import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import Axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
// Validation schema
const validationSchema = Yup.object().shape({
  controllingUnitCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  controllingUnitName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Controlling Unit Name is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  empDDL,
  isEdit,
}) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/hcm/HCMDDL/GetSuperVisorDDL?AccountId=${profileData?.accountId}&Search=${v}`
    ).then((res) => res?.data);
  };

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
            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <IInput
                    value={values.controllingUnitName}
                    label="Controlling Unit"
                    name="controllingUnitName"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={values.controllingUnitCode}
                    label="Code"
                    name="controllingUnitCode"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <label>Select Responsible Person (Optional)</label>
                  <SearchAsyncSelect
                    selectedValue={values?.responsiblePerson}
                    handleChange={(valueOption) => {
                      setFieldValue("responsiblePerson", valueOption);
                    }}
                    loadOptions={loadUserList}
                  />
                  <FormikError
                    errors={errors}
                    name="responsiblePerson"
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
    </>
  );
}
