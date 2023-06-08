import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";

// Validation schema
const validationSchema = Yup.object().shape({
  shipmentId: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Shipment Id is required"),
  shipmentCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Shipment Code is required"),
  noOfChallan: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("No Of Challan is required"),
});
export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
  ty,
}) {
  console.log(ty);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values, isValid }) => (
          <>
            {console.log(values)}
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <IInput
                    value={values.shipmentId}
                    label="Shipment Id"
                    name="shipmentId"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values.shipemntCode}
                    label="Shipment Code"
                    name="shipemntCode"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values.noOfChallan}
                    label="No of Challan"
                    name="noOfChallan"
                    disabled={isEdit}
                  />
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
