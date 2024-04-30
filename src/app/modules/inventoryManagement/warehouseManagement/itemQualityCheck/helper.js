import axios from "axios";
export const grandParentTableHeaders = [
  "",
  "SL",
  "Supplier",
  "Address",
  "Item Name",
  "UOM",
  
  {
    title: "Gate Entry",
    style: { maxWidth: "80px" },
  },
  "Vehicle No",
  "Net Weight",
  "Challan Qty Bag",
  "Challan Qty",
  "Total QC Qty",
  "Deduct Qty",
  {
    title: "Unload Time Deduct",
    style: { maxWidth: "50px" },
  },
  "Actual Qty",
  "Status",
  "Action",
];
export const parentTableHeader =[
  "",
  "Item Name",
  "UOM",
  "QC Qty Bag",
  "QC Qty",
  "Deduct %",
  "Deduct Qty",
  "Unload Deduct",
  "Actual Qty",
  "Remarks",
  "Action",
]
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
      response.data.qcQtyBeg = 0;
      response.data.qcQty = 0;
      response.data.totalQcQty = 0;
      response.data.deductionQuantity = 0;
      response.data.unloadDeductionQuantity = 0;
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
      parameterName:item?.parameterName,
      standardValue:item?.standardValue,
      actualValue:0,
      systemDeduction:0,
      manualDeduction:0,
      remarks:"",
    }));
  } catch (error) {
    return error;
  }
};


//grandParentColum's Total Sum
export const grandParentTotalSum=(arr)=>{

  console.log("arr",arr);
  const totalSum = arr?.reduce(
    (acc, item) => ({
      qcQuantity:acc.qcQuantity + item?.qcQuantity,
      deductionQuantity:acc.deductionQuantity + item?.deductionQuantity,
      unloadedDeductionQuantity:acc.unloadedDeductionQuantity +item?.unloadedDeductionQuantity,
      actualQuantity:acc.actualQuantity + item?.actualQuantity
    }),
    {
      qcQuantity: 0,
      deductionQuantity: 0,
      unloadedDeductionQuantity: 0,
      actualQuantity: 0,
    }
  );
  return totalSum
}


export const _numbering = (value) => {
  let outPut = "";
  switch (value) {
    case 1:
      outPut = "1st";
      break;
    case 2:
      outPut = "2nd";
      break;
    case 3:
      outPut = "3rd";
      break;
    default:
      outPut = `${value}th`;
      break;
  }
  return outPut;
};