import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getAssetDetailsInformation = async (
  accId,
  buId,
  assetCode,
  setName,
  setUnit,
  setAssetDetails
) => {
  try {
    if (isNaN(+assetCode)) {
      const res = await Axios.get(
        `/asset/DetalisView/GetAssetRegister?AccountId=${accId}&UnitId=${buId}&AssetCode=${assetCode}`
      );
      if (res.status === 200 && res?.data) {
        setName(res?.data[0].itemName);
        setUnit(res?.data[0].businessUnitName);
        setAssetDetails(res.data);
      }
    } else {
      const res = await Axios.get(
        `/asset/DetalisView/GetAssetRegister?AccountId=${accId}&UnitId=${buId}&AssetId=${+assetCode}`
      );
      if (res.status === 200 && res?.data) {
        setName(res?.data[0].itemName);
        setUnit(res?.data[0].businessUnitName);
        setAssetDetails(res.data);
      }
    }
  } catch (error) {}
};

export const getServiceDDL = async (accId, buId, plId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetServiceItemListByWhId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WHId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const saveWorkOrderData = async (
  data,
  cb,
  accId,
  buId,
  plId,
  setter,
  setDisabled,
  setisShowModalforCreate
) => {
  try {
    setDisabled(true);
    const res = await Axios.post(`/asset/Workorder/CreateWorkOrder`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
      setisShowModalforCreate(false);
      const response = await Axios.get(
        //`/asset/LandingView/GetMntWorkOrderList?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}`
        `/asset/LandingView/GetMntWorkOrderList?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&PageNo=${0}&PageSize=${15}&viewOrder=desc`
      );
      if (response.status === 200 && response?.data) {
        setter(response?.data);
      }
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const saveForItemReqData = async (
  maintainId,
  setDisabled,
  profileData
) => {
  try {
    setDisabled(true);

    let payload = {
      assetMaintenanceRefId: +maintainId,
      purpose: "",
      actionBy: profileData?.userId || 0,
    };
    const res = await Axios.post(
      `/asset/MntItemTask/CreateItemRequestForAssetMaintenance`,
      payload
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      //cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const saveForPurchaseRequestData = async (data, unitId, cb) => {
  try {
    const payload = data.map((item) => {
      return {
        unitId: unitId,
        maintanenceId: item?.maintenanceId,
        narration: item?.description,
        actionById: item?.actionBy,
        taskId: item?.serviceId,
      };
    });
    const res = await Axios.post(
      `/asset/Workorder/CreateMaintanancePurchaseRequest`,
      payload
    );
    cb && cb();
    console.log("response", res);
    toast.success(res?.data?.Message || "Submitted successfully");
  } catch (error) {
    toast.error(error?.response?.data?.Message);
  }
};

export const getCostCenterDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetCostCenterList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

const getStatus = (status) => {
  return [
    { label: "Open", value: 1 },
    { label: "Pending", value: 2 },
    { label: "Close", value: 3 },
  ].find((item) => item.label.toLowerCase() === status.toLowerCase());
};

export const getSingleData = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DetalisView/GetMaintenanceWorkOrder?MaintenanceId=${id}`
    );
    if (res.status === 200 && res?.data) {
      let maintainData = res?.data;
      let newData = {
        ...res.data,
        workOrder: maintainData?.assetMaintenanceCode,
        status: getStatus(maintainData?.status),
        reparingType: maintainData?.reparingType,
        startDate: _dateFormatter(maintainData?.startDateTime),
        priority: maintainData?.priorityName,
        costCenter: maintainData?.costCenterId
          ? {
              value: maintainData?.costCenterId,
              label: maintainData?.costCenterName,
            }
          : "",
        assignTo: maintainData?.assign?.length > 0
        ? maintainData?.assign?.map((item) => ({
            value: item?.engineerEmployeeId,
            label: item?.engineerName,
            contactNumber: item?.engineerContact
          }))
        : "",
        note: maintainData?.notes,
        depService: "",
        amount: "",
        description: "",
      };
      setter(newData);
    }
  } catch (error) {}
};

export const getAssignToData = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetEmployeeList?AccountId=${accId}&UnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const saveWorkOrderEdit = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/asset/Workorder/EditWorkOrder`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getServiceDDLForEdit = async (accId, buId, plId, whId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetServiceItemListByWhId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WHId=${whId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const saveWorkOrderTaskData = async (data, mainId, setTaskRowData) => {
  try {
    const res = await Axios.post(`/asset/MntTask/CreateMntTask`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      const newData = await Axios.get(
        `/asset/DetalisView/GetMaintenceTaskRowData?MaintenanceId=${mainId}`
      );

      if (newData.status === 200 && newData?.data) {
        setTaskRowData(newData?.data);
      }
    }
  } catch (error) {}
};

export const getMaintananceTaskRowData = async (mainId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DetalisView/GetMaintenceTaskRowData?MaintenanceId=${mainId}`
    );
    if (res.status === 200 && res?.data) {
      const modifedData = res?.data?.map((data) => ({
        ...data,
        isCheck: false,
      }));
      setter(modifedData);
    }
  } catch (error) {}
};

// export const getAssetListDDL = async (plantId, setter) => {
//   try {
//     const res = await Axios.get(
//       `/asset/DropDown/GetAssetList?PlantId=${plantId}`
//     );
//     if (res.status === 200 && res?.data) {
//       setter(res.data);
//     }
//   } catch (error) {

//   }
// };

export const saveMntTaskforEdit = async (data, cb) => {
  try {
    const res = await Axios.put(`/asset/MntTask/UpdateMntTask`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      //cb()
    }
  } catch (error) {}
};

export const getMaintenanceTaskRowData = async (mainId, setter) => {
  try {
    const newData = await Axios.get(
      `/asset/DetalisView/GetMaintenceTaskRowData?MaintenanceId=${mainId}`
    );

    if (newData.status === 200 && newData?.data) {
      setter(newData?.data);
    }
  } catch (error) {}
};
