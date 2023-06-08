import axios from "axios";

export const getPlantNameDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getShopfloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getShopfloorIssueReportLandingData = async (
  accId,
  buId,
  pId,
  sId,
  fromDate,
  toDate,
  setter,
  setLoading,
  search
) => {
  setLoading(true);
  try {
    const searchPath = search ? `search=${search}&` : "";
    const res = await axios.get(
      `/mes/MESReport/GetShopfloorIssueReport?${searchPath}accountId=${accId}&businessUnitId=${buId}&plantId=${pId}&shopfloorId=${sId}&fromDate=${fromDate}&toDate=${toDate}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getShopfloorIssueReportItemWiseDetailData = async (
  accId,
  buId,
  pId,
  sId,
  fromDate,
  toDate,
  itemId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/MESReport/GetShopfloorIssueReportItemWise?accountId=${accId}&businessUnitId=${buId}&plantId=${pId}&shopfloorId=${sId}&fromDate=${fromDate}&toDate=${toDate}&itemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
