import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

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

export const getSalesPlanYearDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetSalesPlanYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}`
    );
    const yearData = await uniqueData(res?.data);
    setter(yearData);
  } catch (error) {}
};

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
    const res = await axios.get(
      `/mes/SalesPlanning/SalesPlanningLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}&Year=${year}&PageNo=1&PageSize=100&viewOrder=desc`
    );
    setLoading(false);
    setter(res?.data?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getLandingPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      // `/mes/MesDDL/GetSalesPlanPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      `/mes/MesDDL/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error.message);
  }
};

export const editSalesPlanning = async (data) => {
  try {
    const res = await axios.post(
      `/mes/SalesPlanning/EditDetailsSalesPlanning`,
      data
    );
    toast.success(res?.data?.message);
  } catch (err) {
    toast.warning(err?.response?.data?.message || err?.message);
  }
};

export const getPlantDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getLogVersionDDL = async (accId, buId, salesPlanId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetSalesPlanHeaderLogDDL?AccountId=${accId}&BusinessunitId=${buId}&SalesPlanId=${salesPlanId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

// year ddl for create page
export const getYearDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    setter(res?.data);
  } catch (error) {}
};

// horizon ddl
export const getHorizonDDL = async (accId, buId, plantId, yearId, setter) => {
  try {
    const res = await axios.get(
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
    const res = await axios.get(
      `/mes/SalesPlanning/GetSalesPlanItemsAll?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}&PageNo=${pageNo}&PageSize=${pageSize}`
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

// create
export const saveItemRequest = async (data) => {
  try {
    const res = await axios.post(
      `/mes/SalesPlanning/CreateDetailsSalesPlanning`,
      data
    );
    toast.success(res?.data?.message);
  } catch (error) {
    //add response message
    toast.warning(error?.response?.data?.message || error?.message);
  }
};

export const getSalesPlanById = async (
  salesPlanId,
  detailsPlanId,
  accId,
  businessUnitId,
  setterHeader,
  setterRow
) => {
  try {
    const res = await axios.get(
      `/mes/SalesPlanning/GetDetailsSalesPlanById?DetailsSalesPlanId=${detailsPlanId}&AccountId=${accId}&BusinessUnitId=${businessUnitId}&PlantId=${salesPlanId}`
    );
    const newRow = res?.data?.objRow?.map((item) => ({
      ...item,
      salesPlanId: item?.intSalesPlanId,
      planningHorizonRowId: 162,
      plantId: 79,
      itemId: item?.intItemId,
      itemName: item?.strItemName,
      uomid: item?.intUoMid,
      entryItemPlanQty: item?.numItemPlanQty,
      rate: item?.numRate,
    }));

    let newRowData = {
      data: [...newRow],
    };
    //const newHeader = res?.data?.objHeader;
    const newHeader = {
      ...res?.data?.objHeader,
      plant: {
        value: res?.data?.objHeader?.intPlantId,
        label: res?.data?.objHeader?.strPlanName,
      },
      channel: {
        value: res?.data?.objHeader?.intDistributionChannelId,
        label: res?.data?.objHeader?.intDistributionChannelName,
      },
      region: {
        value: res?.data?.objHeader?.intRegoinId,
        label: res?.data?.objHeader?.intRegionName,
      },
      area: {
        value: res?.data?.objHeader?.intAreaId,
        label: res?.data?.objHeader?.intAreaName,
      },
      territory: {
        value: res?.data?.objHeader?.teritoryId,
        label: res?.data?.objHeader?.teritoryName,
      },
      year: {
        value: res?.data?.objHeader?.intYearId,
        label: res?.data?.objHeader?.intYearId,
      },
      startDate: _dateFormatter(res?.data?.objHeader?.dteStartDateTime),
      endDate: _dateFormatter(res?.data?.objHeader?.dteEndDateTime),
      horizon: {
        value: res?.data?.objHeader?.intPlanningHorizonId,
        label: res?.data?.objHeader?.strHorizonName,
        intPlanningHorizonRowId: res?.data?.objHeader?.intPlanningHorizonRowId,
        intPlanningHorizonId: res?.data?.objHeader?.intPlanningHorizonId,
      },
    };

    setterHeader(newHeader);
    setterRow(newRowData);
  } catch (error) {}
};

export const createProductionEntry = async (data, cb) => {
  try {
    await axios.post(`/mes/ProductionPlanning/CreateProductionPlanning`, data);
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
    const res = await axios.get(
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

    let modifyingRowData = res?.data?.data?.map((dataItem) => {
      return {
        ...dataItem,
        productionPlanningRowId:
          res?.data?.header?.productionPlanQtyInfoList?.find(
            (item) => item?.itemId === dataItem?.itemId
          )?.productionPlanningRowId || 0,
        productionPlanningQty:
          res?.data?.header?.productionPlanQtyInfoList?.find(
            (item) => item?.itemId === dataItem?.itemId
          )?.productionPlanningQty || 0,
      };
    });

    setterHeader(newHeader);
    setterRow(modifyingRowData);
  } catch (error) {
    console.log(error.message);
  }
};

export const getVersionGridData = async (planId, logId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/mes/SalesPlanning/GetSalesPlanLogById?SalesPlanId=${planId}&Logid=${logId}`
    );
    setLoading(false);
    setter(res?.data?.objRow);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
