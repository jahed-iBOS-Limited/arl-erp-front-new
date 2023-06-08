/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";

const validationSchema = Yup.object().shape({
  damageType: Yup.object().shape({
    label: Yup.string().required("Damage Type is required"),
    value: Yup.string().required("Damage Type is required"),
  }),
  categoryName: Yup.string().required("Category name is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  isEdit,
  resetBtnRef,
  damageTypeDDL,
  view
}) {

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (!isEdit) {
            resetForm(initData);
          }
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
                  name="damageType"
                  options={damageTypeDDL}
                  value={values?.damageType}
                  label="Damage Type"
                  onChange={(valueOption) => {
                    setFieldValue("damageType", valueOption);
                  }}
                  placeholder="Damage Type"
                  errors={errors}
                  touched={touched}
                  isDisabled={view}
                />
              </div>
              <div className="col-lg-3">
                <label>Category Name</label>
                <InputField
                  value={values?.categoryName}
                  name="categoryName"
                  placeholder="Category Name"
                  type="text"
                  disabled={view}
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
