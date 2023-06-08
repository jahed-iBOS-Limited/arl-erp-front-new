import Axios from "axios";
import { toast } from "react-toastify";

export const getWarehouseDDL = async ( accId, buId, plId , setter) => {
    try {
      const res = await Axios.get(
        `/asset/DropDown/GetWareHouseByPlantId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res.data)
      }
    } catch (error) {
      
    }
  };

  export const getServiceDDL = async ( accId, buId, plId ,whId, setter) => {
    try {
      const res = await Axios.get(
        `/asset/DropDown/GetServiceItemListByWhId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WHId=${whId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res.data)
      }
    } catch (error) {
      
    }
  };


  export const getSubTaskListDDL = async ( id, buId, setter) => {
    try {
      const res = await Axios.get(
        `/asset/Asset/GetSubTaskListDDL?businessUnitId=${buId}`
        // `/asset/DropDown/GetServiceItemListByWhId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WHId=${whId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res.data)
      }
    } catch (error) {
      
    }
  };


  export const savesparePartsData = async (data,rowId,setsparePartsData) => {
    try {
      const res = await Axios.post(
        `/asset/MntItemTask/CreateMntItemTask`,
        data
      );
      if (res.status === 200) {
        toast.success(res?.message);
        const newData = await Axios.get(
          `/asset/LandingView/GetMaintenaceTaskItemList?MaintenceTaskId=${rowId}`
        );
        if (newData.status === 200 && newData?.data) {
          setsparePartsData(newData?.data)
        }
      }
    } catch (error) {
      
    }
  };


  export const savesubserviceCostData = async (data,rowId,setsubTaskData) => {
    try {
      const res = await Axios.post(
        `/asset/MntTask/CreateMntSubTask`,
        data
      );
      if (res.status === 200) {
        toast.success(res?.message);
        const newData = await Axios.get(
          `/asset/DetalisView/MaintenceSubTask?MaintenceTaskId=${rowId}`
        );
        if (newData.status === 200 && newData?.data) {
          setsubTaskData(newData?.data)
        }
      }
    } catch (error) {
      
    }
  };

  export const getMaintanaceItemTaskData = async (rowId,setter) => {
    try {
      const res = await Axios.get(
        `/asset/LandingView/GetMaintenaceTaskItemList?MaintenceTaskId=${rowId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {
      
    }
  };

  export const getSubTaskData = async (taskId,setter) => {
    try {
      const res = await Axios.get(
        `/asset/DetalisView/MaintenceSubTask?MaintenceTaskId=${taskId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {
      
    }
  };


  export const getPartsDDL = async ( accId, buId, plId ,whId, setter) => {
    try {
      const res = await Axios.get(
        `/asset/DropDown/GetItemListByWhId?AccountId=${accId}&UnitId=${buId}&PlantId=${plId}&WHId=${whId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res.data)
      }
    } catch (error) {
      
    }
  };


  export const saveItemTaskforEdit = async (data, rowId, setter) => {
    try {
      const res = await Axios.put(
        `/asset/MntItemTask/UpdateMntItemTask`,
        data
      );
      if (res.status === 200) {
        toast.success(res?.message || "Submitted successfully");
         //cb()
         const response = await Axios.get(
          `/asset/LandingView/GetMaintenaceTaskItemList?MaintenceTaskId=${rowId}`
        );
        if (response.status === 200 && response?.data) {
          setter(response?.data);
        }
      }
    } catch (error) {
      
    }
  };

  export const deleteItemData = async (rowId,spareParts,setter) => {
    try {
      const res = await Axios.delete(
        `/asset/MntItemTask/CancelMntItemTask?Id=${rowId}`
      );
      if (res.status === 200 && res?.data) {
        let partsData = spareParts.filter(data => data.rowId !== rowId)
        setter(partsData);
      }
    } catch (error) {
      
    }
  };


  export const saveSubTaskforEdit = async (data, cb) => {
    try {
      const res = await Axios.put(
        `/asset/MntTask/UpdateMntSubTask`,
        data
      );
      if (res.status === 200) {
        toast.success(res?.message || "Submitted successfully");
         //cb()
      }
    } catch (error) {
      
    }
  };
  
  export const deleteSubTaskData = async (rowId,subParts,setter) => {
    try {
      const res = await Axios.delete(
        `/asset/MntTask/CancelMntSubTask?Id=${rowId}`
      );
      if (res.status === 200 && res?.data) {
        let partsData = subParts.filter(data => data.rowId !== rowId)
        setter(partsData);
      }
    } catch (error) {
      
    }
  };
  

  export const getInventoryCurrentBalance = async ({ whId, buId, itemId, setFieldValue, name }) => {
    try {
      const res = await Axios.get(`/asset/DetalisView/GetInventoryCurrentBalance?BusinessUnitId=${buId}&WarehouseId=${whId}&ItemId=${itemId}`);
      if (res.status === 200 && res?.data) {
        let data = Array.isArray(res.data) ? res?.data[0] : null;
        setFieldValue(name, data?.numRate || 0);
        console.log("res?.data", res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  