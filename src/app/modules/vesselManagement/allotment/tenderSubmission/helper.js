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

// Approve status for landing page
export const approveStatusDDL = [
    { value: 0, label: "All" },
    { value: 1, label: "Win" },
    { value: 2, label: "Pending" },
    { value: 3, label: "Reject" },
];

// Inital data for tender submission create & edit page
export const initData = {
    // common state
    businessPartner: "",
    enquiry: "",
    submissionDate: "",
    foreignQnt: "",
    productName: "",
    loadPort: "",
    foreignPriceUSD: "",
    // bcic state
    dischargePort: "",
    commercialNo: "",
    commercialDate: "",
    remarks: "",
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
    // ghat1: "",
    // ghat2: "",
    contractDate: "",
    // dischargeRatio: "",
    laycanDate: "",
    // pricePerQty: "",
    pricePerBag: "",
};

// Validation schema for tender submission create & edit page
export const createPageValidationSchema = Yup.object({
    // common
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
    productName: Yup.string().required("Product name is required"),
    loadPort: Yup.string().required("Load port is required"),
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
    remarks: Yup.string(),
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

    laycanDate: Yup.date().when("businessPartner", {
        is: (businessPartner) =>
            businessPartner && businessPartner?.label === "BADC",
        then: Yup.date().required("Laycan date is required"),
        otherwise: Yup.date(),
    }),
    pricePerBag: Yup.number()
        .positive()
        .min(0)
});

// Validation schema for landing page
export const landingPageValidationSchema = Yup.object({
    businessPartner: Yup.object({
        value: Yup.string().required("Select a status"),
        label: Yup.string().required("Select a status"),
    }).required("Select a business partner"),
    fromDate: Yup.date().required('Please enter from date'),
    toDate: Yup.date().required('Please enter to date'),
    approveStatus: Yup.object({
        value: Yup.string().required("Select a status"),
        label: Yup.string().required("Select a status")
    }).required("Select a status"),
})

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
    getTenderDetailsFunc(url, () => {
        callback && callback();
    });
};

// State function when update data
//export const updateState = ({ header, rows, }, ...rest) => {
export const updateState = (tenderDetails) => {
    const isBCIC = tenderDetails?.header || tenderDetails?.rows;
    if (isBCIC) {
        const { header, rows } = tenderDetails;

        const bcicState = {
            dischargePort: header?.dischargePortId ? {
                label: header?.dischargePortName,
                value: header?.dischargePortId,
            } : "",
            commercialNo: header?.commercialNo,
            commercialDate: _dateFormatter(header?.commercialDate),
            remarks: header?.strRemarks,
            motherVessel: header?.motherVesselId ? {
                label: header?.motherVesselName,
                value: header?.motherVesselId
            } : "",
            localTransportations: rows?.map((item) => {
                return {
                    tenderRowId: item?.tenderRowId,
                    tenderHeaderId: item?.tenderHeaderId,
                    godownName: item?.godownName ? {
                        value: item?.godownId,
                        label: item?.godownName,
                    } : "",
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
            loadPort: header?.loadPortId ? {
                label: header?.loadPortName,
                value: header?.loadPortId,
            } : "",
            // edit
            foreignPriceUSD: header?.foreignPriceUsd,
            attachment: header?.attachment,
            isAccept: header?.isAccept,
            isReject: header?.isReject,
        };
        return commonEditData;
    } else {
        const badcState = {
            dueDate: _dateFormatter(tenderDetails?.dueDate),
            dueTime: tenderDetails?.dueTime,
            lotQty: tenderDetails?.lotqty,
            contractDate: _dateFormatter(tenderDetails?.contractDate),
            laycanDate: _dateFormatter(tenderDetails?.laycandate),
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
            loadPort: tenderDetails?.loadPortId ? {
                label: tenderDetails?.loadPortName,
                value: tenderDetails?.loadPortId,
            } : "",
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
    const url = `/tms/LigterLoadUnload/GetShipToPartnerG2GPagination?AccountId=${accountId}&BusinessUnitId=${buUnId}&BusinessPartnerId=${businessPartner?.value
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
    }
    const commonPayload = {
        businessPartnerId: values?.businessPartner?.value,
        businessPartnerName: values?.businessPartner?.label,
        enquiryNo: values?.enquiry,
        submissionDate: values?.submissionDate,
        foreignQty: +values?.foreignQnt,
        itemName: values?.productName,
        loadPortId: values?.loadPort?.value,
        loadPortName: values?.loadPort?.label,
        isAccept: values?.isAccept,
        isReject: values?.isReject,
        attachment: values?.attachment,
        remarks: values?.remarks,
    }
    // BCIC tender submission payload
    if (values?.businessPartner?.label === "BCIC") {
        return {
            header: {
                // global
                ...globalPayload,
                // common
                ...commonPayload,
                // bcic
                foreignPriceUsd: values?.foreignPriceUSD,
                dischargePortId: values?.dischargePort?.value,
                dischargePortName: values?.dischargePort?.label,
                totalQty: values?.foreignQnt,
                commercialNo: values?.commercialNo,
                commercialDate: values?.commercialDate,
                motherVesselId: values?.motherVessel?.value,
                motherVesselName: values?.motherVessel?.label
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
            //badc
            foreignPriceUsd: +values?.foreignPriceUSD,
            dueDate: values?.dueDate,
            dueTime: values?.dueTime,
            lotqty: values?.lotQty,
            contractDate: values?.contractDate,
            laycandate: values?.laycanDate,
            pricePerBag: +values?.pricePerBag,
        };
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
export const fetchMotherVesselLists = (accId, buUnId, portId, getMotherVesselDDL) => {
    getMotherVesselDDL(`/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buUnId}&PortId=${portId}`)
}