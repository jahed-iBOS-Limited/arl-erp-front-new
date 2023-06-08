import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  remunerationComponent: Yup.string().required(
    "Remuneration component is required"
  ),
  remunerationComponentCode: Yup.string().required(
    "Remuneration component code is required"
  ),
  remunerationComponentTypeID: Yup.object().shape({
    value: Yup.string().required("Component Type is required"),
    label: Yup.string().required("Component Type is required"),
  }),
});
const editValidationSchema = Yup.object().shape({
  remunerationComponent: Yup.string().required(
    "Remuneration component is required"
  ),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  componentTypeDDL,
  isEdit,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? editValidationSchema : validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(
            {
              ...values,
              remunerationComponetTypeId: values.remunerationComponetTypeId,
              remunerationComponentCode: values.remunerationComponentCode,
            },
            () => {
              resetForm(initData);
            }
          );
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
            {console.log("values => ", values)}
            {console.log("errors => ", errors)}

            <Form className="form form-label-right">
              <div className="global-form py-2">
                <div className="row">
                  {!isEdit && (
                    <div className="col-lg">
                        <label>Select Component Type</label>                 
                      <NewSelect
                        name="remunerationComponentTypeID"
                        options={componentTypeDDL}
                        value={values?.remunerationComponentTypeID}
                        // defaultValue={values?.paid_by}
                        onChange={(valueOption) => {
                          setFieldValue(
                            "remunerationComponentTypeID",
                            valueOption
                          );
                        }}
                        isDisabled={isEdit}
                        errors={errors}
                        touched={touched}
                      />
                                        
                    </div>
                  )}{" "}
                        
                  <div className="col-lg">
                    <label>Component Name</label>                       
                    <InputField
                      value={values?.remunerationComponent}
                      name="remunerationComponent"
                      placeholder="Component Name"
                    />
                  </div>
                  <div className="col-lg">
                    <label>Component Code</label>                       
                    <InputField
                      value={values?.remunerationComponentCode}
                      name="remunerationComponentCode"
                      placeholder="Component Code"
                      disabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-2">
                    <div
                      style={{ position: "relative", top: "15px" }}
                      className="mr-3"
                    >
                      <label htmlFor="completeOrder">On Basic?</label>
                      <Field
                        name="completeOrder"
                        component={() => (
                          <input
                            id="isOnBasic"
                            type="checkbox"
                            style={{ position: "relative", top: "5px" }}
                            label="On Basic?"
                            className="ml-2"
                            value={values?.isOnBasic}
                            checked={values?.isOnBasic}
                            name="isOnBasic"
                            onChange={(e) => {
                              if (values?.isOnBasic) {
                                setFieldValue("isOnBasic", e.target.checked);
                                setFieldValue("defaultPercentOnBasic", "");
                              } else {
                                setFieldValue("isOnBasic", e.target.checked);
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-lg">
                    <label>Percent On Basic Remuneration(%)</label>
                    <InputField
                      value={values?.defaultPercentOnBasic}
                      name="defaultPercentOnBasic"
                      placeholder="Percent On Basic Remuneration"
                      disabled={!values?.isOnBasic}
                      type="number"
                      min="0"
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
