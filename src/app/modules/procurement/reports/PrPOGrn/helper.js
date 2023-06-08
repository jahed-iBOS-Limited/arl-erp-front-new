import Axios from "axios";


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


export const getPOPrGRNLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  plantId,
  whId,
  fromDate,
  toDate,
  typeId,
  typeCode,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  const SearchCode = typeCode ? `SearchCode=${typeCode}&` : "";
  try {
    const res = await Axios.get(`/procurement/PurchaseRequest/GetIndentPoMRR?UnitId=${buId}&SbuId=${sbu}&WHId=${whId}&PlantId=${plantId}&FromDate=${fromDate}&ToDate=${toDate}&SearchType=${typeId}&${SearchCode}PageNo=${pageNo || 1}&PageSize=${pageSize}`);
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
