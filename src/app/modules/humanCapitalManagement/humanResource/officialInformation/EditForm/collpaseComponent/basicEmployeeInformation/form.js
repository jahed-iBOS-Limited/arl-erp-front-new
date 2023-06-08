/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import axios from "axios";
import {
  getBusinessUnitDDL,
  getCostCenterDDL,
  getDesignationDDLAction,
  getEmpStatusDDL,
  getEmpTypeDDL,
  getSBUDDL,
  getWorkplaceDDL_api,
  monthDDL,
} from "./helper";
import * as Yup from "yup";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../../../_helper/_formikError";
import { getDepartmentDDL } from "../../../../employeeInformation/helper";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(300, "Maximum 300 symbols")
    .required("Employee name is required")
    .typeError("Employee name is required"),
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
  dateOfJoining: Yup.string()
    .required("Date of joining is required")
    .typeError("Date of joining is required"),
  code: Yup.string()
    .required("Employee code is required")
    .typeError("Employee code is required"),
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
  effectiveYear: Yup.object().when("designation", {
    is: false,
    then: Yup.object()
      .shape({
        value: Yup.string().required("Effected year is required"),
        label: Yup.string().required("Effected year is required"),
      })
      .typeError("Effected year is required"),
  }),
  effectiveMonth: Yup.object().when("designation", {
    is: false,
    then: Yup.object()
      .shape({
        value: Yup.string().required("Effected month is required"),
        label: Yup.string().required("Effected month is required"),
      })
      .typeError("Effected month is required"),
  }),
});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  isDisabled,
  religionDDL,
  customYearDDL,
}) {
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [employeeTypeDDL, setEmployeeTypeDDL] = useState([]);
  const [employeeStatusDDL, setEmployeeStatusDDL] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (edit) {
      getBusinessUnitDDL(setBusinessUnitDDL);
      getDepartmentDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDepartmentDDL
      );
      getDesignationDDLAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDesignationDDL
      );
      getEmpStatusDDL(setEmployeeStatusDDL);
    }
  }, [edit]);

  useEffect(() => {
    if (edit && initData?.businessUnit?.value) {
      getEmpTypeDDL(
        profileData?.accountId,
        initData?.businessUnit?.value,
        setEmployeeTypeDDL
      );
    }
  }, [edit]);

  const subOnChangeHandler = (sbuId) => {
    getCostCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      sbuId,
      setCostCenterDDL
    );
  };
  const businessUnitOnChangeHandler = (buId) => {
    getSBUDDL(profileData?.accountId, buId, setSBUDDL);
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getWorkplaceDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWorkplaceDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const loadEmpList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
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

  const ddlForEdit = (values) => {
    getSBUDDL(profileData?.accountId, values?.businessUnit?.value, setSBUDDL);
    getCostCenterDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.SBUName?.value,
      setCostCenterDDL
    );
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
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Basic Employee Information"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                        }}
                        className="btn btn-light "
                        type="button"
                      >
                        <i className="fas fa-times pointer"></i>
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                        disabled={isDisabled}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEdit(true);
                        ddlForEdit(values);
                      }}
                      className="btn btn-light"
                      type="button"
                    >
                      <i className="fas fa-pen-square pointer"></i>
                      Edit
                    </button>
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3 ">
                      <label>Employee Name</label>
                      <InputField
                        value={values?.firstName || ""}
                        name="firstName"
                        placeholder="Employee Name"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    {/* <div className="col-lg-3 ">
                      <label>Middle Name (Optional)</label>
                      <InputField
                        value={values?.middleName || ""}
                        name="middleName"
                        placeholder="Middle Name"
                        type="text"
                        disabled={!edit}
                      />
                    </div> */}
                    {/* <div className="col-lg-3 ">
                      <label>Last Name (Optional)</label>
                      <InputField
                        value={values?.lastName || ""}
                        name="lastName"
                        placeholder="Last Name"
                        type="text"
                        disabled={!edit}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <NewSelect
                        name="gender"
                        options={genderDDL}
                        value={values?.gender}
                        onChange={(valueOption) => {
                          setFieldValue("gender", valueOption);
                        }}
                        label="Gender"
                        placeholder="Gender"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
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
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Email (Optional)</label>
                      <InputField
                        value={values?.email}
                        name="email"
                        placeholder="Email"
                        type="email"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <label>Employee Code</label>
                      <InputField
                        value={values?.code}
                        name="code"
                        placeholder="Employee Code"
                        type="text"
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3  mt-1">
                      <label>Date of Joining</label>
                      <InputField
                        value={values?.dateOfJoining || ""}
                        name="dateOfJoining"
                        placeholder="Date of Joining"
                        type="date"
                        // min={_todayDate()}
                        disabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit || ""}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", "");
                          setFieldValue("SBUName", "");
                          setFieldValue("employmentType", "");
                          setFieldValue("businessUnit", valueOption);
                          businessUnitOnChangeHandler(valueOption?.value);
                          getEmpTypeDDL(
                            profileData?.accountId,
                            valueOption?.value,
                            setEmployeeTypeDDL
                          );
                        }}
                        placeholder="Business Unit"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="SBUName"
                        options={SBUDDL || []}
                        value={values?.SBUName || ""}
                        label="SBU Name"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", "");
                          setFieldValue("SBUName", valueOption);
                          subOnChangeHandler(valueOption?.value);
                        }}
                        placeholder="SBU Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="costCenter"
                        options={costCenterDDL || []}
                        value={values?.costCenter || ""}
                        label="Cost Center (Optional)"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", valueOption);
                        }}
                        placeholder="Cost Center"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="workplace"
                        options={workplaceDDL || []}
                        value={values?.workplace || ""}
                        label="Workplace"
                        onChange={(valueOption) => {
                          console.log("Value option", valueOption);
                          setFieldValue("workplace", valueOption);
                        }}
                        placeholder="Workplace"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="functionalDepartment"
                        options={departmentDDL || []}
                        value={values?.functionalDepartment}
                        label="Functional Department"
                        onChange={(valueOption) => {
                          setFieldValue("functionalDepartment", valueOption);
                        }}
                        placeholder="Functional Department"
                        errors={errors}
                        touched={touched}
                        isDisabled={edit}
                      />
                    </div>
                    {/* <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="HRposition"
                        options={HRPositionDDL || []}
                        value={values?.HRposition || ""}
                        label="HR Position"
                        onChange={(valueOption) => {
                          setFieldValue("HRposition", valueOption);
                        }}
                        placeholder="HR Position"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div> */}
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="designation"
                        options={designationDDL || []}
                        value={values?.designation || ""}
                        label="Designation"
                        onChange={(valueOption) => {
                          setFieldValue("effectiveYear", "");
                          setFieldValue("effectiveMonth", "");
                          setFieldValue("designation", valueOption);
                        }}
                        placeholder="Designation"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    {/* <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="employeeGrade"
                        options={employeeGradeDDL || []}
                        value={values?.employeeGrade || ""}
                        label="Employee Grade (Optional)"
                        onChange={(valueOption) => {
                          setFieldValue("employeeGrade", valueOption);
                        }}
                        placeholder="Employee Grade"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div> */}
                    <div className="col-lg-3 mt-1">
                      <NewSelect
                        name="employmentType"
                        options={employeeTypeDDL || []}
                        value={values?.employmentType || ""}
                        label="Employment Type"
                        onChange={(valueOption) => {
                          // if current data and database prev data is same , then we will set gross salary and basic salary from database value, which user save previously,
                          if (
                            initData?.employmentType?.label ===
                            valueOption?.label
                          ) {
                            setFieldValue("grossSalary", initData?.grossSalary);
                            setFieldValue("basicSalary", initData?.basicSalary);
                          } else {
                            setFieldValue("grossSalary", "");
                            setFieldValue("basicSalary", "");
                          }

                          if (
                            valueOption?.label !== "Permanent" &&
                            initData?.employmentType?.label !==
                              valueOption?.label
                          ) {
                            setFieldValue("grossSalary", 0);
                          }
                          setFieldValue("effectiveYear", "");
                          setFieldValue("effectiveMonth", "");
                          setFieldValue("employmentType", valueOption);
                        }}
                        placeholder="Employment Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
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
                          disabled={!edit}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="col-lg-3 mt-1">
                      <label>Supervisor</label>
                      {edit ? (
                        <>
                          <SearchAsyncSelect
                            selectedValue={values?.superVisor}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue("superVisor", valueOption);
                            }}
                            loadOptions={loadEmpList}
                            isDisabled={!edit}
                          />
                          <FormikError
                            name="superVisor"
                            errors={errors}
                            touched={touched}
                          />
                        </>
                      ) : (
                        <NewSelect
                          value={values?.superVisor}
                          isDisabled={!edit}
                        />
                      )}
                    </div>
                    <div className="col-lg-3 mt-1">
                      <label>Line Manager</label>
                      {edit ? (
                        <SearchAsyncSelect
                          selectedValue={values?.lineManager}
                          isSearchIcon={true}
                          handleChange={(valueOption) => {
                            setFieldValue("nanagerInfo", valueOption?.code);
                            setFieldValue("lineManager", valueOption);
                          }}
                          loadOptions={loadEmpList}
                          isDisabled={!edit}
                        />
                      ) : (
                        <NewSelect
                          value={values?.lineManager}
                          isDisabled={!edit}
                        />
                      )}
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
                      <NewSelect
                        name="employeeStatus"
                        options={employeeStatusDDL || []}
                        value={values?.employeeStatus}
                        label="Employee Status"
                        onChange={(valueOption) => {
                          setFieldValue("employeeStatus", valueOption);
                          setFieldValue("separationDate","");
                          setFieldValue("separationReason","");
                        }}
                        placeholder="Employee Status"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                    {(values?.employeeStatus?.value === 2 || values?.employeeStatus?.value === 4) && 
                      <>
                      <div className="col-lg-3 mt-1">
                      <label>{`${values?.employeeStatus?.label}`} Date</label>
                      <InputField
                        name="separationDate"
                        disabled={!edit}
                        onChange={(e) => {
                          setFieldValue("separationDate", e.target.value);
                        }}
                        type="date"
                        value={values?.separationDate}
                      />
                    </div>
                    <div className="col-lg-3 mt-1">
                      <label>{`${values?.employeeStatus?.label}`} Reason</label>
                      <NewSelect
                        name="separationReason"
                        options={[
                          {value:"Ask to resign", label: "Ask to resign"},
                          {value:"Switch to another job", label: "Switch to another job"},
                          {value:"Dead", label: "Dead"},
                          {value:"Go to abroad", label: "Go to abroad"},
                          {value:"Personal problem", label: "Personal problem"},
                          {value:"Unauthorized absence", label: "Unauthorized absence"},
                          {value:"Lack of morality", label: "Lack of morality"},
                          {value:"End of internship", label:"End of internship"},
                        ]}
                        value={values?.separationReason}
                        onChange={(valueOption) => {
                          setFieldValue("separationReason", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit}
                      />
                    </div>
                      </>
                    }
                    <div className="col-lg-3 mt-1">
                      <label>Basic Salary</label>
                      <InputField
                        placeholder="Basic Salary"
                        name="basicSalary"
                        disabled={
                          values?.employmentType?.label !== "Permanent" ||
                          !values?.employmentType ||
                          !edit
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
                          !values?.employmentType ||
                          !edit
                        }
                        type="number"
                        name="grossSalary"
                        value={values?.grossSalary}
                      />
                    </div>
                    {values?.designation && values?.employmentType && (
                      <>
                        <div className="col-lg-3 mt-1">
                          <NewSelect
                            name="effectiveMonth"
                            options={monthDDL}
                            value={values?.effectiveMonth}
                            onChange={(valueOption) => {
                              setFieldValue("effectiveMonth", valueOption);
                            }}
                            label="Effected Month"
                            placeholder="Effected Month"
                            errors={errors}
                            touched={touched}
                            isDisabled={!edit}
                          />
                        </div>
                        <div className="col-lg-3 mt-1">
                          <NewSelect
                            name="effectiveYear"
                            options={customYearDDL}
                            value={values?.effectiveYear}
                            onChange={(valueOption) => {
                              setFieldValue("effectiveYear", valueOption);
                            }}
                            label="Effected Year"
                            placeholder="Effected Year"
                            errors={errors}
                            touched={touched}
                            isDisabled={!edit}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {/* Table End */}
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
