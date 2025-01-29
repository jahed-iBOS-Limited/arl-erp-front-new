import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import Axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
// Validation schema
const validationSchema = Yup.object().shape({
  costCenterName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),
  costCenterCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Controlling Unit Name is required"),
  // responsiblePerson: Yup.object().shape({
  //   label: Yup.string().required("Responsible Person is required"),
  //   value: Yup.string().required("Responsible Person is required"),
  // }),
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
  cu: Yup.object().shape({
    label: Yup.string().required("Controlling Unit is required"),
    value: Yup.string().required("Controlling Unit is required"),
  }),
  ccGroupName: Yup.object().shape({
    label: Yup.string().required("Group Name is required"),
    value: Yup.string().required("Group Name is required"),
  }),
  profitCenter: Yup.object().shape({
    label: Yup.string().required("Profit Center is required"),
    value: Yup.string().required("Profit Center is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  sbuDDL,
  CuDDL,
  CcTypeDDL,
  CostCenterType,
  CcGroupNameDDL,
  CostCenterGroup,
  profitCenter_Acion,
  ProfitCenterDDL,
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
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <>
            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <Field
                    value={values.costCenterName || ""}
                    name="costCenterName"
                    component={Input}
                    disabled={isEdit}
                    placeholder="Cost Center Name"
                    label="Cost Center Name"
                  />
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.costCenterCode || ""}
                    name="costCenterCode"
                    component={Input}
                    disabled={isEdit}
                    placeholder="Cost Center code"
                    label="Code"
                  />
                </div>
                <div className="col-lg-3">
                  <label>SBU</label>
                  <Field
                    name="sbu"
                    placeholder="Select SBU"
                    component={() => (
                      <Select
                        options={sbuDDL}
                        placeholder="Select SBU"
                        value={values?.sbu}
                        isDisabled={isEdit}
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
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
                    {errors && errors.sbu && touched && touched.sbu
                      ? errors.sbu.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Controlling Unit</label>
                  <Field
                    name="cu"
                    placeholder="Select Controlling Unit"
                    component={() => (
                      <Select
                        options={CuDDL}
                        isDisabled={isEdit}
                        placeholder="Select Controlling Unit"
                        value={values?.cu}
                        onChange={(valueOption) => {
                          setFieldValue("cu", valueOption);
                          setFieldValue("costCenterType", "");
                          setFieldValue("ccGroupName", "");
                          setFieldValue("profitCenter", "");
                          CostCenterType(valueOption?.value);
                          CostCenterGroup(valueOption?.value);
                          profitCenter_Acion(valueOption?.value);
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
                    {errors && errors.cu && touched && touched.cu
                      ? errors.cu.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Group Name</label>
                  <Field
                    name="ccGroupName"
                    placeholder="Select Group Name"
                    component={() => (
                      <Select
                        options={CcGroupNameDDL}
                        isDisabled={isEdit}
                        placeholder="Select Group Name"
                        value={values?.ccGroupName}
                        onChange={(valueOption) => {
                          setFieldValue("ccGroupName", valueOption);
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
                    errors.ccGroupName &&
                    touched &&
                    touched.ccGroupName
                      ? errors.ccGroupName.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Profit Center Name</label>
                  <Field
                    name="profitCenter"
                    placeholder="Select Profit Center Name"
                    component={() => (
                      <Select
                        options={ProfitCenterDDL}
                        isDisabled={isEdit}
                        placeholder="Select Profit Center Name"
                        value={values?.profitCenter}
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
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
                    errors.profitCenter &&
                    touched &&
                    touched.profitCenter
                      ? errors.profitCenter.value
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
