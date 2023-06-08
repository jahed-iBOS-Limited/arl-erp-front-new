import axios from "axios";
import { toast } from "react-toastify";

export const getProductionLineDDL = async (
  shopfloorId,
  accId,
  buId,
  setter
) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetProductionLineDDL?AccountId=${accId}&BusinessUnitid=${buId}&ShopfloorId=${shopfloorId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getPlantNameDDl = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPlantNameDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getEmployeeIdDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getUOMDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getAssetIdDDL = async (plantId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetAssetDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const createWorkCenter = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.post(`/mes/WorkCenter/CreateWorkCenter`, data);

    if (res.status === 200 && res.data) {
      toast.success(res.data?.message || "Created successfully", {
        toastId: "createWorkCenter",
      });
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getWorkCenterLanding = async (
  accId,
  buId,
  plantId,
  setLoader,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setLoader(true);
  try {
    const searchPath = search ? `Searchterm=${search}&` : "";

    const res = await axios.get(
      // `/mes/WorkCenter/GetWorkCenterPagination?accountId=${accId}&businessUnitId=${buId}&status=true&PageNo=1&PageSize=100&viewOrder=desc`
      `/mes/WorkCenter/GetWorkCenterPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&PlantId=${plantId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );

    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};

export const getItemAttribute = async (itemId, accId, buId, setter) => {
  try {
    setter([]);
    const res = await axios.get(
      `/mes/MesDDL/GetItemNameFGDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.label + ` [${item?.code}]`,
          };
        })
      );
    }
  } catch (error) {}
};

export const getShopFloorIdDDL = async (plantId, accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getWorkCenterById = async (
  workcenterId,
  accId,
  buId,
  setter1,
  setter2
) => {
  try {
    const res = await axios.get(
      `/mes/WorkCenter/GetWorkCenterById?WorkCenterId=${workcenterId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res?.data) {
      const {
        getByIdHeader: {
          plantId,
          plantName,
          productionLineName,
          productionLineId,
          workCenterName,
          workCenterCode,
          workCenterCapacity,
          setupTime,
          machineTime,
          laborQty,
          laborTime,
          laborCost,
          assetId,
          employeeId,
          shopFloorId,
          shopFloorName,
          uomid,
          uomName,
        },
        getByIdRow,
      } = res?.data;

      const newData = {
        plantName: { value: plantId, label: plantName },
        productionLine: { value: productionLineId, label: productionLineName },

        workcenterName: workCenterName,
        workcenterCode: workCenterCode,
        workCenterCapacity: workCenterCapacity > 0 ? workCenterCapacity : "",
        setupTime: setupTime > 0 ? setupTime : "",
        machineTime: machineTime > 0 ? machineTime : "",
        laborQty: laborQty > 0 ? laborQty : "",
        laborTime: laborTime > 0 ? laborTime : "",
        laborCost: laborCost > 0 ? laborCost : "",
        assetId: {
          value: assetId ? assetId : "",
          label: assetId ? assetId : "",
        },
        employeeId: {
          value: employeeId ? employeeId : "",
          label: employeeId ? employeeId : "",
        },
        shopFloorId: { value: shopFloorId, label: shopFloorName },
        UomName: { value: uomid, label: uomName },
      };

      setter1(newData);
      setter2(getByIdRow);
    }
  } catch (error) {}
};

export const editWorkCenter = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(`/mes/WorkCenter/EditWorkCenter`, data);
    if (res.status === 200 && res.data) {
      toast.success(res.data?.message || "Edited successfully", {
        toastId: "editWorkCenter",
      });
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};
