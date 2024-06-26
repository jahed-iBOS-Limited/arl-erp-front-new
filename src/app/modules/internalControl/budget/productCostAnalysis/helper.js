import Axios from "axios";
import { toast } from "react-toastify";

export const GetBillofMaterialPagination = async (
  accId,
  buId,
  plantId,
  shopFloorId,
  setLoading,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setLoading(true);
  try {
    // const searchPath = search ? `Searchterm=${search}&` : "";
    const res = await Axios.get(
      search
        ? `/mes/BOM/GetBOMPasignation?SearchTerm=${search}&AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
        : `/mes/BOM/GetBOMPasignation?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}&Status=true&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
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

export const getShopFloorDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getGrossWeight = async (accId, buId, plantId, itemId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetItemNetGrossWeight?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getMaterialDDL = async (accId, buId, plantId, search, setter) => {
  const searchPath = search ? `search=${search}` : "";

  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetItemNameRMDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&${searchPath}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getProductDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetItemNameFGDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSingleDataById = async (
  bomId,
  setter,
  setRowDto,
  setCostElementRowData,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(`/mes/BOM/GetBOMView?BOMId=${bomId}`);
    if (res?.status === 200) {
      const {
        plantId,
        plantName,
        shopFloorId,
        shopFloorName,
        billOfMaterialName,
        billOfMaterialId,
        billOfMaterialCode,
        itemId,
        itemName,
        lotSize,
        wastagePercentage,
        isStandardBoM,
        itemCode,
        boMUOMName,
        boMuoMid,
        boMItemVersionName,
        billOfTypeId,
        billOfTypeName,
      } = res?.data?.objHeaderDTO;

      const newData = {
        billOfMaterialId: billOfMaterialId,
        plant: {
          value: plantId,
          label: plantName,
        },
        shopFloor: {
          value: shopFloorId,
          label: shopFloorName,
        },
        bomName: billOfMaterialName,
        bomVersion: boMItemVersionName,
        bomType:
          billOfTypeId > 0 && billOfTypeName !== ""
            ? { value: billOfTypeId, label: billOfTypeName }
            : "",
        // bomType: {
        //   value: billOfTypeId,
        //   label: billOfTypeName,
        // },
        bomCode: billOfMaterialCode,
        product: {
          value: itemId,
          label: itemName,
        },
        lotSize: lotSize,
        netWeight: "",
        wastage: wastagePercentage,
        isStandardBoM: isStandardBoM,
        itemCode: itemCode,
        objList: res?.data?.objList,
        costCenter: "",
        headerUOM: {
          value: boMuoMid,
          label: boMUOMName,
        },
        material: "",
        quantity: "",
      };
      const newRowData = res?.data?.objList?.map((item, index) => ({
        ...item,

        material: {
          value: item?.rowItemId,
          label: item?.rowItemName,
          description: item?.uomName,
        },
        quantity: item?.quantity,
        uomName: item?.uomName,
      }));

      setCostElementRowData(res?.data?.boEdata);
      setRowDto(newRowData);
      setter(newData);
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const getCostElementDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/CostElement/GetCostElementLandingPaging?AccountId=${accId}&BusinessUnitId=${buId}&Status=true&PageNo=0&PageSize=1000&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.data?.map((item) => {
          return {
            ...item,
            value: item?.costElementId,
            label: item?.costElementName,
          };
        })
      );
    }
  } catch (error) {}
};
export const getPreviousBomName = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/BOM/GetBOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const saveBillofMaterial = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/mes/BOM/CreateBillOfMaterial`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const saveEditedBillofMaterial = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/mes/BOM/EditBillOfMaterial`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
