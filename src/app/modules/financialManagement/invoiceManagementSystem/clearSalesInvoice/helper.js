import Axios from "axios";
import { toast } from "react-toastify";
export const getInvoiceClearPasignation_api = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  customerId
) => {
  try {
    setLoading && setLoading(true);
    // const res = await Axios.get(
    //   `/fino/InvoiceClear/GetInvoiceClearLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    // );
    const res = await Axios.get(
      `/fino/InvoiceClear/GetInvoiceClearLandingPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&CustomerId=${customerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const GetGeneralLedgerDDLType_api = async (
  accId,
  buId,
  accingGroupId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${buId}&AccountingGroupId=${accingGroupId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createCashInvoiceClear_api = async (data, cb, setDisabled) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.post(
      `/fino/InvoiceClear/CreateCashInvoiceClear`,
      data
    );
    if (res.status === 200) {
      setDisabled && setDisabled(false);
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//getBankAccountDDL_api
export const getBankAccountDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//getInstrumentType_Api
export const getInstrumentType_Api = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createBankInvoiceClear_api = async (data, cb, setDisabled) => {
  try {
    setDisabled && setDisabled(true);
    const res = await Axios.post(
      `/fino/InvoiceClear/CreateBankInvoiceClear`,
      data
    );
    if (res.status === 200) {
      setDisabled && setDisabled(false);
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled && setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//getInvoiceClearDDL_api
export const getInvoiceClearDDL_api = async (
  refName,
  accId,
  buId,
  businessPartnerId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/InvoiceClear/GetInvoiceClearDDL?RefName=${refName}&AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${businessPartnerId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data?.map((item) => ({
        ...item,
        value: item?.journalId,
        label: item?.journalCode,
      }));
      setter(newData);
    }
  } catch (error) {}
};

export const createAdvAdjustmentInvoiceClear_api = async (
  data,
  cb,
  setLoading
) => {
  try {
    setLoading && setLoading(true);
    const res = await Axios.post(
      `/fino/InvoiceClear/CreateAdvAdjustmentInvoiceClear`,
      data
    );
    if (res.status === 200) {
      setLoading && setLoading(false);
      toast.success(res?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setLoading && setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getCustomerDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getInvoiceReportData = async (
  accId,
  buId,
  invoiceCode,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/fino/InvoiceClear/GetInvoiceReport?accountId=${accId}&BusinessUnitId=${buId}&invoiceCode=${invoiceCode}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
