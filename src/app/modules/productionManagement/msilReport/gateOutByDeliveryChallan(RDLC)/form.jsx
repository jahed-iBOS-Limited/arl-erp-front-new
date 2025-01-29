import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";

const GateOutByDeliveryChallanRDLC = () => {
  const reportId = `fc860c0b-e0bf-435d-adbe-dae2480dc0a3`;
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit
  }, shallowEqual)
  const parameterValues = () => {
    return [
      { name: "Bunit", value: selectedBusinessUnit?.value?.toString() }
    ];
  };
  return (
    <PowerBIReport
      reportId={reportId}
      groupId={groupId}
      parameterValues={parameterValues()}
      parameterPanel={true}
    />
  );
};

export default GateOutByDeliveryChallanRDLC;
