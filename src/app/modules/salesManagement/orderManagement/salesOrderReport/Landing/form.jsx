

import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ISelect } from '../../../../_helper/_inputDropDown';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GridData from './grid';
import {
  getSalesOfficeDDL_Action,
  getSalesOrgDDL_Action,
  getSBUDDL_Aciton,
  getShipPoint_Action,
  SetGridDataEmpty_Action,
} from '../_redux/Actions';
import { getPlantDDLAction } from '../../../../_helper/_redux/Actions';
import { getDistributionChannelDDLAction } from './../_redux/Actions';
import { getSalesOrderTypeDDL_Action } from './../_redux/Actions';
import { getSalesOrderGridData } from './../_redux/Actions';
import { setSalesOrderLandingAction } from '../../../../_helper/reduxForLocalStorage/Actions';
import { salesOrderComplete, cancelSalesOrder } from '../helper';
// import Loading from "../../../../_helper/_loading";
import IConfirmModal from './../../../../_helper/_confirmModal';

// Validation schema
const validationSchema = Yup.object().shape({
  controllingUnitCode: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(100, 'Maximum 100 symbols')
    .required('Code is required'),
  controllingUnitName: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(100, 'Maximum 100 symbols')
    .required('Controlling Unit Name is required'),
  sbu: Yup.object().shape({
    label: Yup.string().required('SBU is required'),
    value: Yup.string().required('SBU is required'),
  }),
  plant: Yup.object().shape({
    label: Yup.string().required('Plant is required'),
    value: Yup.string().required('Plant is required'),
  }),
  salesOrg: Yup.object().shape({
    label: Yup.string().required('SalesOrg is required'),
    value: Yup.string().required('SalesOrg is required'),
  }),
  shippoint: Yup.object().shape({
    label: Yup.string().required('shippoint is required'),
    value: Yup.string().required('shippoint is required'),
  }),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required('DistributionChannel is required'),
    value: Yup.string().required('DistributionChannel is required'),
  }),
  salesOffice: Yup.object().shape({
    label: Yup.string().required('SalesOffice is required'),
    value: Yup.string().required('SalesOffice is required'),
  }),
  orderType: Yup.object().shape({
    label: Yup.string().required('OrderType is required'),
    value: Yup.string().required('OrderType is required'),
  }),
  refType: Yup.object().shape({
    label: Yup.string().required('RefType is required'),
    value: Yup.string().required('RefType is required'),
  }),
});

