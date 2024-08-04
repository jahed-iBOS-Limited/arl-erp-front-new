import axios from "axios";
import { Field, getIn } from "formik";
import React from "react";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";

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

export const businessPartnerDDL = [{ value: 89497, label: "BCIC" }];

// Inital data for tender submission create & edit page
export const initData = {
  businessPartner: "",
  enquiry: "",
  submissionDate: "",
  foreignQnt: "",
  uomname: "",
  productName: "",
  loadPort: "",
  dischargePort: "",
  foreignPriceUSD: "",
  commercialNo: "",
  commercialDate: "",
  referenceNo: "",
  referenceDate: "",
  approveStatus: "",
  localTransportations: [
    {
      godownName: "",
      quantity: "",
      price: "",
    },
  ],
};

// Validation schema for tender submission create & edit page
export const validationSchema = Yup.object({
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
  commercialDate: Yup.date().required("Commercial date is required"),
  commercialNo: Yup.string().required("Commercial no is required"),
  referenceNo: Yup.string().required("Reference no is required"),
  referenceDate: Yup.date().required("Reference date is required"),
  localTransportations: Yup.array()
    .of(
      Yup.object({
        godownName: Yup.string().required("Godown is required"),
        quantity: Yup.number()
          .positive()
          .min(0)
          .required("Quantity is required"),
        price: Yup.number()
          .positive()
          .min(0)
          .required("Price is required"),
      })
    )
    .required("Local transport is required")
    .min(1, "Minimum 1 local transport"),
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
