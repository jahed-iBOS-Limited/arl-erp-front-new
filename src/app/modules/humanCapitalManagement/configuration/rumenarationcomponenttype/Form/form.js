import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  remunerationComponentType: Yup.string().required("Remuneration Type  is required"),
  remunerationComponentTypeCode: Yup.string().required("Code is required"),

});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  businessTypeDDl,
  isEdit,
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
            {disableHandler(!isValid)}
            {console.log("values", values)}
            {console.log("errors", errors)}
            <div className="global-form">
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <label> Component Type</label>                      
                  <InputField
                    value={values?.remunerationComponentType}
                    name="remunerationComponentType"
                    placeholder="Component Type"
                  />
                                    
                </div>
                      
                <div className="col-lg-4">
                  <label>Code</label>
                                        
                  <InputField
                    value={values?.remunerationComponentTypeCode}
                    name="remunerationComponentTypeCode"
                    placeholder="Code"
                    disabled={isEdit}
                  />
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
              </div>
            </Form>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
