import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import axios from "axios";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(300, "Maximum 300 symbols")
    .required("Employee name is required")
    .typeError("Employee name is required"),
  // middleName: Yup.string()
  //   .min(1, "Minimum 1 symbol")
  //   .max(300, "Maximum 300 symbols")
  //   .typeError("Maximum 300 symbols"),
  // lastName: Yup.string()
  //   .min(1, "Minimum 1 symbol")
  //   .max(300, "Maximum 300 symbols")
  //   .typeError("Maximum 300 symbols"),
  gender: Yup.object()
    .shape({
      label: Yup.string().required("Gender is required"),
      value: Yup.string().required("Gender is required"),
    })
    .typeError("Gender is required"),
  businessUnit: Yup.object()
    .shape({
      label: Yup.string().required("Business unit is required"),
      value: Yup.string().required("Business unit is required"),
    })
    .typeError("Business unit is required"),
  SBUName: Yup.object()
    .shape({
      label: Yup.string().required("SBU name is required"),
      value: Yup.string().required("SBU name is required"),
    })
    .typeError("SBU name is required"),
  functionalDepartment: Yup.object()
    .shape({
      label: Yup.string().required("Functional department is required"),
      value: Yup.string().required("Functional department is required"),
    })
    .typeError("Functional department is required"),
  // HRposition: Yup.object()
  //   .shape({
  //     label: Yup.string().required("HR position/rank is required"),
  //     value: Yup.string().required("HR position/rank is required"),
  //   })
  //   .typeError("HR position/rank is required"),
  designation: Yup.object()
    .shape({
      label: Yup.string().required("Designation is required"),
      value: Yup.string().required("Designation is required"),
    })
    .typeError("Designation is required"),
  workplace: Yup.object()
    .shape({
      label: Yup.string().required("Workplace is required"),
      value: Yup.string().required("Workplace is required"),
    })
    .typeError("Workplace is required"),
  employmentType: Yup.object()
    .shape({
      label: Yup.string().required("Employment type is required"),
      value: Yup.string().required("Employment type is required"),
    })
    .typeError("Employment type is required"),
  employeeStatus: Yup.object()
    .shape({
      label: Yup.string().required("Employee status is required"),
      value: Yup.string().required("Employee status is required"),
    })
    .typeError("Employee status is required"),
  superVisor: Yup.object()
    .shape({
      label: Yup.string().required("Supervisor is required"),
      value: Yup.string().required("Supervisor is required"),
    })
    .typeError("Supervisor is required"),
  religion: Yup.object()
    .shape({
      label: Yup.string().required("Religion is required"),
      value: Yup.string().required("Religion is required"),
    })
    .typeError("Religion is required"),
  joiningDate: Yup.string()
    .required("Date is required")
    .typeError("Date is required"),
  code: Yup.string()
    .required("Employee code is required")
    .typeError("Employee code is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  costCenterDDL,
  businessUnitDDL,
  workplaceDDL,
  departmentDDL,
  designationDDL,
  employeeGradeDDL,
  employeeTypeDDL,
  employeeStatusDDL,
  SBUDDL,
  modalShow,
  setModelShow,
  lineManager,
  setLineManagerValue,
  subOnChangeHandler,
  businessUnitOnChangeHandler,
  lineManagerDDl,
  selectedBusinessUnit,
  profileData,
  religionDDL,
}) {
  const loadEmpList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const genderDDL = [
    { value: 1, label: "Male" },
    { value: 2, label: "Female" },
    { value: 3, label: "Common" },
  ];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employeeStatus: employeeStatusDDL[0],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, setModelShow, () => {
            resetForm(initData);
            setLineManagerValue("");
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
              <div className="row global-form global-form-custom bj-left pb-2">
                <div className="col-lg-3 ">
                  <label>Employee Name</label>
                  <InputField
                    value={values?.firstName}
                    name="firstName"
                    placeholder="Employee Name"
                    type="text"
                  />
                </div>
                {/* <div className="col-lg-3 ">
                  <label>Middle Name (Optional)</label>
                  <InputField
                    value={values?.middleName}
                    name="middleName"
                    placeholder="Middle Name"
                    type="text"
                  />
                </div> */}
                {/* <div className="col-lg-3 ">
                  <label>Last Name (Optional)</label>
                  <InputField
                    value={values?.lastName}
                    name="lastName"
                    placeholder="Last Name"
                    type="text"
                  />
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="gender"
                    options={genderDDL}
                    value={values?.gender}
                    label="Gender"
                    onChange={(valueOption) => {
                      setFieldValue("gender", valueOption);
                    }}
                    placeholder="Gender"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="religion"
                    options={religionDDL}
                    value={values?.religion}
                    label="Religion"
                    onChange={(valueOption) => {
                      setFieldValue("religion", valueOption);
                    }}
                    placeholder="Religion"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 ">
                  <label>Email (Optional)</label>
                  <InputField
                    value={values?.email}
                    name="email"
                    placeholder="Email"
                    type="email"
                  />
                </div>
                <div className="col-lg-3 ">
                  <label>Employee Code</label>
                  <InputField
                    value={values?.code}
                    name="code"
                    placeholder="Employee Code"
                    type="text"
                  />
                </div>
                <div className="col-lg-3  mt-1">
                  <label>Date of Joining</label>
                  <InputField
                    value={values?.joiningDate || ""}
                    name="joiningDate"
                    placeholder="Date of Joining"
                    type="date"
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("SBUName", "");
                      setFieldValue("businessUnit", valueOption);
                      businessUnitOnChangeHandler(valueOption?.value);
                    }}
                    placeholder="Business Unit"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="SBUName"
                    options={SBUDDL}
                    value={values?.SBUName}
                    label="SBU Name"
                    onChange={(valueOption) => {
                      setFieldValue("costCenter", "");
                      setFieldValue("SBUName", valueOption);
                      subOnChangeHandler(valueOption?.value);
                    }}
                    placeholder="SBU Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="costCenter"
                    options={costCenterDDL}
                    value={values?.costCenter}
                    label="Cost Center (Optional)"
                    onChange={(valueOption) => {
                      setFieldValue("costCenter", valueOption);
                    }}
                    isDisabled={!values?.SBUName}
                    placeholder="Cost Center"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="workplace"
                    options={workplaceDDL}
                    value={values?.workplace}
                    label="Workplace"
                    onChange={(valueOption) => {
                      setFieldValue("workplace", valueOption);
                    }}
                    placeholder="Workplace"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="functionalDepartment"
                    options={departmentDDL}
                    value={values?.functionalDepartment}
                    label="Functional Department"
                    onChange={(valueOption) => {
                      setFieldValue("functionalDepartment", valueOption);
                    }}
                    placeholder="Functional Department"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="HRposition"
                    options={HRPositionDDL}
                    value={values?.HRposition}
                    label="HR Position/Rank"
                    onChange={(valueOption) => {
                      setFieldValue("HRposition", valueOption);
                    }}
                    placeholder="HR Position/Rank"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="designation"
                    options={designationDDL}
                    value={values?.designation}
                    label="Designation"
                    onChange={(valueOption) => {
                      setFieldValue("designation", valueOption);
                    }}
                    placeholder="Designation"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="employeeGrade"
                    options={employeeGradeDDL}
                    value={values?.employeeGrade}
                    label="Employee Grade (Optional)"
                    onChange={(valueOption) => {
                      setFieldValue("employeeGrade", valueOption);
                    }}
                    placeholder="Employee Grade"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="employmentType"
                    options={employeeTypeDDL}
                    value={values?.employmentType}
                    label="Employment Type"
                    onChange={(valueOption) => {
                      setFieldValue("grossSalary", "");
                      setFieldValue("basicSalary", "");
                      setFieldValue("employmentType", valueOption);
                      if (valueOption?.label !== "Permanent") {
                        setFieldValue("grossSalary", 0);
                      }
                    }}
                    placeholder="Employment Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.employmentType?.label === "Permanent" ? (
                  <div className="col-lg-3  mt-1">
                    <label>Confirmation Date</label>
                    <InputField
                      value={values?.confirmationDate || ""}
                      name="confirmationDate"
                      placeholder="Confirmation Date"
                      type="date"
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className="col-lg-3">
                  <label>Supervisor</label>
                  <SearchAsyncSelect
                    selectedValue={values?.superVisor}
                    handleChange={(valueOption) => {
                      setFieldValue("superVisor", valueOption);
                    }}
                    loadOptions={loadEmpList}
                    disabled={true}
                  />
                  <FormikError
                    name="superVisor"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* old */}
                {/* <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="lineManager"
                    options={lineManagerDDl}
                    value={values?.lineManager}
                    label="Supervisor"
                    onChange={(valueOption) => {
                      setFieldValue("lineManager", valueOption);
                      setFieldValue("nanagerInfo", valueOption?.code);
                    }}
                    placeholder="Line Manager"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <label>Line Manager (Optional)</label>
                  <SearchAsyncSelect
                    selectedValue={values?.lineManager}
                    handleChange={(valueOption) => {
                      setFieldValue("nanagerInfo", valueOption?.code);
                      setFieldValue("lineManager", valueOption);
                    }}
                    loadOptions={loadEmpList}
                    disabled={true}
                  />
                </div>
                {/* old code */}
                {/* <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="lineManager"
                    options={lineManagerDDl}
                    value={values?.lineManager}
                    label="Line Manager"
                    onChange={(valueOption) => {
                      setFieldValue("lineManager", valueOption);
                      setFieldValue("nanagerInfo", valueOption?.code);
                    }}
                    placeholder="Line Manager"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}

                {/* <div className="col-lg-3 mt-1">
                  <label>Manager Info.</label>
                  <InputField
                    placeholder="Manager Info."
                    type="text"
                    disabled={true}
                    name="nanagerInfo"
                    value={values?.nanagerInfo}
                  />
                </div> */}
                <div className="col-lg-3 mt-1">
                  <label>Basic Salary</label>
                  <InputField
                    placeholder="Basic Salary"
                    name="basicSalary"
                    disabled={
                      values?.employmentType?.label !== "Permanent" ||
                      !values?.employmentType
                    }
                    onChange={(e) => {
                      setFieldValue("basicSalary", e.target.value);
                      if (values?.employmentType?.label === "Permanent") {
                        setFieldValue("grossSalary", e.target.value * 2);
                      }
                    }}
                    type="number"
                    value={values?.basicSalary}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <label>Gross Salary</label>
                  <InputField
                    placeholder="Gross Salary"
                    disabled={
                      values?.employmentType?.label === "Permanent" ||
                      !values?.employmentType
                    }
                    type="number"
                    name="grossSalary"
                    value={values?.grossSalary}
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
                onClick={() => {
                  resetForm(initData);
                  setLineManagerValue("");
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
