import axios from "axios";
import { toast } from "react-toastify";

export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );

    if (res.status === 200 && res.data) {
      const data = res?.data.map((itm) => ({
        value: itm?.value,
        label: `${itm?.label} (${itm?.code})`,
      }));
      setter(data);
    }
  } catch (error) {}
};

//Get Master Scheduling Plant DDL
export const getProductionMasterSchedulingPlant = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionMasterSchedulingPlantCreateDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

//Get Master Scheduling Year DDL For Landing Page
export const getProductionMasterSchedulingYear = async (
  accId,
  buId,
  plantId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionMasterSchedulingYearCreateDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

//Get Master Scheduling Year DDL For Create Page
export const getMasterSchedulingHorizon = async (
  accId,
  buId,
  plantId,
  yearId,
  headerSetter,
  rowSetter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionMasterSchedulingHorizonCreateDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
    );
    headerSetter(res?.data.header);
    rowSetter(res?.data.row);
  } catch (error) {
    console.log(error.message);
  }
};

//Get Master Scheduling Plant DDL For Landing Page
export const getMasterSchedulingLandingPlant = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionMasterSchedulingPlantLandingDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
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

//Get Master Scheduling Year DDL For Landing Page
export const getMasterSchedulingLandingYear = async (
  accId,
  buId,
  plantId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionMasterSchedulingYearLandingDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    var year = await uniqueData(res?.data);
    setter(year);
  } catch (error) {
    console.log(error.message);
  }
};

//Get Master Scheduling Item DDL For Create Page
export const getProductionMasterSchedulingItems = async (
  accId,
  buId,
  plantId,
  yearId,
  monthId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/ProductionMasterSchedule/ProductionMasterScheduleCreateItemsDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}&MonthId=${monthId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

//Get Master Scheduling Others For Create Page
export const getProductionMasterSchedulingOthers = async (
  accId,
  buId,
  plantId,
  yearId,
  monthId,
  itemId,
  workCenterSetter,
  boMSetter,
  productionPlanQtySetter,
  productionPlanningIdSetter,
  uomIdSetter
) => {
  try {
    const res = await axios.get(
      `/mes/ProductionMasterSchedule/ProductionMasterScheduleCreateDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}&MonthId=${monthId}&ItemId=${itemId}`
    );
    workCenterSetter(res?.data?.workCenters);
    boMSetter(res?.data?.boMs);
    productionPlanQtySetter(res?.data?.itemQty);
    productionPlanningIdSetter(res?.data.productionPlanningId);
    uomIdSetter(res?.data.uomId);
  } catch (error) {
    console.log(error.message);
  }
};

// create
export const saveItemRequest = async (data) => {
  try {
    const res = await axios.post(
      `/mes/ProductionMasterSchedule/CreateProductionMasterSchedule`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Get Master Scheduling Landing Page Data
export const getMasterSchedulingLandingPageData = async (
  accId,
  buId,
  plantId,
  yearId,
  monthId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/ProductionMasterSchedule/ProductionMasterScheduleLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}&MonthId=${monthId}&PageNo=1&PageSize=10&viewOrder=desc`
    );
    setter(res?.data?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message)
    console.log(error);
  }
};

//Get Master Scheduling Horizon DDL For Landing Page
export const getMasterSchedulingLandingHorizon = async (
  accId,
  buId,
  plantId,
  yearId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionMasterSchedulingHorizonLandingDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

//Update Master Scheduling
export const updateMasterScheduling = async (data, cb) => {
  try {
    const res = await axios.put(
      `/mes/ProductionMasterSchedule/EditProductionMasterSchedule`,
      data
    );
    cb();
    
    toast.success(res?.data?.message);
  } catch (error) {
    console.log(error.message);
  }
};
