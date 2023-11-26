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
                          name="shipment"
                          label="Shipment"
                          placeholder="Shipment"
                          value={values?.shipment}
                          error={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="custom"
                          label="Custom"
                          placeholder="Custom"
                          value={values?.custom}
                          error={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="agentName"
                          label="Agent Name"
                          placeholder="Agent Name"
                          value={values?.agentName}
                          error={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.docForwardDate}
                          label="Doc Forward Date"
                          placeholder="Doc Forward Date"
                          name="docForwardDate"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.dutyForwardDate}
                          label="Duty Forward Date"
                          placeholder="Duty Forward Date"
                          name="dutyForwardDate"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.deliveryDate}
                          label="Delivery Date"
                          placeholder="Delivery Date"
                          name="deliveryDate"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.m11}
                          label="M11"
                          placeholder="M11"
                          name="m11"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.BoE}
                          label="Bo E"
                          placeholder="Bo E"
                          name="BoE"
                        />
                      </div>
                      {/* )} */}
                      {/* {!isEdit && ( */}

                      {/* )} */}
                      {/* {!isEdit && ( */}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.billNo}
                          label="Bill No"
                          placeholder="Bill No"
                          name="billNo"
                        />
                      </div>
                      {/* )} */}

                      <div className="col-lg-3">
                        <InputField
                          value={values?.portCharges}
                          label="Port Charges"
                          placeholder="Port Charges"
                          name="portCharges"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.shippingCharges}
                          label="Shipping Charges"
                          placeholder="Shipping Charges"
                          name="shippingCharges"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.carriage}
                          label="Carriage"
                          placeholder="Carriage"
                          name="carriage"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.otherCharges}
                          label="Other Changes"
                          placeholder="Other Changes"
                          name="otherCharges"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.agencyCommission}
                          label="Agency Commission"
                          placeholder="Agency Commission"
                          name="agencyCommission"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.totalMiscellaneousExpense}
                          label="Total Miscellaneous Expense"
                          placeholder="Total Miscellaneous Expense"
                          name="totalMiscellaneousExpense"
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.paymentDate}
                          label="Payment Date"
                          placeholder="Payment Date"
                          name="paymentDate"
                          type="date"
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
