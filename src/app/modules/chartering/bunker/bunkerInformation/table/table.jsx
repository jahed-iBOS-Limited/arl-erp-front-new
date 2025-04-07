import React, { useState, useEffect, useContext } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router';
import { Formik } from 'formik';
import { getVesselDDL, getVoyageDDLNew } from '../../../helper';
import FormikSelect from '../../../_chartinghelper/common/formikSelect';
import customStyles from '../../../_chartinghelper/common/selectCustomStyle';
import Loading from '../../../_chartinghelper/loading/_loading';
import ICustomTable from '../../../_chartinghelper/_customTable';
import IView from '../../../_chartinghelper/icons/_view';
import PaginationTable from '../../../_chartinghelper/_tablePagination';
import { getBunkerInformationLandingData } from '../helper';
import IEdit from '../../../_chartinghelper/icons/_edit';
import { CharteringContext } from '../../../charteringContext';

const headers = [
  { name: 'SL' },
  { name: 'Vessel Name' },
  { name: 'Voyage No' },
  { name: 'Voyage Type' },
  { name: 'BOD LSMGO QTY' },
  { name: 'BOD LSFO-1 QTY' },
  { name: 'BOD LSFO-2 QTY' },
  { name: 'BOR LSMGO QTY' },
  { name: 'BOR LSFO-1 QTY' },
  { name: 'BOR LSFO-2 QTY' },
  { name: 'Actions' },
];

export default function BunkerInfoTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.bunkerInformationLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      bunkerInformationLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (values, PageNo, PageSize) => {
    getBunkerInformationLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      PageNo || pageNo,
      PageSize || pageSize,
      '',
      setGridData,
      setLoading
    );
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
      voyageTypeId: 0,
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
        onSubmit={(values) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Bunker Information</p>
                <div className="d-flex">
                  <button
                    type="button"
                    className={'btn btn-primary px-3 py-2'}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push(
                        '/chartering/bunker/bunkerInformation/create'
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
                        setFieldValue('vesselName', valueOption);

                        setVoyageNoDDL([]);
                        updateCharteringState({
                          voyageNo: '',
                          vesselName: valueOption,
                        });
                        if (valueOption) {
                          getVoyageDDL({ ...values, vesselName: valueOption });
                        }
                        getGridData({ ...values, vesselName: valueOption });
                      }}
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
                        updateCharteringState({
                          ...values,
                          voyageNo: valueOption,
                        });
                        getGridData({ ...values, voyageNo: valueOption });
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              {loading && <Loading />}
              <ICustomTable ths={headers}>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.vesselName}</td>
                    <td>{item?.voyageNo}</td>
                    <td>{item?.voyageTypeName}</td>
                    <td>{item?.bodLsmgoQty}</td>
                    <td>{item?.bodLsfo1Qty}</td>
                    <td>{item?.bodLsfo2Qty}</td>
                    <td>{item?.borLsmgoQty}</td>
                    <td>{item?.borLsfo1Qty}</td>
                    <td>{item?.borLsfo2Qty}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push({
                              pathname: `/chartering/bunker/bunkerInformation/view/${item?.bunkerInformationId}`,
                              state: item,
                            });
                          }}
                        />
                        {!item?.complete && (
                          <IEdit
                            title="Complete Bunker Information"
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/bunker/bunkerInformation/edit/${item?.bunkerInformationId}`,
                                state: item,
                              });
                            }}
                          />
                        )}
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
