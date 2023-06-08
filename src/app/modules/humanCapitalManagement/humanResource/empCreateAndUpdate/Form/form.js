/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { useSelector, shallowEqual } from "react-redux";
import axios from "axios";
import {
  getWorkplaceGroupDDLAction,
  getDepartmentDDL,
  getDesignationDDLAction,
  getSBUDDL,
  getWorkplaceDDL_api,
  getEmpTypeDDLAction,
  getEmpStatusDDL,
  religionDDL_api,
  getBankDDL_api,
  getAllDistrictAction,
  getBankBranchDDL_api,
} from "../../employeeInformation/helper.js";

import { categoryDDL, genderDDL, validationSchema } from "./utils";
import { getEmpInfoByIdAction, getFunctionDDLAction, getSubFunctionDDLAction } from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isUpdate,
  setDisabled,
}) {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state?.authData;
    },
    shallowEqual
  );

  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [designationDDL, setDesignationDDL] = useState([]);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [employeeTypeDDL, setEmployeeTypeDDL] = useState([]);
  const [employeeStatusDDL, setEmployeeStatusDDL] = useState([]);
  const [religionDDL, setReligionDDL] = useState([]);
  const [bankDDL, setBankDDL] = useState([]);
  const [functionDDL, setFunctionDDL] = useState([]);
  const [subFunctionDDL, setSubFunctionDDL] = useState([]);
  const [branchDDL, setBranchDDL] = useState([]);
  const [districtDDL, setDistrictDDL] = useState([]);

  const [positionDDL, getPositionDDL] = useAxiosGet();
  const [gradeDDL, getGradeDDL] = useAxiosGet();
  // const [positionGroupDDL, getPositionGroupDDL] = useAxiosGet();

  const getWorkplaceAndSBU = (businessUnitId) => {
    getSBUDDL(profileData?.accountId, businessUnitId, setSBUDDL);
    getWorkplaceDDL_api(
      profileData?.accountId,
      businessUnitId,
      setWorkplaceDDL
    );
  };

  const getFunctionAndSubFunction = (departmentId, functionId) => {
    if(departmentId){
      getFunctionDDLAction(departmentId, selectedBusinessUnit?.value, setFunctionDDL)
    }
    if(functionId){
      getSubFunctionDDLAction(functionId, setSubFunctionDDL)
    }
  }

  const loadEmpList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const loadSupervisorAndLineManagerList = (v) => {
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

  const generateAPI = (name, autoId = 0, typeId = 0) => {
    return `/hcm/TrustManagement/GetTrustAllDDL?PartName=${name}&AutoId=${autoId}&TypeId=${typeId}`;
  };

  useEffect(() => {
    getWorkplaceGroupDDLAction(profileData?.accountId, setWorkplaceGroupDDL);
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
    getEmpTypeDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setEmployeeTypeDDL
    );
    getEmpStatusDDL(setEmployeeStatusDDL);
    religionDDL_api(setReligionDDL);
    getBankDDL_api(setBankDDL);
    getAllDistrictAction(setDistrictDDL);
    getPositionDDL(generateAPI("PositionDDL"))
    // getPositionGroupDDL(generateAPI("PositionGroupDDL"))
  }, []);

  const getGradeAction = (id) => {
    getGradeDDL(generateAPI("EmpGrade_V2", 0, id))
  }

  const getBankDDLAction = (bankId) => {
    getBankBranchDDL_api(bankId, setBranchDDL);
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
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
          setFieldValue,
          isValid,
          errors,
          touched,
          setValues,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                {isUpdate && (
                  <>
                    {/* First Row */}
                    <div className="col-lg-2 mb-2">
                      <div className="d-flex align-items-center h-100">
                        Search Employee
                      </div>
                    </div>
                    <div className="col-lg-10 mb-2">
                      <div className="d-flex align-items-center w-100">
                        <span className="mr-2">:</span>
                        <SearchAsyncSelect
                          selectedValue={values?.employee}
                          handleChange={(valueOption) => {
                            setFieldValue("employee", valueOption);
                            getEmpInfoByIdAction(
                              valueOption,
                              values,
                              setValues,
                              setDisabled,
                              getWorkplaceAndSBU,
                              getFunctionAndSubFunction,
                              getGradeAction,
                              getBankDDLAction
                            );
                          }}
                          loadOptions={loadEmpList}
                          placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                        />
                        <FormikError
                          name="employee"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                    {/* First Row */}
                  </>
                )}

                {/* Second Row */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Employee Name
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.employeeName}
                        name="employeeName"
                        placeholder="Employee Name"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">Code</div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.code}
                        name="code"
                        placeholder="Code"
                        disabled={isUpdate}
                      />
                    </div>
                  </div>
                </div>
                {/* Second Row */}

                {/* Third Row */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Card No. (Optional)
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.cardNo}
                        name="cardNo"
                        placeholder="Card No."
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="d-flex align-items-center h-100">
                    Department
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      isHiddenToolTip={true}
                      name="department"
                      isHiddenLabel={true}
                      options={departmentDDL}
                      value={values?.department}
                      onChange={(valueOption) => {
                        setFieldValue("function", "");
                        setFieldValue("subFunction", "");
                        setFieldValue("department", valueOption);
                        setFunctionDDL([])
                        setSubFunctionDDL([])
                        getFunctionDDLAction(valueOption?.value, selectedBusinessUnit?.value, setFunctionDDL)
                      }}
                      placeholder="Department"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Function/Section
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      isHiddenToolTip={true}
                      name="function"
                      isHiddenLabel={true}
                      options={functionDDL}
                      value={values?.function}
                      onChange={(valueOption) => {
                        setFieldValue("subFunction", "");
                        setFieldValue("function", valueOption);
                        setSubFunctionDDL([])
                        getSubFunctionDDLAction(valueOption?.value, setSubFunctionDDL)
                      }}
                      placeholder="Function/Section"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Sub Function
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      isHiddenToolTip={true}
                      name="subFunction"
                      isHiddenLabel={true}
                      options={subFunctionDDL}
                      value={values?.subFunction}
                      onChange={(valueOption) => {
                        setFieldValue("subFunction", valueOption);
                      }}
                      placeholder="Sub Function"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* Third Row */}

                {/* Four Row */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Designation
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      isHiddenToolTip={true}
                      name="designation"
                      isHiddenLabel={true}
                      options={designationDDL}
                      value={values?.designation}
                      onChange={(valueOption) => {

                        // setFieldValue("position", "")
                        // setFieldValue("positionGroup", "")


                        // let {positionId, positionName, positionGroupId, positionGroupName} = valueOption;


                        // if(positionId && positionName){
                        //   setFieldValue("position", {value : positionId, label : positionName});
                        // }

                        // if(positionGroupId && positionGroupName){
                        //   setFieldValue("positionGroup", {value : positionGroupId, label : positionGroupName});
                        // }
                        
                        
                        setFieldValue("designation", valueOption);
                      }}
                      placeholder="Designation"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Position
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="position"
                      isHiddenToolTip={true}
                      isHiddenLabel={true}
                      options={positionDDL}
                      value={values?.position}
                      onChange={(valueOption) => {
                        setFieldValue("position", valueOption);
                      }}
                      placeholder="Position"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Position Group
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="positionGroup"
                      isHiddenToolTip={true}
                      isHiddenLabel={true}
                      options={positionGroupDDL}
                      value={values?.positionGroup}
                      onChange={(valueOption) => {
                        setFieldValue("positionGroup", valueOption);
                      }}
                      placeholder="Position Group"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div> */}
                {/* Four Row */}

                {/* Row Five */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Category
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      isHiddenToolTip={true}
                      name="category"
                      isHiddenLabel={true}
                      options={categoryDDL}
                      value={values?.category}
                      onChange={(valueOption) => {
                        setFieldValue("grade", "");
                        setFieldValue("category", valueOption);
                        getGradeAction(valueOption?.value)
                      }}
                      placeholder="Category"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Business Unit
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      isHiddenToolTip={true}
                      name="businessUnit"
                      isHiddenLabel={true}
                      options={businessUnitList}
                      value={values?.businessUnit}
                      onChange={(valueOption) => {
                        setFieldValue("sbu", "");
                        setFieldValue("workplace", "");
                        setFieldValue("businessUnit", valueOption);
                        getWorkplaceAndSBU(valueOption?.value);
                      }}
                      placeholder="Business Unit"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">SBU</div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="sbu"
                      isHiddenToolTip={true}
                      isHiddenLabel={true}
                      options={SBUDDL}
                      value={values?.sbu}
                      onChange={(valueOption) => {
                        setFieldValue("sbu", valueOption);
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* Row Five */}

                {/* Row Six */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Workplace Group
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="workplaceGroup"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={workplaceGroupDDL}
                      value={values?.workplaceGroup}
                      onChange={(valueOption) => {
                        setFieldValue("basicSalary", 0);
                        setFieldValue("grossSalary", "");
                        setFieldValue("workplaceGroup", valueOption);
                      }}
                      placeholder="Workplace Group"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Workplace
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="workplace"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={workplaceDDL}
                      value={values?.workplace}
                      onChange={(valueOption) => {
                        setFieldValue("workplace", valueOption);
                      }}
                      placeholder="Workplace"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* Row Six */}

                {/* Row Seven */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Employment Type
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="employmentType"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={employeeTypeDDL}
                      value={values?.employmentType}
                      onChange={(valueOption) => {
                        setFieldValue("basicSalary", 0);
                        setFieldValue("grossSalary", "");
                        setFieldValue("employmentType", valueOption);
                      }}
                      placeholder="Employment Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">Gender</div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="gender"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={genderDDL}
                      value={values?.gender}
                      onChange={(valueOption) => {
                        setFieldValue("gender", valueOption);
                      }}
                      placeholder="Gender"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* Row Seven */}

                {/* Row Eight */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Employee Status
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="employeeStatus"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={employeeStatusDDL?.filter((item) => (item?.value !== 2 && item?.value !== 4)) || []}
                      value={values?.employeeStatus}
                      onChange={(valueOption) => {
                        setFieldValue("employeeStatus", valueOption);
                      }}
                      placeholder="Employee Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Religion
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="religion"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={religionDDL}
                      value={values?.religion}
                      onChange={(valueOption) => {
                        setFieldValue("religion", valueOption);
                      }}
                      placeholder="Religion"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* Row Eight */}

                {/* Row Nine */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Date of Joining
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.dateOfJoining}
                        name="dateOfJoining"
                        placeholder="Date of Joining"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Supervisor
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <SearchAsyncSelect
                        selectedValue={values?.supervisor}
                        handleChange={(valueOption) => {
                          setFieldValue("supervisor", valueOption);
                        }}
                        loadOptions={loadSupervisorAndLineManagerList}
                        placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                      />
                      <FormikError
                        name="supervisor"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                {/* Row Nine */}

                {/* Row ten */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Line Manager
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <SearchAsyncSelect
                        selectedValue={values?.lineManager}
                        handleChange={(valueOption) => {
                          setFieldValue("lineManager", valueOption);
                        }}
                        loadOptions={loadSupervisorAndLineManagerList}
                        placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                      />
                      <FormikError
                        name="lineManager"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Gross Salary
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.grossSalary}
                        name="grossSalary"
                        placeholder="Gross Salary"
                        type="number"
                        onChange={(e) => {

                          if(values?.workplaceGroup?.label === "Logistics"){
                            setFieldValue("grossSalary", e.target.value);
                            return null;
                          }

                          if (
                            values?.employmentType?.value === 38 ||
                            values?.employmentType?.label.toLowerCase() ===
                              "permanent"
                          ) {
                            setFieldValue("basicSalary", e.target.value / 2);
                          } else {
                            setFieldValue("basicSalary", 0);
                          }

                          setFieldValue("grossSalary", e.target.value);
                        }}
                        disabled={!values?.employmentType?.value || !values?.workplaceGroup?.label}
                      />
                    </div>
                  </div>
                </div>

                {/* Row ten */}

                {/* Row eleven */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">Grade</div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="grade"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={gradeDDL}
                      value={values?.grade}
                      onChange={(valueOption) => {
                        setFieldValue("grade", valueOption);
                      }}
                      placeholder="Grade"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Basic Salary
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.basicSalary}
                        name="basicSalary"
                        placeholder="Basic Salary"
                        type="number"
                        disabled={values?.workplaceGroup?.label === "Logistics" ? false : true}
                      />
                    </div>
                  </div>
                </div>

                {/* Row eleven */}

                {/* Row twelve */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Pay in Bank (Fixed - Optional)
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.payInBank}
                        name="payInBank"
                        placeholder="Pay in Bank (Fixed)"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">Bank</div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="bank"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={bankDDL}
                      value={values?.bank}
                      onChange={(valueOption) => {
                        setFieldValue("bank", valueOption);
                        setFieldValue("branch", "");
                        getBankBranchDDL_api(valueOption?.value, setBranchDDL);
                      }}
                      placeholder="Bank"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* Row twelve */}

                {/* Row thirteen */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">Branch</div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="branch"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={branchDDL}
                      value={values?.branch}
                      onChange={(valueOption) => {
                        setFieldValue("branch", valueOption);
                      }}
                      placeholder="Branch"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    District
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <NewSelect
                      name="district"
                      isHiddenLabel={true}
                      isHiddenToolTip={true}
                      options={districtDDL}
                      value={values?.district}
                      onChange={(valueOption) => {
                        setFieldValue("district", valueOption);
                      }}
                      placeholder="District"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
                {/* Row thirteen */}

                {/* Row fourteen */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Account No.
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.accountNo}
                        name="accountNo"
                        placeholder="Account No."
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Last Promotion Date (Optional)
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.lastPromotionDate}
                        name="lastPromotionDate"
                        placeholder=" Last Promotion Date"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                {/* Row fourteen */}

                {/* Row fifteen */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Confirmation Date (Optional)
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.confirmationDate}
                        name="confirmationDate"
                        placeholder="Confirmation Date"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                {/* <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100"></div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center w-100"></div>
                </div> */}
                {/* Row fifteen */}

                {/* Row sixteen */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Official Email (Optional)
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.officialEmail}
                        name="officialEmail"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        onChange={(e) => {
                          setFieldValue("officialEmail", e.target.value);

                          if (e.target.value?.length > 0) {
                            setFieldValue("isUser", {
                              value: 1,
                              label: "Yes",
                            });
                          } else {
                            setFieldValue("isUser", {
                              value: 2,
                              label: "No",
                            });
                          }
                        }}
                        placeholder="Official Email"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Row sixteen */}

                {/* Row seventeen */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">
                    Personal Email (Optional)
                  </div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <div className="w-100">
                      <InputField
                        value={values?.personalEmail}
                        name="personalEmail"
                        placeholder="Personal Email"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                {/* Row seventeen */}

                {/* Row Eighteen */}
                <div className="col-lg-2 mb-2">
                  <div className="d-flex align-items-center h-100">Is User(Depends on official email)</div>
                </div>
                <div className="col-lg-4 mb-2">
                  <div className="d-flex align-items-center">
                    <span className="mr-2">:</span>
                    <NewSelect
                      isHiddenToolTip={true}
                      name="isUser"
                      isHiddenLabel={true}
                      options={[]}
                      value={values?.isUser}
                      onChange={(valueOption) => {
                        setFieldValue("isUser", valueOption);
                      }}
                      placeholder="Is User"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                </div>
                {/* Row Eighteen */}
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
