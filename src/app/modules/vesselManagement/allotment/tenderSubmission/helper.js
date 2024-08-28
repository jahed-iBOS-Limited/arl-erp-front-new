import axios from "axios";
import { Field, getIn } from "formik";
import React from "react";
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
  distance0100: "",
  distance101200: "",
  distance201300: "",
  distance301400: "",
  distance401500: "",
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
  // distance0100: Yup.number()
  //   .positive()
  //   .min(0, "Must be greater than or equal 0")
  //   .max(100, "Must be less than or qual 100")
  //   .required("Distance 0-100 is required"),
  // distance101200: Yup.number()
  //   .positive()
  //   .min(0, "Must be greater than or equal 0")
  //   .max(100, "Must be less than or qual 100")
  //   .required("Distance 101-200 is required"),
  // distance201300: Yup.number()
  //   .positive()
  //   .min(0, "Must be greater than or equal 0")
  //   .max(100, "Must be less than or qual 100")
  //   .required("Distance 201-300 is required"),
  // distance301400: Yup.number()
  //   .positive()
  //   .min(0, "Must be greater than or equal 0")
  //   .max(100, "Must be less than or qual 100")
  //   .required("Distance 301-400 is required"),
  // distance401500: Yup.number()
  //   .positive()
  //   .min(0, "Must be greater than or equal 0")
  //   .max(100, "Must be less than or qual 100")
  //   .required("Distance 401-500 is required"),
  // mopRowsData: Yup.array()
  //   .of(Yup.object())
  //   .when("businessPartner", {
  //     is: (businessPartner) =>
  //       businessPartner && businessPartner?.label === "BADC(MOP)",
  //     then: Yup.array()
  //       .min(1, "Minimum 1 Mop Rows Data")
  //       .required("Mop Rows Data is required"),
  //     otherwise: Yup.array().notRequired(),
  //   }),
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

  // if (values?.businessPartner?.label === "BADC(MOP)") {
  //   url = `/tms/TenderSubmission/GetBADCMOPConfigurationlanding?AccountId=${accountId}&BusinessUnitId=${buUnId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&fromDate=${values?.fromDate}&toDate=${values?.toDate}&status=${values?.approveStatus?.value}`;
  // }

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
  // if (values?.businessPartner?.label === "BADC(MOP)") {
  //   url = `/tms/TenderSubmission/GetForEditMOPConfiguration?AccountId=${accountId}&BusinessUnitId=${buUnId}&MopTenderId=${tenderId}`; // tenderId => mopTenderId
  // }
  getTenderDetailsFunc(url, () => {
    callback && callback();
  });
};

// callback approch for rows data fetch badc mop for print page
export const fetchBADCMOPRowsDataForPrintPage = (
  accountId,
  buUnId,
  mopTenderId,
  portId,
  getTenderDetailsFunc,
  callback
) => {
  const url = `/tms/TenderSubmission/GetByBADCMOPConfiguration?AccountId=${accountId}&BusinessUnitId=${buUnId}&MopTenderId=${mopTenderId}&PortId=${portId}`;

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
  // const isBADCMOP = tenderDetails?.headerDTO || tenderDetails?.rowDTOs;

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
  }
  // else if (isBADCMOP) {
  //   const { headerDTO, rowDTOs } = tenderDetails;

  //   const badcMOPState = {
  //     enquiry: headerDTO?.mopInvoiceId,
  //     mopTenderId: headerDTO?.mopTenderId,
  //     submissionDate: _dateFormatter(headerDTO?.submissionDate),
  //     // dischargePortMOP: headerDTO?.portId
  //     //   ? {
  //     //       label: headerDTO?.portName,
  //     //       value: headerDTO?.portId,
  //     //     }
  //     //   : "",
  //     mopRowsData: rowDTOs?.map((item) => {
  //       return {
  //         mopTenderId: item?.mopTenderId,
  //         mopInvoiceId: item?.mopInvoiceId,
  //         ghatId: item?.ghatId,
  //         ghatName: item?.ghatName,
  //         portId: item?.portId,
  //         portName: item?.portName,
  //         distance: item?.distance,
  //         quantity: item?.quantity,
  //         actualQuantity: item?.actualQuantity,
  //       };
  //     }),
  //   };

  //   const commonEditData = {
  //     // badc (mop)
  //     ...badcMOPState,

  //     // global
  //     businessPartner: headerDTO?.businessPartnerId
  //       ? {
  //         value: headerDTO?.businessPartnerId,
  //         label: headerDTO?.businessPartnerName,
  //       }
  //       : "",
  //     remarks: headerDTO?.strRemarks,

  //     // edit
  //     attachment: headerDTO?.attachment,
  //     isAccept: headerDTO?.isAccept,
  //     isReject: headerDTO?.isReject,
  //   };

  //   return commonEditData;
  // }
  else {
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

// Select url for create tender on create and edit page with business partner & tenderId. BADC MOP use different url for update
export const selectUrl = (businessPartner, mopTenderId) => {
  switch (businessPartner) {
    case "BCIC":
      return `/tms/TenderSubmission/CreateOrUpdateTenderSubission`;
    case "BADC":
      return `/tms/TenderSubmission/CreateOrEditBIDCTenderSubmission`;
    case "BADC(MOP)":
      // tenderId. BADC MOP use different url for update
      if (mopTenderId) {
        return `/tms/TenderSubmission/UpdateBADCMOPConfiguration`;
      }
      return `/tms/TenderSubmission/CreateBADCMOPConfiguration`;
    default:
      return "";
  }
};

// Select payload for save tender data on create and edit page
export const selectPayload = (
  values,
  mopRowsData,
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
        mopTenderId: tenderId ? +tenderId : 0,
        valueOto100: values?.distance0100,
        value1O1to200: values?.distance101200,
        value2O1to300: values?.distance201300,
        value3O1to400: values?.distance301400,
        value401to500: values?.distance401500,
      },
      rowDTOs: mopRowsData,
    };
    // console.log(payload)
    return payload;
  }
  return {};
};

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

