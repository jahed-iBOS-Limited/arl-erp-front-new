import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  uomName: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("UOM is required"),
  uomCode: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Code is required"),
});

export default function _Form({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  uomCode,
  uomName,
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <Field
                    value={values.uomName || ""}
                    name="uomName"
                    component={Input}
                    placeholder="UOM"
                    label="UOM"
                    disabled={uomName}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.uomCode || ""}
                    name="uomCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    disabled={uomCode}
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
