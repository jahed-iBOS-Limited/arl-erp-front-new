import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

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
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
                      {/* {!isEdit && ( */}

                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <NewSelect
                          name="inspectionCompany"
                          label="Inspection Company"
                          placeholder="Inspection Company"
                          value={values?.inspectionCompany}
                          error={errors}
                          touched={touched}
                        ></NewSelect>
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.unitOfMeasurement}
                          label="Unit Of Measurement"
                          placeholder="Unit Of Measurement"
                          name="unitOfMeasurement"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.invoiceQty}
                          label="Invoice Qty"
                          placeholder="Invoice Qty"
                          name="invoiceQty"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.actualQty}
                          label="Actual Qty"
                          placeholder="Actual Qty"
                          name="actualQty"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.shortQty}
                          label="Short Qty"
                          placeholder="Short Qty"
                          name="shortQty"
                        />
                      </div>
                      {/* )} */}

                      <div className="col-lg-3">
                        <InputField
                          value={values?.billNumber}
                          label="Bill Number"
                          placeholder="Bill Number"
                          name="billNumber"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.inspectionCharge}
                          label="Inspection Charge"
                          placeholder="Inspection Charge"
                          name="inspectionCharge"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.vatOnCharge}
                          label="VAT On Charge"
                          placeholder="VAT On Charge"
                          name="vatOnCharge"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.surveyDate}
                          label="Survey Date"
                          placeholder="Survey Date"
                          name="surveyDate"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.paymentDate}
                          label="Payment Date"
                          placeholder="Payment Date"
                          name="paymentDate"
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
