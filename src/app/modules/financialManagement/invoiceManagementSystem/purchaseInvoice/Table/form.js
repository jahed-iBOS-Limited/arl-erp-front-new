/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, shallowEqual } from "react-redux";
import GridData from "./grid";
import NewSelect from "./../../../../_helper/_select";
import { useHistory } from "react-router-dom";
import { setPurchaseInvoiceLandingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
import { useDispatch } from "react-redux";
import {
  getPurchaseInvoiceGridData,
  getSBUDDL,
  getPlantDDL,
  getWarehouseDDL,
  getPurchaseOrgDDL,
} from "../helper";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
// Validation schema
const validationSchema = Yup.object().shape({});

export default function HeaderForm() {
  let history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [purchaseOrg, setpurchaseOrg] = useState([]);
  const [plant, setPlant] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const dispatch = useDispatch();
  let receivepaymentAuthData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  let { profileData, selectedBusinessUnit } = receivepaymentAuthData;

  const purchaseInvoiceLanding = useSelector((state) => {
    return state.localStorage.purchaseInvoiceLanding;
  });

  //Get Api Data
  useEffect(() => {
    getSBUDDL(profileData.accountId, selectedBusinessUnit.value, setSBUDDL);
    // getPurchaseOrgDDL(
    //   profileData.accountId,
    //   selectedBusinessUnit.value,
    //   setpurchaseOrg
    // );
    getPlantDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlant
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const viewGridData = (
    accId,
    buId,
    SbuId,
    plantId,
    wareId,
    purId,
    setter,
    search
  ) => {
    if (SbuId && plantId && wareId && purId) {
      getPurchaseInvoiceGridData(
        accId,
        buId,
        SbuId,
        plantId,
        wareId,
        purId,
        setter,
        setLoading,
        pageNo,
        pageSize,
        search
      );
    }
  };

  useEffect(() => {
    cb()
  }, []);


  let cb = () =>{
    viewGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      purchaseInvoiceLanding?.sbu?.value,
      purchaseInvoiceLanding?.plant?.value,
      purchaseInvoiceLanding?.warehouse?.value,
      purchaseInvoiceLanding?.purchaseOrg?.value,
      setGridData
    );
  }

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getPurchaseInvoiceGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      purchaseInvoiceLanding?.sbu?.value,
      purchaseInvoiceLanding?.plant?.value,
      purchaseInvoiceLanding?.warehouse?.value,
      purchaseInvoiceLanding?.purchaseOrg?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={purchaseInvoiceLanding}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Purchase Invoice"}>
                  <CardHeaderToolbar>
                    <button
                      className="btn btn-primary"
                      style={{ marginRight: 10 }}
                      onClick={(e) => {
                        dispatch(setPurchaseInvoiceLandingAction(values));
                        viewGridData(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          values.sbu.value,
                          values.plant.value,
                          values.warehouse.value,
                          values.purchaseOrg.value,
                          setGridData
                        );
                      }}
                      disabled={
                        !values?.sbu ||
                        !values?.purchaseOrg ||
                        !values?.plant ||
                        !values?.warehouse
                      }
                    >
                      View
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        history.push({
                          pathname:
                            "/financial-management/invoicemanagement-system/purchaseinvoice/add",
                          state: {
                            selectSBU: values?.sbu,
                            selectpurchaseOrg: values?.purchaseOrg,
                            selectplant: values?.plant,
                            selectwarehouse: values?.warehouse,
                          },
                        });
                        dispatch(setPurchaseInvoiceLandingAction(values));
                      }}
                      disabled={
                        !values?.sbu ||
                        !values?.purchaseOrg ||
                        !values?.plant ||
                        !values?.warehouse
                      }
                    >
                      Create
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="sbu"
                        options={SBUDDL}
                        value={values?.sbu}
                        label="Select SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                          setFieldValue("purchaseOrg", "");
                          getPurchaseOrgDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setpurchaseOrg
                          );
                        }}
                        placeholder="Select SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="purchaseOrg"
                        options={purchaseOrg}
                        value={values?.purchaseOrg}
                        label="Select Purchase Organization"
                        onChange={(valueOption) => {
                          setFieldValue("purchaseOrg", valueOption);
                        }}
                        placeholder="Select Purchase Organization"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plant}
                        value={values?.plant}
                        label="Select Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setFieldValue("warehouse", "");
                          getWarehouseDDL(
                            profileData.userId,
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setWarehouse
                          );
                        }}
                        placeholder="Select Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={warehouse}
                        value={values?.warehouse}
                        label="Select Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                        }}
                        placeholder="Select Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <GridData
                    rowDto={gridData}
                    values={values}
                    loading={loading}
                    cb={cb}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    setPositionHandler={setPositionHandler}
                  />
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
