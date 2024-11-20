import { _dateFormatter } from "../../../../_helper/_dateFormate";

// warehouse stock modal
export const warehouseStockModalInitData = {};

function getMonthFirstLastDate(date) {
  const newDate = new Date(date);
  const firstDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  const lastDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
  return {
    firstDate: _dateFormatter(firstDate),
    lastDate: _dateFormatter(lastDate),
  };
}

// fetch warehouse stock details data
export const fetchWarehouseStockDetailsData = (obj) => {
  // destrcuture
  const {
    getWarehouseStockData,
    selectedBusinessUnit,
    singleRowData,
    setSingleRowData,
    values,
  } = obj;
  // single row
  const { itemId, itemName } = singleRowData;

  // current month first & last date
  const date = getMonthFirstLastDate(values?.monthYear);
//   console.log(date);
//   console.log(singleRowData);

  // params
  const params = `businessUnitId=${selectedBusinessUnit?.value}&intPlantId=0&fromDate=${date?.firstDate}&toDate=${date?.lastDate}&intItemTypeId=0&itemId=${itemId}&warehouseId=142&pageNo=0&pageSize=100&search=${itemName}`;
  // url
  const url = `/procurement/Report/GetInventoryStatement`;

  getWarehouseStockData(`${url}?${params}`, () => {
    setSingleRowData({});
  });
};