// validation object properties array
// const validationBADCMOPDRFieldNames = [
//   "distance0100",
//   "distance101200",
//   "distance201300",
//   "distance301400",
//   "distance401500",
// ];

// validation badc mop distance rate field before show table data & 1st phase
// export const validationBADCMORDistanceRateField = async (
//   validateForm,
//   setTouched,
//   callback
// ) => {
//   // set true all field with second button with setTouched
//   setTouched(
//     validationBADCMOPDRFieldNames.reduce((acc, fieldName) => {
//       acc[fieldName] = true;
//       // console.log(acc);
//       return acc;
//     }, {})
//   );

//   // all field required
//   const errors = await validateForm();

//   const allFieldsErrors = validationBADCMOPDRFieldNames?.every((fieldName) =>
//     errors?.hasOwnProperty(fieldName)
//   );
//   // console.log(allFieldsErrors);

//   if (!allFieldsErrors) {
//     callback && callback();
//   } else {
//     console.log(errors);
//   }
// };

// get mop rows data when distance rate form field ha no errors. this is a callback func on validationBADCMOPDistanceRateField
export const ranges = {
  rangOto100: 0,
  rang101to200: 0,
  rang201to300: 0,
  rang301to400: 0,
  rang401to500: 0,
};

export const distributeDistance = (distance = 0) => {
  const ranges = {
    rangOto100: 0,
    rang101to200: 0,
    rang201to300: 0,
    rang301to400: 0,
    rang401to500: 0,
  };
  if (distance > 0) {
    if (distance >= 500) {
      ranges.rangOto100 = 100;
      ranges.rang101to200 = 100;
      ranges.rang201to300 = 100;
      ranges.rang301to400 = 100;
      ranges.rang401to500 = 100;
    } else if (distance >= 400) {
      ranges.rangOto100 = 100;
      ranges.rang101to200 = 100;
      ranges.rang201to300 = 100;
      ranges.rang301to400 = 100;
      ranges.rang401to500 = distance - 400;
    } else if (distance >= 300) {
      ranges.rangOto100 = 100;
      ranges.rang101to200 = 100;
      ranges.rang201to300 = 100;
      ranges.rang301to400 = distance - 300;
    } else if (distance >= 200) {
      ranges.rangOto100 = 100;
      ranges.rang101to200 = 100;
      ranges.rang201to300 = distance - 200;
    } else if (distance >= 100) {
      ranges.rangOto100 = 100;
      ranges.rang101to200 = distance - 100;
    } else {
      ranges.rangOto100 = distance;
    }
  }

  return ranges;
};

export const calculateRangesRate = (distributedDistance, values) => {
  const rangOto100Rate = (
    distributedDistance?.rangOto100 * +values?.distance0100
  ).toFixed(2);
  const rang101to200Rate = (
    distributedDistance?.rang101to200 * +values?.distance101200
  ).toFixed(2);
  const rang201to300Rate = (
    distributedDistance?.rang201to300 * +values?.distance201300
  ).toFixed(2);
  const rang301to400Rate = (
    distributedDistance?.rang301to400 * +values?.distance301400
  ).toFixed(2);
  const rang401to500Rate = (
    distributedDistance?.rang401to500 * +values?.distance401500
  ).toFixed(2);

  return {
    rangOto100Rate,
    rang101to200Rate,
    rang201to300Rate,
    rang301to400Rate,
    rang401to500Rate,
  };
};

