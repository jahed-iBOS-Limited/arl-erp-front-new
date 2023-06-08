import axios from "axios";
import { toast } from "react-toastify";

export const getLandingData = async (
  accId,
  buId,
  plantId,
  setLoader,
  setter,
  pageNo,
  pageSize
) => {
  setLoader(true);
  try {
    const res = await axios.get(
      // `/mes/ProductionLine/ProductionLineLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=1&PageSize=100`
      `/mes/ProductionLine/ProductionLineLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoader(false);
      //   console.log(res.data.data);
    }
  } catch (error) {
    setLoader(false);
  }
};
export const getPlantNameDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    toast.warn(error.message);
  }
};
// SHOPFLOOR DDL
export const getShopFloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId} `
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    toast.warn(error.message);
  }
};
// CREATE PRODUCTION LINE
export const createProductionLine = async (payload, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      `/mes/ProductionLine/CreateProductionLine
        `,
      payload
    );

    if (res.data && res.status) {
      toast.success("Successfully Created!");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.warning(
      error?.response?.data?.message || "Sorry can not perform the action!"
    );
    setDisabled(false);
  }
};
// EDIT PRODUCTION LINE
export const editProductionLine = async (payload, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      `/mes/ProductionLine/EditProductionLine
        `,
      payload
    );

    if (res.status === 200 && res.data) {
      toast.success("Updated Successfully!");
      setDisabled(false);
    }
  } catch (error) {
    toast.warning(error?.response?.data?.message);
    setDisabled(false);
  }
};

// SINGLE DATA BY ID
export const getSingleDataById = async (id, setter) => {
  try {
    const res = await axios.get(`/mes/ProductionLine/GetProductionLineById?ProductionLineId=${id}
        `);

    if (res.data && res.status) {
      const response = res.data[0];
      const newObj = {
        ...response,
        plantName: {
          value: response.plantId,
          label: response.plantName,
        },
        shopFloorName: {
          value: response.shopFloorId,
          label: response.shopFloorName,
        },
      };
      setter(newObj);
    }
  } catch (error) {}
};
