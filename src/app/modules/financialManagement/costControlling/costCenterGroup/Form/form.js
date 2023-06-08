import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const validationSchema = Yup.object().shape({
  costCenterGroupCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  costCenterGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Name is required"),
  controllingUnit: Yup.object().shape({
    label: Yup.string().required("Controlling Unit is required"),
    value: Yup.string().required("Controlling Unit is required"),
  }),
  costCenterGroupParent: Yup.object().shape({
    label: Yup.string().required("Group Parent is required"),
    value: Yup.string().required("Group Parent is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  controlUnitDDL,
  isEdit,
  groupParentDDL,
  controllingUnitDDL,
  getGroupParentDDL,
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
                <div className="col-lg-6">
                  <Field
                    value={values.costCenterGroupName || ""}
                    name="costCenterGroupName"
                    component={Input}
                    placeholder="Group Name"
                    label="Group Name"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-6">
                  <Field
                    value={values.costCenterGroupCode || ""}
                    name="costCenterGroupCode"
                    component={Input}
                    disabled={isEdit}
                    placeholder="Group code"
                    label="Group code"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-6">
                  <label>Select Controlling Unit</label>
                  <Field
                    name="controllingUnit"
                    placeholder="Select Controlling Unit"
                    component={() => (
                      <Select
                        options={controllingUnitDDL}
                        placeholder="Select Controlling Unit"
                        value={values?.controllingUnit}
                        onChange={(valueOption) => {
                          setFieldValue("controllingUnit", valueOption);
                          setFieldValue("costCenterGroupParent", "");
                          getGroupParentDDL(valueOption?.value);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={isEdit}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.controllingUnit &&
                    touched && touched.controllingUnit
                      ? errors.controllingUnit.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-6">
                  <label>Select Group Parent</label>
                  <Field
                    name="costCenterGroupParent"
                    placeholder="Select Group Parent"
                    component={() => (
                      <Select
                        isDisabled={!values?.controllingUnit?.value}
                        options={groupParentDDL}
                        placeholder="Select Group Parent"
                        value={values?.costCenterGroupParent}
                        onChange={(valueOption) => {
                          setFieldValue("costCenterGroupParent", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.costCenterGroupParent &&
                    touched && touched.costCenterGroupParent
                      ? errors.costCenterGroupParent.value
                      : ""}
                  </p>
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
