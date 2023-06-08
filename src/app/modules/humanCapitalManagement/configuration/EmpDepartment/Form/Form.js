import React  from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";

// Validation schema
const validationSchema = Yup.object().shape({
  functionalDepartmentName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Department is required"),
  functionalDepartmentCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Middle Name 100 symbols")
    .required("Code is required"),
  // businessUnit: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Last Name 100 symbols")
  //   .required("Comments is required"),
  // partnerDDL: Yup.object().shape({
  //   value: Yup.string().required("Partner DDL is required"),
  //   label: Yup.string().required("Partner DDL is required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  businessUnitDdlData,
  allBusinessUnitChecked,
  setAllBusinessUnitChecked,
  isCorporateChecked,
  setIsCorporateChecked,
  id
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
              <div className="form-group row global-form">
                <div className="col">
                  <IInput
                    value={values.functionalDepartmentName }
                    label="Department Name"
                    name="functionalDepartmentName"
                  />
                </div>

                <div className="col">
                  <IInput
                    value={values.functionalDepartmentCode}
                    label="Department Code"
                    name="functionalDepartmentCode"
                    disabled={isEdit}
                  />
                </div>
                {/* {!id && ( */}
                  <div className="d-flex justify-content-center align-items-center col">
                    <label>
                      <Field
                        onClick={() => {
                          setFieldValue("isCorporate", "");
                          // setAllBusinessUnitChecked(!allBusinessUnitChecked);
                          setIsCorporateChecked(!isCorporateChecked);
                        }}
                        style={{ marginRight: "5px", marginTop:"6px" }}
                        type="checkbox"
                        name="isCorporate"
                        // value={}
                        checked={values?.isCorporate}
                        
                      />
                     <span style={{position:"relative", bottom:"3px"}}> Is Corporate</span>
                    </label>
                  </div>
                {/* )} */}

                {/* {!id && ( */}
                  <div className="col">
                    <ISelect
                      label="Business Unit"
                      options={businessUnitDdlData}
                      // defaultValue={values.businessUnit}
                      value={values.businessUnit}
                      name="businessUnit"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      isDisabled={allBusinessUnitChecked === true}
                    />
                  </div>
                {/* )} */}
                {/* {!id && ( */}
                  <div className="d-flex justify-content-center align-items-center col">
                    <label>
                      <Field
                        onClick={() => {
                          setFieldValue("businessUnit", "");
                          setAllBusinessUnitChecked(!allBusinessUnitChecked);
                          
                        }}
                        style={{ marginRight: "5px", marginTop:"6px" }}
                        type="checkbox"
                        name="checked"
                        value="All Business Unit"
                        checked={allBusinessUnitChecked === true}
                      />
                      <span style={{position:"relative", bottom:"3px"}}>All Business Unit</span>
                    </label>
                  </div>
                {/* )} */}
              </div>

              {/* <div className="row">
                <div className="col-lg">

                </div>
              </div> */}

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
