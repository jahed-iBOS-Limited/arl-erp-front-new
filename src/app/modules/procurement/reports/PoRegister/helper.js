import Axios from "axios";


export const getPurchaseOrgList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
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


export const getPORegisterLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  poId,
  plantId,
  whId,
  fromDate,
  toDate,
  typeId,
  sercId,
  pageNo,
  pageSize
) => {
  setLoading(true);
  const SearchText = sercId ? `SearchText=${sercId}&` : "";
  try {
    const res = await Axios.get(
      //`/procurement/PurchaseOrder/PORegisterLandingPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&Sbu=${sbu}&PurchaseOrganizationId=${poId}&Plant=${plantId}&WearHouse=${whId}&fromDate=${fromDate}&toDate=${toDate}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
      `/procurement/PurchaseOrder/PORegisterLandingPasignationSPR?FromDate=${fromDate}&ToDate=${toDate}&UnitId=${buId}&PurchOrgId=${poId}&PlantId=${plantId}&WhId=${whId}&SearchType=${typeId}&${SearchText}PageNo=${pageNo || 1}&PageSize=${pageSize}`
      );
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
