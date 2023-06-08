import React, { useState, useEffect } from "react";
import NewSelect from "../../../../_helper/_select";
import { useSelector, shallowEqual } from "react-redux";
import {
  getEmpGradeDDL,
  getEmpTypeDDL,
  getLineManagerDDL,
} from "../helper";

export const OthersInfo = ({ values, setFieldValue, errors, touched }) => {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [empGradeDDL, setEmpGradeDDL] = useState("");
  const [empTypeDDL, setEmpTypeDDL] = useState("");
  const [lineManagerDDL, setLineManagerDDL] = useState("");
  const [empLavelDDL, setEmpLavelDDL] = useState("");

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getEmpGradeDDL(setEmpGradeDDL);
      getEmpTypeDDL(setEmpTypeDDL);
      getLineManagerDDL(setLineManagerDDL);
      // Employee Lavel DDL is static
      setEmpLavelDDL([
        {
          value: "Level-1",
          label: "Level-1",
        },
        {
          value: "Level-2",
          label: "Level-2",
        },
        {
          value: "Level-3",
          label: "Level-3",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId && selectedBusinessUnit?.value]);
  return (
    <div className="global-form form form-label-right">
      <div className="row">
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
      </div>
    </div>
  );
};
