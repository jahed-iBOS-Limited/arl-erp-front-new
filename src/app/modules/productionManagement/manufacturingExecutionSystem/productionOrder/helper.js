import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _todayDate } from "../../../_helper/_todayDate";

export const GetPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getShopFloorDDL = async (accId, buId, pId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetShopfloorDDL?AccountId=${accId}&BusinessUnitid=${buId}&PlantId=${pId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

// itemName ddl
export const getItemNameDDL = async (accId, buId, plantId, sid, setter) => {
  try {
    const res = await Axios.get(
      // previous api - /mes/MesDDL/GetItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}
      `/mes/MesDDL/GetItemNameByBOMandRouting?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${sid}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            label: item?.label + " [" + item?.code + "]",
          };
        })
      );
    }
  } catch (error) { }
};
// GetWorkCenterDDL ddl
export const getRoutingToWorkCenterDDL = async (
  accId,
  buId,
  shoopfloorId,
  itemId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetRoutingToWorkCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&ShoopfloorId=${shoopfloorId}&ItemId=${itemId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
// BOM Name DDL
export const getRoutingToBOMDDL = async (
  accId,
  buId,
  itemId,
  workCenterId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetRoutingToBOMDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemId=${itemId}&WorkCenterId=${workCenterId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
// prt number ddl
export const getPTRNumberDDL = async (accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetPTRNumberDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
// create productionOrder
export const createProductionOrder = async (
  data,
  cb,
  setDisabled,
  accId,
  buId,
  setProductionOrderSFG,
  setProductionId,
  setSubPo
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/mes/ProductionOrder/CreateProductionOrder`,
      data
    );
    if (res.status === 200) {
      // console.log(res?.data,"id")

      setDisabled(false);
      await setSubPo(data);
      await setProductionId(res?.data);
      await getProductionOrderSFGById(
        res?.data?.key,
        accId,
        buId,
        setProductionOrderSFG,
        "",
        data?.plantId
      );
      toast.success(res.data?.message || "Submitted successfully");
      cb();
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

// Get by ID
export const getById = async (id, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/mes/ItemRequest/GetProductionDtailsById?ProductionOrderId=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(
        res?.data?.map((item) => {
          return {
            ...item,
            qty: item?.suggestionQty,
            isError: false,
          };
        })
      );
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

// production landing
export const getItemTransferInPagination = async (
  accId,
  buId,
  plantId,
  shopFloorId,
  statusId,
  setLoader,
  setter,
  pageNo,
  pageSize,
  search
) => {
  setLoader(true);
  const searchPath = search ? `searchTerm=${search}&` : "";
  try {
    const res = await Axios.get(
      `/mes/ProductionOrder/ProductionOrderSearchLandingPagination?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&ShopFloorId=${shopFloorId}&status=${statusId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      const newResData = res?.data?.data?.map((item) => {
        return {
          ...item,
          isItemRequestFalse: item?.isDeleteEnable,
          isItemRequestCheck: false,
        };
      });
      setter({
        ...res?.data,
        data: newResData,
      });
      setLoader(false);
    }
  } catch (error) {
    setLoader(false);
  }
};
// production single ID is
export const getProductionOrderById = async (productionOrderId, setter) => {
  try {
    const res = await Axios.get(
      `/mes/ProductionOrder/GetProductionOrderById?ProductionOrderById=${productionOrderId}`
    );
    if (res.status === 200 && res?.data) {
      const index = res?.data[0];
      const newData = {
        productionOrderId: index?.productionOrderId,
        uomid: index?.uomid,
        itemName: {
          value: index?.itemId,
          label: index?.itemName + " [" + index?.itemCode + "]",
        },
        plantName: {
          value: index?.plantId,
          label: index?.plantName,
        },
        bomName: {
          value: index?.bomId,
          label: index?.bomName,
        },
        workCenter: {
          value: index?.workCenterId,
          label: index?.workCenterName,
        },
        numOrderQty: index?.orderQty,
        salesOrderId: index?.salesOrderId,
        prtNumber: {
          value: index?.ptrId,
          label: index?.ptrName,
        },
        startDate: _dateFormatter(index?.startDate),
        startTime: index?.startTime,
        endDateTime: _dateFormatter(index?.endDate),
        endTime: index?.endTime,
        bomVersion: index?.bomVersion,
        baseUomName: index?.uomName,

      };
      setter(newData);
    }
  } catch (error) { }
};
// edit production order

export const editProductionOrder = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/mes/ProductionOrder/EditProductionOrder`,
      data
    );
    if (res.status === 200) {
      setDisabled(false);
      toast.success(res?.message || "Edited successfully");
    }
  } catch (error) {
    setDisabled(false);
  }
};
// GetProductionOrderSFGById
export const getProductionOrderSFGById = async (
  productionOrderId,
  accId,
  buId,
  setter,
  orderQty
) => {
  try {
    const res = await Axios.get(
      `/mes/ProductionOrder/GetProductionOrderSFGById?ProductionOrderId=${productionOrderId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      console.log(res.data);
      let newData = res?.data?.map((item) => ({
        ...item,
        startDate: _todayDate(),
        startTime: "",
        endDate: "",
        endTime: "",
        prtNumber: "",
        workCenter: "",
        bomName: "",
        proOrderQty: "",
        orderQuantity: orderQty,
      }));
      setter(newData);
    }
  } catch (error) { }
};
// create sub-po
export const createSFGProductionOrder = async (data) => {
  const payload = {
    productionOrderId: +data?.productionOrderId,
    itemId: +data?.itemId,
    itemCode: data?.itemCode,
    itemName: data?.itemName,
    billOfMaterialId: +data?.bomName?.value,
    workCenterId: +data?.workCenter?.value,
    numOrderQty: +data?.proOrderQty,
    uomid: +data?.uomid,
    startDate: data?.startDate,
    startTime: data?.startTime,
    endDate: data?.endDate,
    endTime: data?.endTime,
    itemIdTools: +data?.prtNumber?.value || 0,
    actionBy: 0,
  };
  try {
    const res = await Axios.post(
      `/mes/ProductionOrder/CreateSFGProductionOrder`,
      payload
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
// is close
export const productionOrderClose = async (
  poId,
  accId,
  buId,
  plantId,
  setLoader,
  setter,
  pageNo,
  pageSize
) => {
  setLoader(true);
  try {
    const res = await Axios.put(
      `/mes/ProductionOrder/ProductionOrderClose?ProductionId=${poId}`
    );
    if (res.status === 200) {
      toast.success("PO rejected successfully");
      getItemTransferInPagination(
        accId,
        buId,
        plantId,
        setLoader,
        setter,
        pageNo,
        pageSize
      );
      setLoader(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};

// isSOUseOnProductionOrder
export const isSOUseOnProductionOrder = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/SalesOrder/isSOUseOnProductionOrder?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getSubOrderQty = async (bomId, orderQty) => {
  try {
    const res = await Axios.get(
      `/mes/MesDDL/GetSubOrderQuantity?BomId=${bomId}&Po_OrderQty=${orderQty}`
    );
    if (res.status === 200 && res?.data) {
      console.log(res?.data);
    }
  } catch (error) { }
};

export const createItemRequest = async (
  payload,
  cb,
  setLoading,
  popUpCallback
) => {
  setLoading(true);
  try {
    const res = await Axios.post(`/mes/ItemRequest/CreateItemRequest`, payload);
    if (res.status === 200 && res?.data) {
      cb();
      if (res?.data) {
        popUpCallback(res?.data?.message); // Assign By Sohag (Backend)
      }
      setLoading(false);
    }
  } catch (error) {
    toast.warn(error?.response?.data?.message, {
      toastId: "createItemRequestERR",
    });
    setLoading(false);
  }
};

export const getSBUDDL_Api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getPlantDDL_api = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getWarehouseDDL_api = async (
  userId,
  accId,
  buId,
  plantId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};
export const saveItemRequest_api = async (
  data,
  cb,
  setGridData,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(`/wms/ItemRequest/CreateItemRequest`, data);
    if (res.status === 200) {
      setGridData([]);
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const itemRequest_api = async (data, setter, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/mes/ItemRequestNew/GetItemRequiremtDetailsForItemRequest`,
      data
    );
    if (res.status === 200) {
      setter(res?.data);
      // toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message || "Submitted successfully");
  }
};

export const createItemRequestNew = async (data, cb, IConfirmModal, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/mes/ItemRequestNew/CreateItemRequestNew`,
      data
    );
    //toast.success(res?.message || "Submitted successfully");
    console.log("res", res)
    cb();
    setDisabled(false);
    const obj = {
      title: res?.data?.message,
      code: "00987",
      noAlertFunc: () => {
        //window.location.reload();
      },
    };
    IConfirmModal(obj);
  } catch (error) {
    setDisabled(false);
    toast.warning(error?.response?.data?.message);
  }
};

export const getBoMDetailsByBoMId = async (
  bomMaterialId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/BOM/GetBoMDetailsByBoMId?billOfMaterialId=${bomMaterialId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};