import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

// Get data for form
export const GetDataForForm = async (accId, buId, PoNo, setter) => {
  try {
    const res = await Axios.get(
      `/imp/LetterOfCredit/GetLetterOfCreditForLCAmendment?accountId=${accId}&businessUnit=${buId}&search=${PoNo}`
    );
    if (res.status === 200) {
      const data = {
        lcType: {
          value: res?.data?.lctypeId,
          label: res?.data?.lctypeName,
        },
        LCExpiredDate: _dateFormatter(res?.data?.dteLcexpireDate),
        lastShipmentDate: _dateFormatter(res?.data?.dteLastShipmentDate),
        dueDate: _dateFormatter(res?.data?.dueDate),
        incoTerms: {
          value: res?.data?.incoTerms,
          label: res?.data?.incoTermsName,
        },
        tolarencePercentage: res?.data?.numTolarance,
        LCTenorDays: res?.data?.lcTenor,
        totalAmendmentCharge:
          res?.data?.totalAmendmentCharge === 0
            ? ""
            : res?.data?.totalAmendmentCharge,
        VATOnAmendmentCharge:
          res?.data?.vatOnAmendmentCharge === 0
            ? ""
            : res?.data?.vatOnAmendmentCharge,
        totalPIAmount: res?.data?.numTotalPiamount,
        exchangeRate: res?.data?.numExchangeRate,
        currency: {
          label: res?.data?.currencyName,
          value: res?.data?.currencyId,
        },
        PIAmountBDT: res?.data?.numTotalPiamountBDT,
      };
      setter(data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

// Get Item List Details By POId
export const GetItemListDetailsByPOId = async (accId, buId, PoNo, setter) => {
  try {
    const res = await Axios.get(
      `/imp/LCAmendment/GetItemListDetailsByPOId?accountId=${accId}&businessUintId=${buId}&POName=${PoNo}`
    );
    if (res.status === 200) {
      let newData = res.data.map((data) => {
        return {
          ...data,
          price: data?.orderQty * data?.basePrice,
          remaining: data?.orderQty - data?.shippedQty,
          poOrderQuantity: data?.orderQty,
          orderQty: 0,
        };
      });
      setter(newData);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

//create data;
export const createLCAmendment = async (
  setDisabled,
  values,
  profileData,
  LcNo,
  PoNo,
  LcId,
  selectedBusinessUnit,
  uploadImage,
  cb,
  itemList,
  PIAmount,
  poId,
  sbuID,
  plantID
) => {
  const obj = createPayloadChange(
    values,
    profileData,
    LcNo,
    PoNo,
    LcId,
    selectedBusinessUnit,
    uploadImage,
    itemList,
    PIAmount,
    poId,
    sbuID,
    plantID
  );
  setDisabled(true);
  try {
    await Axios.post(`/imp/LCAmendment/CreateLCAmendment`, obj);
    setDisabled(false);
    toast.success(
      "Create Successfully And Please Create Insurance Amendment now"
    );
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const saveLcDocAmendmentRowApi = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    await Axios.post(`/imp/LetterOfCredit/SaveLcDocAmendmentRow`, payload);
    setDisabled(false);
    toast.success(
      "Create Successfully And Please Create Insurance Amendment now"
    );
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const createPayloadChange = (
  values,
  profileData,
  LcNo,
  PoNo,
  LcId,
  selectedBusinessUnit,
  uploadImage,
  itemList,
  PIAmount,
  poId,
  sbuID,
  plantID
) => {
  const payload = {
    header: {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      poId: poId,
      poNumber: PoNo,
      lcId: LcId,
      lcNumber: LcNo,
      sbuId: sbuID,
      plantId: plantID,
      lCtypeId: values?.lcType?.value,
      lcExpireDate: values?.LCExpiredDate,
      lastShipmentDate: values?.lastShipmentDate,
      incoTermId: values?.incoTerms?.value,
      tolarance: values?.tolarencePercentage,
      lcTenorDays: values?.LCTenorDays,
      currencyId: values?.currency?.value,
      totalAmandmentCharge: +values?.totalAmendmentCharge,
      vatOnAmandmentCharge: +values?.VATOnAmendmentCharge,
      totalPIAmountFC: PIAmount,
      numExchangeRate: +values?.exchangeRate,
      totalPIAmountBDT: values?.PIAmountBDT,
      documentId: uploadImage[0]?.id || "",
      lastActionBy: profileData?.employeeId,
      dueDate: values?.dueDate,
    },
    row: itemList,
  };
  return payload;
};

//landing api;
export const getLandingData = async (
  accountId,
  businessUnitId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  searchTerm,
  searchValue = false
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/imp/LCAmendment/LCAmendmentLandingPasignation?accountId=${accountId}&businessUnitId=${businessUnitId}&searchTerm=${searchTerm}&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    // toast.error(error?.response?.data?.message);
  }
};

//get single data;
export const getSingleData = async (id, setter, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/imp/LCAmendment/GetLCAmendmentById?LCAmendmentId=${id}`
    );
    if (res.status === 200) {
      const payload = {
        lcType: {
          value: res?.data?.header?.lCtypeId,
          label: res?.data?.header?.lCtypeName,
        },
        LCExpiredDate: _dateFormatter(res?.data?.header?.lcExpireDate),
        lastShipmentDate: _dateFormatter(res?.data?.header?.lastShipmentDate),
        incoTerms: {
          value: res?.data?.header?.incoTermId,
          label: res?.data?.header?.incoTermsName,
        },
        tolarencePercentage: res?.data?.header?.tolarance,
        LCTenorDays: res?.data?.header?.lcTenorDays,
        totalAmendmentCharge: res?.data?.header?.totalAmandmentCharge,
        VATOnAmendmentCharge: res?.data?.header?.vatOnAmandmentCharge,
        totalPIAmount: res?.data?.header?.totalPIAmountFC,
        attachment: res?.data?.header?.documentId,
        currency: {
          value: res?.data?.header?.currencyId,
          label: res?.data?.header?.currencyName,
        },
        PIAmountBDT: res?.data?.header?.totalPIAmountBDT,
        exchangeRate: res?.data?.header?.numExchangeRate,
        dueDate: _dateFormatter(res?.data?.header?.dueDate),
      };
      setter(payload);
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//update data;
export const updateLCAmendment = async (
  setDisabled,
  singleData,
  values,
  selectedBusinessUnit,
  uploadImage
) => {
  setDisabled(true);
  const obj = updatePayloadChange(
    singleData,
    values,
    selectedBusinessUnit,
    uploadImage
  );
  try {
    await Axios.put(`/imp/LCAmendment/EditLCAmendment`, obj);
    setDisabled(false);
    toast.success("Update successfully");
    // cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

const updatePayloadChange = (
  singleData,
  values,
  uploadImage
  // selectedBusinessUnit,
) => {
  const payload = {
    accountId: singleData?.accountId,
    businessUnitId: values?.businessUnit?.value,
    // lcnumber: lcNo,
    lcnumber: singleData?.lcNo,
    reason: values?.reason,
    numCommission: values?.commission,
    numCharges: values?.charges,
    numSwift: values?.swift,
    numStationary: values?.stationary,
    numVat: values?.vat,
    dteLcexpireDate: values?.LCExpireDate,
    dteLastShipDate: values?.lastShipDate,
    lcamendmentDocumentId: values?.attachment || "",
    dtePaymentDate: values?.paymentDate,
    lastActionBy: singleData?.userId,
    numPiamount: values?.PIAmount,

    active: values?.active,
    dteLastActionDateTime: values?.dteLastActionDateTime,
    lcAmendmentId: values?.lcAmendmentId,
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
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const getLCAmendmentLandingPasignation = async (
  accountId,
  businessUnitId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  searchTerm,
  searchValue = false
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/imp/LCAmendment/LCAmendmentLandingPasignation?search=${searchTerm}&accountId=${accountId}&businessUnitId=${businessUnitId}&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

//schema validation
export const validationSchema = Yup.object().shape({
  exchangeRate: Yup.number()
    .required("Exchange Rate is required")
    .positive("Exchange Rate Must be a positive number"),
  totalAmendmentCharge: Yup.number()
    .required("Amendment Charge is required")
    .positive("Amendment Charge Must be a positive number"),
  VATOnAmendmentCharge: Yup.number()
    .required("VAT On Amendment Charge is required")
    .positive("VAT On Amendment Charge Must be a positive number"),
});

//landing api;
export const getLatestChangesOfDoc = async (
  document_id,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `https://devscheduler.ibos.io/google_doc/get_latest_changes_of_doc?document_id=${document_id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    // toast.error(error?.response?.data?.message);
  }
};
