import Axios from "axios";
export const getHeaderData = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/Mushak91/GetTaxPayerInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter({});
  }
};

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getGridData = async (accId, buId, fromDate, toDate, setter) => {
  try {
    const res = await Axios.get(
      `/vat/Musha61/GetMushak61?accountId=${accId}&BusinessunitId=${buId}&fromdate=${fromDate}&todate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter({
      salesData: [],
      purchaseData: [],
    });
  }
};
