import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  remunerationType: Yup.string().required("Remuneration Type  is required"),
  paid_by: Yup.object().shape({
    value: Yup.string().required("Paid By is required"),
    label: Yup.string().required("Paid By is required"),
    
  }),
  
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
                  <label>Remuneration Type</label>                      
                  <InputField
                    value={values?.remunerationType}
                    name="remunerationType"
                    placeholder="Remuneration Type"
                  />
                                    
                </div>
                
                      
              
                  <div className="col-lg-4">
                    <NewSelect
                      name="paid_by"
                      label="Paid By"
                      options={[{value:"monthlyPaid",label:"Monthly"},{value:"dailyPaid",label:"Daily"}]}
                      value={values?.paid_by}
                      // defaultValue={values?.paid_by}
                      onChange={(valueOption) => {
                        setFieldValue("paid_by", valueOption);
                      }}
                      
                      
                      errors={errors}
                      touched={touched}
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
