import React from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

const validationSchema = Yup.object().shape({
  // DDL
  designation: Yup.object().shape({
    value: Yup.string().required("Designation is required"),
    label: Yup.string().required("Designation is required"),
  }),
  sbu: Yup.object().shape({
    value: Yup.string().required("SBU is required"),
    label: Yup.string().required("SBU is required"),
  }),
  department: Yup.object().shape({
    value: Yup.string().required("Department is required"),
    label: Yup.string().required("Department is required"),
  }),
  workplaceGroup: Yup.object().shape({
    value: Yup.string().required("Workplace Group is required"),
    label: Yup.string().required("Workplace Group is required"),
  }),
  hrPostion: Yup.object().shape({
    value: Yup.string().required("HR Postion is required"),
    label: Yup.string().required("HR Postion is required"),
  }),
  empType: Yup.object().shape({
    value: Yup.string().required("Employee Type is required"),
    label: Yup.string().required("Employee Type is required"),
  }),
  lineManager: Yup.object().shape({
    value: Yup.string().required("Line Manager is required"),
    label: Yup.string().required("Line Manager is required"),
  }),
  empLavel: Yup.object().shape({
    value: Yup.string().required("Employee Lavel is required"),
    label: Yup.string().required("Employee Lavel is required"),
  }),

  // Basic Info
  employeeFirstName: Yup.string().required("First Name is required"),
  joiningDate: Yup.string().required("Joining Date is required"),
  presentAddress: Yup.string().required("Present Address is required"),
  permanentAddress: Yup.string().required("Permanent Address is required"),
  dateOfBirth: Yup.string().required("Date Of Birth is required"),
  fatherName: Yup.string().required("FatherName is required"),
  motherName: Yup.string().required("MotherName is required"),
  email: Yup.string().required("Email is required"),
  contactNumber: Yup.string().required("Contact Number is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,

  // Other
  isEdit,

  // All DDL
  designationDDL,
  sbuDDL,
  departmentDDL,
  workplaceGroupDDL,
  hrPostionDDL,
  empGradeDDL,
  empTypeDDL,
  lineManagerDDL,
  empLavelDDL,
  bloodGroupDDL,
}) {
  return (
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
          <Form className="global-form form form-label-right">
            <div className="form-group row">
              <div className="col-lg-3">
                <label>First Name</label>
                <InputField
                  value={values?.employeeFirstName}
                  name="employeeFirstName"
                  placeholder="First Name"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Middle Name (Optional)</label>
                <InputField
                  value={values?.middleName}
                  name="middleName"
                  placeholder="Middle Name"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Last Name (Optional)</label>
                <InputField
                  value={values?.lastName}
                  name="lastName"
                  placeholder="Last Name"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
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
              <div className="col-lg-3">
                <NewSelect
                  name="sbu"
                  options={sbuDDL}
                  value={values?.sbu}
                  label="SBU Name"
                  onChange={(valueOption) => {
                    setFieldValue("sbu", valueOption);
                  }}
                  placeholder="SBU Name"
                  errors={errors}
                  touched={touched}
                  isDisabled={isEdit}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="department"
                  options={departmentDDL}
                  value={values?.department}
                  label="Department"
                  onChange={(valueOption) => {
                    setFieldValue("department", valueOption);
                  }}
                  placeholder="Department"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="workplaceGroup"
                  options={workplaceGroupDDL}
                  value={values?.workplaceGroup}
                  label="Workplace Group"
                  onChange={(valueOption) => {
                    setFieldValue("workplaceGroup", valueOption);
                  }}
                  placeholder="Workplace Group"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="hrPostion"
                  options={hrPostionDDL}
                  value={values?.hrPostion}
                  label="HR Postion"
                  onChange={(valueOption) => {
                    setFieldValue("hrPostion", valueOption);
                  }}
                  placeholder="HR Postion"
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
                <label>Present Address</label>
                <InputField
                  value={values?.presentAddress}
                  name="presentAddress"
                  placeholder="Present Address"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Permanent Address</label>
                <InputField
                  value={values?.permanentAddress}
                  name="permanentAddress"
                  placeholder="Permanent Address"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Date Of Birth</label>
                <InputField
                  value={values?.dateOfBirth}
                  name="dateOfBirth"
                  placeholder="Date Of Birth"
                  type="date"
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="empGrade"
                  options={empGradeDDL}
                  value={values?.empGrade}
                  label="Employee Grade (Optional)"
                  onChange={(valueOption) => {
                    setFieldValue("empGrade", valueOption);
                  }}
                  placeholder="Employee Grade"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="empType"
                  options={empTypeDDL}
                  value={values?.empType}
                  label="Employee Type"
                  onChange={(valueOption) => {
                    setFieldValue("empType", valueOption);
                  }}
                  placeholder="Employee Type"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="lineManager"
                  options={lineManagerDDL}
                  value={values?.lineManager}
                  label="Line Manager"
                  onChange={(valueOption) => {
                    setFieldValue("lineManager", valueOption);
                  }}
                  placeholder="Line Manager"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="empLavel"
                  options={empLavelDDL}
                  value={values?.empLavel}
                  label="Employee Lavel"
                  onChange={(valueOption) => {
                    setFieldValue("empLavel", valueOption);
                  }}
                  placeholder="Employee Lavel"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Father Name</label>
                <InputField
                  value={values?.fatherName}
                  name="fatherName"
                  placeholder="Father Name"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Mother Name</label>
                <InputField
                  value={values?.motherName}
                  name="motherName"
                  placeholder="Mother Name"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Email</label>
                <InputField
                  value={values?.email}
                  name="email"
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="bloodGroup"
                  options={bloodGroupDDL}
                  value={values?.bloodGroup}
                  label="Blood Group (Optional)"
                  onChange={(valueOption) => {
                    setFieldValue("bloodGroup", valueOption);
                  }}
                  placeholder="Blood Group"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-lg-3">
                <label>Contact Number</label>
                <InputField
                  value={values?.contactNumber}
                  name="contactNumber"
                  placeholder="Contact Number"
                  type="text"
                />
              </div>
              <div className="col-lg-3">
                <label>Alternate Contact Number (Optional)</label>
                <InputField
                  value={values?.alternativeContactNumber}
                  name="alternativeContactNumber"
                  placeholder="Alternate Contact Number"
                  type="text"
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
  );
}

export default _Form;
