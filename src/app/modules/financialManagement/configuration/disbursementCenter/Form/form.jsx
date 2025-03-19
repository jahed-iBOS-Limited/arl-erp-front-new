import React  from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
// Validation schema
const validationSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  disbursementCenter: Yup.string()
    .min(1, "Minimum 8 symbols")
    .max(1000, "Maximum 1000 symbols")
    .required("Disbursement Center is required"),
  disbursementCenterCode: Yup.string()
    .min(1, "Minimum 8 symbols")
    .max(1000, "Maximum 1000 symbols")
    .required("Disbursement Center Code is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  sbuDDL,
}) {
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
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <NewSelect
                    name="sbu"
                    options={sbuDDL || []}
                    value={values?.sbu}
                    label="Select SBU"
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                    }}
                    placeholder="Select SBU"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <label>Disbursement Center</label>
                  <InputField
                    value={values?.disbursementCenter}
                    name="disbursementCenter"
                    placeholder="Disbursement Center"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Disbursement Center Code</label>
                  <InputField
                    value={values?.disbursementCenterCode}
                    name="disbursementCenterCode"
                    placeholder="Disbursement Center Code"
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
