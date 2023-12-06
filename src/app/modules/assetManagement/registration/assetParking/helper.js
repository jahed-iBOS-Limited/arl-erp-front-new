import Axios from "axios";
import { toast } from "react-toastify";

export const getAssetPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getAssetSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetSbuByUnitId?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBrtaDDL = async (setter) => {
  try {
    const res = await Axios.get(`/asset/DropDown/GetBRTAVehicleType`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getassetWarehouseData = async (
  userId,
  accId,
  buId,
  plId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getGridData = async (
  accId,
  buId,
  plId,
  whId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search
) => {
  try {
    const searchPath = search ? `searchTearm=${search}&` : "";
    setLoading(true);
    const res = await Axios.get(
      `/asset/LandingView/GetAssetReceiveListForRegistration?Accountid=${accId}&BusinessUnitId=${buId}&PlantId=${plId}&WhId=${whId}&${searchPath}PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getAssetReceiveDDL = async (Id, itemId, setter, initData) => {
  try {
    const res = await Axios.get(
      `/asset/DetalisView/GetAssetReceive?AssReceiveId=${Id}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      let header = res?.data.objHeader;
      let row = res.data.objRow;
      let newData = {
        ...header,
        itemId: row.itemId,
        itemName: row.itemName,
        transactionQuantity: row.transactionQuantity,
        transactionValue: row.transactionValue,
        uoMid: row.uoMid,
        uoMname: row.uoMname,
        itemCode: row.itemCode,
        objLast: res.data.objLast,
        itemCategoryName: row?.itemCategoryName,
        brtaType: "",
      };
      // update category in initData
      initData.category = {
        value: row?.itemCategoryId,
        label: row?.itemCategoryName,
      };

      setter(newData);
      console.log("initData", initData);
    }
  } catch (error) {}
};

export const getAssignToDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getresponsiblePersonDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveAssetData = async (
  data,
  cb,
  setIsShowModal,
  setDisabled,
  IConfirmModal
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/asset/Asset/CreateAsset`, data);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      setDisabled(false);
      setIsShowModal(false);
      cb();
      const obj = {
        title: "Asset Code",
        message: res?.data?.message,
        noAlertFunc: () => {},
      };
      IConfirmModal(obj);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveAssetForData = async (
  data,
  cb,
  setter,
  setDisabled,
  setIsShowModal,
  IConfirmModal
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/asset/Asset/CreateAsset`, data);
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted successfully");
      cb();
      setter([]);
      setDisabled(false);
      setIsShowModal(false);
      const obj = {
        title: "Asset Code",
        message: res?.data?.message,
        noAlertFunc: () => {},
      };
      IConfirmModal(obj);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getDepartmenttDDL = async (accId, buId, userId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetDepartmentList?AccountId=${accId}&UnitId=${buId}&Userid=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getAssignToDDLforCreate = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getresponsiblePersonDDLforCreate = async (
  accId,
  buId,
  sbuId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemDDLforCreate = async (accId, buId, plId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetItemListByWhId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WHId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSupplierDDLforCreate = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetSupplierList?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemAttributeforCreate = async (
  itemId,
  accId,
  buId,
  setter
) => {
  try {
    setter([]);
    const res = await Axios.get(
      `/asset/DetalisView/GetItem?ItemId=${itemId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getUOMList = async (
  itemId,
  buId,
  accId,
  setter,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/wms/ItemPlantWarehouse/GetItemUomconversionData?ItemId=${itemId}&BusinessUnitId=${buId}&AccountId=${accId}`
    );
    const data = res?.data?.convertedList;
    const newData = data?.map((item) => {
      return {
        value: item?.value,
        label: item?.label,
      };
    });
    setter(newData);
    setFieldValue("uomName", {
      value: res?.data?.value,
      label: res?.data?.label,
    });
  } catch (error) {}
};

export const getAssetCategoryList = async (setter) => {
  try {
    const res = await Axios.get(`/asset/Asset/AssetCategory`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
