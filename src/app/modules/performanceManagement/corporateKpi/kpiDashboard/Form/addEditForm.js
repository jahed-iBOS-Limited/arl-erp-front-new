/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
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
// import { getSbuDDLAction } from "../../balancedScore/_redux/Actions";
import { getCorporateDepertmentDDL } from "./../helper";

const initData = {
  id: undefined,
  unpavorite: "",
  year: "",
  from: "",
  to: "",
  // sbu: "",
  corporate: "",
  section: "",
};

export default function KpiDashboardForm() {
  const [corporateDDL, setCorporateDDL] = useState([]);
  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        month: state.corporatePerformanceChart.monthDDL,
        unFevDepDDL: state.performanceMgt?.unFavDepSbuDDL,
        // sbuDDL: state.corporateInDividualBalancedScore.sbuDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    month,
    // sbuDDL,
    unFevDepDDL,
  } = storeData;

  const dispatch = useDispatch();

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      // dispatch(
      //   getSbuDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      // );
      getCorporateDepertmentDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCorporateDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));

      dispatch(
        getUnFavDepSbuDDLAction(
          selectedBusinessUnit?.value,
          4,
          yearDDL[0]?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL.length > 0 && month.length > 0 && corporateDDL.length > 0) {
      dispatch(
        getReportAction(
          selectedBusinessUnit?.value,
          corporateDDL[0]?.value,
          yearDDL[0]?.value,
          month[0]?.value,
          month[month.length - 1]?.value,
          true,
          4
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL, month, corporateDDL, selectedBusinessUnit]);

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
      <ICard title="CORPORATE DASHBOARD">
        <Form
          initData={initData}
          getMonthDDLAction={getMonthDDLAction}
          yearDDL={yearDDL}
          month={month}
          selectedBusinessUnit={selectedBusinessUnit}
          profileData={profileData}
          unFevDepDDL={unFevDepDDL}
          corporateDDL={corporateDDL}
        />
      </ICard>
    </div>
  );
}
