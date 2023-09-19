import Axios from "axios";
import { toast } from "react-toastify";

export const getBusinessUnitGridData = async (
  accId,
  buId,
  setter,
  setLoding,
  pageNo,
  pageSize,
  search,
  generalLedgerId
) => {
  setLoding(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  try {
    const res = await Axios.get(
      `/fino/BusinessTransaction/GetBusinessTransactionSearchLandingPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&generalLedgerId=${generalLedgerId?generalLedgerId:0}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoding(false);
    }
  } catch (error) {
    
    setLoding(false);
  }
};

///fino/BusinessTransaction/GetPaymentTermsFinoDDL

export const getGeneralLedgerDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=0`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data?.map((itm) => ({
        value: itm?.generalLedgerId,
        label: itm?.generalLedgerName,
        code: itm?.generalLedgerNameCode,
      }));
      setter(newData);
    }
  } catch (error) {
    
  }
};

export const saveBusinessTransaction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/BusinessTransaction/CreateBusinessTransaction`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const gdetBusinessTransactionId_api = async (
  accId,
  buId,
  getById,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/BusinessTransaction/GetBusinessTransactionDTOById?AccountId=${accId}&BusinessUnitId=${buId}&BusinessTransactionId=${getById}`
    );
    if (res.status === 200 && res?.data) {
      const newData = {
        ...res?.data[0],
        generalLedger: {
          value: res?.data[0]?.generalLedgerId,
          label: res?.data[0]?.generalLedgerName,
          code: res?.data[0]?.generalLedgerCode
        },
        isInternalExpense: res?.data[0].isInternalExpense
      };
      setter(newData);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const editBusinessTransaction_api = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/fino/BusinessTransaction/EditBusinessTransaction`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.message);
    setDisabled(false);
  }
};
