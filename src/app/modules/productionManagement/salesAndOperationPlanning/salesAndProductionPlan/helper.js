import Axios from 'axios';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../_helper/_dateFormate';

// horizon ddl

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
      item['itemPlanQty'] = '';
      item['bom'] =
        item?.objBOMList?.filter((nestedItem) => nestedItem?.isStandard)[0] ||
        '';
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
export const saveItemRequest = async (data) => {
  try {
    const res = await Axios.post(
      `/mes/SalesPlanning/CreateSalesPlanning`,
      data
    );
    toast.success(res?.data?.message);
  } catch (error) {
    //add response message
    toast.warning(error?.response?.data?.message || error?.message);
  }
};

// Edit Sales Planning
export const editSalesPlanning = async (data) => {
  try {
    const res = await Axios.put(`/mes/SalesPlanning/EditSalesPlanning`, data);
    toast.success(res?.data?.message);
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
      `/mes/SalesPlanning/SalesPlanningLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&plantId=${plantId}&StrYear=${year}&PageNo=1&PageSize=100&viewOrder=asc`
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
        label: res?.data?.objHeader?.strYear,
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
    toast.success('Submitted successfully');
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

    const resTwo = await Axios.get(
      `/mes/SalesPlanning/GetSalesPlanById?SalesPlanId=${salesPlanId}`
    );

    console.log('resresres', res?.data);
    const newHeader = {
      plant: {
        value: res?.data?.header?.plant.value,
        label: res?.data?.header?.plant.label,
      },
      year: {
        value: res?.data?.header?.intYearId,
        label: res?.data?.header?.strYear,
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
        itemPlanQty:
          resTwo?.data?.objRow?.find(
            (item) => item?.itemId === dataItem?.itemId
          )?.itemPlanQty || 0,
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