export const calculateTotalRate = (calculateRangesRate) => {
  const ratesArray = Object.values(calculateRangesRate);
  return ratesArray?.reduce((acc, item) => acc + +item, 0).toFixed(2);
};

export const calculateTotalCost = (totalTaxVat = 0, item) => {
  // console.log(
  //   +totalTaxVat +
  //     item?.additionalCost +
  //     item?.labourBill +
  //     item?.invoiceCost +
  //     item?.transPortCost
  // );
  return (
    +totalTaxVat +
    +item?.additionalCost +
    +item?.labourBill +
    +item?.invoiceCost +
    +item?.transPortCost
  ).toFixed(2);
  // return costs.reduce((acc, costItem) => acc + +costItem, 0).toFixed(2);
};

export const calculateTotalRecieve = (totalRate = 0, totalCost = 0) =>
  Math.abs(+totalRate - +totalCost).toFixed(2);

export const calculateBillAmount = (itemQty, totalRate = 0) =>
  (+itemQty * +totalRate).toFixed(2);

export const calculateCostAmount = (itemQty, totalCost = 0) =>
  (+itemQty * +totalCost).toFixed(2);

export const calculateProfitAmount = (billAmount = 0, costAmount = 0) =>
  Math.abs(+billAmount - +costAmount).toFixed(2);

export const calculateTaxVat = (totalRate = 0, taxPercentage = 0.17) =>
  (+totalRate * +taxPercentage).toFixed(2);

export const fetchMOPRowsData = (
  accountId,
  buUnId,
  getMopRowsDataFunc,
  values,
  updateMopRowsData
) => {
  getMopRowsDataFunc(
    `/tms/TenderSubmission/GetBADCMopMasterConfigation?AccountId=${accountId}&BusinessUnitId=${buUnId}`,
    (data) => {
      const modifyData = data?.map((item, index) => {
        const distributedDistance = distributeDistance(item?.distance);
        const rangesRate = calculateRangesRate(distributedDistance, values);
        const totalRate = calculateTotalRate(rangesRate);
        const totalTaxVat = calculateTaxVat(totalRate);
        const totalCost = calculateTotalCost(totalTaxVat, item);
        const totalRecieve = calculateTotalRecieve(totalRate - totalCost);
        const billAmount = calculateBillAmount(item?.quantity, totalRate);
        const costAmount = calculateCostAmount(item?.quantity, totalCost);
        const profitAmount = calculateProfitAmount(billAmount, costAmount);

        // console.log(totalCost);

        return {
          ...item,
          rangOto100: rangesRate.rangOto100Rate,
          rang101to200: rangesRate.rang101to200Rate,
          rang201to300: rangesRate.rang201to300Rate,
          rang301to400: rangesRate.rang301to400Rate,
          rang401to500: rangesRate.rang401to500Rate,
          totalRate,
          taxVat: totalTaxVat,
          totalCost,
          totalRecieve,
          billAmount,
          costAmount,
          profitAmount,
        };
      });
      updateMopRowsData(modifyData);
    }
  );
};

// calculate distance & range rate
// export const calculateDistanceRate = (data, values, updateMopRowsData) => {
//   const {
//     distance0100,
//     distance101200,
//     distance201300,
//     distance301400,
//     distance401500,
//   } = values;

//   const first100 = 100 * distance0100;
//   const second100 = 100 * distance101200;
//   const third100 = 100 * distance201300;
//   const fourth100 = 100 * distance301400;

//   const updateData = data?.map((item, index) => {
//     const first = item.distance * distance0100;
//     const second = (item.distance - 100) * distance101200;
//     const third = (item.distance - 200) * distance201300;
//     const fourth = (item.distance - 300) * distance301400;
//     const fifth = (item.distance - 400) * distance401500;

