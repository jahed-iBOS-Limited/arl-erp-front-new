import axios from "axios";
import * as ExcelJS from "exceljs";
import { Field, getIn } from "formik";
import moment from "moment";
import React from "react";
import { ExcelRenderer } from "react-excel-renderer";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import { _dateFormatter } from "../../../_helper/_dateFormate";

// Error message display field for field array of of tender submission create & edit page
export const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? error : null;
    }}
  />
);

// Business partner value & label (get from vessel management > configeration > godowns)
export const businessPartnerDDL = [
  { value: 89497, label: "BCIC" },
  { value: 88075, label: "BADC" },
  { value: 3, label: "BADC(MOP)" },
];

// Approve status for landing page
export const approveStatusDDL = [
  { value: 0, label: "All" },
  { value: 1, label: "Win" },
  { value: 2, label: "Pending" },
  { value: 3, label: "Reject" },
];

// Inital data for tender submission create & edit page
export const initData = {
  // common state bcic, badc, badc(mop)
  businessPartner: "",
  enquiry: "",
  submissionDate: "",
  remarks: "",

  // common bcic & badc
  foreignQnt: "",
  productName: "",
  loadPort: "",
  foreignPriceUSD: "", // edit
  // bcic state
  dischargePort: "",
  commercialNo: "",
  commercialDate: "",
  localTransportations: [
    {
      godownName: "",
      quantity: "",
      price: "",
    },
  ],
  // badc
  dueDate: "",
  dueTime: "",
  lotQty: "",
  contractDate: "",
  layCan: "",
  pricePerBag: "", // edit
  // badc (mop)
  // dischargePortMOP: "",
  mopRowsData: [],
};

// Validation schema for tender submission create & edit page
export const createPageValidationSchema = Yup.object({
  // common state bcic, badc, badc(mop)
  businessPartner: Yup.object({
    label: Yup.string().required("Business partner label is required"),
    value: Yup.string().required("Business partner value is required"),
  }).required("Business partner is required"),
  enquiry: Yup.string().required("Enquiry is required"),
  submissionDate: Yup.date().required("Submission date is required"),
  remarks: Yup.string(),

  // common bcic & badc
  foreignQnt: Yup.number()
    .positive()
    .min(0)
    .when("businessPartner", {
      is: (businessPartner) =>
        businessPartner && businessPartner?.label === "BADC",
      then: Yup.number()
        .positive()
        .min(0)
        .required("Foreign qnt is required"),
      otherwise: Yup.number()
        .positive()
        .min(0),
    }),
  productName: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.string().required("Product name is required"),
    otherwise: Yup.string(),
  }),
  loadPort: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.string().required("Load port is required"),
    otherwise: Yup.string(),
  }),
  foreignPriceUSD: Yup.number()
    .positive()
    .min(0),

  // bcic
  dischargePort: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BCIC",
    then: Yup.string().required("Discharge port is required"),
    otherwise: Yup.string(),
  }),
  commercialDate: Yup.date().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BCIC",
    then: Yup.date().required("Commercial date is required"),
    otherwise: Yup.date(),
  }),
  commercialNo: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BCIC",
    then: Yup.string().required("Commercial no is required"),
    otherwise: Yup.string(),
  }),
  localTransportations: Yup.array()
    .of(
      Yup.object({
        godownName: Yup.string().when("$.businessPartner", {
          is: (businessPartner) =>
            businessPartner && businessPartner?.label === "BCIC",
          then: Yup.string().required("Godown is required"),
          otherwise: Yup.string(),
        }),
        quantity: Yup.number()
          .positive()
          .min(0)
          .when("$.businessPartner", {
            is: (businessPartner) =>
              businessPartner && businessPartner?.label === "BCIC",
            then: Yup.number().required("Quantity is required"),
            otherwise: Yup.number(),
          }),
        price: Yup.number()
          .positive()
          .min(0)
          .when("$.businessPartner", {
            is: (businessPartner) => {
              // console.log(businessPartner);
              return businessPartner && businessPartner?.label === "BCIC";
            },
            then: Yup.number().required("Price is required"),
            otherwise: Yup.number(),
          }),
      })
    )
    .when("businessPartner", {
      is: (businessPartner) =>
        businessPartner && businessPartner?.label === "BCIC",
      then: Yup.array()
        .min(1, "Minimum 1 local transport")
        .max(14, "Maximum 14 local transport")
        .required("Local transport is required"),
      otherwise: Yup.array().notRequired(),
    }),

  // badc
  dueDate: Yup.date().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.date().required("Due date is required"),
    otherwise: Yup.date(),
  }),
  dueTime: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.string().required("Due time is required"),
    otherwise: Yup.string(),
  }),
  lotQty: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.string().required("Lot Qty is required"),
    otherwise: Yup.string(),
  }),
  contractDate: Yup.date().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.date().required("Contract date is required"),
    otherwise: Yup.date(),
  }),
  layCan: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.string().required("Laycan is required"),
    otherwise: Yup.string(),
  }),
  pricePerBag: Yup.number()
    .positive()
    .min(0),

  // badc (mop)
  // dischargePortMOP: Yup.string().when("businessPartner", {
  //   is: (businessPartner) => {
  //     // console.log(businessPartner?.label === "BADC(MOP)")
  //     return businessPartner && businessPartner?.label === "BADC(MOP)";
  //   },
  //   then: Yup.string().required("Discharge Port is required"),
  //   otherwise: Yup.string(),
  // }),
  mopRowsData: Yup.array()
    .of(Yup.object())
    .when("businessPartner", {
      is: (businessPartner) =>
        businessPartner && businessPartner?.label === "BADC(MOP)",
      then: Yup.array()
        .min(1, "Minimum 1 Mop Rows Data")
        .required("Mop Rows Data is required"),
      otherwise: Yup.array().notRequired(),
    }),
});

