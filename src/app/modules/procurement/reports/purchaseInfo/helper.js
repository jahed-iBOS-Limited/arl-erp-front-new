import Axios from "axios";


export const getPlantList = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    setter([{ value: 0, label: 'All' }, ...res?.data]);
  } catch (error) { }
};
export const getRequestTypeList = async (setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseRequest/GetPurchaseRequestTypeListDDL`
    );
    let data = res?.data?.map((item) => ({
      value: item?.purchaseRequestTypeId,
      label: item?.purchaseRequestTypeName,
    }));
    setter(data);
  } catch (error) { }
};
export const getPurchaseOrganizationData = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemPurchaseInfo/GetPurchaseOrganizationDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};


