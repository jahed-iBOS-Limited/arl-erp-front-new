import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import {
  getPositionDDL,
  getEmploymentTypeDDLAction,
  saveYearlyLeavePolicy,
} from "../helper";
import Loading from "../../../../_helper/_loading";

const initData = {
  policyId: "",
  year: "",
  employmentType: "",
  days: "",
};

export default function CreateYearlyLeavePolicyForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});
  const params = useParams();
  const [positionDDL, setPositionDDL] = useState([]);
  const [employmentTypeDDL, setEmploymentTypeDDL] = useState([]);
  const [leaveType, setLeaveType] = useState([]);

  const { selectedBusinessUnit, profileData, businessUnitList } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPositionDDL(profileData?.accountId, setPositionDDL);
      getEmploymentTypeDDLAction(profileData?.accountId, selectedBusinessUnit?.value, setEmploymentTypeDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    saveYearlyLeavePolicy(rowDto, cb, setDisabled, profileData, values, selectedBusinessUnit);
  };

  const setLeaevDays = (sl, value) => {
    const cloneArr = rowDto;
    cloneArr[sl].leaveDays = value;
    setRowDto([...cloneArr]);
  };

  return (
    <IForm
      title={
        params?.id ? "Edit Yearly Leave Policy" : "Create Yearly Leave Policy"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        businessUnitDDL={businessUnitList}
        positionDDL={positionDDL}
        setLeaveType={setLeaveType}
        leaveType={leaveType}
        employmentTypeDDL={employmentTypeDDL}
        isEdit={params?.id || false}
        id={params?.id}
        setRowDto={setRowDto}
        setLeaevDays={setLeaevDays}
      />
    </IForm>
  );
}
