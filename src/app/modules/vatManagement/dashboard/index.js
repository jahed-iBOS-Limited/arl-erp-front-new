import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Chart from "./chart/chart";
import {
  getItemWIsePurchaseDashBoard_api,
  getItemWiseSalesDashBoard_api,
  getMonthlyTAXinfoDashBoard_api,
  getDashBoardSalesProduction_api,
  getDashBoardBarchtByTracType_api
} from "./helper";
import "./style.css";
function Dashboard() {
  const [monthlyTAXinfoDashBoard, setMonthlyTAXinfoDashBoard] = useState([]);
  const [itemWIsePurchaseDashBoard, setItemWIsePurchaseDashBoard] = useState(
    []
  );
  const [itemWiseSalesDashBoard, setItemWiseSalesDashBoard] = useState(
    []
  );
  const [dashBoardSalesProduction, setDashBoardSalesProduction] = useState(
    []
  );
  const [dashBoardBarchtByTracType, setDashBoardBarchtByTracType] = useState(
    []
  );
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //MonthlyTAXinfoDashBoard
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getMonthlyTAXinfoDashBoard_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setMonthlyTAXinfoDashBoard
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //ItemWIsePurchaseDashBoard
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getItemWIsePurchaseDashBoard_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemWIsePurchaseDashBoard
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //ItemWIsePurchaseDashBoard
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getItemWiseSalesDashBoard_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemWiseSalesDashBoard
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //ItemWIsePurchaseDashBoard
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDashBoardSalesProduction_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDashBoardSalesProduction
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //DashBoardBarchartByTransactionType
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDashBoardBarchtByTracType_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDashBoardBarchtByTracType
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <div className="vatDashboard">
      <Chart
        monthlyTAXinfoDashBoard={monthlyTAXinfoDashBoard}
        itemWIsePurchaseDashBoard={itemWIsePurchaseDashBoard}
        itemWiseSalesDashBoard={itemWiseSalesDashBoard}
        dashBoardSalesProduction={dashBoardSalesProduction}
        dashBoardBarchtByTracType={dashBoardBarchtByTracType}
      />
    </div>
  );
}

export default Dashboard;
