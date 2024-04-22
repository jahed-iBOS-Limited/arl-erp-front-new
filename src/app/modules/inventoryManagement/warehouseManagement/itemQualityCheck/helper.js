import axios from "axios";
export const headerTableHeaders = [
  "",
  "SL",
  "Supplier",
  "Address",
  "Item Name",
  "UOM",
  "Gate Entry",
  "Vehicle No",
  "Net Weight",
  "Deduct %",
  "Deduct Qty",
  {
    title: "Unload Time Deduct",
    style: { maxWidth: "50px" },
  },
  "Actual Qty",
  "Status",
  "Action",
];
export const headerRowTableHeaders = [
  "#",
  "Parameter",
  "Standard Value (%)",
  "Actual Value (%)",
  "System Deduction(%)",
  "Manual Deduction(%)",
  "Remarks",
  "Action",
];

export const gateEntry = async (buId, entryCode) => {
  try {
    const api = `/mes/QCTest/GetVehicleGateEntryInformation?businessUnitId=${buId}&GateEntryCode=${entryCode}`;

    const response = await axios.get(api);
      response.data.deductionQuantity = 0;
      response.data.actualQuantity = 0
      return response.data
  } catch (error) {
    return error;
  }
};
export const getRowWithItemId = async (buId, itemId) => {
  try {
    const api = `/mes/QCTest/GetQCItemParameterConfigByItem?businessUnitId=${buId}&itemId=${itemId}`;

    const response = await axios.get(api);

    return response?.data?.map((item) => ({
      ...item,
      systemDeduction: 0,
      manualDeduction: 0,
      actualValue: 0,
      rowId:0
    }));
  } catch (error) {
    return error;
  }
};
