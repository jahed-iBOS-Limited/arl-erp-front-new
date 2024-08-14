import React from "react";
import NewSelect from "../../../_helper/_select";

export default function DivisionSubDivisionAndBusinessUnit({
  values,
  setFieldValue,
  setSubDivisionDDL,
  setbuddl,
  getSubDivisionDDL,
  subDivisionDDL,
  getBusinessDDLByED,
  enterpriseDivisionDDL,
  profileData,
  buddl,
}) {
  return (
    <>
      <div className="col-md-3">
        <NewSelect
          name="enterpriseDivision"
          options={enterpriseDivisionDDL || []}
          value={values?.enterpriseDivision}
          label="Enterprise Division"
          onChange={(valueOption) => {
            setFieldValue("enterpriseDivision", valueOption);
            setFieldValue("subDivision", "");
            setFieldValue("businessUnit", "");
            setSubDivisionDDL([]);
            setbuddl([]);
            if (valueOption?.value) {
              getSubDivisionDDL(
                `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=${profileData?.accountId}&BusinessUnitGroup=${valueOption?.label}`
              );
            }
          }}
        />
      </div>
      <div className="col-md-3">
        <NewSelect
          name="subDivision"
          options={subDivisionDDL || []}
          value={values?.subDivision}
          label="Sub Division"
          onChange={(valueOption) => {
            setFieldValue("subDivision", valueOption);
            setFieldValue("businessUnit", "");
            setbuddl([]);
            if (valueOption) {
              getBusinessDDLByED(
                profileData?.accountId,
                values?.enterpriseDivision?.value,
                setbuddl,
                valueOption
              );
            }
          }}
          placeholder="Sub Division"
          isDisabled={!values?.enterpriseDivision}
        />
      </div>
      <div className="col-md-3">
        <NewSelect
          name="businessUnit"
          options={buddl || []}
          value={values?.businessUnit}
          label="Business Unit"
          onChange={(valueOption) => {
            setFieldValue("businessUnit", valueOption);
          }}
          placeholder="Business Unit"
          isDisabled={!values?.subDivision}
        />
      </div>
    </>
  );
}
