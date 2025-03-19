/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { validationSchema } from "../helper";
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  remover,
  setter,
  pId,
  profileData,
  selectedBusinessUnit,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values }, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <div style={{ fontWeight: "900" }}>Unit: APMBD</div>
              <div style={{ fontWeight: "900" }}>PO Number: 46545651</div>
              <div style={{ fontWeight: "900", marginRight: "30px" }}>
                LC Number: 65465
              </div>
            </div>
            {/* {console.log(values)} */}
            {/*  */}
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipment"
                      options={[]}
                      label="Shipment"
                      value={values?.shipment}
                      onChange={(valueOption) => {
                        setFieldValue("shipment", valueOption);
                      }}
                      placeholder="Shipment"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="providerName"
                      options={[]}
                      label="Provider Name"
                      value={values?.providerName}
                      onChange={(valueOption) => {
                        setFieldValue("providerName", valueOption);
                      }}
                      placeholder="Provider Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Service Date</label>
                    <InputField
                      value={values?.serviceDate}
                      name="serviceDate"
                      placeholder="Service Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Amount (BDT)</label>
                    <InputField
                      value={values?.amount}
                      name="amount"
                      placeholder="Amount (BDT)"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Payment Date</label>
                    <InputField
                      value={values?.paymentDate}
                      name="paymentDate"
                      placeholder="Payment Date"
                      type="date"
                    />
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
