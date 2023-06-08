import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const validationSchema = Yup.object().shape({
  strType: Yup.string().required("Type name is required"),
  strComments: Yup.string().required("Comments is required"),
  addDeType: Yup.object()
    .shape({
      label: Yup.string().required("Type is required"),
    })
    .typeError("Type is required"),
});

function _Form({ initData, btnRef, saveHandler, resetBtnRef, type }) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        addDeType:
          type?.label === "All"
            ? {
                label: "Addition",
                value: 1,
              }
            : type,
      }}
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
                <NewSelect
                  name="addDeType"
                  options={[
                    {
                      label: "Addition",
                      value: 1,
                    },
                    {
                      label: "Deduction",
                      value: 2,
                    },
                  ]}
                  value={values?.addDeType}
                  label="Type"
                  onChange={(valueOption) => {
                    setFieldValue("addDeType", valueOption);
                  }}
                  placeholder="Type"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>{values?.addDeType?.label || ""} Type Name</label>
                <InputField
                  value={values?.strType}
                  name="strType"
                  placeholder={`${values?.addDeType?.label || ""} Type`}
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Comments</label>
                <InputField
                  value={values?.strComments}
                  name="strComments"
                  placeholder="Comments"
                  type="text"
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