//     if (item?.distance > 0 && item?.distance <= 100) {
//       return {
//         ...item,
//         rangOto100: first,
//         rang101to200: 0,
//         rang201to300: 0,
//         rang301to400: 0,
//         rang401to500: 0,
//       };
//     } else if (item?.distance > 100 && item?.distance <= 200) {
//       return {
//         ...item,
//         rangOto100: first100,
//         rang101to200: second,
//         rang201to300: 0,
//         rang301to400: 0,
//         rang401to500: 0,
//       };
//     } else if (item?.distance > 200 && item?.distance <= 300) {
//       return {
//         ...item,
//         rangOto100: first100,
//         rang101to200: second100,
//         rang201to300: third,
//         rang301to400: 0,
//         rang401to500: 0,
//       };
//     } else if (item?.distance > 300 && item?.distance <= 400) {
//       return {
//         ...item,
//         rangOto100: first100,
//         rang101to200: second100,
//         rang201to300: third100,
//         rang301to400: fourth,
//         rang401to500: 0,
//       };
//     } else if (item?.distance > 400 && item?.distance <= 500) {
//       return {
//         ...item,
//         rangOto100: first100,
//         rang101to200: second100,
//         rang201to300: third100,
//         rang301to400: fourth100,
//         rang401to500: fifth,
//       };
//     } else {
//       return {
//         ...item,
//         rangOto100: 0,
//         rang101to200: 0,
//         rang201to300: 0,
//         rang301to400: 0,
//         rang401to500: 0,
//       };
//     }
//   });

//   console.log(updateData);

//   updateMopRowsData(updateData);
// };

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
  "TotalReceive",
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
  "Quantity",
  "Actual Quantity",
];

//
export const commonFieldValueChange = (
  e,
  item,
  index,
  values,
  mopRowsData,
  updateMopRowsData,
  fieldName
) => {
  const newValue = +e.target.value || 0;

  // Create a copy of the current item and update the field with the new value
  const updatedItem = { ...item, [fieldName]: newValue };

  const distributedDistance = distributeDistance(
    fieldName === "distance" ? newValue : item?.distance
  );
  // console.log(updatedItem?.additionalCost);
  // console.log(item?.additionalCost);
  // console.log(mopRowsData[index]?.additionalCost);
  const rangesRate = calculateRangesRate(distributedDistance, values);
  const totalRate = calculateTotalRate(rangesRate);
  const totalTaxVat = calculateTaxVat(totalRate);
  const totalCost = calculateTotalCost(totalTaxVat, updatedItem);
  const totalRecieve = calculateTotalRecieve(totalRate - totalCost);
  const billAmount = calculateBillAmount(updatedItem?.quantity, totalRate);
  const costAmount = calculateCostAmount(updatedItem?.quantity, totalCost);
  const profitAmount = calculateProfitAmount(billAmount, costAmount);

  const newMopRowsData = [...mopRowsData];

  newMopRowsData[index] = {
    ...newMopRowsData[index],
    [fieldName]: newValue,
    rangOto100: rangesRate.rangOto100Rate,
    rang101to200: rangesRate.rang101to200Rate,
    rang201to300: rangesRate.rang201to300Rate,
    rang301to400: rangesRate.rang301to400Rate,
    rang401to500: rangesRate.rang401to500Rate,
    totalRate,
    taxVat: totalTaxVat,
    totalCost,
    totalRecieve,
    billAmount,
    costAmount,
    profitAmount,
  };

  updateMopRowsData(newMopRowsData);
};

// export const handleDistanceChange = (
//   e,
//   item,
//   index,
//   values,
//   mopRowsData,
//   updateMopRowsData,
//   fieldName
// ) => {
//   const newValue = +e.target.value || 0;
//   const distributedDistance = distributeDistance(newValue);
//   const rangesRate = calculateRangesRate(distributedDistance, values);
//   const totalRate = calculateTotalRate(rangesRate);
//   const totalTaxVat = calculateTaxVat(totalRate);
//   const totalCost = calculateTotalCost(totalTaxVat, item);
//   const totalRecieve = calculateTotalRecieve(totalRate - totalCost);
//   const billAmount = calculateBillAmount(item?.quantity, totalRate);
//   const costAmount = calculateCostAmount(item?.quantity, totalCost);
//   const profitAmount = calculateProfitAmount(billAmount, costAmount);

//   const newMopRowsData = [...mopRowsData];
//   console.log({ [fieldName]: newValue });

//   newMopRowsData[index] = {
//     ...newMopRowsData[index],
//     distance: newValue,
//     rangOto100: rangesRate.rangOto100Rate,
//     rang101to200: rangesRate.rang101to200Rate,
//     rang201to300: rangesRate.rang201to300Rate,
//     rang301to400: rangesRate.rang301to400Rate,
//     rang401to500: rangesRate.rang401to500Rate,
//     totalRate,
//     taxVat: totalTaxVat,
//     totalCost,
//     totalRecieve,
//     billAmount,
//     costAmount,
//     profitAmount,
//   };

//   updateMopRowsData(newMopRowsData);
// };
