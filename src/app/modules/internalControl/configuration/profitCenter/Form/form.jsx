import Axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Select from "react-select";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import customStyles from "../../../../selectCustomStyle";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
// Validation schema
const validationSchema = Yup.object().shape({
  profitCenterCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  profitCenterName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Profit Center Name is required"),
  // responsiblePerson: Yup.object().shape({
  //   label: Yup.string().required("Responsible Person is required"),
  //   value: Yup.string().required("Responsible Person is required"),
  // }),
  controllingUnit: Yup.object().shape({
    label: Yup.string().required("Controlling Unit is required"),
    value: Yup.string().required("Controlling Unit is required"),
  }),
  groupName: Yup.object().shape({
    label: Yup.string().required("Group Name is required"),
    value: Yup.string().required("Group Name is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  cuDDL,
  groupNameDDL,
  isEdit,
  groupDDLDispatch,
  setResponsiblePerson,
  responsiblePerson,
}) {
  useEffect(() => {
    if (initData?.responsiblePerson?.label) {
      setResponsiblePerson(initData?.responsiblePerson?.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);
  console.log("initData", initData);
  useEffect(() => {
    groupDDLDispatch(initData?.controllingUnit?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, initData?.controllingUnit?.value]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/hcm/HCMDDL/GetSuperVisorDDL?AccountId=${profileData?.accountId}&Search=${v}`
    ).then((res) => res?.data);
    // return Axios.get(
    //   `/hcm/HCMDDL/GetLineManagerDDLSearch?AccountId=${profileData?.accountId}&Search=${v}`
    // ).then((res) => res?.data)
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <Field
                    value={values.profitCenterName || ""}
                    name="profitCenterName"
                    component={Input}
                    placeholder="Profit Center Name"
                    label="Profit Center Name"
                    disabled={isEdit}
                  />
                </div>

                <div className="col-lg-4">
                  <Field
                    value={values.profitCenterCode || ""}
                    name="profitCenterCode"
                    component={Input}
                    disabled={isEdit}
                    placeholder="Profit Center code"
                    label="Profit Center code"
                  />
                </div>

                <div className="col-lg-4">
                  <label>Select Controlling Unit</label>
                  <Field
                    name="controllingUnit"
                    placeholder="Select Controlling Unit"
                    component={() => (
                      <Select
                        isDisabled={isEdit}
                        options={cuDDL}
                        placeholder="Select Controlling Unit"
                        value={values?.controllingUnit}
                        onChange={(valueOption) => {
                          setFieldValue("controllingUnit", valueOption);
                          groupDDLDispatch(valueOption?.value);
                          setFieldValue("groupName", {});
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
                    errors.controllingUnit &&
                    touched?.controllingUnit
                      ? errors.controllingUnit.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-4">
                  <label>Select Group Name</label>
                  <Field
                    name="groupName"
                    placeholder="Select Group Name"
                    component={() => (
                      <Select
                        // isDisabled={isEdit}
                        options={groupNameDDL}
                        placeholder="Select Group Name"
                        value={values?.groupName}
                        onChange={(valueOption) => {
                          setFieldValue("groupName", valueOption);
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
                    {errors && errors.groupName && touched.groupName
                      ? errors.groupName.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-3 mt-1">
                  <label>Responsible Person (Optional)</label>
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