// Validation schema for landing page
export const landingPageValidationSchema = Yup.object({
  businessPartner: Yup.object({
    value: Yup.string().required("Select a status"),
    label: Yup.string().required("Select a status"),
  }).required("Select a business partner"),
  fromDate: Yup.date().required("Please enter from date"),
  toDate: Yup.date().required("Please enter to date"),
  approveStatus: Yup.object({
    value: Yup.string().required("Select a status"),
    label: Yup.string().required("Select a status"),
  }).required("Select a status"),
});

// Get Load Port DDL (Naltional Load)
export const getDischargePortDDL = async (setter) => {
  try {
    const res = await axios.get(`/wms/FertilizerOperation/GetDomesticPortDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// Get Load Port DDL (Internaltional Load)
export const GetLoadPortDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Vessel/GetCountryDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// Fetch tender details with tender id
export const fetchTenderDetailsForCreateEditPage = (
  tenderId,
  accountId,
  buUnId,
  getTenderDetailsCallback
) => {
  const url = `/tms/TenderSubmission/GetTenderSubmissionById?AccountId=${accountId}&BusinessUnitId=${buUnId}&TenderId=${tenderId}`;
  getTenderDetailsCallback(url);
};

// Fetch sumitted tender with page & pageSize (but fetch is occuring with getSubmittedTenderLists)
export const fetchSubmittedTenderData = (
  accountId,
  buUnId,
  values,
  pageNo,
  pageSize,
  getTenderDetailsListFunc
) => {
  let url = "";

  if (values?.businessPartner?.label === "BCIC") {
    url = `/tms/TenderSubmission/GetTenderSubmissionpagination?AccountId=${accountId}&BusinessUnitId=${buUnId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&fromDate=${values?.fromDate}&toDate=${values?.toDate}&status=${values?.approveStatus?.value}`;
  }
  if (values?.businessPartner?.label === "BADC") {
    url = `/tms/TenderSubmission/GetBIDCTenderpagination?AccountId=${accountId}&BusinessUnitId=${buUnId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&fromDate=${values?.fromDate}&toDate=${values?.toDate}&status=${values?.approveStatus?.value}`;
  }

  if (values?.businessPartner?.label === "BADC(MOP)") {
    url = `/tms/TenderSubmission/GetBADCMOPConfigurationlanding?AccountId=${accountId}&BusinessUnitId=${buUnId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&fromDate=${values?.fromDate}&toDate=${values?.toDate}&status=${values?.approveStatus?.value}`;
  }

  getTenderDetailsListFunc(url);
};

// Async await approch for fetch details along with print page view
// const fetchTenderDetails = async (tenderId,) => {
//     const url = `/tms/TenderSubmission/GetTenderSubmissionById?AccountId=${accountId}&BusinessUnitId=${buUnId}8&TenderId=${tenderId}`
//     const response = await getTenderDetails(url)
//     return response
// }

// Callback approch for fetch details along with print page view
export const fetchTenderDetailsCallbackForPrintAndCreateEditPage = (
  accountId,
  buUnId,
  values,
  tenderId,
  getTenderDetailsFunc,
  callback
) => {
  let url = "";
  // console.log(values?.businessPartnerName?.label);

  if (values?.businessPartner?.label === "BCIC") {
    url = `/tms/TenderSubmission/GetTenderSubmissionById?AccountId=${accountId}&BusinessUnitId=${buUnId}&TenderId=${tenderId}`;
  }
  if (values?.businessPartner?.label === "BADC") {
    url = `/tms/TenderSubmission/GetBIDCTenderSubmissionById?AccountId=${accountId}&BusinessunitId=${buUnId}&TenderId=${tenderId}`;
  }
  // Here this is only for edit but for print we use fetchBADCMOPRowsDataForPrintPage func for backend issuu
  if (values?.businessPartner?.label === "BADC(MOP)") {
    url = `/tms/TenderSubmission/GetForEditMOPConfiguration?AccountId=${accountId}&BusinessUnitId=${buUnId}&MopTenderId=${tenderId}`; // tenderId => mopTenderId
  }
  getTenderDetailsFunc(url, () => {
    callback && callback();
  });
};

// callback approch for rows data fetch badc mop for print page
export const fetchBADCMOPRowsDataForPrintPage = (
  accountId,
  buUnId,
  mopTenderId,
  getTenderDetailsFunc,
  callback
) => {
  const url = `/tms/TenderSubmission/GetByBADCMOPConfiguration?AccountId=${accountId}&BusinessUnitId=${buUnId}&MopTenderId=${mopTenderId}`;

  getTenderDetailsFunc(url, () => {
    callback && callback();
  });
};

// Select Edit Id
export const selectEditId = (item) => {
  switch (item?.businessPartnerName) {
    case "BCIC":
    case "BADC":
      return item?.tenderId;
    case "BADC(MOP)":
      return item?.mopTenderId;
    default:
      return "";
  }
};

// State function when update data
//export const updateState = ({ header, rows, }, ...rest) => {
export const updateState = (tenderDetails) => {
  const isBCIC = tenderDetails?.header || tenderDetails?.rows;
  const isBADCMOP = tenderDetails?.headerDTO || tenderDetails?.rowDTOs;

  if (isBCIC) {
    const { header, rows } = tenderDetails;

    const bcicState = {
      dischargePort: header?.dischargePortId
        ? {
            label: header?.dischargePortName,
            value: header?.dischargePortId,
          }
        : "",
      commercialNo: header?.commercialNo,
      commercialDate: _dateFormatter(header?.commercialDate),
      remarks: header?.strRemarks,
      motherVessel: header?.motherVesselId
        ? {
            label: header?.motherVesselName,
            value: header?.motherVesselId,
          }
        : "",
      localTransportations: rows?.map((item) => {
        return {
          tenderRowId: item?.tenderRowId,
          tenderHeaderId: item?.tenderHeaderId,
          godownName: item?.godownName
            ? {
                value: item?.godownId,
                label: item?.godownName,
              }
            : "",
          quantity: item?.quantity,
          price: item?.perQtyTonPriceBd,
          perQtyPriceWords: item?.perQtyTonPriceBd,
        };
      }),
    };

    const commonEditData = {
      //bcic
      ...bcicState,

      // global
      businessPartner: header?.businessPartnerId
        ? {
            value: header?.businessPartnerId,
            label: header?.businessPartnerName,
          }
        : "",
      // common
      enquiry: header?.enquiryNo,
      submissionDate: _dateFormatter(header?.submissionDate),
      foreignQnt: header?.foreignQty,
      productName: header?.itemName,
      loadPort: header?.loadPortId
        ? {
            label: header?.loadPortName,
            value: header?.loadPortId,
          }
        : "",
      // edit
      foreignPriceUSD: header?.foreignPriceUsd,
      attachment: header?.attachment,
      isAccept: header?.isAccept,
      isReject: header?.isReject,
    };
    return commonEditData;
  } else if (isBADCMOP) {
    const { headerDTO, rowDTOs } = tenderDetails;

    const badcMOPState = {
      enquiry: headerDTO?.mopInvoiceId,
      mopTenderId: headerDTO?.mopTenderId,
      submissionDate: _dateFormatter(headerDTO?.submissionDate),
      // dischargePortMOP: headerDTO?.portId
      //   ? {
      //       label: headerDTO?.portName,
      //       value: headerDTO?.portId,
      //     }
      //   : "",
      mopRowsData: rowDTOs?.map((item) => {
        return {
          mopTenderId: item?.mopTenderId,
          mopInvoiceId: item?.mopInvoiceId,
          ghatId: item?.ghatId,
          ghatName: item?.ghatName,
          distance: item?.distance,
          quantity: item?.quantity,
          actualQuantity: item?.actualQuantity,
        };
      }),
    };

    const commonEditData = {
      // badc (mop)
      ...badcMOPState,

      // global
      businessPartner: headerDTO?.businessPartnerId
        ? {
            value: headerDTO?.businessPartnerId,
            label: headerDTO?.businessPartnerName,
          }
        : "",
      remarks: headerDTO?.strRemarks,

      // edit
      attachment: headerDTO?.attachment,
      isAccept: headerDTO?.isAccept,
      isReject: headerDTO?.isReject,
    };

    return commonEditData;
  } else {
    const badcState = {
      dueDate: _dateFormatter(tenderDetails?.dueDate),
      dueTime: tenderDetails?.dueTime,
      lotQty: tenderDetails?.lotqty,
      contractDate: _dateFormatter(tenderDetails?.contractDate),
      layCan: tenderDetails?.layCan,
      pricePerBag: tenderDetails?.pricePerBag,
    };

    const commonEditData = {
      //badc
      ...badcState,
      // global
      businessPartner: tenderDetails?.businessPartnerId
        ? {
            value: tenderDetails?.businessPartnerId,
            label: tenderDetails?.businessPartnerName,
          }
        : "",
      // common
      enquiry: tenderDetails?.enquiryNo,
      submissionDate: _dateFormatter(tenderDetails?.submissionDate),
      foreignQnt: tenderDetails?.foreignQty,
      productName: tenderDetails?.itemName,
      loadPort: tenderDetails?.loadPortId
        ? {
            label: tenderDetails?.loadPortName,
            value: tenderDetails?.loadPortId,
          }
        : "",
      // edit
      foreignPriceUSD: tenderDetails?.foreignPriceUsd,
      attachment: tenderDetails?.attachment,
      isAccept: tenderDetails?.isAccept,
      isReject: tenderDetails?.isReject,
    };
    return commonEditData;
  }
};

// fetch godown list function
export const fetchGodownDDLList = (
  businessPartner,
  accountId,
  buUnId,
  getGodownDDLFunc,
  updateGodownDDLFunc
) => {
  const url = `/tms/LigterLoadUnload/GetShipToPartnerG2GPagination?AccountId=${accountId}&BusinessUnitId=${buUnId}&BusinessPartnerId=${
    businessPartner?.value
  }&PageNo=${0}&PageSize=${100}`;
  getGodownDDLFunc(url, (data) => {
    const updateDDL = data?.data?.map((item) => {
      return {
        value: item?.shiptoPartnerId,
        label: item?.shipToParterName,
      };
    });
    updateGodownDDLFunc(updateDDL);
  });
};

// For number to text convert
const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];
const teens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Fourty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];
const thousands = ["", "Thousand", "Lakh", "Crore"];

// Helper function for convert number to text
function convertBelowThousand(num) {
  if (num === 0) return "";
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100)
    return (
      tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")
    );
  return (
    ones[Math.floor(num / 100)] +
    " Hundred" +
    (num % 100 !== 0 ? " and " + convertBelowThousand(num % 100) : "")
  );
}

// Helper function for convert number to text
function convertToWords(num) {
  if (num === 0) return "Zero";

  let parts = [];
  let thousandIndex = 0;

  while (num > 0) {
    let part = num % 1000;
    if (part > 0) {
      parts.unshift(
        convertBelowThousand(part) +
          (thousands[thousandIndex] ? " " + thousands[thousandIndex] : "")
      );
    }
    num = Math.floor(num / 1000);
    thousandIndex++;
  }

  return parts.join(" ");
}

// Main function for convert number to text
export function convertToText(n, uoc) {
  if (!uoc) {
    if (n === "") return "";
    if (n === 0 || n === null) return "";
    return (
      convertToWords(n)
        .trim()
        .toUpperCase() + " TAKA ONLY"
    );
  }
  if (n === "") return "";
  if (n === 0 || n === null) return "";
  return (
    convertToWords(n)
      .trim()
      .toUpperCase() + ` ${uoc.toUpperCase()} ONLY`
  );
}

// Select url for create tender on create and edit page
export const selectUrl = (businessPartner) => {
  switch (businessPartner) {
    case "BCIC":
      return `/tms/TenderSubmission/CreateOrUpdateTenderSubission`;
    case "BADC":
      return `tms/TenderSubmission/CreateOrEditBIDCTenderSubmission`;
    case "BADC(MOP)":
      return `/tms/TenderSubmission/CreateBADCMOPConfiguration`;
    default:
      return "";
  }
};

// Select payload for save tender data on create and edit page
export const selectPayload = (
  values,
  { accountId, buUnId, buUnName, tenderId, userId }
) => {
  const globalPayload = {
    accountId: accountId,
    businessUnitId: buUnId,
    businessUnitName: buUnName,
    tenderId: tenderId ? tenderId : 0,
    actionBy: userId,
    isActive: true,
  };
  const commonPayload = {
    businessPartnerId: values?.businessPartner?.value,
    businessPartnerName: values?.businessPartner?.label,
    enquiryNo: values?.enquiry,
    submissionDate: values?.submissionDate,
    remarks: values?.remarks,
    attachment: values?.attachment,
    isAccept: values?.isAccept,
    isReject: values?.isReject,
  };

  const bcicBadcCommonPayload = {
    foreignQty: +values?.foreignQnt,
    itemName: values?.productName,
    loadPortId: values?.loadPort?.value,
    loadPortName: values?.loadPort?.label,
  };

  // BCIC tender submission payload
  if (values?.businessPartner?.label === "BCIC") {
    return {
      header: {
        // global
        ...globalPayload,
        // common
        ...commonPayload,
        // bcic badc common
        ...bcicBadcCommonPayload,
        // bcic
        foreignPriceUsd: values?.foreignPriceUSD,
        dischargePortId: values?.dischargePort?.value,
        dischargePortName: values?.dischargePort?.label,
        totalQty: values?.foreignQnt,
        commercialNo: values?.commercialNo,
        commercialDate: values?.commercialDate,
        motherVesselId: values?.motherVessel?.value,
        motherVesselName: values?.motherVessel?.label,
      },
      // bcic
      rows: values?.localTransportations?.map((item) => ({
        godownId: item?.godownName?.value,
        godownName: item?.godownName?.label,
        quantity: item?.quantity,
        perQtyTonPriceBd: item?.price,
        perQtyPriceWords: convertToText(item?.price),
        tenderHeaderId: tenderId ? tenderId : 0,
        tenderRowId: tenderId ? item?.tenderRowId : 0,
        isActive: true,
      })),
    };
  }

  // BADC tender submission payload
  if (values?.businessPartner?.label === "BADC") {
    return {
      // global
      ...globalPayload,
      //common
      ...commonPayload,
      // bcic badc common
      ...bcicBadcCommonPayload,
      //badc
      foreignPriceUsd: +values?.foreignPriceUSD,
      dueDate: values?.dueDate,
      dueTime: values?.dueTime,
      lotqty: values?.lotQty,
      contractDate: values?.contractDate,
      layCan: values?.layCan,
      pricePerBag: +values?.pricePerBag,
    };
  }

  // BADC(MOP) tender submission payload
  if (values?.businessPartner?.label === "BADC(MOP)") {
    const payload = {
      headerDTO: {
        // global
        ...globalPayload,
        // common
        ...commonPayload,

        mopInvoiceId: values?.enquiry,
        mopTenderId: tenderId ? tenderId : 0,
        // portId: values?.dischargePortMOP?.value,
        // portName: values?.dischargePortMOP?.label,
      },
      rowDTOs: values?.mopRowsData,
    };
    // console.log(payload)
    return payload;
  }
  return {};
};

// ! remove ghat for requirement change
// fetch ghat ddl for badc create & edit
// export const fetchGhatDDL = (accountId, buUnId, getGhatDDLFunc) => {
//     getGhatDDLFunc(
//         `/wms/ShipPoint/GetShipPointDDL?accountId=${accountId}&businessUnitId=${buUnId}`
//     );
// };

// fetch mother vessel with port
export const fetchMotherVesselLists = (
  accId,
  buUnId,
  portId,
  getMotherVesselDDL
) => {
  getMotherVesselDDL(
    `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buUnId}&PortId=${portId}`
  );
};

/* BADC (MOP) */

// fetch ghat ddl for badc (mop) create
export const fetchGhatDDL = (accountId, buUnId, getGhatDDLFunc) => {
  getGhatDDLFunc(
    `/wms/ShipPoint/GetShipPointDDL?accountId=${accountId}&businessUnitId=${buUnId}`
  );
};

// ! Excel sheet columns length
export const TOTAL_COLUMNS_LENGTH = 21;

// create excel sheet for badc(mop) table rows
export const createExcelSheet = (ghatDDL, dischargePortDDL) => {
  const workbook = new ExcelJS.Workbook();

  // Add a new worksheet
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Add some rows and columns
  worksheet.columns = [
    { header: "Port Name", key: "portName", width: 15 },
    { header: "Ghat Name", key: "ghatName", width: 15 },
    { header: "Distance", key: "distance", width: 15 },
    { header: "Rang0to100", key: "rangOto100", width: 15 },
    { header: "Rang101to200", key: "rang101to200", width: 15 },
    { header: "Rang201to300", key: "rang201to300", width: 20 },
    { header: "Rang301to400", key: "rang301to400", width: 15 },
    { header: "Rang401to500", key: "rang401to500", width: 15 },
    { header: "TotalRate", key: "totalRate", width: 15 },
    { header: "TaxVat", key: "taxVat", width: 15 },
    { header: "InvoiceCost", key: "invoiceCost", width: 15 },
    { header: "LabourBill", key: "labourBill", width: 15 },
    { header: "TransPortCost", key: "transPortCost", width: 15 },
    { header: "AdditionalCost", key: "additionalCost", width: 15 },
    { header: "TotalCost", key: "totalCost", width: 15 },
    { header: "TotalRecive", key: "totalRecive", width: 15 },
    { header: "Quantity", key: "quantity", width: 15 },
    { header: "BillAmount", key: "billAmount", width: 15 },
    { header: "CostAmount", key: "costAmount", width: 15 },
    { header: "ProfitAmount", key: "profitAmount", width: 15 },
  ];

  // First row color add
  const rows = worksheet.getRow(1);
  for (let i = 0; i < TOTAL_COLUMNS_LENGTH; i++) {
    rows.getCell(i + 1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF00" },
    };
  }

  // Port Name (DDL)
  const portName = worksheet.getCell("A2");
  portName.value = dischargePortDDL?.[0]?.label || "";
  const portDDLList = [
    `"${dischargePortDDL?.map((item) => item?.label).join(", ")}"`,
  ];
  portName.dataValidation = {
    type: "list",
    formulae: portDDLList || [],
    showErrorMessage: true,
    error: "Please use the dropdown to select a port",
    errorTitle: "Invalid Selection",
  };

  // Ghat name (DDL)
  const ghatName = worksheet.getCell("B2");
  ghatName.value = ghatDDL?.[0]?.label || "";
  const ghatDDLList = [`"${ghatDDL?.map((item) => item?.label).join(",")}"`];
  ghatName.dataValidation = {
    type: "list",
    formulae: ghatDDLList || [],
    showErrorMessage: true,
    error: "Please use the dropdown to select a ghat",
    errorTitle: "Invalid Selection",
  };

  // Distance
  worksheet.getCell("C2").value = 0;
  // Rang0to100
  worksheet.getCell("D2").value = {
    formula: "IF(AND(C2>0,C2 <= 100), C2* 15,100*15)",
    result: 0,
  };
  // Rang101to200
  worksheet.getCell("E2").value = {
    formula: "IF(AND(C2 > 100, C2 <= 200),(C2-100)*3.25,IF(C2>200,100*3.25,0))",
    result: 0,
  };
  // Rang201to300
  worksheet.getCell("F2").value = {
    formula: "IF(AND(C2 > 200, C2 <= 300),(C2-200)*0.7,IF(C2>300,100*0.7,0))",
    result: 0,
  };
  // Rang301to400
  worksheet.getCell("G2").value = {
    formula: "IF(AND(B5 > 300, B5 <= 400),(B5-300)*0.5,IF(B5>400,100*0.5,0))",
    result: 0,
  };
  // Rang401to500
  worksheet.getCell("H2").value = {
    formula: "IF(AND(C2 > 400, C2 <= 500),(C2-400)*0.3,IF(C2>500,100*0.3,0))",
    result: 0,
  };
  // TotalRate
  worksheet.getCell("I2").value = {
    formula: "SUM(C2:G2)",
    result: 0,
  };
  // TaxVat
  worksheet.getCell("J2").value = {
    formula: "I2*0.17",
    result: 0,
  };
  // InvoiceCost
  worksheet.getCell("K2").value = 0;
  // LabourBill
  worksheet.getCell("L2").value = 100;
  // TransportCost
  worksheet.getCell("M2").value = 0;
  // TotalCost
  worksheet.getCell("N2").value = 0;
  // AdditionalCost
  worksheet.getCell("O2").value = {
    formula: "SUM(J2:N2)",
    result: 0,
  };
  // TotalRecieve
  worksheet.getCell("P2").value = {
    formula: "ABS(I2-O2)",
    result: 0,
  };
  // Quantity
  worksheet.getCell("Q2").value = 0;
  // BillAmount
  worksheet.getCell("R2").value = {
    formula: "Q2*I2",
    result: 0,
  };
  // CostAmount
  worksheet.getCell("S2").value = {
    formula: "Q2*O2",
    result: 0,
  };
  // ProfitAmount
  worksheet.getCell("T2").value = {
    formula: "ABS(R2-S2)",
    result: 0,
  };

  // Save the workbook
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // download the file
    const mopExcel = document.createElement("a");
    document.body.appendChild(mopExcel);

    const url = window.URL.createObjectURL(blob);
    mopExcel.href = url;
    mopExcel.download = `BADCMOPTender-${moment().format("l")}`;
    mopExcel.click();
  });
};

// remove 1st row & filter that array has element
const removeEmptyRow = (excelData) => {
  // const data =rows?.slice(1).filter(item => item?.[0])
  // console.log(data)
  // const data2 = res?.rows?.slice(1)
  // console.log(data2)
  return excelData?.rows?.slice(1).filter((item) => item?.[0]);
};

// format string > convert string to lower case & remove one or more space, tabs & trim from bothside
const formatString = (ghatname) =>
  ghatname?.length > 0 &&
  ghatname
    ?.toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

// get ghat object from a ghat name
const getCurrentGhatObj = (ghatDDL, ghatname) => {
  const ghat = ghatDDL.find(
    (item) => formatString(item?.label) === formatString(ghatname)
  );
  return ghat;
};

// get port object from a port name
const getCurrentPortObj = (portDDL, portName) => {
  const port = portDDL.find(
    (item) => formatString(item?.label) === formatString(portName)
  );
  return port;
};

// fill with undefined to empty cell
const fillWithUndefindValueToEmptyCell = (data) =>
  data?.map((item, index) => {
    const updateData = [];
    for (let i = 0; i < TOTAL_COLUMNS_LENGTH; i++) {
      updateData.push(item[i]);
    }
    return updateData;
  });

// Modify array item to object from filledUndefinedValueToEmptyCellaData arr
const modifyFilledData = (filledArr, ghatDDL, dischargePortDDL) =>
  filledArr?.map((item, index) => {
    const portName = item[0];
    const ghatName = item[1];

    return {
      conFigId: 0,
      mopInvoiceId: "",
      portId: getCurrentPortObj(dischargePortDDL, portName)?.value, // reuturn port id/value with port name from port ddl
      portName: portName,
      ghatId: getCurrentGhatObj(ghatDDL, ghatName)?.value, // reuturn ghat id/value with ghat name from ghat ddl
      ghatName: ghatName,
      distance: item[2], // distance index
      rangOto100: item[3], // rangOto100 index
      rang101to200: item[4], // rang101to200 index
      rang201to300: item[5], // rang201to300 index
      rang301to400: item[6], // rang301to400 index
      rang401to500: item[7], // rang401to500 index
      totalRate: item[8], // totalRate index
      taxVat: item[9], // taxVat index
      invoiceCost: item[10], // invoiceCost index
      labourBill: item[11], // labourBill index
      transPortCost: item[12], // transPortCost index
      additionalCost: item[13], // additionalCost index
      totalCost: item[14], // totalCost index
      totalRecive: item[15], // totalRecive index
      quantity: item[16], // quantity index
      billAmount: item[17], // billAmount index
      costAmount: item[18], // costAmount index
      profitAmount: item[19], // profitAmount index
      isActive: true,
      mopTenderId: 0,
      actualQuantity: 0,
    };
  });

// excel sheet file upload handler
export const excelSheetUploadHandler = async (
  excelFile,
  ghatDDL,
  dischargePortDDL
) => {
  // collection of update excel data list from array of array to array of object
  let updateExcelDataList = [];

  if (excelFile) {
    await ExcelRenderer(excelFile, (err, res) => {
      if (err) {
        toast.warning("An unexpected error occurred");
      } else {
        // ! excel file response
        // {"rows": [["Port Name","Ghat Name", "Distance","Rang0to100",],["",0, 0,]],
        // "cols": [{"name": "A","key": 0},{"name": "B","key": 1},]}
        // console.log(res)
        // remove 1st row & filter that array has element
        const data = removeEmptyRow(res);
        // console.log(data)

        // fill with undefined to empty cell
        const filledUndefinedValueToEmptyCellaData = fillWithUndefindValueToEmptyCell(
          data
        );
        // console.log(filledUndefinedValueToEmptyCellaData)

        // Modify array item to object from filledUndefinedValueToEmptyCellaData arr
        const modifiedData = modifyFilledData(
          filledUndefinedValueToEmptyCellaData,
          ghatDDL,
          dischargePortDDL
        );

        // asign modifiedData to updateExcelDataList
        updateExcelDataList = modifiedData;
        // console.log(modifiedData)
      }
    });
  }

  return updateExcelDataList;
};

// mop tender create data table header
export const mopTenderCreateDataTableHeader = [
  "Port Name",
  "Ghat Name",
  "Distance",
  "RangOto100",
  "Rang101to200",
  "Rang201to300",
  "Rang301to400",
  "Rang401to500",
  "TotalRate",
  "TaxVat",
  "InvoiceCost",
  "LabourBill",
  "TransPortCost",
  "AdditionalCost",
  "TotalCost",
  "TotalRecive",
  "Quantity",
  "BillAmount",
  "CostAmount",
  "ProfitAmount",
  "Actions",
];

// mop tender create data table header
export const mopTenderEditDataTableHeader = [
  "Port Name",
  "Ghat Name",
  "Actual Quantity",
];
