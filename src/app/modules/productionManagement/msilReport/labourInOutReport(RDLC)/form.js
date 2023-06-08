import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";

const LabourInOutReportRDLC = () => {
  const reportId = `1491ae89-d187-4f68-8b74-1ff5b82629c0`;
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

export default LabourInOutReportRDLC;
