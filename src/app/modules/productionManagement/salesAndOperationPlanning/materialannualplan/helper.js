import Axios from "axios";
import { toast } from "react-toastify";

// Get Landing Plant DDL
export const getPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      // `/mes/MesDDL/GetSalesPlanPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      `/mes/MesDDL/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

// horizon ddl
export const getHorizonDDLView = async (
  accId,
  buId,
  plantId,
  yearId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetProductReqPlannDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
    );
    let newData = res?.data;
    setter(
      newData.sort(function(a, b) {
        return new Date(a.startdatetime) - new Date(b.enddatetime);
      })
    );
  } catch (error) {}
};

export const getHorizonDDLCreate = async (
  accId,
  buId,
  plantId,
  yearId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetPlanningHorizonDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
    );
    let newData = res?.data;
    setter(
      newData.sort(function(a, b) {
        return new Date(a.startdatetime) - new Date(b.enddatetime);
      })
    );
  } catch (error) {}
};

// Plant Item DDL
export const getItemListSalesPlanDDL = async (
  accId,
  buId,
  plantId,
  pageNo,
  pageSize,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/SalesPlanning/GetSalesPlanItemsAll?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    res.data.data.forEach((item) => {
      item["itemPlanQty"] = "";
    });
    setter(res?.data);
  } catch (error) {}
};

const uniqueData = (data) => {
  var unique = [];
  var distinct = [];
  for (let i = 0; i < data.length; i++) {
    if (!unique[data[i].label]) {
      distinct.push(data[i]);
      unique[data[i].label] = 1;
    }
  }
  return distinct;
};

// year ddl for landing
export const getYearDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    const yearData = await uniqueData(res?.data);
    setter(yearData);
  } catch (error) {
    setter([]);
  }
};

// create
export const createMaterialRequirementPlanning = async (
  payload,
  cb,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/mes/SalesPlanning/CreateMaterialRequirementPlanning`,
      payload
    );

    setLoading(false);
    toast.success(res?.data?.message || "Created successfully", {
      toastId: 14214,
    });
    cb();
  } catch (error) {
    setLoading(false);
    toast.warning(error?.response?.data?.message || error?.message, {
      toastId: 142123,
    });
  }
};

export const getLandingData = async (
  accId,
  buId,
  plantId,
  horizonId,
  horizonRowId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/SalesPlanning/GetMrplanningInfo?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&PlanningHorizonId=${horizonId}&PlanningHorizonRowId=${horizonRowId}`
    );

    const itemWiseList = {};

    const quantitySum = (newQuantity, oldQuantity) => {
      if (oldQuantity && newQuantity) {
        return oldQuantity + newQuantity;
      } else if (oldQuantity && !newQuantity) {
        return oldQuantity;
      } else if (!oldQuantity && newQuantity) {
        return newQuantity;
      }
    };

    /* Program Time Complexity O(n) and Space Complexity O(n) */
    for (let item of res?.data?.objList) {
      if (!itemWiseList[item?.itemId]) {
        itemWiseList[item?.itemId] = item;
      } else {
        let oldItem = itemWiseList[item?.itemId];

        itemWiseList[item?.itemId] = {
          ...oldItem,
          salesPlanId01: oldItem?.salesPlanId01 || item?.salesPlanId01,
          planningHorizonRowId01:
            oldItem?.planningHorizonRowId01 || item?.planningHorizonRowId01,
          planningHorizonRowName01:
            oldItem?.planningHorizonRowName01 || item?.planningHorizonRowName01,
          numItemQty01: quantitySum(item?.numItemQty01, oldItem?.numItemQty01),
          salesPlanId02: oldItem?.salesPlanId02 || item?.salesPlanId02,
          planningHorizonRowId02:
            oldItem?.planningHorizonRowId02 || item?.planningHorizonRowId02,
          planningHorizonRowName02:
            oldItem?.planningHorizonRowName02 || item?.planningHorizonRowName02,
          numItemQty02: quantitySum(item?.numItemQty02, oldItem?.numItemQty02),
          salesPlanId03: oldItem?.salesPlanId03 || item?.salesPlanId03,
          planningHorizonRowId03:
            oldItem?.planningHorizonRowId03 || item?.planningHorizonRowId03,
          planningHorizonRowName03:
            oldItem?.planningHorizonRowName03 || item?.planningHorizonRowName03,
          numItemQty03: quantitySum(item?.numItemQty03, oldItem?.numItemQty03),
        };
      }
    }
    setter({ ...res?.data, objList: [...Object.values(itemWiseList)] });
  } catch (error) {
    setter([]);
  }
};

export const getMrplanningInfoDetails_api = async (
  accId,
  buId,
  plantId,
  horizonId,
  horizonRowId,
  setter,
  setLoading
) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/mes/SalesPlanning/GetMrplanningInfoDetail?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&PlanningHorizonId=${horizonId}&PlanningHorizonRowId=${horizonRowId}`
    );
    setter(res?.data);
    setLoading(false)
  } catch (error) {
    setter([]);
    setLoading(false)
  }
};
