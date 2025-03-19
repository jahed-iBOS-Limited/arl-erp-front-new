import React, { useState, useEffect } from "react";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { useSelector, shallowEqual } from "react-redux";
import {
  getDesignationDDL,
  getSbuDDL,
  getDepartmentDDL,
  getWorkplaceGroupDDL,
  getHrPostionDDL,
} from "../helper";

export const BasicInfo = ({ values, setFieldValue, errors, touched }) => {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [desinationDDL, setDesinationDDL] = useState("");
  const [sbuDDL, setSbuDDL] = useState("");
  const [departmentDDL, setDepartmentDDL] = useState("");
  const [workplaceGroupDDL, setWorkplaceGroupDDL] = useState("");
  const [hrPostionDDL, setHrPostionDDL] = useState("");

  // Fetch All DDL
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDesignationDDL(setDesinationDDL);
      getSbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
      getDepartmentDDL(setDepartmentDDL);
      getWorkplaceGroupDDL(setWorkplaceGroupDDL);
      getHrPostionDDL(setHrPostionDDL);
      // Employee Lavel DDL is static
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

  return (
    <div className="global-form form form-label-right">
      <div className="row">
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
            options={desinationDDL}
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
            //isDisabled={isEdit}
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
      </div>
    </div>
  );
};
