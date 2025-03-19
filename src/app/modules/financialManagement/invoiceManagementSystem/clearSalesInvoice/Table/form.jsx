/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bankJournalValidationSchema } from "../../../../_helper/_validationSchema";
import { SetInvoicemanagementSystemClearSalesInvoiceAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { getCustomerDDL_api } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import NewSelect from "./../../../../_helper/_select";
import { getInvoiceClearPasignation_api } from "./../helper";
import GridData from "./grid";

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
  const { invoicemanagementSystemClearSalesInvoice } = useSelector(state => state?.localStorage)
  const dispatch = useDispatch()


  const initData = {
    transactionType: invoicemanagementSystemClearSalesInvoice?.transactionType || "",
    ReferanceNo: invoicemanagementSystemClearSalesInvoice?.ReferanceNo || "",
    employeeEnroll: invoicemanagementSystemClearSalesInvoice?.employeeEnroll || "",
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
        validationSchema={bankJournalValidationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
                            customer: valueOption
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
