import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";
//landing api;

// https://localhost:44396/imp/LetterOfCredit/LetterOfCreditLandingPasignation?accountId=2&businessUnitId=164&searchTerm=420071&bankId=2&fromDate=2021-06-26%2000%3A00%3A00.000&toDate=2021-06-27%2000%3A00%3A00.000&PageSize=100&PageNo=1&viewOrder=asc
export const getLandingData = async (
  accountId,
  businessUnitId,
  searchTerm,
  bankId,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize
) => {
  try {
    let query = `/imp/LetterOfCredit/LetterOfCreditLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}`;
    if (searchTerm) {
      query += `&searchTerm=${searchTerm}`;
    }
    if (bankId) {
      query += `&bankId=${bankId}`;
    }
    if (fromDate) {
      query += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      query += `&toDate=${toDate}`;
    }
    query += `&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`;
    setLoading(true);
    const res = await Axios.get(query);

    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};
// https://localhost:44396/imp/LetterOfCredit/GetLetterOfCreditByPOnumberOrLCNumber?accountId=2&businessUnit=164&search=LC-420071
// export const checkDuplicateLc = async (
//   accountId,
//   businessUnit,
//   searchTerm,
//   cb
// ) => {
//   try {
//     let query = `/imp/LetterOfCredit/GetLetterOfCreditByPOnumberOrLCNumber?accountId=${accountId}&businessUnit=${businessUnit}&search=${searchTerm}`;
//     const res = await Axios.get(query);
//     if (res) {
//       toast.error("LC is created on this po");
//     }
//   } catch (error) {
//     cb();
//   }
// };

export const marginTypeDDLArr = [
  { value: 1, label: 'Cash Margin', },
  { value: 2, label: 'Fdr Margin' }
]

//get single data;
export const getSingleData = async (id, setter, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/imp/LetterOfCredit/GetLetterOfCreditById?LCId=${id}`
    );
    setDisabled(false);
    const payload = {
      PIAmountBDT: res?.data?.numTotalPiamountBDT,
      poId: res?.data?.poId,
      exchangeRate: res?.data?.numExchangeRate,
      PIAmountFC: res?.data?.numTotalPiamountFC,
      accountId: res?.data?.accountId,
      lastActionBy: res?.data?.lastActionBy,
      businessUnit: {
        value: res?.data?.businessUnitId,
        label: res?.data?.businessUnitName,
      },
      lcid: res?.data?.lcid,
      subPonumber: res?.data?.subPonumber,
      lcNo: res?.data?.lcnumber,
      lcDate: _dateFormatter(res?.data?.dteLcdate),
      lastShipmentDate: _dateFormatter(res?.data?.dteLastShipmentDate),
      lcExpiredDate: _dateFormatter(res?.data?.dteLcexpireDate),
      encoTerms: {
        value: res?.data?.incoTerms,
        label: res?.data?.incoTermsName,
      },
      materialType: {
        value: res?.data?.materialTypeId,
        label: res?.data?.materialTypeName,
      },
      lcType: { value: res?.data?.lctypeId, label: res?.data?.lctypeName },
      origin: { value: res?.data?.originId, label: res?.data?.originName },
      loadingPort: res?.data?.loadingPortName,
      finalDestination: {
        value: res?.data?.finalDestinationId,
        label: res?.data?.finalDestination,
      },
      tolarance: res?.data?.numTolarance,
      currency: {
        label: res?.data?.currencyName,
        value: res?.data?.currencyId,
      },
      totalPIAmount: res?.data?.numTotalPiamount,
      lcTenor: res?.data?.lcTenor,
      pgAmount: res?.data?.numPgamount,
      pgDueDate: _dateFormatter(res?.data?.dtePgdueDate),
      totalBankCharge: res?.data?.totalBankCharge,
      vatOnCharge: res?.data?.vatOnBankCharge,
      attachment: res?.data?.openingLcdocumentId,
      indemnityBond: res?.data?.indemnityBond,
      bondLicense: res?.data?.bondLicense,
      duration: _dateFormatter(res?.data?.duration),
      poNo: res?.data?.ponumber,
      // poNo: { label: res?.data?.ponumber, value: 1 },
      dueDate: _dateFormatter(res?.data?.dueDate),
      bankName: {
        label: res?.data?.bankName,
        value: res?.data?.bankId,
      },
      bankAccount: res?.data?.bankAccountNo
        ? {
          value: res?.data?.bankAccountId,
          label: res?.data?.bankAccountNo,
        }
        : "",
      description: res?.data?.description,
      // lcMarginPercent: res?.data?.lcMarginPercentage || "",
      lcMarginValue: res?.data?.lcMarginValue || "",
      lcMarginDueDate: res?.data?.lcMarginDueDate
        ? _dateFormatter(res?.data?.lcMarginDueDate)
        : "",
    };

    setter(payload);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

// function addDaysToDate(date, days) {
//   let res = new Date(date);
//   res.setDate(res.getDate() + days);
//   return res;
// }
export function removeDaysToDate(date, days) {
  let res = new Date(date);
  res.setDate(res.getDate() - days);
  return res;
}

//create data;
export const createLCOpen = async (
  setDisabled,
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage,
  cb
) => {
  const obj = createPayloadChange(
    values,
    profileData,
    selectedBusinessUnit,
    uploadImage
  );
  try {
    setDisabled(true);
    const res = await Axios.post(
      `/imp/LetterOfCredit/CreateLetterOfCredit`,
      obj
    );
    setDisabled(false);
    // console.log(res,"res");
    toast.success(res?.message || "Create successfully");
    cb();
  } catch (error) {
    setDisabled(false);
    // console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

const createPayloadChange = (
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage
) => {
  const payload = {
    lcTypeName: values?.lcType?.label,
    countryOriginName: values?.origin?.label,
    currencyName: values?.currency?.label,
    description: values?.description,
    lcafNo: "",
    applicationDate: _dateFormatter(new Date()),
    poId: values?.poId,
    numExchangeRate: values?.exchangeRate,
    numTotalPiamountFC: +values?.PIAmountFC,
    numTotalPiamountBDT: +values?.PIAmountBDT,
    accountId: profileData?.accountId,
    businessUnitId: selectedBusinessUnit?.value,
    sbuId: values?.sbuId,
    plantId: values?.plantId,
    ponumber: values?.poNo,
    lcnumber: values?.lcNo,
    subPonumber: "",
    incoTerms: values?.encoTerms?.value,
    materialTypeId: values?.materialType?.value,
    bankName: values?.bankName?.label,
    bankId: values?.bankName?.value,
    lctypeId: values?.lcType?.value,
    dteLcdate: values?.lcDate,
    dteLastShipmentDate: _dateFormatter(values?.lastShipmentDate),
    dteLcexpireDate: _dateFormatter(values?.lcExpiredDate),
    originId: values?.origin?.value,
    loadingPortName: values?.loadingPort,
    numTolarance: +values?.tolarance,
    currencyId: values?.currency?.value,
    totalBankCharge: values?.totalBankCharge,
    vatOnBankCharge: values?.vatOnCharge,
    lcTenor: values?.lcTenor,
    numPgamount: +values?.pgAmount,
    dtePgdueDate: values?.pgDueDate,
    // indemnityBond: values?.indemnityBond || false,
    indemnityBond: false,
    // bondLicense: values?.bondLicense || false,
    bondLicense: false,
    // duration: values?.duration,
    duration: null,
    openingLcdocumentId: uploadImage[0]?.id || "",
    lastActionBy: profileData?.userId,
    finalDestinationId: values?.finalDestination?.value,
    dueDate: values?.dueDate,
    bankAccountId: values?.bankAccount?.value || 0,
    bankAccountNo: values?.bankAccount?.label || "",
    lcMarginPercentage: +values?.lcMarginPercent || 0,
    lcMarginValue: +values?.lcMarginValue || 0,
    lcMarginDueDate: values?.lcMarginDueDate || null,
    marginType: values?.marginType?.value,
    numInterestRate: values?.numInterestRate || 0
  };
  return payload;
};

//update data;
export const updateLCOpen = async (
  setDisabled,
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage
  // cb
) => {
  const obj = updatePayloadChange(
    values,
    profileData,
    selectedBusinessUnit,
    uploadImage
  );
  try {
    setDisabled(true);
    let res = await Axios.put(`/imp/LetterOfCredit/EditLetterOfCredit`, obj);
    setDisabled(false);
    toast.success(res?.message || "Update successfully");
    // cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const updatePayloadChange = (
  values,
  profileData,
  selectedBusinessUnit,
  uploadImage
) => {
  const payload = {
    description: values?.description,
    numPIAmountBDT: values?.PIAmountBDT,
    numPIAmountFC: values?.PIAmountFC,
    numExchangeRate: values?.exchangeRate,
    lcId: values?.lcid,
    accountId: profileData?.accountId,
    businessUnitId: selectedBusinessUnit?.value,
    ponumber: values?.poNo,
    lcnumber: values?.lcNo,
    subPonumber: "",
    incoTerms: values?.encoTerms?.value,
    materialTypeId: values?.materialType?.value,
    bankId: values?.bankName?.value,
    lctypeId: values?.lcType?.value,
    dteLcdate: values?.lcDate,
    dteLastShipmentDate: _dateFormatter(values?.lastShipmentDate),
    dteLcexpireDate: _dateFormatter(values?.lcExpiredDate),
    originId: values?.origin?.value,
    loadingPortName: values?.loadingPort,
    numTolarance: +values?.tolarance,
    currencyId: values?.currency?.value,
    totalBankCharge: values?.totalBankCharge,
    vatOnBankCharge: values?.vatOnCharge,
    lcTenor: values?.lcTenor,
    numPgamount: +values?.pgAmount,
    dtePgdueDate: values?.pgDueDate,
    // indemnityBond: values?.indemnityBond || false,
    indemnityBond: false,
    // bondLicense: values?.bondLicense || false,
    bondLicense: false,
    // duration: values?.duration,
    duration: null,
    openingLcdocumentId: uploadImage[0]?.id || values?.attachment || "",
    finalDestinationId: values?.finalDestination?.value,
    dueDate: values?.dueDate,
    bankAccountId: values?.bankAccount?.value || 0,
    bankAccountNo: values?.bankAccount?.label || "",
    lcMarginPercentage: +values?.lcMarginPercent || 0,
    lcMarginValue: +values?.lcMarginValue || 0,
    lcMarginDueDate: values?.lcMarginDueDate || null,
  };
  return payload;
};

//Image Attachment
export const empAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success(data?.message || "Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

//Dropdown loading start

//LC type ddl
export const LCTypeDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await Axios.get(`/imp/ImportCommonDDL/GetLCTypeDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};
//Currency ddl
export const currencyTypeDDLAction = async (setter) => {
  try {
    const res = await Axios.get(`/imp/ImportCommonDDL/GetCurrencyTypeDDL`);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};
//Origin ddl
export const originTypeDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await Axios.get(`/imp/ImportCommonDDL/GetCountryNameDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

//Enco Type ddl
export const encoItemDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await Axios.get(`/imp/ImportCommonDDL/GetIncoTermsDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};
//Origin ddl
export const materialTypeDDLAction = async (setDisabled, setter) => {
  try {
    setDisabled(true);
    const res = await Axios.get(`/imp/ImportCommonDDL/GetMaterialTypeDDL`);
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};
//port ddl
export const PortDDLAction = async (
  accId,
  businessUnitId,
  setDisabled,
  setter
) => {
  try {
    setDisabled(true);
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetPortName?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    setDisabled(false);
    setter(res?.data);
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};
export const GetBankDDL = async (setter, accId, businessUnitId) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetBankListDDL?accountId=${accId}&businessUnitId=${businessUnitId}`
    );
    // const res = await Axios.get(`/imp/ImportCommonDDL/GetBankListDDL`);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

//calculation form landing api;
export const getCalculationFormLandingForm = async (
  businessUnitId,
  values,
  setter,
  setLoading
) => {
  try {
    // console.log(values, "calculation form landing");
    setLoading(true);
    const res = await Axios.get(
      `/imp/FormulaForCalculation/GetFormulaForLcBankCharge?businessUnitId=${businessUnitId}&poId=${values?.poId
      }&tenorDays=${values?.lcTenor
      }&poTotalFc=${+values?.PIAmountFC}&toleranceRate=${values?.tolarance
      }&excRate=${values?.exchangeRate}&bankId=${values?.bankName?.value
      }&type=${values?.lcType?.value}`
    );
    setLoading(false);

    // console.log(res)
    let newObj = {};
    for (let index = 0; index < res?.data.length; index++) {
      const element = res?.data[index];
      newObj[element.strType] = element.monAmount;
    }
    // console.log("newObj", newObj);
    setter(newObj && newObj);
    setter({
      swift: newObj["Swift Charge"],
      stamp: newObj["Stamp Charge"],
      stationary: newObj["Stationary Charge"],
      stampChargeforOther: newObj["Others Charge"],
      lcConfirm: 0,
      tenorQuarter: 0,
      vatRate: 0,
    });
  } catch (error) {
    setLoading(false);
    toast.error(error.response.data.message);
  }
};

//https://localhost:44396/imp/LetterOfCredit/GetPOForLCOpen?accountId=2&businessUnitId=164&POId=755

export const getPoForLcOpen = (accountId, businessUnitId, poId, cb) => {
  try {
    let query = `/imp/LetterOfCredit/GetPOForLCOpen?accountId=${accountId}&businessUnitId=${businessUnitId}&POId=${poId}`;
    return Axios.get(query);

    // console.log(res, "res");
  } catch (error) {
    // cb();
  }
};

// currency load by po id
export const currencyLoadByPoId = async (
  setter,
  accId,
  businessUnitId,
  poId
) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetCurrencyFromInsuranceDDL?accountId=${accId}&businessUnitId=${businessUnitId}&POId=${poId}`
    );
    // let modifyData = { ...initFormData, currency: res?.data[0] };
    setter({ currency: res?.data[0] });
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setter([]);
  }
};

//Dropdown loading finish

export const validationSchema = Yup.object().shape({
  // poNo: Yup.object().shape({
  //   value: Yup.string().required("PO No is required"),
  // }),
  lcNo: Yup.string().required("LC No is required"),
  encoTerms: Yup.object().shape({
    value: Yup.string().required("Enco Terms is required"),
  }),
  materialType: Yup.object().shape({
    value: Yup.string().required("Material Type is required"),
  }),
  lcType: Yup.object().shape({
    value: Yup.string().required("LC Type is required"),
  }),
  bankName: Yup.object().shape({
    value: Yup.string().required("Bank Name is required"),
  }),
  // bankAccount: Yup.object().shape({
  //   value: Yup.string().required("Bank Account is required"),
  //   label: Yup.string().required("Bank Account is required"),
  // }),
  origin: Yup.object().shape({
    value: Yup.string().required("Origin is required"),
  }),
  loadingPort: Yup.string().required("Loading Port is required"),
  finalDestination: Yup.object().shape({
    value: Yup.string().required("Final Destination is required"),
  }),
  // tolarance: Yup.number()
  //   .positive("Tolarance Must Be Positive")
  //   .required("Tolarance is required"),
  currency: Yup.object().shape({
    value: Yup.string().required("Currency is required"),
  }),

  PIAmountFC: Yup.string()
    // .positive("PI Amount Must Be Positive")
    .required("PI Amount is required"),

  lcTenor: Yup.number()
    .integer("Must be Integer Number")
    .positive("LC Tenor is positive"),
  exchangeRate: Yup.number().required("Exchange Rate is required"),
  PIAmountBDT: Yup.string().required("PI Amount BDT Number is required"),
  // pgAmount: Yup.number().positive("PG Amount is always positive"),
  pgDueDate: Yup.date(),
  totalBankCharge: Yup.number()
    .positive("Total bank Charge is always positive")
    .required("Total Bank Charge is Required"),
  vatOnCharge: Yup.number()
    .positive("VAT On Charge is always positive")
    .required("VAT On Charge is Required"),
  // duration: Yup.date().required("Duration Date is required"),
  // lcMarginPercent: Yup.number()
  //   .required("LC Margin is required"),
  lcMarginValue: Yup.number().required("LC Margin Value is required"),
  lcMarginDueDate: Yup.date().required("LC Margin Due Date is required"),
  marginType: Yup.object().shape({
    value: Yup.string().required("Margin type is required"),
  }),
  numInterestRate: Yup.number().min(0, 'Must be above 0').max(100, 'Must be below 100')
});
