import Axios from "axios";
import { toast } from "react-toastify";
export const getTaxBranches = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const GetOpeningBalanceByBranchId_api = async (taxBranchId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxLedgerOpenning/GetOpeningBalanceByBranchId?taxBranchId=${taxBranchId}`
    );
    if (res.status === 200 && res?.data) {
      const obj = {
        vat: res?.data?.numVat,
        sd: res?.data?.numSd,
        surcharge: res?.data?.numSurcharge,
      }
      setter(obj);
    }
  } catch (error) {}
};

//

export const getOpenningBalenceData = async (
  accId,
  buId,
  branchId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/vat/TaxLedgerOpenning/GetTaxLedgerOpeningBalanceLandingPasignation?accountId=${accId}&businessUnitId=${buId}&branchId=${branchId}&PageNo=1&PageSize=123&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getDeductionData = async (
  accId,
  buId,
  branchId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/vat/TaxLedgerOpenning/GetTaxLedgerDeductionLandingPasignation?accountId=${accId}&businessUnitId=${buId}&branchId=${branchId}&PageNo=1&PageSize=12&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
export const saveDeduction_api = async (
  payload,
  setDisabled,
  cb,
  getDeductionDataFunc,
  formValues
) => {
  setDisabled(true);
  try {
    let res = await Axios.post(
      `/vat/TaxLedgerOpenning/CreateTaxLedgerDeduction`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "saveDeduction" });
      getDeductionDataFunc(formValues?.branch?.value);
      cb();
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "editDataError",
    });
    setDisabled(false);
  }
};
export const saveOpenningBalance_api = async (
  payload,
  setDisabled,
  cb,
  getOpenningBalenceFunc,
  formValues
) => {
  setDisabled(true);
  try {
    let res = await Axios.post(
      `/vat/TaxLedgerOpenning/CreateTaxLedgerOpening`,
      payload
    );
    if (res?.status === 200) {
      toast.success(res?.data?.message, { toastId: "saveOpenningBalance" });
      getOpenningBalenceFunc(formValues?.branch?.value);
      cb();
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "editDataError",
    });
    setDisabled(false);
  }
};

