import axios from "axios";

export const getParentTerritoryTypeDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/TerritoryTypeInfo/GetParentTerritoryTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getParentTerritoryDDL = async (accId, buId, typId, setter) => {
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetTerritoryByParentTerritoryTypeId?AccountId=${accId}&BUnitId=${buId}&ParentTerritoryTypeId=${typId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};
