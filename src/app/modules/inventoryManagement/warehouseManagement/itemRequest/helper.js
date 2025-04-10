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
  privacyType,
  sbuId,
  plantId,
  whId,
  status,
  fromDate,
  toDate,
  search
) => {
  const searchPath = search ? `searchTerm=${search}&` : '';
  const statusPath = status !== undefined ? `&status=${status}` : '';
  const fromDatePath = fromDate ? `&fromDate=${fromDate}` : '';
  const toDatePath = toDate ? `&toDate=${toDate}` : '';

  setLoading(true);
  const requestUrl = `/wms/ItemRequest/GetItemRequestSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&ActionBy=${userId}&sbuId=${sbuId || 0}&plantId=${plantId || 0}&warehouse=${whId || 0}${statusPath}${fromDatePath}${toDatePath}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&PrivateOrPublic=${privacyType}`;

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
