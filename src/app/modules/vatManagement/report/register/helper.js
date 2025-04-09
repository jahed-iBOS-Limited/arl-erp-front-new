import axios from 'axios';
import { _dateFormatter } from '../../../_helper/_dateFormate';

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
  setLoading
) => {
  const {
    sbu = null,
    registerType = null,
    generalLedger = null,
    fromDate,
    toDate,
    partnerType,
  } = values;
  console.log(registerType);
  let api;
  if (registerType?.value === 5) {
    api = `/fino/Account/GetBusinessTransectionLedger?BusinessUnitId=${buId}&GLId=${generalLedger?.value}&FromDate=${fromDate}&ToDate=${toDate}`;
  } else if (registerType?.value === 7) {
    const fromDateQuery = fromDate ? `&fromDate=${fromDate}` : '';
    const toDateQuery = toDate ? `&toDate=${toDate}` : '';
    api = `fino/Account/GetAccountingRegisterSummaryPartner?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu?.value}&PartnerType=${partnerType?.value}${fromDateQuery}${toDateQuery}`;
  } else if (registerType?.value !== 6 && registerType?.value) {
    api = `/fino/Account/GetAccountingRegisterSummaryPartner?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu?.value}&PartnerType=${registerType?.value}`;
  } else if (registerType?.value === 6) {
    api = `/fino/Account/GetAccountingRegisterSummaryBank?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu?.value}&ToDate=${_dateFormatter(values?.toDate)}`;
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

export const getPartnerTypeDDL = async (setter) => {
  try {
    const res = await axios.get(
      '/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList'
    );
    const list = res?.data.map((item) => {
      return {
        value: item?.businessPartnerTypeId,
        label: item?.businessPartnerTypeName,
      };
      // itemTypes.push(items)
    });
    list.push({ value: 3, label: 'Employee' });
    setter(list);
  } catch (error) {
    console.log(error);
  }
};
