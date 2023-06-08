import Axios from "axios";
import { toast } from "react-toastify";

export const getCopyFromDDL = async (accId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=${accId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const getFinancialStatementComponentDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinancialStatement/GetFinancialStatementComponentDDL`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const getAccountCategoryDDL = async (accId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/GeneralLedger/GetAccountCategoryDDL?AccountId=${accId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter(data);
    }
  } catch (error) {}
};

export const getGeneralLedgerDDL = async (
  accId,
  buId,
  acCategoryId,
  setter
) => {
  try {
    // const res = await Axios.get(
    //   `/domain/BusinessUnitGeneralLedger/GetBUGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=${acGroupId}`
    // );
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerByAccountCategoryDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountCategoryId=${acCategoryId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data?.map((itm) => {
        return {
          ...itm,
          value: itm?.generalLedgerId,
          label: itm?.generalLedgerName,
        };
      });
      setter(data);
    }
  } catch (error) {}
};

export const getFinancialStatementCopyFromLanding = async (
  comId,
  busId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/FinancialStatement/GetFinancialStatementLandingByCopyFromId?componentId=${comId}&BusinessUnitId=${busId}&viewOrder=desc&PageNo=1&PageSize=1000`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {}
};

export const getFinancialStatementMainLanding = async (setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinancialStatement/GetFinancialStatementLandingByCopyFromId?componentId=0&BusinessUnitId=0&viewOrder=desc&PageNo=1&PageSize=1000`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {}
};

export const saveFinancialStatement = async (data, cb) => {
  try {
    const res = await Axios.post(
      `/fino/FinancialStatement/CreateFinancialStatement`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getFinancialStatementById = async (comId, busId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/FinancialStatement/GetFinancialStatementById?ComponentId=${comId}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
