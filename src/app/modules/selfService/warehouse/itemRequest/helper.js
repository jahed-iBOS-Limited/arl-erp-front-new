import Axios from 'axios';
import { _dateFormatter } from '../../../_helper/_dateFormate';

export const getItemRequestGridData = async (
  accId,
  buId,
  userId,
  setter,
  setLoading,
  setTotalCount,
  pageNo,
  pageSize,
  sbuId,
  plantId,
  whId,
  status,
  fromDate,
  toDate,
  search
) => {
  const searchPath = search ? `searchTerm=${search}&` : '';

  setLoading(true);
  const requestUrl =
    status !== undefined && fromDate && toDate
      ? `/wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
      : fromDate && toDate
        ? `/wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
        : fromDate
          ? `/wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}&fromDate=${fromDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
          : toDate
            ? `wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
            : status !== undefined
              ? `/wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}&status=${status}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
              : `/wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`;

  try {
    const res = await Axios.get(requestUrl);
    if (res.status === 200 && res?.data) {
      setTotalCount(res?.data?.totalCount);
      let gridData = res?.data?.data.map((data) => {
        return {
          sl: data.sl,
          itemRequestId: data.itemRequestId,
          itemRequestCode: data.itemRequestCode,
          requestDate: _dateFormatter(data.requestDate),
          validTill: _dateFormatter(data.validTill),
          dueDate: _dateFormatter(data.dueDate),
          strApproved: data.strApproved,
        };
      });
      setter(gridData);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getCostElement = async (unId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetCostElementByUnitId?businessUnitId=${unId}`
    );

    if (res.status === 200) {
      let newData = res?.data.map((data) => {
        return {
          ...data,
          value: data?.costElementId,
          label: data?.costElementName,
        };
      });

      setter(newData);
    }
  } catch (error) {}
};
