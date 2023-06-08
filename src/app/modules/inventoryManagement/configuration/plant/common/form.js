import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
// Validation schema
const ProductEditSchema = Yup.object().shape({
  plantName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Warehouse is required"),
  plantCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Code is required"),
  plantAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(300, "Maximum 300 symbols")
    .required("Address is required"),
});

export default function _Form({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  disableHandler,
  plantCode,
  plantName,
  accountId,
  selectedBusinessUnit,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveWarehouse(values, () => {
            resetForm(product);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
           
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values.plantName || ""}
                    name="plantName"
                    component={Input}
                    placeholder="Plant"
                    label="Plant"
                    disabled={plantName}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.plantCode || ""}
                    name="plantCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    disabled={plantCode}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.plantAddress || ""}
                    name="plantAddress"
                    component={Input}
                    placeholder="Address"
                    label="Address"
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
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
