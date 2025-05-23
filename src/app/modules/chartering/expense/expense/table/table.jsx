import { Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _formatMoney } from '../../../../_helper/_formatMoney';
import ICustomTable from '../../../_chartinghelper/_customTable';
import PaginationTable from '../../../_chartinghelper/_tablePagination';
import FormikSelect from '../../../_chartinghelper/common/formikSelect';
import customStyles from '../../../_chartinghelper/common/selectCustomStyle';
import IEdit from '../../../_chartinghelper/icons/_edit';
import IView from '../../../_chartinghelper/icons/_view';
import Loading from '../../../_chartinghelper/loading/_loading';
import { CharteringContext } from '../../../charteringContext';
import { getVesselDDL, getVoyageDDLNew } from '../../../helper';
import { getAdditionalCostLandingData } from '../helper';

const headers = [
  { name: 'SL' },
  { name: 'Vessel Name' },
  { name: 'Voyage No' },
  { name: 'Cost Amount' },
  { name: 'Actions' },
];

export default function ExpenseTable() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const history = useHistory();
  const [charteringState, setCharteringState] = useContext(CharteringContext);

  const initData = charteringState?.expenseLandingFormData;

  // the function to update the context value
  const updateCharteringState = (newState) => {
    setCharteringState((prevState) => ({
      ...prevState,
      expenseLandingFormData: newState,
    }));
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (values, _pageNo = 0, _pageSize = 15) => {
    getAdditionalCostLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.vesselName?.value || 0,
      values?.voyageNo?.value || 0,
      _pageNo,
      _pageSize,
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
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Expense</p>
                <div>
                  <button
                    type="button"
                    className={'btn btn-primary px-3 py-2'}
                    onClick={() => {
                      updateCharteringState(values);
                      history.push('/chartering/expense/expense/create');
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
                        setFieldValue('voyageNo', '');
                        setVoyageNoDDL([]);
                        const updatedValues = {
                          ...values,
                          vesselName: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        if (valueOption) {
                          getVoyageDDL(updatedValues);
                        }
                        getGridData(updatedValues);
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
                        const updatedValues = {
                          ...values,
                          voyageNo: valueOption,
                        };
                        updateCharteringState(updatedValues);
                        getGridData(updatedValues);
                      }}
                      isDisabled={!values?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              {gridData?.data?.length > 0 && (
                <ICustomTable ths={headers}>
                  {gridData?.data?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.vesselName}</td>
                      <td>{item?.voyageName}</td>
                      <td className="text-right">
                        {_formatMoney(item?.costAmount)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-around">
                          <IView
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/expense/expense/view/${item?.additionalCost}`,
                                state: item,
                              });
                            }}
                          />
                          {/* <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">Pay/Receive</Tooltip>
                            }
                          >
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                history.push({
                                  pathname: `/chartering/expense/expense/cash/${item?.additionalCost}`,
                                  state: item,
                                });
                              }}
                            >
                              <i className="fas fa-lg fa-hand-holding-usd"></i>
                            </span>
                          </OverlayTrigger> */}
                          <IEdit
                            clickHandler={() => {
                              history.push({
                                pathname: `/chartering/expense/expense/edit/${item?.additionalCost}`,
                                state: item,
                              });
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </ICustomTable>
              )}
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
