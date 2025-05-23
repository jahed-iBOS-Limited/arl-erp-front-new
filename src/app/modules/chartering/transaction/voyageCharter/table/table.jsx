import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getVesselDDL, getVoyageDDLNew } from '../../../helper';
import FormikSelect from '../../../_chartinghelper/common/formikSelect';
import customStyles from '../../../_chartinghelper/common/selectCustomStyle';
import IView from '../../../_chartinghelper/icons/_view';
import Loading from '../../../_chartinghelper/loading/_loading';
import ICustomTable from '../../../_chartinghelper/_customTable';
import { _dateFormatter } from '../../../_chartinghelper/_dateFormatter';
import PaginationTable from '../../../_chartinghelper/_tablePagination';
import { getVoyageCharterTransactionLandingData } from '../helper';
import { CharteringContext } from '../../../charteringContext';

const headers = [
  { name: 'SL' },
  { name: 'Vessel Name' },
  { name: 'Voyage No' },
  { name: 'Charterer Name' },
  { name: 'Statement' },
  { name: 'Invoice Date' },
  { name: 'Net Payble Amount' },
  { name: 'Actions' },
];

export default function VoyageCharterTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const history = useHistory();
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.voyageCharterLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      voyageCharterLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (values, _pageNo = 0, _pageSize = 15) => {
    setGridData([]);
    if (values?.vesselName && values?.voyageNo) {
      getVoyageCharterTransactionLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.vesselName?.value || 0,
        values?.voyageNo?.value || 0,
        _pageNo,
        _pageSize,
        setGridData,
        setLoading
      );
    }
  };

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      hireType: 0,
      isComplete: 0,
      voyageTypeId: 2,
    });
  };

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    if (initData?.vesselName) {
      getVoyageDDL(initData);
    }
    getGridData(initData, pageNo, pageSize);
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(values, pageNo, pageSize);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Voyage Charter Transaction</p>
                <div>
                  <button
                    type="button"
                    className={'btn btn-primary px-3 py-2'}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push(
                        '/chartering/transaction/voyagecharter/create'
                      );
                    }}
                    disabled={false}
                  >
                    Create
                  </button>
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ''}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue('voyageNo', '');
                        setFieldValue('vesselName', valueOption);
                        const updatedValues = {
                          ...values,
                          vesselName: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        if (valueOption) {
                          getVoyageDDL(updatedValues);
                        }

                        getGridData(updatedValues, pageNo, pageSize);
                      }}
                      // isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ''}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setFieldValue('voyageNo', valueOption);
                        const updatedValues = {
                          ...values,
                          voyageNo: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        getGridData(updatedValues, pageNo, pageSize);
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.vesselname}</td>
                    <td className="text-center">{item?.voyageNo}</td>
                    <td className="text-left">{item?.charterName}</td>
                    <td>
                      {item?.statementNo === 2
                        ? 'Final Statement'
                        : 'Initial Statement'}
                    </td>
                    <td className="text-center">
                      {_dateFormatter(item?.invoiceDate)}
                    </td>
                    <td className="text-right">{item?.totalNetPayble}</td>

                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push({
                              pathname: `/chartering/transaction/voyagecharter/view/${item?.freightInvoiceId}`,
                              state: item,
                            });
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </ICustomTable>

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
