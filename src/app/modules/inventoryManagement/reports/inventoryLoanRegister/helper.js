import axios from "axios";

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
    fromDate,
    toDate,
  } = values;

  try {
    setLoading(true);
    const res = await axios.get(`wms/InventoryLoan/GetAccountingRegisterSummaryPartnerItemLoan?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbu.value}&PartnerType=4&fromDate=${fromDate}&toDate=${toDate}`);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getRegisterDetailsByIdAction = async (
  buId,
  partnerId,
  fromDate,
  toDate,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/wms/InventoryLoan/GetPartnerBookItemLoan?BusinessUnitId=${buId}&PartnerId=${partnerId}&PartnerType=4&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
