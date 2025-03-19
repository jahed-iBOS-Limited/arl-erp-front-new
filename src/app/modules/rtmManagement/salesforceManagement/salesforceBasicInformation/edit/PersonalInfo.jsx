/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { useSelector, shallowEqual } from "react-redux";
import {
  getBloodGroupDDL,
} from "../helper";

export const PersonalInfo = ({
  values,
  setFieldValue,
  errors,
  touched
}) => {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [bloodGroupDDL, setBloodGroupDDL] = useState("");

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {

      getBloodGroupDDL(setBloodGroupDDL);
      // Employee Lavel DDL is static
    }
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

  return (
    <div className="global-form form form-label-right">
      <div className="row">
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
    </div>
  );
};
