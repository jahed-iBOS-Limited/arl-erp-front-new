import Axios from "axios";
export const getAssetReceiveReportData = async (
  accId,
  buId,
  userId,
  value,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  const searchPath = search ? `searchTearm=${search}&` : "";
  setLoading(true);
  try {
    const res = await Axios.get(`/asset/Asset/GetAssetReportForEmployee?AccountId=${accId}&UnitId=${buId}&ActionBy=${userId}&Type=${value}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`)
    if (res.status === 200 && res?.data) {     
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};


export const getPurchaseOrgList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getOrderTypeList = async (setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetOrderTypeListDDL`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getRefferenceTypeList = async (orderTypeId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/getPOReferenceType?PoTypeId=${orderTypeId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getPlantList = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getWhList = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) {}
};


export const getPOStatementLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  ordId,
  refId,
  poId,
  plantId,
  whId,
  status,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  try {
    const res = await Axios.get(`/procurement/PurchaseOrder/GetPurchaseOrderStatement?${searchPath}AccountId=${accId}&UnitId=${buId}&Sbu=${sbu}&Plant=${plantId}&WearHouse=${whId}&PurchaseOrderTypeId=${ordId}&PurchaseOrganizationId=${poId}&ReferenceTypeId=${refId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&isApproved=${status}&showBoth=false&fromDate=${fromDate}&toDate=${toDate}`);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};


export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {}
};
