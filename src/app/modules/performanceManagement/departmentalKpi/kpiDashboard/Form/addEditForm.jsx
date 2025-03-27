
import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";

import ICard from "../../../../_helper/_card";
import { getReportAction, setReportEmpty } from "../_redux/Actions";
import {
  getEmployeeBasicInfoByIdAction,
  getUnFavDepSbuDDLAction,
  getYearDDLAction,
} from "../../../_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import { getDepartmentDDLAction } from "../../balancedScore/_redux/Actions";
import Help from "./../../../help/Help";

const initData = {
  id: undefined,
  unpavorite: "",
  year: "",
  from: "",
  to: "",
  department: "",
};

export default function KpiDashboardForm() {
  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        month: state.performanceChartTwo.monthDDL,
        unFevDepDDL: state.performanceMgt?.unFavDepSbuDDL,
        departmentDDL: state.inDividualBalancedScore.departmentDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    month,
    departmentDDL,
    unFevDepDDL,
  } = storeData;

  const dispatch = useDispatch();

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(
        getDepartmentDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
    }

  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));

      dispatch(
        getUnFavDepSbuDDLAction(
          selectedBusinessUnit?.value,
          2,
          yearDDL[0]?.value
        )
      );
    }

  }, [yearDDL, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL.length > 0 && month.length > 0 && departmentDDL.length > 0) {
      dispatch(
        getReportAction(
          selectedBusinessUnit?.value,
          departmentDDL[0]?.value,
          yearDDL[0]?.value,
          month[0]?.value,
          month[month.length - 1]?.value,
          true,
          2
        )
      );
    }

  }, [yearDDL, month, departmentDDL, selectedBusinessUnit]);

  useEffect(() => {
    if (profileData?.userId) {
      dispatch(getEmployeeBasicInfoByIdAction(profileData?.userId));
    }

  }, [profileData]);

  useEffect(() => {
    return () => {
      dispatch(setReportEmpty());
    };

  }, []);

  return (
    <div className="KPI_DASHBOARD">
      <ICard
        title="DEPARTMENTAL DASHBOARD"
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
          unFevDepDDL={unFevDepDDL}
          departmentDDL={departmentDDL}
        />
      </ICard>
    </div>
  );
}
