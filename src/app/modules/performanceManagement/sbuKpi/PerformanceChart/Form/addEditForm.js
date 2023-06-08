/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { getMonthDDLAction } from "../_redux/Actions";
import { getReportAction, getYearDDLAction } from "../../../_redux/Actions";
const initData = {
  id: undefined,
  year: "",
  from: "",
  to: "",
};

export default function SbuPerformanceForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const dispatch = useDispatch();

  let pmsData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        month: state.performanceChartTwo.monthDDL,
        employeeBasicInfo: state?.performanceMgt?.employeeBasicInfo,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    month,
    employeeBasicInfo,
  } = pmsData;

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));
    }
  }, [yearDDL]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title="Performance Chart"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        yearDDL={yearDDL}
        month={month}
        getReportAction={getReportAction}
        employeeBasicInfo={employeeBasicInfo}
      />
    </IForm>
  );
}
