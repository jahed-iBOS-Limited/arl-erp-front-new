import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";

const validationSchema = Yup.object().shape({
  beatName: Yup.string().required("Market Name is required"),
  territory: Yup.object().shape({
    value: Yup.string().required("Territory Name  is required"),
    label: Yup.string().required("Territory Name  is required"),
  }),
  route: Yup.object().shape({
    value: Yup.string().required("Route Name  is required"),
    label: Yup.string().required("Route Name  is required"),
  }),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  territoryNameDDL,
  routeNameDDL,
}) {
  return (
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
          <Form className="global-form form form-label-right">
            <div className="form-group row">
              <div className="col-lg-3">
                <label>Market Name</label>
                <InputField
                  value={values?.beatName}
                  name="beatName"
                  placeholder="Market Name"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="territory"
                  options={territoryNameDDL}
                  value={values?.territory}
                  label="Territory Name"
                  onChange={(valueOption) => {
                    setFieldValue("territory", valueOption);
                  }}
                  placeholder="Territory Name"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="route"
                  options={routeNameDDL}
                  value={values?.route}
                  label="Route Name"
                  onChange={(valueOption) => {
                    setFieldValue("route", valueOption);
                  }}
                  placeholder="Route Name"
                  errors={errors}
                  touched={touched}
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
  );
}

export default _Form;
