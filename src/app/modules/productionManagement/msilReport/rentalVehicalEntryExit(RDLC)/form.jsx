import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";

const RentalVehicalEntryExitRDLC = () => {
  const reportId = `bce75073-e094-4561-be03-73de9436caf9`;
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

export default RentalVehicalEntryExitRDLC;
