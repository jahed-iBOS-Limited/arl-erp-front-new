import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../../../_helper/_inputField";
import { validationSchema } from "../helper";

// Validation schema
export default function _Form({
  initData,
  btnRef,
  //   saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  setter,
  remover,
  setRowDto,
  rowDto,
  setDivisionDDL,
  setEdit,
  edit,
  isDisabled,
  providerDDL,
  insuranceTypeDDL,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //   resetForm(initData);
          //   setRowDto([]);
          // });
        }}
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
            {/* {disableHandler(!isValid)} */}

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.indentNumber}
                          label="Indent Number"
                          placeholder="Indent Number"
                          name="indentNumber"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.supplierName}
                          label="Supplier Name"
                          placeholder="Supplier Name"
                          name="supplierName"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.bankName}
                          label="Bank Name"
                          placeholder="Bank Name"
                          name="bankName"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.LCNumber}
                          label="LC Number"
                          placeholder="LC Number"
                          name="LCNumber"
                        />
                      </div>
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.LCDate}
                          label="LC Date"
                          placeholder="LC Date"
                          name="LCDate"
                          type="date"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.incoTerms}
                          label="Inco Terms"
                          placeholder="Inco Terms"
                          name="incoTerms"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.lastShipmentDate}
                          label="Last Shipment Date"
                          placeholder="Last Shipment Date"
                          name="lastShipmentDate"
                          type="date"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.paymentMode}
                          label="Payment Mode"
                          placeholder="Payment Mode"
                          name="paymentMode"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.HSCode}
                          label="HS Code"
                          placeholder="HS Code"
                          name="HSCode"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.loadingPort}
                          label="Loading Port"
                          placeholder="Loading Port"
                          name="loadingPort"
                        />
                      </div>
                      {/* )} */}

                      <div className="col-lg-3">
                        <InputField
                          value={values?.destinationPort}
                          label="Destination Port"
                          placeholder="Destination Port"
                          name="destinationPort"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.tolerance}
                          label="Tolerance (%)"
                          placeholder="Tolerance (%)"
                          name="tolerance"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.currency}
                          label="Currency"
                          placeholder="Currency"
                          name="currency"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.totalInvoiceAmount}
                          label="Total Invoice Amount"
                          placeholder="Total Invoice Amount"
                          name="totalInvoiceAmount"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.cashMargin}
                          label="Cash Margin"
                          placeholder="Cash Margin"
                          name="cashMargin"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.FDRMargin}
                          label="FDR Margin"
                          placeholder="FDR Margin"
                          name="FDRMargin"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.LCLength}
                          label="LC Length (Quarter)"
                          placeholder="LC Length (Quarter)"
                          name="LCLength"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.insuranceProviderName}
                          label="Insurance Provider Name"
                          placeholder="Insurance Provider Name"
                          name="insuranceProviderName"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.coverNoteNumber}
                          label="Cover Note Number"
                          placeholder="Cover Note Number"
                          name="coverNoteNumber"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.noOfLCAmendments}
                          label="No of LC Amendments"
                          placeholder="No of LC Amendments"
                          name="noOfLCAmendments"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.noOfInsuranceAmendments}
                          label="No of Insurance Amendments"
                          placeholder="No of Insurance Amendments"
                          name="noOfInsuranceAmendments"
                        />
                      </div>
                    </>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                // onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
