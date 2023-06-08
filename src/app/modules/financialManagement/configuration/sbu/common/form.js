import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  sbuname: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("SBU Name is required"),
  sbucode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("SBU Code is required"),
});

export default function _Form({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  sbucode,
  sbuname,
  selectedBusinessUnit,
  warehouseCode,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { resetForm }) => {
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
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={selectedBusinessUnit.label}
                    name="businessUnitName"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    disabled="true"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.sbuname || ""}
                    name="sbuname"
                    component={Input}
                    placeholder=" SBU Name"
                    label=" SBU Name"
                    disabled={sbuname}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.sbucode || ""}
                    name="sbucode"
                    component={Input}
                    placeholder="SBU Code"
                    label="SBU Code"
                    disabled={warehouseCode}
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
