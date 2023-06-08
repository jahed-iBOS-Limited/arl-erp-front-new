import axios from "axios";
import { toast } from "react-toastify";

export const getGLDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=0`
    );
    const newData = res?.data?.map((item) => ({
      value: item?.generalLedgerId,
      label: item?.generalLedgerName,
      code: item?.generalLedgerNameCode,
    }));
    setter(newData);
  } catch (error) {
    setter([]);
  }
};
export const getPartnerTypeDDLFromAccoutingConfig = async (setter) => {
  try {
    const res = await axios.get(`/fino/AccountingConfig/GetAccountingConfigTypeDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const getBusinessTransDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(`/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${buId}`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const saveAccountingConfigAction = async (
  data,
  setDisabled,
  setRowDto
) => {
  try {
    setDisabled(true);
    const res = await axios.post(
      `/fino/AccountingConfig/CreateAccountingConfig`,
      data
    );
    setRowDto([]);
    setDisabled(false);
    toast.success(res?.data?.message || "Submitted successfully");
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message || "Please try again");
  }
};

export const getOrgDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
