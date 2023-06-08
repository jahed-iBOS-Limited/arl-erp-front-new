import Axios from "axios";
import { toast } from "react-toastify";

export const getCancelInvGridData = async (
  accId,
  buId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  sbuId,
  plantId,
  whId,
  search
) => {
  const searchPath = search ? `searchTerm=${search}&` : "";
  setLoading(true);
  try {
    const res = await Axios.get(`/wms/CancelInventory/CancelInventoryTransectionLanding?${searchPath}accountId=${accId}&businessUnitId=${buId}&sbuId=${sbuId}&plantId=${plantId}&warehouse=${whId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`)
    if (res.status === 200 && res?.data) {     
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};


export const saveCanceInvRequest = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/wms/CancelInventory/CancelInventoryTransection?AccountId=${data?.accId}&BusinessUnitId=${data?.buId}&ReferenceTypeId=${1}&InventoryTransactionCode=${data?.code}`);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};


export const getRowAndHeaderLabelData = async (invTransCode,accId,buId,sbuId,plId,whId, setter) => {
  try {
    const res = await Axios.get(
     `/wms/InventoryTransaction/GetGrninfofromInventoryTransactionDetails?InventoryTransactionCode=${invTransCode}&AccountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}&PlantId=${plId}&WearhouseId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      if(res?.data?.transactionId === 0){
        toast.warning("Data not found")
      }
      setter(res?.data);
    }
  } catch (error) {}
};


export const saveItemReqEdit = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/wms/ItemRequest/EditItemRequest`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      //cb()
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};


/// cancel inv


//get request type
export const getRefTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/wms/InventoryTransaction/GetReferenceTypeDDL?InvTGoupId=8`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};


//get request type
export const getTransTypeDDL = async (refTyId,setter) => {
  try {
    const res = await Axios.get(`/wms/InventoryTransaction/GetTransectionTypeDDL?InvTGoupId=8&RefenceTypeId=${refTyId}`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};



export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};


export const getWarehouseDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getReportCancelInvReq = async (prId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/CancelInventory/CancelInventoryTransectionView?InventoryTransactionId=${prId}`
    );
    setter(res?.data);
  } catch (error) {}
};