export default function HeaderForm() {
  let [controlls, setControlls] = useState([]);
  const [completeModalInfo, setCompleteModalInfo] = useState('');
  const [selesOrderId, setSalesOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const purchaseOrgDDL = useSelector(
    (state) => state?.commonDDL?.purchaseOrgDDL,
  );
  const wareHouseDDL = useSelector((state) => state?.commonDDL?.wareHouseDDL);
  const orderTypeDDL = useSelector(
    (state) => state.purchaseOrder?.orderTypeDDL,
  );
  const poReferenceTypeDDL = useSelector(
    (state) => state?.purchaseOrder?.poReferenceTypeDDL,
  );

  let salesOrderData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        SBUDDL: state.salesOrder.SBUDDL,
        plantDDL: state?.commonDDL?.plantDDL,
        salesOrgDDL: state.salesOrder.salesOrgDDL,
        salesOfficeDDL: state.salesOrder.salesOfficeDDL,
        distributionChannelDDL: state.salesOrder.distributionChannelDDL,
        salesOrderTypeDDL: state.salesOrder.salesOrderTypeDDL,
        salesReferanceType: state.salesOrder.salesReferanceType,
        shipPointDDL: state.salesOrder.shipPointDDL,
      };
    },
    { shallowEqual },
  );

  let {
    profileData,
    selectedBusinessUnit,
    SBUDDL,
    plantDDL,
    salesOrgDDL,
    salesOfficeDDL,
    distributionChannelDDL,
    salesOrderTypeDDL,
    shipPointDDL,
    salesReferanceType,
  } = salesOrderData;
  const history = useHistory();
  const dispatch = useDispatch();

  const salesOrderLanding = useSelector((state) => {
    return state.localStorage.salesOrderLanding;
  });
  //paginationState

  const [pageNo, setPageNo] = React.useState(0);

  const [pageSize, setPageSize] = React.useState(15);
  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSBUDDL_Aciton(profileData.accountId, selectedBusinessUnit.value),
      );
      dispatch(
        getPlantDDLAction(
          profileData.userId,
          profileData.accountId,
          selectedBusinessUnit.value,
        ),
      );
      dispatch(
        getSalesOrderTypeDDL_Action(
          profileData.accountId,
          selectedBusinessUnit.value,
        ),
      );
      dispatch(
        getShipPoint_Action(
          profileData?.userId,
          profileData?.accountId,
          selectedBusinessUnit?.value,
        ),
      );
    }

  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      salesOrderLanding?.shippoint?.value
    ) {
      dispatch(
        getSalesOrderGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          salesOrderLanding?.shippoint?.value,
          salesOrderLanding?.orderStatus?.value,
          pageNo,
          pageSize,
          setLoading,
        ),
      );
    }
  }, [selectedBusinessUnit, profileData]);
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatch(
      getSalesOrderGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        salesOrderLanding?.shippoint?.value,
        salesOrderLanding?.orderStatus?.value,
        pageNo,
        pageSize,
        searchValue,
        setLoading,
      ),
    );
  };

  const orderStatusDDL = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Complete' },
    { value: 2, label: 'Pending' },
    { value: 3, label: 'UnApproved' },
    { value: 4, label: 'Reject' },
  ];

  useEffect(() => {
    setControlls([
      {
        label: 'Order Type',
        name: 'orderType',
        options: salesOrderTypeDDL || [],
      },
      {
        label: 'SBU',
        name: 'sbu',
        options: SBUDDL || [],
        dependencyFunc: (currentValue, value, setter) => {
          console.log(currentValue);
          dispatch(
            getSalesOrgDDL_Action(
              profileData.accountId,
              selectedBusinessUnit.value,
              currentValue,
            ),
          );
          dispatch(
            getDistributionChannelDDLAction(
              profileData.accountId,
              selectedBusinessUnit.value,
              currentValue,
            ),
          );
          setter('salesOrg', '');
          setter('distributionChannel', '');
        },
      },
      {
        label: 'Plant',
        name: 'plant',
        options: plantDDL || [],
      },
      {
        label: 'Sales Org',
        name: 'salesOrg',
        options: salesOrgDDL,
        isDisabled: ['sbu'],
        dependencyFunc: (currentValue, value, setter) => {
          dispatch(
            getSalesOfficeDDL_Action(
              profileData.accountId,
              selectedBusinessUnit.value,
              currentValue,
            ),
          );

          setter('salesOffice', '');
        },
      },
      {
        label: 'Shippoint',
        name: 'shippoint',
        options: shipPointDDL || [],
        dependencyFunc: (currentValue, value, setter) => {
          dispatch(SetGridDataEmpty_Action());
        },
      },
      {
        label: 'Dist. Channel',
        name: 'distributionChannel',
        options: distributionChannelDDL || [],
        isDisabled: ['sbu'],
      },
      {
        label: 'Sales Office',
        name: 'salesOffice',
        options: salesOfficeDDL || [],
        isDisabled: ['salesOrg'],
      },
      {
        label: 'Order Status',
        name: 'orderStatus',
        options: orderStatusDDL || [],
        // isDisabled: ["salesOrg"],
      },
    ]);
  }, [
    purchaseOrgDDL,
    orderTypeDDL,
    plantDDL,
    wareHouseDDL,
    poReferenceTypeDDL,
    salesOrgDDL,
    salesOfficeDDL,
    distributionChannelDDL,
    salesOrderTypeDDL,
    shipPointDDL,
    salesReferanceType,
    SBUDDL,
  ]);
  const callBackFuncGridData = () => {
    dispatch(
      getSalesOrderGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        salesOrderLanding?.shippoint?.value,
        salesOrderLanding?.orderStatus?.value,
        pageNo,
        pageSize,
        setLoading,
      ),
    );
  };

  const saveCompleteModel = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        orderStatus: values?.isComplete,
        completeNarration: completeModalInfo?.commentRequired
          ? values?.remarks
          : '',
        orderId: +selesOrderId,
      };
      const callBackFunc = () => {
        setIsShowModal(false);
      };
      salesOrderComplete(
        payload?.orderStatus,
        payload?.completeNarration,
        payload?.orderId,
        setLoading,
        callBackFunc,
      );
    }
  };

  // cancel handler
  const cancelHandler = (id) => {
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to cancel sales order?`,
      yesAlertFunc: () => {
        const payload = {
          salesOrderId: +id,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
        };

        cancelSalesOrder(payload, setLoading, callBackFuncGridData);
      },
      noAlertFunc: () => {
        history.push('/sales-management/ordermanagement/salesOrderReportVat');
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    return () => {
      dispatch(SetGridDataEmpty_Action());
    };
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...salesOrderLanding,
          orderType: salesOrderLanding?.orderType?.value
            ? salesOrderLanding?.orderType
            : salesOrderTypeDDL?.find((itm) => itm?.value === 1),
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form m-0">
                {controlls.map((itm, idex) => (
                  <div className="col-lg-3">
                    <ISelect
                      dependencyFunc={itm?.dependencyFunc}
                      label={itm?.label}
                      placeholder={itm?.label}
                      options={itm?.options || []}
                      value={values[itm?.name]}
                      name={itm?.name}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      values={values}
                      disabledFields={itm?.isDisabled || []}
                      touched={touched}
                    />
                  </div>
                ))}
                {/* View button */}
                <div className="d-flex col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary mt-5"
                    onClick={() => {
                      dispatch(
                        getSalesOrderGridData(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          values?.shippoint?.value,
                          values?.orderStatus?.value,
                          pageNo,
                          pageSize,
                          setLoading,
                        ),
                      );
                      dispatch(setSalesOrderLandingAction(values));
                    }}
                    disabled={!values?.shippoint}
                  >
                    View
                  </button>
                  <div className="text-right ml-2">
                    <button
                      type="button"
                      className="btn btn-primary mt-5"
                      onClick={() => {
                        history.push({
                          pathname: `/sales-management/ordermanagement/salesOrderReportVat/create`,
                          state: values,
                        });
                        dispatch(setSalesOrderLandingAction(values));
                      }}
                      disabled={
                        !values?.sbu ||
                        !values?.plant ||
                        !values?.salesOrg ||
                        !values?.shippoint ||
                        !values?.distributionChannel ||
                        !values?.salesOffice ||
                        !values?.orderType
                      }
                    >
                      Create
                    </button>
                  </div>
                </div>

                {/* box-one-end */}
              </div>
              <GridData
                profileData={profileData}
                selectedBusinessUnit={selectedBusinessUnit}
                setIsShowModal={setIsShowModal}
                isShowModal={isShowModal}
                setCompleteModalInfo={setCompleteModalInfo}
                completeModalInfo={completeModalInfo}
                setPositionHandler={setPositionHandler}
                values={values}
                saveCompleteModel={saveCompleteModel}
                loading={loading}
                setLoading={setLoading}
                setSalesOrderId={setSalesOrderId}
                cancelHandler={cancelHandler}
                shipPointDDL={shipPointDDL}
                callBackFuncGridData={callBackFuncGridData}
                pageNo={pageNo}
                pageSize={pageSize}
                setPageNo={setPageNo}
                setPageSize={setPageSize}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
