import axios from "axios";
import * as Yup from "yup";
export const grandParentTableHeaders = [
  "",
  "SL",
  // "Supplier",
  // "Address",
  "Item Name",
  "UOM",

  {
    title: "Gate Entry",
    style: { maxWidth: "80px" },
  },
  "Vehicle No",
  "Net Weight",
  {
    title: "Net Weight (Without Bag)",
    style: { maxWidth: "50px" },
  },
  "Challan Qty Bag",
  "Challan Qty",
  "Total QC Qty",
  "Deduct Qty",
  {
    title: "Unload Time Deduct",
    style: { maxWidth: "50px" },
  },
  {
    title: "Deduct For Bag",
    style: { maxWidth: "50px" },
  },
  "Actual Qty",
  "Status",
  "Action",
];
export const parentTableHeader = [
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
];
export const headerRowTableHeaders = [
  "#",
  "Parameter",
  "Standard Value (%)",
  "Actual Value (%)",
  "System Deduction(%)",
  // "Manual Deduction(%)",
  "Difference Limit",
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
    response.data.actualQuantity = 0;
    return response.data;
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
      parameterName: item?.parameterName,
      standardValue: item?.standardValue,
      actualValue: 0,
      systemDeduction: 0,
      manualDeduction: 0,
      remarks: "",
    }));
  } catch (error) {
    return error;
  }
};

//grandParentColum's Total Sum
export const grandParentTotalSum = (arr) => {
  const totalSum = arr?.reduce(
    (acc, item) => ({
      qcQuantity: acc.qcQuantity + item?.qcQuantity,
      deductionQuantity: acc.deductionQuantity + item?.deductionQuantity,
      unloadedDeductionQuantity:
        acc.unloadedDeductionQuantity + item?.unloadedDeductionQuantity,
      actualQuantity: acc.actualQuantity + item?.actualQuantity,
    }),
    {
      qcQuantity: 0,
      deductionQuantity: 0,
      unloadedDeductionQuantity: 0,
      actualQuantity: 0,
    }
  );
  return totalSum;
};

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

// create mrr page function
export const getSupplierDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      let newData = res?.data?.map((data) => {
        return {
          ...data,
          label: data?.labelValue,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};
export const initData = {
  refType: "",
  refNo: "",
  transType: "",
  busiPartner: "",
  personnel: "",
  remarks: "",
  item: "",
  costCenter: "",
  projName: "",
  isAllItem: false,
  getEntry: "",
  file: "",
  challanNO: "",
  challanDate: "",
  vatChallan: "",
  vatAmmount: "",
  freight: "",
  grossDiscount: "",
  commission: "",
  foreignPurchase: "",
  othersCharge: "",
};
export const validationSchemaForMRR = Yup.object().shape({
  refType: Yup.object().shape({
    label: Yup.string().required("Refference Type is required"),
    value: Yup.string().required("Refference Type is required"),
  }),
  transType: Yup.object().shape({
    label: Yup.string().required("Transaction Type is required"),
    value: Yup.string().required("Transaction Type is required"),
  }),
  // item: Yup.object().shape({
  //   label: Yup.string().required("Item is required"),
  //   value: Yup.string().required("Item is required")
  // })
});

export const uploadAttachment = (attachment) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  return axios.post("/domain/Document/UploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getForeignPurchaseDDL = async (poId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/wms/Import/GetImportShipmentDDL?PoId=${poId}&PlantId=${sbuId}`
    );
    setter(res?.data);
  } catch (error) {}
};
