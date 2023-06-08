/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";

import ICard from "../../../../_helper/_card";
import {
  getUnFavouriteDDLAction,
  getReportAction,
  setReportEmpty,
} from "../_redux/Actions";
import {
  getEmployeeBasicInfoByIdAction,
  getYearDDLAction,
} from "../../../_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import { getEmployeeDDLAction } from "../../balancedScore/_redux/Actions";
import Help from "./../../../help/Help";

const initData = {
  id: undefined,
  unpavorite: "",
  year: "",
  from: "",
  to: "",
  employee: "",
};

export default function KpiDashboardForm() {
  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        month: state.performanceChartTwo.monthDDL,
        unPavDDL: state.kipDeshboardTwo?.unPavDDL,
        empDDL: state.inDividualBalancedScore.employeeDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    month,
    empDDL,
    unPavDDL,
  } = storeData;

  const dispatch = useDispatch();

  // get employee basic info from store
  const employeeBasicInfo = useSelector((state) => {
    return state?.performanceMgt?.employeeBasicInfo;
  }, shallowEqual);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(
        getEmployeeDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));

      dispatch(
        getUnFavouriteDDLAction(
          selectedBusinessUnit?.value,
          profileData.userId,
          yearDDL[0]?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL]);

  useEffect(() => {
    if (yearDDL.length > 0 && month.length > 0) {
      dispatch(
        getReportAction(
          selectedBusinessUnit?.value,
          profileData.userId,
          yearDDL[0]?.value,
          month[0]?.value,
          month[month.length - 1]?.value,
          true,
          1
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL, month]);

  useEffect(() => {
    if (profileData?.userId) {
      dispatch(getEmployeeBasicInfoByIdAction(profileData?.userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    return () => {
      dispatch(setReportEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="KPI_DASHBOARD">
      <ICard
        title="INDIVIDUAL DASHBOARD"
        isHelp={true}
        helpModalComponent={<Help />}
      >
        <Form
          initData={initData}
          getMonthDDLAction={getMonthDDLAction}
          yearDDL={yearDDL}
          month={month}
          selectedBusinessUnit={selectedBusinessUnit}
          profileData={profileData}
          unPavDDL={unPavDDL}
          empDDL={empDDL}
          employeeBasicInfo={employeeBasicInfo}
        />
      </ICard>
    </div>
  );
}
