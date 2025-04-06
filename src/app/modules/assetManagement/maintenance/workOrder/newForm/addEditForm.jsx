


import React from "react";
import WorkOrderForm from "./workOrderForm";

export default function AssetOrderForm({
  currentRowData,
  sbuName,
  plantName,
  warehouseName,
  setGridData,
  setisShowModalforCreate
}) {

  return (
    <WorkOrderForm
      currentRowData={currentRowData}
      sbuName={sbuName}
      plantName={plantName}
      warehouseName={warehouseName}
      setGridData={setGridData}
      setisShowModalforCreate={setisShowModalforCreate}
      actionFor="assetOrder"
    />
  );
}
