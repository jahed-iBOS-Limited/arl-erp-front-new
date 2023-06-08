import axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getSbuDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getRegisterReportAction = async (
  accId,
  buId,
  values,
  setter,
  setLoading,
  registerTypeId,
  partnerTypeId,
) => {
  const {
    sbu = null,
    generalLedger = null,
    fromDate,
    toDate,
  } = values;
  // console.log(registerType);
  let api;
  if (registerTypeId === 5) {
    api = `/fino/Account/GetBusinessTransectionLedger?BusinessUnitId=${buId}&GLId=${generalLedger?.value}&FromDate=${fromDate}&ToDate=${toDate}`;
  } else if (registerTypeId === 7) {
    const fromDateQuery = fromDate ? `&fromDate=${fromDate}` :"";
    const toDateQuery = toDate ? `&toDate=${toDate}`:""
    api = `fino/Account/GetAccountingRegisterSummaryPartner?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu?.value}&PartnerType=${partnerTypeId}${fromDateQuery}${toDateQuery}`;
  } else if (registerTypeId !== 6 && registerTypeId) {
    api = `/fino/Account/GetAccountingRegisterSummaryPartner?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu?.value}&PartnerType=${registerTypeId}`;
  } else if (registerTypeId === 6) {
    api = `/fino/Account/GetAccountingRegisterSummaryBank?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu?.value
      }&ToDate=${_dateFormatter(values?.toDate)}`;
  } else {
    api = `/fino/Account/GetAccountingRegisterSummaryBank?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu?.value}`;
  }

  try {
    setLoading(true);
    const res = await axios.get(api);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getRegisterDetailsByIdAction = async (
  buId,
  bankAccId,
  fromDate,
  toDate,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/Account/GetBankBook?BusinessUnitId=${buId}&BankAccountId=${bankAccId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getGeneralLedgerDDL = async (setLoading, setter) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/CommonFino/GetGeneralLedgerListScheduleView`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getPartnerTypeDDL = async (setter) => {
  try {
    const res = await axios.get(
      "/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList"
    );
    const list = res?.data.map((item) => {
      return {
        value: item?.businessPartnerTypeId,
        label: item?.businessPartnerTypeName,
      };
      // itemTypes.push(items)
    });
    list.push({ value: 3, label: "Employee" });
    setter(list);
  } catch (error) {
    console.log(error);
  }
};


export const getPartnerBook = async (
  businessUnitId,
  partnerId,
  partnerType,
  fromDate,
  toDate,
  setLoading,
  setter,
  glId
) => {
  try {
    setLoading(true);
    let query = `/fino/Account/GetPartnerBook?BusinessUnitId=${businessUnitId}&PartnerId=${partnerId}&PartnerType=${partnerType}&FromDate=${fromDate}&ToDate=${toDate}`
    if (glId) {
      query += `&GeneralId=${glId}`
    }
    const res = await axios.get(query);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};


export const partnerGeneralLedgerList = async (businessUnitId, partnerTypeId, setter) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/PartnerGeneralLedgerList?businessUnitId=${businessUnitId}&partnerTypeId=${partnerTypeId}`
    );
    setter(res?.data.map((item) => ({
      ...item,
      value: item?.glId,
      label: item?.glName,
    })));
  } catch (error) {
    console.log(error);
  }
};