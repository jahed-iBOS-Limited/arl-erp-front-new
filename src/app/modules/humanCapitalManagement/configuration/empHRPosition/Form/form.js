import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  positionName: Yup.string().required("HR Position Name is required"),
  positionCode: Yup.string().required("HR Position Code is required"),
  positionGroup: Yup.object().shape({
    value: Yup.string().required("Position Group is required"),
    label: Yup.string().required("Position Group is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  positionGroupDDl,
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
            <div className="global-form">
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-lg">
                    <label>HR Position Name</label>                      
                    <InputField
                      value={values?.positionName}
                      name="positionName"
                      placeholder="HR Position Name"
                    />
                                      
                  </div>
                  <div className="col-lg">
                     <label>HR Position Code</label>               
                    <InputField
                      value={values?.positionCode}
                      name="positionCode"
                      placeholder="HR Position Code"
                      disabled={isEdit}
                    />
                                      
                  </div>
                        
                  <div className="col-lg">
                    <NewSelect
                      name="positionGroup"
                      options={positionGroupDDl || []}
                      value={values?.positionGroup}
                      // defaultValue={{
                      //   value: "",
                      //   label: "Select Business Unit",
                      // }}
                      onChange={(valueOption) => {
                        setFieldValue("positionGroup", valueOption);
                      }}
                      label="Position Group"
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
