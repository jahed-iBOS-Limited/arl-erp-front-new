/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import * as Yup from "yup";
import GridData from "./grid";
import NewSelect from "./../../../../_helper/_select";
import { getCustomerDDL_api } from "../helper";
import { getInvoiceClearPasignation_api } from "./../helper";
import { useDispatch, useSelector } from "react-redux";
import {SetInvoicemanagementSystemClearSalesInvoiceAction} from "../../../../_helper/reduxForLocalStorage/Actions"
// Validation schema
const validationSchema = Yup.object().shape({
  controllingUnitCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  accountingJournalTypeId: Yup.object().shape({
    label: Yup.string().required("Journal Type is required"),
    value: Yup.string().required("Journal Type is required"),
  }),
});



export default function HeaderForm({
  rowDto,
  remover,
  setGirdData,
  loading,
  setLoading,
  paginationState,
  setPositionHandler,
  profileData,
  selectedBusinessUnit,
}) {
  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  const [customerDDL, setCustomerDDL] = useState([]);
  const {invoicemanagementSystemClearSalesInvoice} = useSelector(state=>state?.localStorage)
  const dispatch = useDispatch()


  const initData = {
    transactionType: invoicemanagementSystemClearSalesInvoice?.transactionType || "",
    ReferanceNo: invoicemanagementSystemClearSalesInvoice?.ReferanceNo || "",
    employeeEnroll:invoicemanagementSystemClearSalesInvoice?.employeeEnroll || "",
    customer: invoicemanagementSystemClearSalesInvoice?.customer || "",
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getCustomerDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCustomerDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

const gridDataFunc = (values) => {
  getInvoiceClearPasignation_api(
    profileData?.accountId,
    selectedBusinessUnit.value,
    setGirdData,
    setLoading,
    pageNo,
    pageSize,
    values?.customer?.value
  );
}
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right cj p-0">
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Clear Sales Invoice"}>
                  <CardHeaderToolbar></CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="customer"
                        options={customerDDL || []}
                        value={values?.customer}
                        label="Select Customer"
                        onChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                          dispatch(SetInvoicemanagementSystemClearSalesInvoiceAction({
                              ...values,
                              customer:valueOption
                          }))
                        }}
                        placeholder="Select Customer"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: "15px" }}
                        onClick={() => {
                          gridDataFunc(values)
                        }}
                        disabled={!values?.customer}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <GridData
                    rowDto={rowDto}
                    remover={remover}
                    type={values.type}
                    completeDate={values.completeDate}
                    journalTypeValue={values?.accountingJournalTypeId?.value}
                    values={values}
                    setGirdData={setGirdData}
                    loading={loading}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    setPositionHandler={setPositionHandler}
                    gridDataFunc={gridDataFunc}
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
