import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";

// Get landing data for customs duty
export const getLandingData = async (
  accId,
  buId,
  shipmentId,
  PoNo,
  pageSize,
  pageNo,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    let query = `imp/CustomDuty/GetCustomDutyLandingPasignation?accountId=${accId}&businessUnitId=${buId}`;
    if (PoNo) {
      query += `&search=${PoNo}`;
    }
    if (shipmentId) {
      query += `&shipmentId=${shipmentId}`;
    }
    query += `&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`;
    let res = await axios.get(query);
    // console.log("res custom duty", res?.data);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};

// Get single data for customs duty
export const getSingleData = async (customsDutyId, setter, setLoading) => {
  setLoading(true);
  try {
    let res = await axios.get(
      `/imp/CustomDuty/GetCustomDutyById?customDutyId=${customsDutyId}`
    );
    setLoading(false);
    let modifyData = {
      ...res?.data,
      boeNo: res?.data?.boENumber,
      boeDate: _dateFormatter(res?.data?.boEDate),
      paymentDate: _dateFormatter(res?.data?.paymentDate),
      invoiceAmount: res?.data?.invoiceAmount,
      exRate: res?.data?.exRate,
      fineBDT: res?.data?.fineBdt,
      AITExemptionBDT: res?.data?.aitExemptionBdt,
      docProcessFee: res?.data?.docProcessFee,
      CnFIncomeTax: res?.data?.cnfIncomeTax,
      cnfVat: res?.data?.cnfVat,
      scanning: res?.data?.scanning,
      cnfAgencyDDL: {
        value: res?.data?.cnFPartnerId,
        label: res?.data?.cnFPartnerName,
      },
      custom: { value: res?.data?.customId, label: res?.data?.customsName },
      paidBy: { value: res?.data?.paidById, label: res?.data?.paidByName },
      assessmentValue: res?.data?.numAssesmentValueBdt,
      customDuty: res?.data?.numCustomDuty,
      regulatoryDuty: res?.data?.numRd,
      supplementaryDuty: res?.data?.numSd,
      vat: res?.data?.numVat,
      ait: res?.data?.numAit,
      advanceTradeVat: res?.data?.numAtv,
      psi: res?.data?.numPsi,
      at: res?.data?.numAt,
      bank: { value: res?.data?.bankId, label: res?.data?.bankName },
      instrumentType: {
        value: res?.data?.paymentInstrumentBy,
        label: res?.data?.paymentInstrumentByName,
      },
      grandTotal: res?.data?.grandTotal,
      invoiceAmountBDT: +res?.data?.invoiceAmountBDT,
    };
    setter(modifyData);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};

// Create Customs Duty
export const CreateCustomsDuty = async (
  values,
  cb,
  profileData,
  buId,
  PoNo,
  LcNo,
  poID,
  lcID,
  shipmentId,
  shipmentCode,
  sbuID,
  plantID
) => {
  const payload = dataSetForCreate(
    values,
    profileData,
    buId,
    PoNo,
    LcNo,
    poID,
    lcID,
    shipmentId,
    shipmentCode,
    sbuID,
    plantID
  );
  try {
    const res = await axios.post(`/imp/CustomDuty/CreateCustomDuty`, payload);
    if (res.status === 200) {
      toast.success(res?.message || "Created Successfully");
      cb();
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
  }
};

// DataSet For Create
const dataSetForCreate = (
  values,
  profileData,
  buId,
  PoNo,
  LcNo,
  poID,
  lcID,
  shipmentId,
  shipmentCode,
  sbuID,
  plantID
) => {
  const payload = {
    accountId: profileData?.accountId,
    businessUnitId: buId,
    sbuId: sbuID,
    plantId: plantID,
    poId: poID,
    poNumber: PoNo,
    lcId: lcID,
    lcNumber: LcNo,
    shipmentId: shipmentId,
    shipmentCode: shipmentCode,
    paidById: values?.paidBy?.value || 0,
    bankId: values?.bank?.value || 0,
    customId: values?.custom?.value || 0,
    paymentInstrumentBy: values?.instrumentType?.value || 0,
    boEnumber: values?.boeNo || "",
    boEdate: values?.boeDate,
    paymentDate: values?.paymentDate,
    fineBdt: values?.fineBDT || 0,
    aitexemptionBdt: values?.AITExemptionBDT || 0,
    exRate: values?.exRate || 0,
    docProcessFee: values?.docProcessFee || 0,
    cnfIncomeTax: values?.CnFIncomeTax || 0,
    cnfVat: values?.cnfVat || 0,
    scanning: values?.scanning || 0,
    customDutyDocumentId: "",
    lastActionBy: profileData?.employeeId,
    grandTotal: values?.grandTotal || 0,
    invoiceAmount: values?.invoiceAmount || 0,
    cnFpartnerId: values?.cnfAgencyDDL.value,
    customsPartnerId: values?.custom?.value || 0,
    numAssesmentValueBdt: +values?.assessmentValue || 0,
    numCustomDuty: +values?.customDuty || 0,
    numRd: +values?.regulatoryDuty || 0,
    numSd: +values?.supplementaryDuty || 0,
    numVat: +values?.vat || 0,
    numAit: +values?.ait || 0,
    numAtv: +values?.advanceTradeVat || 0,
    numPsi: +values?.psi || 0,
    numAt: +values?.at || 0,
    invoiceAmountBDT: +values?.invoiceAmountBDT || 0,
    is78Guarantee: values?.is78Guarantee,
    guarantee78Amount: values?.is78Guarantee ? values?.guarantee78Amount : 0,
  };
  return payload;
};

// Edit Customs Duty
export const EditCustomsDuty = async (
  cdId,
  values,
  profileData,
  PoNo,
  LcNo,
  shipmentId,
  shipmentCode,
  hsCode
) => {
  const payload = dataSetForEdit(
    cdId,
    values,
    profileData,
    PoNo,
    LcNo,
    shipmentId,
    shipmentCode,
    hsCode
  );
  try {
    const res = await axios.put(`/imp/CustomDuty/EditCustomDuty`, payload);
    if (res.status === 200) {
      toast.success(res?.message || "Updated Successfully");
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
  }
};

// Dataset For Edit
const dataSetForEdit = (
  cdId,
  values,
  profileData,
  PoNo,
  LcNo,
  shipmentId,
  shipmentCode,
  hsCode

) => {
  const payload = {
    objHeader: {
      customDutyId: cdId,
      paidById: values?.paidBy?.value,
      bankId: values?.bank?.value,
      customId: values?.custom?.value,
      paymentInstrumentBy: values?.instrumentType?.value,
      boENumber: values?.boeNo,
      boEDate: values?.boeDate,
      paymentDate: values?.paymentDate,
      docProcessFee: values?.docProcessFee,
      aitExemptionBdt: values?.AITExemptionBDT,
      exRate: values?.exRate,
      fineBdt: +values?.fineBDT,
      cnfIncomeTax: values?.CnFIncomeTax,
      cnfVat: values?.cnfVat,
      scanning: values?.scanning,
      // totalCustomDuty: subTotal,
      customDutyDocumentId: "string",
      is78Guarantee: values?.is78Guarantee,
      guarantee78Amount: values?.is78Guarantee ? values?.guarantee78Amount : 0,
      lastActionBy: profileData?.employeeId,
      // grandTotal: grandTotal0,
      // refundBy: refundBy,
      // refundDate: refundDate,
    },
    objRow: [
      {
        rowId: 0,
        poNumber: PoNo,
        lcNumber: LcNo,
        shipmentId: shipmentId,
        shipmentCode: shipmentCode,
        hscode: hsCode,
        assesmentTk: +values?.assessmentValue,
        customDuty: +values?.customDuty,
        // totalDuty: totalDuty,
        regulatoryDuty: +values?.regulatoryDuty,
        supplimentaryDuty: +values?.supplementaryDuty,
        vat: +values?.vat,
        ait: +values?.ait,
        advanceTradeVat: +values?.advanceTradeVat,
        psi: +values?.psi,
        at: +values?.at,
        // dutyVat: dutyVat,
        // otherVat: otherVat,
        // otherCharges: otherCharges,
      },
    ],
  };
  return payload;
};

//doc release status check
export const docReleaseStatusCheck = (
  accId,
  businessUnitId,
  poId,
  shipmentId
) => {
  return axios.get(
    `/imp/CustomDuty/GetDocRelaseStatus?accountId=${accId}&businessUnitId=${businessUnitId}&poId=${poId}&shipmentId=${shipmentId}`
  );
};
//bank ddl
export const GetBankDDL = async (setter, accId, businessUnitId) => {
  try {
    const res = await axios.get(
      `imp/ImportCommonDDL/GetBankListDDL?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

// Get Shipment DDL
export const getShipmentDDL = async (
  accountId,
  businessUnitId,
  searchValue,
  setter
) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetShipmentListForAllCharge?accountId=${accountId}&businessUnitId=${businessUnitId}&search=${searchValue}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get HS Code By ShipmentId DDL
export const GetHsCodeByShipmentIdDDL = async (
  poNumber,
  shipmentCode,
  setter
) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetHsCodeFromShipmentDDL?poNumber=${poNumber}&shipmentCode=${shipmentCode}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get Customs Name DDL
export const GetCustomsNameDDL = async (setter, accId, businessUnitId) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetCustomsName?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get Paid By DDL
export const GetPaidByDDL = async (setter) => {
  try {
    let res = await axios.get(`/imp/ImportCommonDDL/GetPaidByDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get Instrument Type DDL
export const GetInstrumentTypeDDL = async (setter) => {
  try {
    let res = await axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const GetHSCodeInfoForCustomDuty = async (
  accountId,
  businessUnitId,
  poId,
  shipmentId,
  setter
) => {
  try {
    let res = await axios.get(
      `/imp/CustomDuty/GetHSCodeInfoForCustomDuty?accountId=${accountId}&businessUnitId=${businessUnitId}&poId=${poId}&shipmentId=${shipmentId}`
    );
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const validationSchema = Yup.object().shape({
  is78Guarantee: Yup.boolean(),
  guarantee78Amount: Yup.number().when("is78Guarantee", {
    is: true,
    then: Yup.number()
      .required("Guarantee78 Amount is required")
      .positive("Guarantee78 Amount Must be positive"),
    otherwise: Yup.number(),
  }),
  boeNo: Yup.string().when("is78Guarantee", {
    is: false,
    then: Yup.string().required("BoE No is required"),
    otherwise: Yup.string(),
  }),
  exRate: Yup.number().when("is78Guarantee", {
    is: false,
    then: Yup.number()
      .required("Exchange Rate is required")
      .positive("Exchange Rate Must be positive"),
    otherwise: Yup.number(),
  }),
  // invoiceAmountBDT: Yup.string().required("Invoice Amount BDT is required"),
  cnfAgencyDDL: Yup.object().shape({
    value: Yup.string().required("CnF Agency is required"),
  }),

  custom: Yup.object().shape({
    label: Yup.string().required("Custom is required"),
    value: Yup.string().required("Custom is required"),
  }),
  paidBy: Yup.object().when("is78Guarantee", {
    is: false,
    then: Yup.object().shape({
      label: Yup.string().required("Paid By is required"),
      value: Yup.string().required("Paid By is required"),
    }),
    otherwise: Yup.object(),
  }),
  assessmentValue: Yup.number()
    .positive("Assessment Value Must be a Positive Number")
    .nullable(),

  customDuty: Yup.number()
    .positive("Custom Duty Must be a Positive Number")
    .nullable(),

  regulatoryDuty: Yup.number()
    .positive("Regulatory Duty Must be a Positive Number")
    .nullable(),

  supplementaryDuty: Yup.number()
    .positive("Supplementary Duty Must be a Positive Number")
    .nullable(),

  vat: Yup.number()
    .positive("VAT Must be a Positive Number")
    .nullable(),

  bank: Yup.string().when("paidBy", {
    is: (data) => data?.label === "Own Cheque",
    then: Yup.string().required("Bank is required"),
  }),

  instrumentType: Yup.string().when("paidBy", {
    is: (data) => data?.label === "Own Cheque",
    then: Yup.string().required("Instrument Type is required"),
  }),

  invoiceAmount: Yup.number().positive(
    "Invoice Amount Must be a Positive Number"
  ),
  ait: Yup.number()
    .positive("AIT Must be a Positive Number")
    .nullable(),
  advanceTradeVat: Yup.number()
    .positive("Advance TradeVat Must be a Positive Number")
    .nullable(),
  psi: Yup.number()
    .positive("PSI Must be a Positive Number")
    .nullable(),
  at: Yup.number()
    .positive("AT Must be a Positive Number")
    .nullable(),
  fineBDT: Yup.number()
    .positive("Fine BDT Must be a Positive Number")
    .nullable(),
  AITExemptionBDT: Yup.number()
    .positive("AITExemptionBDT Must be a Positive Number")
    .nullable(),
  docProcessFee: Yup.number()
    .positive("DOC Process Fee Must be a Positive Number")
    .nullable(),
  CnFIncomeTax: Yup.number()
    .positive("CnF Income Tax Must be a Positive Number")
    .nullable(),
  cnfVat: Yup.number()
    .positive("CnF VAT Must be a Positive Number")
    .nullable(),
  scanning: Yup.number()
    .positive("Scanning Must be a Positive Number")
    .nullable(),
  grandTotal: Yup.number().positive("Grand Total Must be a Positive Number"),
});

// Get Bank List DDL
// export const GetBankListDDL = async (setter) => {
//   try {
//     let res = await axios.get(`/imp/ImportCommonDDL/GetBankListDDL`);
//     if (res?.status === 200) {
//       setter(res?.data);
//     }
//   } catch (err) {
//     toast.warning(err?.response?.data?.message);
//   }
// };

//cnf agency ddl
// https://localhost:44396/imp/ImportCommonDDL/GetCnFAgencyList?accountId=2&businessUnitId=164
export const GetCNFAgencyDDL = async (accountId, businessUnitId, setter) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetCnFAgencyList?accountId=${accountId}&businessUnitId=${businessUnitId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get HsCode Info
// export const GetHsCodeInfo = async (
//   hsCode,
//   assValue,
//   setFieldValue,
//   setLoading
// ) => {
//   setLoading(true);
//   try {
//     let res = await axios.get(
//       `/imp/ImportCommonDDL/GetHsCodeInfo?hsCode=${hsCode}`
//     );
//     if (res?.status === 200) {
//       // Destructuring The response
//       const { cd, rd, sd, vat, ait, psi } = res?.data;

//       // Calculation for Customs Duty
//       const customDuty = assValue ? ((assValue * cd) / 100).toFixed(4) : "";
//       const regulatoryDuty = assValue ? ((assValue * rd) / 100).toFixed(4) : "";
//       const supplementaryDuty = assValue
//         ? (
//             assValue * (1 + cd / 100) +
//             (((assValue * rd) / 100) * sd) / 100
//           ).toFixed(4)
//         : "";
//       const VAT = assValue
//         ? (
//             ((assValue * (1 + cd / 100) + (assValue * rd) / 100) *
//               (1 + sd / 100) *
//               vat) /
//             100
//           ).toFixed(4)
//         : "";
//       const AIT = assValue ? ((assValue * ait) / 100).toFixed(4) : "";
//       const ATV = 0;
//       const PSI = assValue ? ((assValue * psi) / 100).toFixed(4) : "";
//       const AT = assValue
//         ? (((assValue + (assValue * cd) / 100) * 5) / 100).toFixed(4)
//         : "";
//       // Set Fields Value
//       setFieldValue("customDuty", customDuty ? customDuty : "");
//       setFieldValue("regulatoryDuty", regulatoryDuty);
//       setFieldValue("supplementaryDuty", supplementaryDuty);
//       setFieldValue("vat", VAT);
//       setFieldValue("ait", AIT);
//       setFieldValue("advanceTradeVat", ATV);
//       setFieldValue("psi", PSI);
//       setFieldValue("at", AT);
//       setLoading(false);
//     }
//   } catch (err) {
//     toast.warning(err?.response?.data?.message);
//     setLoading(false);
//   }
// };
