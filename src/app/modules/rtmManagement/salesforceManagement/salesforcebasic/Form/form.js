import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { DropzoneDialogBase } from "material-ui-dropzone";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import Axios from "axios";
import FormikError from "./../../../../_helper/_formikError";
import { shallowEqual, useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols")
    .required("First Name required"),
  middleName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols"),
  // .required("Middle Name required"),
  lastName: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(1000, "Maximum 100 symbols"),
  // employeeCode: Yup.string()
  //   .min(1, "Minimum 1 symbols")
  //   .max(1000, "Maximum 100 symbols")
  //   .required("Employee Code required"),

  businessUnit: Yup.object().shape({
    label: Yup.string().required("Business Unit required"),
    value: Yup.string().required("Business Unit required"),
  }),
  SBUName: Yup.object().shape({
    label: Yup.string().required("SBU Name required"),
    value: Yup.string().required("SBU Name required"),
  }),
  // costCenter: Yup.object().shape({
  //   label: Yup.string().required("Cost Center required"),
  //   value: Yup.string().required("Cost Center required"),
  // }),
  functionalDepartment: Yup.object().shape({
    label: Yup.string().required("Functional Department required"),
    value: Yup.string().required("Functional Department required"),
  }),
  HRposition: Yup.object().shape({
    label: Yup.string().required("HR Position required"),
    value: Yup.string().required("HR Position required"),
  }),
  designation: Yup.object().shape({
    label: Yup.string().required("Designation required"),
    value: Yup.string().required("Designation required"),
  }),
  // employeeGrade: Yup.object().shape({
  //   label: Yup.string().required("Employee Grade required"),
  //   value: Yup.string().required("Employee Grade required"),
  // }),
  workplace: Yup.object().shape({
    label: Yup.string().required("Workplace required"),
    value: Yup.string().required("Workplace required"),
  }),

  // lineManager: Yup.object().shape({
  //   label: Yup.string().required('Line Manager required'),
  //   value: Yup.string().required('Line Manager required'),
  // }),
  employmentType: Yup.object().shape({
    label: Yup.string().required("Employment Type required"),
    value: Yup.string().required("Employment Type required"),
  }),
  employeeStatus: Yup.object().shape({
    label: Yup.string().required("Employee Status required"),
    value: Yup.string().required("Employee Status required"),
  }),
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
  HRPositionDDL,
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
  empLavelDDL,
  setFileObjects,
  fileObjects,
}) {
  // image attachment
  const [open, setOpen] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/hcm/HCMDDL/GetLineManagerDDLSearch?AccountId=${profileData?.accountId}&Search=${v}`
    ).then((res) => res?.data);
  };

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
          saveHandler(values, () => {
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
                  <label>First Name</label>
                  <InputField
                    value={values?.firstName}
                    name="firstName"
                    placeholder="First Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3 ">
                  <label>Middle Name (Optional)</label>
                  <InputField
                    value={values?.middleName}
                    name="middleName"
                    placeholder="Middle Name"
                    type="text"
                  />
                </div>
                <div className="col-lg-3 ">
                  <label>Last Name (Optional)</label>
                  <InputField
                    value={values?.lastName}
                    name="lastName"
                    placeholder="Last Name"
                    type="text"
                  />
                </div>
                {/* <div className="col-lg-3">
                  <label>Employee Code</label>
                  <InputField
                    value={values?.employeeCode}
                    name="employeeCode"
                    placeholder="Employee Code"
                    type="text"
                    disabled={true}
                  />
                </div> */}
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      businessUnitOnChangeHandler(valueOption?.value);
                      setFieldValue("SBUName", "");
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
                      setFieldValue("SBUName", valueOption);
                      subOnChangeHandler(valueOption?.value);
                      setFieldValue("costCenter", "");
                    }}
                    placeholder="SBU Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="costCenter"
                    options={costCenterDDL}
                    value={values?.costCenter}
                    label="Cost Center"
                    onChange={(valueOption) => {
                      setFieldValue("costCenter", valueOption);
                    }}
                    placeholder="Cost Center"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
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
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="HRposition"
                    options={HRPositionDDL}
                    value={values?.HRposition}
                    label="HR Position"
                    onChange={(valueOption) => {
                      setFieldValue("HRposition", valueOption);
                    }}
                    placeholder="HR Position"
                    errors={errors}
                    touched={touched}
                  />
                </div>
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
                <div className="col-lg-3 mt-1">
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
                </div>
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="employmentType"
                    options={employeeTypeDDL}
                    value={values?.employmentType}
                    label="Employment Type"
                    onChange={(valueOption) => {
                      setFieldValue("employmentType", valueOption);
                    }}
                    placeholder="Employment Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <div className="newSelectWrapper">
                    <label>Line Manager (Optional)</label>
                    <SearchAsyncSelect
                      selectedValue={values?.lineManager}
                      handleChange={(valueOption) => {
                        setFieldValue("lineManager", valueOption);
                        setFieldValue("nanagerInfo", valueOption?.code);
                      }}
                      loadOptions={loadUserList}
                      name="lineManager"
                    />
                    <i
                      class="far fa-times-circle "
                      style={{
                        position: "absolute",
                        zIndex: "99",
                        right: " 8%",
                        top: "53%",
                        fontSize: "13px",
                      }}
                      onClick={() => {
                        setFieldValue("lineManager", "");
                        setFieldValue("nanagerInfo", "");
                      }}
                    ></i>
                  </div>

                  <FormikError
                    errors={errors}
                    name="lineManager"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <label>Manager Info.</label>
                  <InputField
                    placeholder="Manager Info."
                    type="text"
                    disabled={true}
                    name="nanagerInfo"
                    value={values?.nanagerInfo}
                  />
                </div>
                <div className="col-lg-3 mt-1">
                  <NewSelect
                    name="employeeStatus"
                    options={employeeStatusDDL}
                    value={values?.employeeStatus}
                    label="Employee Status"
                    onChange={(valueOption) => {
                      setFieldValue("employeeStatus", valueOption);
                    }}
                    placeholder="Employee Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Joining Date</label>
                  <InputField
                    value={values?.joiningDate}
                    name="joiningDate"
                    placeholder="Joining Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="empLavel"
                    options={empLavelDDL}
                    value={values?.empLavel}
                    label="Employee Group"
                    onChange={(valueOption) => {
                      setFieldValue("empLavel", valueOption);
                    }}
                    placeholder="Employee Group"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mr-2 my-2"
                    type="button"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Attachment
                  </button>
                </div>
              </div>

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  console.log("onSave", fileObjects);
                  setOpen(false);
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

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
