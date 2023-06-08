import axios from "axios";
export const getHeaderData = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter({});
  }
};

export const SalesRegister_Report_api = async (
  accid,
  buid,
  fromDate,
  toDate,
  itemId,
  branch,
  setter,
  setLoading
) => {
  setLoading && setLoading(true)
  try {
    const res = await axios.get(
      `/vat/VATSP/SalesRegister?intAccountId=${accid}&intBusinessUnitId=${buid}&intBranch=${branch}&ItemId=${itemId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading && setLoading(false)
    }
  } catch (error) {
    setLoading && setLoading(false)
  }
};
