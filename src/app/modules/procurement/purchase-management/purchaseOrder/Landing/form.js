/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import {
  getPurchaseOrgDDLAction,
  getSbuDDLAction,
} from "../../../../_helper/_redux/Actions";
import NewSelect from "../../../../_helper/_select";
import { setPOLandingDataAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import {
  getGridAction,
  getOrderTypeListDDLAction,
  getPlantListDDLAction,
  getPoReferenceTypeDDLAction,
  getWareHouseDDLAction,
} from "../_redux/Actions";
import GridData from "./grid";

import ILoader from "../../../../_helper/loader/_loader";
// eslint-disable-next-line no-unused-vars
const initData = {
  orderType: "",
  refType: "",
  sbu: "",
  purchaseOrg: "",
  plant: "",
  warehouse: "",
};
// Validation schema
const validationSchema = Yup.object().shape({});

const statusData = [
  { label: "Approved", value: true },
  { label: "Pending", value: false },
  { label: "Close", value: "Close" },
];

export default function HeaderForm({selectedBusinessUnit, estimatePDAPOPage}) {
  let [controlls, setControlls] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  const sbuDDL = useSelector((state) => state.commonDDL.sbuDDL);
  const purchaseOrgDDL = useSelector((state) => state.commonDDL.purchaseOrgDDL);
  const plantDDL = useSelector((state) => state.purchaseOrder.plantDDL);
  const wareHouseDDL = useSelector((state) => state.purchaseOrder.wareHouseDDL);
  const orderTypeDDL = useSelector((state) => state.purchaseOrder.orderTypeDDL);
  const poLandingInitData = useSelector(
    (state) => state.localStorage.poLanding
  );
  const poReferenceTypeDDL = useSelector(
    (state) => state.purchaseOrder.poReferenceTypeDDL
  );
  const history = useHistory();
  // get user profile data from store
  const profileData = useSelector(
    (state) => state.authData.profileData,
    shallowEqual
  );


  // loading
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getPurchaseOrgDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getPlantListDDLAction(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value
      )
    );
    dispatch(getOrderTypeListDDLAction());
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (poLandingInitData?.orderType?.value) {
      getPoReferenceTypeDDL(poLandingInitData?.orderType?.value);
    }
  }, [poLandingInitData]);

  useEffect(() => {
    if (poLandingInitData?.sbu?.value) {
      dispatch(
        getGridAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          poLandingInitData?.sbu?.value,
          poLandingInitData?.plant?.value,
          poLandingInitData?.warehouse?.value,
          poLandingInitData?.orderType?.value,
          poLandingInitData?.purchaseOrg?.value,
          poLandingInitData?.refType?.value,
          poLandingInitData?.status?.value,
          poLandingInitData?.fromDate,
          poLandingInitData?.toDate,
          setLoading,
          pageNo,
          pageSize,
          null,
          poLandingInitData?.status?.label
        )
      );
      getWarehouseDDL(poLandingInitData?.plant?.value);
      getPoReferenceTypeDDL(poLandingInitData?.orderType?.value);
    }
  }, []);

  let cb = () => {
    dispatch(
      getGridAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        poLandingInitData?.sbu?.value,
        poLandingInitData?.plant?.value,
        poLandingInitData?.warehouse?.value,
        poLandingInitData?.orderType?.value,
        poLandingInitData?.purchaseOrg?.value,
        poLandingInitData?.refType?.value,
        poLandingInitData?.status?.value,
        poLandingInitData?.fromDate,
        poLandingInitData?.toDate,
        setLoading,
        pageNo,
        pageSize,
        null,
        poLandingInitData?.status?.label
      )
    );
  };

  // Get warehouse ddl on plant ddl onChange
  const getWarehouseDDL = (param) => {
    dispatch(
      getWareHouseDDLAction(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        param
      )
    );
  };

  // Get po ref type ddl on ordertype ddl onChange
  const getPoReferenceTypeDDL = (param) => {
    dispatch(getPoReferenceTypeDDLAction(param));
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatch(
      getGridAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        poLandingInitData?.sbu?.value,
        poLandingInitData?.plant?.value,
        poLandingInitData?.warehouse?.value,
        poLandingInitData?.orderType?.value,
        poLandingInitData?.purchaseOrg?.value,
        poLandingInitData?.refType?.value,
        poLandingInitData?.status?.value,
        poLandingInitData?.fromDate,
        poLandingInitData?.toDate,
        setLoading,
        pageNo,
        pageSize,
        searchValue,
        poLandingInitData?.status?.label
      )
    );
  };
  useEffect(() => {
    setControlls([
      {
        label: "Order Type",
        name: "orderType",
        options: orderTypeDDL,
        dependencyFunc: (payload, allValues, setter) => {
          getPoReferenceTypeDDL(payload);
          setter("refType", "");
        },
      },
      {
        label: "SBU",
        name: "sbu",
        options: sbuDDL,
      },
      {
        label: "Purchase Org",
        name: "purchaseOrg",
        options: purchaseOrgDDL,
      },
      {
        label: "Plant",
        name: "plant",
        options: plantDDL,
        dependencyFunc: (payload, allvalues, setter) => {
          getWarehouseDDL(payload);
          setter("warehouse", "");
        },
      },
      {
        label: "Warehouse",
        name: "warehouse",
        options: wareHouseDDL,
        isDisabled: ["plant"],
      },
      {
        label: "Reference Type",
        name: "refType",
        options: poReferenceTypeDDL,
        isDisabled: ["orderType"],
      },
    ]);
  }, [
    sbuDDL,
    purchaseOrgDDL,
    orderTypeDDL,
    plantDDL,
    wareHouseDDL,
    poReferenceTypeDDL,
  ]);

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  const gridData = useSelector((state) => {
    return state?.purchaseOrder?.gridData;
  }, shallowEqual);

  const [data, setData] = useState([]);

  const newGrid = gridData?.data;
  useEffect(() => {
    if (newGrid?.length > 0) {
      setData([...newGrid]);
    } else {
      setData([]);
    }
  }, [newGrid]);


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...poLandingInitData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <div
              style={{ transform: "translateY(-40px)" }}
              className="text-right"
            >
              {/* <button
                disabled={
                  !values.warehouse ||
                  !values.plant ||
                  !values.purchaseOrg ||
                  !values.sbu ||
                  !values.refType ||
                  !values.orderType
                }
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  dispatch(
                    getGridAction(
                      profileData?.accountId,
                      selectedBusinessUnit?.value,
                      values?.sbu?.value,
                      values?.plant?.value,
                      values?.warehouse?.value,
                      values?.orderType?.value,
                      values?.purchaseOrg?.value,
                      values?.refType?.value,
                      values?.status?.value,
                      values?.fromDate,
                      values?.toDate,
                      setLoading,
                      pageNo,
                      pageSize
                    )
                  )
                  dispatch(setPOLandingDataAction(values))
                }}
              >
                View
              </button> */}
              <button
                disabled={
                  !values?.warehouse ||
                  !values?.plant ||
                  !values?.purchaseOrg ||
                  !values?.sbu ||
                  !values?.refType ||
                  !values?.orderType ||
                  (selectedBusinessUnit?.value !== 184 &&
                    values?.orderType?.label === "Standard PO" &&
                    values?.purchaseOrg?.label === "Local Procurement")
                }
                type="button"
                className="btn btn-primary ml-3"
                onClick={() => {
                  console.log({values})
                  history.push({
                    pathname: `/mngProcurement/purchase-management/purchaseorder/create`,
                    search: `?potype=${values.orderType?.value}`,
                    state: {
                      ...values,
                      estimatePDAPOPage: estimatePDAPOPage
                    },
                  });
                  dispatch(setPOLandingDataAction(values));
                }}
              >
                Create
              </button>
            </div>
            <div
              style={{ transform: "translateY(-34px)" }}
              className="global-form"
            >
              <Form className="form form-label-right">
                <div className="form-group row">
                  {controlls.map((itm, idx) => {
                    return (
                      <div className="col-lg-2" key={idx}>
                        <ISelect
                          dependencyFunc={itm.dependencyFunc}
                          label={itm.label}
                          placeholder={itm.label}
                          options={itm.options || []}
                          value={values[itm.name]}
                          name={itm.name}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          values={values}
                          disabledFields={itm.isDisabled || []}
                          touched={touched}
                          // onChange={(valueOption)=>{
                          //   setFieldValue(itm.name,valueOption)
                          //   setData([]);
                          // }}
                          // menuIsOpen={true}
                        />
                      </div>
                    );
                  })}
                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={statusData || []}
                      value={values?.status}
                      label="Status"
                      onChange={(v) => {
                        setData([]);
                        setFieldValue("status", v);
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3" style={{ marginTop: 22 }}>
                    <button
                      disabled={
                        !values?.warehouse ||
                        !values?.plant ||
                        !values?.purchaseOrg ||
                        !values?.sbu ||
                        !values?.refType ||
                        !values?.orderType
                      }
                      type="submit"
                      className="btn btn-primary"
                      onClick={() => {
                        dispatch(
                          getGridAction(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.sbu?.value,
                            values?.plant?.value,
                            values?.warehouse?.value,
                            values?.orderType?.value,
                            values?.purchaseOrg?.value,
                            values?.refType?.value,
                            values?.status?.value,
                            values?.fromDate,
                            values?.toDate,
                            setLoading,
                            pageNo,
                            pageSize,
                            null,
                            values?.status?.value
                          )
                        );
                        dispatch(setPOLandingDataAction(values));
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
            </div>

            {loading ? (
              <ILoader />
            ) : (
              <div className="pagination_disable_relative">
                <GridData
                  values={values}
                  POorderType={values?.orderType?.value}
                  PORefType={values?.refType?.value}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  setPositionHandler={setPositionHandler}
                  paginationSearchHandler={paginationSearchHandler}
                  cb={cb}
                  selectedBusinessUnit={selectedBusinessUnit}
                  profileData={profileData}
                  gridData={gridData}
                  data={data}
                />
              </div>
            )}
          </>
        )}
      </Formik>
    </>
  );
}
