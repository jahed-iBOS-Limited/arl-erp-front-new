import Axios from "axios";

export const getPurchaseOrgList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) { }
};

export const getissuerList = async (buId, orId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPoIssuer?BusinessUnitId=${buId}&OrganizationId=${orId}`
    );
    setter(res?.data);
  } catch (error) { }
};

export const getsupplierList = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    setter(res?.data);
  } catch (error) { }
};


export const getbillbysupplierLanding = async (
  accId,
  buId,
  setLoading,
  setter,
  poId,
  partnerId,
  issuerId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  plantId,
  warehouseId
) => {
  setLoading(true);
  const PartnerId = partnerId ? `PartnerId=${partnerId}` : "";
  const PoIssuer = issuerId ? `PoIssuer=${issuerId}` : "";
  try {
    const res = await Axios.get(
      // `/procurement/SupplierInvoice/GetBillBySupplier?AccountId=${accId}&BusinessUnitId=${buId}&OrganizationType=${poId}&${PartnerId}${PoIssuer}fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}`
      `/procurement/SupplierInvoice/GetBillBySupplier?AccountId=${accId}&BusinessUnitId=${buId}&OrganizationType=${poId}&PlantId=${plantId}&WarehouseId=${warehouseId}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&${PartnerId}${PoIssuer}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
  }
};


export const getSBUList = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) { }
};
