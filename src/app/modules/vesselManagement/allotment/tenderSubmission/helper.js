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
];

// Inital data for tender submission create & edit page
export const initData = {
  // common state
  businessPartner: "",
  enquiry: "",
  submissionDate: "",
  foreignQnt: "",
  uomname: "",
  productName: "",
  loadPort: "",
  dischargePort: "",
  foreignPriceUSD: "",
  approveStatus: "",
  // bcic state
  commercialNo: "",
  commercialDate: "",
  referenceNo: "",
  referenceDate: "",
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
  dischargeRatio: "",
  laycanDate: "",
};

// Validation schema for tender submission create & edit page
export const validationSchema = Yup.object({
  businessPartner: Yup.object({
    label: Yup.string().required("Business partner label is required"),
    value: Yup.string().required("Business partner value is required"),
  }).required("Business partner is required"),
  enquiry: Yup.string().required("Enquiry is required"),
  submissionDate: Yup.date().required("Submission date is required"),
  foreignQnt: Yup.number()
    .positive()
    .min(0)
    .required("Foreign qnt is required"),
  uomname: Yup.string().required("Qnt Unit is required"),
  productName: Yup.string().required("Product name is required"),
  loadPort: Yup.string().required("Load port is required"),
  dischargePort: Yup.string().required("Discharge port is required"),
  foreignPriceUSD: Yup.number()
    .positive()
    .min(0)
    .required("Foreign price is required"),
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
  referenceNo: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BCIC",
    then: Yup.string().required("Reference no is required"),
    otherwise: Yup.string(),
  }),
  referenceDate: Yup.date().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BCIC",
    then: Yup.date().required("Reference date is required"),
    otherwise: Yup.date(),
  }),
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
  dischargeRatio: Yup.string().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.string().required("Discharge ratio is required"),
    otherwise: Yup.string(),
  }),
  contractDate: Yup.date().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.date().required("Contract date is required"),
    otherwise: Yup.date(),
  }),
  laycanDate: Yup.date().when("businessPartner", {
    is: (businessPartner) =>
      businessPartner && businessPartner?.label === "BADC",
    then: Yup.date().required("Laycan date is required"),
    otherwise: Yup.date(),
  }),
  localTransportations: Yup.array()
    .of(
      Yup.object({
        godownName: Yup.string().when("$businessPartner", {
          is: (businessPartner) =>
            businessPartner && businessPartner?.label === "BCIC",
          then: Yup.string().required("Godown is required"),
          otherwise: Yup.string(),
        }),
        quantity: Yup.number()
          .positive()
          .min(0)
          .when("$businessPartner", {
            is: (businessPartner) =>
              businessPartner && businessPartner?.label === "BCIC",
            then: Yup.number().required("Quantity is required"),
            otherwise: Yup.number(),
          }),
        price: Yup.number()
          .positive()
          .min(0)
          .when("$businessPartner", {
            is: (businessPartner) => {
              console.log(businessPartner);
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
        .required("Local transport is required"),
      otherwise: Yup.array().notRequired(),
    }),
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
export const fetchTenderDetails = (
  tenderId,
  accountId,
  buUnId,
  getTenderDetailsCallback
) => {
  const url = `/tms/TenderSubmission/GetTenderSubmissionById?AccountId=${accountId}&BusinessUnitId=${buUnId}&TenderId=${tenderId}`;
  getTenderDetailsCallback(url);
};

// State function when update data
export const updateState = ({ header, rows }) => {
  const editData = {
    businessPartner: {
      value: header?.businessPartnerId,
      label: header?.businessPartnerName,
    },
    attachment: header?.attachment,
    enquiry: header?.enquiryNo,
    submissionDate: _dateFormatter(header?.submissionDate),
    foreignQnt: header?.foreignQty,
    uomname: header?.uomname,
    productName: header?.itemName,
    loadPort: {
      label: header?.loadPortName,
      value: header?.loadPortId,
    },
    dischargePort: {
      label: header?.dischargePortName,
      value: header?.dischargePortId,
    },
    foreignPriceUSD: header?.foreignPriceUsd,
    commercialNo: header?.commercialNo,
    commercialDate: _dateFormatter(header?.commercialDate),
    referenceNo: header?.referenceNo,
    referenceDate: _dateFormatter(header?.referenceDate),
    approveStatus: header?.isAccept,
    localTransportations: rows?.map((item) => {
      return {
        tenderRowId: item?.tenderRowId,
        tenderHeaderId: item?.tenderHeaderId,
        godownName: {
          value: 98654,
          label: item?.godownName,
        },
        quantity: item?.quantity,
        price: item?.perQtyTonPriceBd,
        perQtyPriceWords: item?.perQtyTonPriceBd,
      };
    }),
  };
  return editData;
};

// get godown list function
export const getGodownDDLList = (
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
export function convertToText(n) {
  if (n === "") return "";
  if (n === 0) return "ZERO TAKA ONLY";
  return (
    convertToWords(n)
      .trim()
      .toUpperCase() + " TAKA ONLY"
  );
}
