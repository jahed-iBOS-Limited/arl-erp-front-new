import Axios from 'axios';
export const getOrderTypeList = async (setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetOrderTypeListDDL`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getRefferenceTypeList = async (orderTypeId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/getPOReferenceType?PoTypeId=${orderTypeId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const getPOStatementLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  sbu,
  ordId,
  refId,
  poId,
  plantId,
  whId,
  status,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  const searchPath = search ? `searchTerm=${search}&` : '';
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPurchaseOrderStatement?${searchPath}AccountId=${accId}&UnitId=${buId}&Sbu=${sbu}&Plant=${plantId}&WearHouse=${whId}&PurchaseOrderTypeId=${ordId}&PurchaseOrganizationId=${poId}&ReferenceTypeId=${refId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&isApproved=${status}&showBoth=false&fromDate=${fromDate}&toDate=${toDate}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};
