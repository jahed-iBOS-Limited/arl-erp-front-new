import React, { useContext, useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router';
import { Formik } from 'formik';
import { getVesselDDL, getVoyageDDLNew } from '../../../helper';
import { getBunkerCostLandingData } from '../helper';
import customStyles from '../../../_chartinghelper/common/selectCustomStyle';
import FormikSelect from '../../../_chartinghelper/common/formikSelect';
import Loading from '../../../_chartinghelper/loading/_loading';
import ICustomTable from '../../../_chartinghelper/_customTable';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import IView from '../../../_chartinghelper/icons/_view';
import PaginationTable from '../../../_chartinghelper/_tablePagination';
import { CharteringContext } from '../../../charteringContext';

const headers = [
  { name: 'SL' },
  { name: 'Vessel Name' },
  { name: 'Voyage No' },
  { name: 'Bunker Cost' },
  { name: 'Actions' },
];

export default function BunkerCostTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.bunkerCostLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      bunkerCostLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (values, PageNo, PageSize) => {
    getBunkerCostLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      PageNo || pageNo,
      PageSize || pageSize,
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
    getGridData(initData, pageNo, pageSize);
    if (initData?.vesselName) {
      getVoyageDDL(initData);
    }
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
                <p>Bunker Cost</p>
                <div>
                  <button
                    type="button"
                    className={'btn btn-primary px-3 py-2'}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push('/chartering/bunker/bunkerCost/create');
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
                        setGridData([]);
                        updateCharteringState({
                          voyageNo: '',
                          vesselName: valueOption,
                        });
                        if (valueOption) {
                          getVoyageDDL({ ...values, vesselName: valueOption });
                          getGridData({ ...values, vesselName: valueOption });
                        }
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
                        setGridData([]);
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
                    <td className="text-right">
                      {_formatMoney(item?.totalBunkerCost)}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <IView
                          clickHandler={() => {
                            history.push({
                              pathname: `/chartering/bunker/bunkerCost/view/${item?.bunkerCostId}`,
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
