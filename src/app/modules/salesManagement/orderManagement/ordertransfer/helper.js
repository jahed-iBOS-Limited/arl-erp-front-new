import axios from "axios";

export const GetPaginationForShippointtransfer_api = async (
  accId,
  buid,
  shipPointId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setter
) => {
  try {
    const res = await axios.get(
      `/oms/SalesOrder/GetSalesOrderPaginationForShippointtransfer?AccountId=${accId}&BUnitId=${buid}&ShipPointId=${shipPointId}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
