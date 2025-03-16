import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../_helper/_dateFormate";


// getBusinessPartnerSalesDDL
export const getBusinessPartnerSalesDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerSales?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

// getBusinessPartnerSalesDDL
export const getBusinessPartnerPurchaseDDLAction = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getOthersPartner = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerOthersDdl?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getPartnerTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(
      "/fino/AccountingConfig/GetAccTransectionTypeDDL"
    );
    setter(res?.data);
  } catch (error) { }
};
// getProfitCenter List
export const getProfitCenterDDL = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`
    );
    const modifiedData = res?.data?.map((item) => ({
      ...item,
      value: item?.profitCenterId,
      label: item?.profitCenterName,
    }));
    setter(modifiedData);
  } catch (error) { }
};
// getCostElementDDL
export const getCostElementDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/CostElement?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) { }
};
// getCostCenterDDL
export const getCostCenterDDL = async (UnitId, AccountId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/CostCenter?AccountId=${AccountId}&UnitId=${UnitId}`
    );
    setter(res?.data);
  } catch (error) { }
};
// getRevenueElementListDDL
export const getRevenueElementListDDL = async (businessUnitId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) { }
};
// getRevenueCenterListDDL
export const getRevenueCenterListDDL = async (businessUnitId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${businessUnitId}`
    );
    setter(res?.data);
  } catch (error) { }
};

// getNextBankCheque
export const getNextBankCheque = async (
  accId,
  buId,
  bankId,
  branchId,
  bankAccountId,
  setter,
  key
) => {
  try {
    const res = await Axios.get(
      `/fino/BankJournal/GetNextBankCheque?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}&BranchId=${branchId}&BankAccountId=${bankAccountId}`
    );
    if (res.status === 200 && res?.data) {
      setter(key, res?.data?.currentChequeNo);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message);
  }
};

// /fino/JournalPosting/CancelJournal?JournalCode=CN-APFIL-JUL21-2&JournalTypeId=6&UnitId=8&ActionById=32897&TypeId=2
export const cancelJournal = async (
  journalCode,
  journalTypeId,
  unitId,
  actionById,
  typeId,
  cb
) => {
  try {
    await Axios.post(
      `/fino/JournalPosting/CancelJournal?JournalCode=${journalCode}&JournalTypeId=${journalTypeId}&UnitId=${unitId}&ActionById=${actionById}&TypeId=${typeId}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    cb();
    toast.success("Submitted successfully");
  } catch (error) {
    // toast.warn(error?.response?.data?.message);
    // setDisabled(false);
  }
};

export const getBusinessTransactionByPartnerDDL = async (
  accountId,
  businessUnitId,
  partnerTypeId,
  partnerId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionByPartnerDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&partnerTypeId=${partnerTypeId}&partnerId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

// https://localhost:5001/fino/CommonFino/CheckTwoFactorApproval?OtpType=1&intUnitId=164&strTransectionType=kfjdskfj&intTransectionId=2&strCode=djfksjk&intActionById=11621&strOTP=kfjsklfjsd&CancelType=1
export const checkTwoFactorApproval = async (
  otpType,
  unitId,
  transectionType,
  transectionId,
  journalCode,
  journalTypeId,
  actionById,
  strOTP,
  cancelType,
  setDisabledModalButton,
  cb
) => {
  try {
    setDisabledModalButton(true);
    const res = await Axios.get(
      `/fino/CommonFino/CheckTwoFactorApproval?OtpType=${otpType}&intUnitId=${unitId}&strTransectionType=${transectionType}&intTransectionId=${transectionId}&strCode=${journalCode}&journalTypeId=${journalTypeId}&intActionById=${actionById}&strOTP=${strOTP}&CancelType=${cancelType}`
    );
    // setFieldValue("instrumentNo",res?.data?.code)
    if (res?.data?.status === 1) {
      toast.success(res?.data?.message);
      cb(res?.data?.status);
    } else {
      toast.error(res?.data?.message);
      cb();
    }
    setDisabledModalButton(false);
    // toast.success("Submitted successfully");
  } catch (error) {
    setDisabledModalButton(false);
    toast.warn(error?.response?.data?.message || "Please try again");
    // setDisabled(false);
  }
};

export const getCostElementByCostCenterDDL = async (
  unitId,
  accountId,
  costCenterId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) { }
};
