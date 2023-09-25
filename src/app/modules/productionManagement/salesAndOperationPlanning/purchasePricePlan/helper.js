import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getLogVersionDDL = async (accId, buId, salesPlanId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetSalesPlanHeaderLogDDL?AccountId=${accId}&BusinessunitId=${buId}&SalesPlanId=${salesPlanId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// Get Landing Plant DDL
export const getLandingPlantDDL = async (accId, buId, setter) => {
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

// year ddl for create page
export const getYearDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    setter(res?.data);
  } catch (error) {}
};

// horizon ddl
export const getHorizonDDL = async (accId, buId, plantId, yearId, setter) => {
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
      `/mes/SalesPlanning/GetPurchasePlanItemsAll?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    res.data.data.forEach((item) => {
      item["itemPlanQty"] = "";
      item["bom"] =
        item?.objBOMList?.filter((nestedItem) => nestedItem?.isStandard)[0] ||
        "";
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
export const getSalesPlanYearDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetSalesPlanYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}`
    );
    const yearData = await uniqueData(res?.data);
    setter(yearData);
  } catch (error) {}
};

// create
export const saveItemRequest = async (data, cb, setLoader) => {
  try {
    setLoader && setLoader(true);
    const res = await Axios.post(
      `/mes/SalesPlanning/CreatePurchasePlanning`,
      data
    );
    cb && cb();
    toast.success(res?.data?.message);
    setLoader && setLoader(false);
  } catch (error) {
    //add response message
    toast.warning(error?.response?.data?.message || error?.message);
  }
};

// Edit Sales Planning
export const editSalesPlanning = async (data, setLoading) => {
  try {
    setLoading && setLoading(true);
    const res = await Axios.put(`/mes/SalesPlanning/EditSalesPlanning`, data);
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message || err?.message);
  }
};

// landing ddl
export const getSalesPlanLanding = async (
  accId,
  buId,
  plantId,
  year,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `mes/SalesPlanning/PurchasePlanningLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}&Year=${year}&PageNo=1&PageSize=100&viewOrder=desc`
    );
    setLoading(false);
    setter(res?.data?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
// get data by single id

export const getSalesPlanById = async (
  salesPlanId,
  setterHeader,
  setterRow
) => {
  try {
    const res = await Axios.get(
      `/mes/SalesPlanning/GetSalesPlanById?SalesPlanId=${salesPlanId}`
    );
    const newRow = res?.data?.objRow;
    let newRowData = {
      data: [...newRow],
    };
    //const newHeader = res?.data?.objHeader;
    const newHeader = {
      plant: {
        value: res?.data?.objHeader?.plantId,
        label: res?.data?.objHeader?.plantName,
      },
      year: {
        value: res?.data?.objHeader?.yearId,
        label: res?.data?.objHeader?.yearId,
      },
      startDate: _dateFormatter(res?.data?.objHeader?.startDateTime),
      endDate: _dateFormatter(res?.data?.objHeader?.endDateTime),
      horizon: {
        value: res?.data?.objHeader?.planningHorizonRowId,
        label: res?.data?.objHeader?.planningHorizonRowName,
      },
    };

    setterHeader(newHeader);
    setterRow(newRowData);
  } catch (error) {}
};

export const createProductionEntry = async (data, cb) => {
  try {
    await Axios.post(`/mes/ProductionPlanning/CreateProductionPlanning`, data);
    toast.success("Submitted successfully");
    cb();
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error.message);
  }
};

//Get Production plan Data
export const getProductionPlanning = async (
  accId,
  buId,
  plantId,
  salesPlanId,
  setterHeader,
  setterRow
) => {
  try {
    const res = await Axios.get(
      `/mes/ProductionPlanning/GetProductionPlanItemsPagination?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&SalesPlanId=${salesPlanId}&PageNo=1&PageSize=10&viewOrder=desc`
    );
    const newHeader = {
      plant: {
        value: res?.data?.header?.plant.value,
        label: res?.data?.header?.plant.label,
      },
      year: {
        value: res?.data?.header?.intYearId,
        label: res?.data?.header?.intYearId,
      },
      startDate: _dateFormatter(res?.data?.header?.dteStartDateTime),
      endDate: _dateFormatter(res?.data?.header?.dteEndDateTime),
      horizon: {
        value: res?.data?.header?.planningHorizon.value,
        label: res?.data?.header?.planningHorizon.label,
      },
    };

    setterHeader(newHeader);
    setterRow(res?.data?.data);
  } catch (error) {
    console.log(error.message);
  }
};

export const getVersionGridData = async (planId, logId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/mes/SalesPlanning/GetSalesPlanLogById?SalesPlanId=${planId}&Logid=${logId}`
    );
    setLoading(false);
    setter(res?.data?.objRow);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
