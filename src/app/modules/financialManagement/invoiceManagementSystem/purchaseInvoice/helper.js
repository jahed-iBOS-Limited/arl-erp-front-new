import Axios from "axios";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../App";

export const getPurchaseInvoiceGridData = async (
  accId,
  buId,
  SbuId,
  plantId,
  wareId,
  purId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    const res = await Axios.get(
      `/procurement/SupplierInvoice/GetSupplierInvoiceSearchPasignation?${searchPath}AccountId=${accId}&UnitId=${buId}&SbuId=${SbuId}&Plant=${plantId}&WearHouse=${wareId}&PurchaseOrganizationId=${purId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
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

export const savePurchaseInvoice = async (
  data,
  cb,
  setgrnGridData,
  geGrossAmount,
  setGinvoice,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/procurement/SupplierInvoice/CreateSupplierInvoice`,
      data
    );
    // if (res.status === 200) {
    if (res?.data?.statuscode === 200) {
      setgrnGridData([]);
      geGrossAmount("");
      setGinvoice("");
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    } else {
      toast.error(res.data?.message || "Invoice Already Exists");
      setDisabled(false);
    }
    // }
  } catch (error) {
    toast.error(error?.res?.data?.message);
    setDisabled(false);
  }
};

export const CreateAdvanceForSupplier = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/fino/SupplierInvoiceInfo/CreateAdvanceForSupplier`,
      data
    );
    if (res?.data?.statuscode === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    } else {
      toast.error(res.data?.message);
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.res?.data?.message);
    setDisabled(false);
  }
};

export const getPurchaseOrgDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      // `/partner/BusinessPartnerPurchaseInfo/GetPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}`
      `/partner/BusinessPartnerPurchaseInfo/GetPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}&SbuId=${sbuId}`
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

export const getSupplierDDL = async (accId, buId, SBUId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${accId}&UnitId=${buId}&SBUId=${SBUId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetAdvanceForSupplierById = async (poId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/SupplierInvoiceInfo/GetAdvanceForSupplierById?PoId=${poId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPurchaseDDL = async (
  accId,
  buId,
  SBUId,
  pogId,
  plantId,
  wId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetPurchaseOrderPIDDL2?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${SBUId}&PurchaseOrganizationId=${pogId}&PlantId=${plantId}&WarehouseId=${wId}`
    );
    if (res.status === 200 && res?.data) {
      const options = res.data
        .map((item) => ({
          ...item,
          value: item.intPurchaseOrderId,
          label: item.intPurchaseOrderNumber,
        }))
        .sort(function compare(a, b) {
          if (a.label > b.label) {
            return -1;
          }
          if (a.label < b.label) {
            return 1;
          }
          return 0;
        });
      setter(options);
      // setter(res?.data);
    }
  } catch (error) {}
};

export const getGRNDDL = async (
  accId,
  buId,
  SBUId,
  plantId,
  wareId,
  refId,
  refCode,
  setter
) => {
  try {
    const res = await Axios.get(
      // `/wms/InventoryTransaction/GetGrnDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${SBUId}&PlantId=${plantId}&WarehouseId=${wareId}`
      `/wms/InventoryTransaction/GetGrnDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${SBUId}&PlantId=${plantId}&WarehouseId=${wareId}&ReferenceId=${refId}&ReferenceCode=${refCode}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSingleDataForEdit = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/SupplierInvoice/GetSupplierInvoiceById?SupplierInvoiceId=${id}`
    );
    if (res.status === 200 && res?.data) {
      let setDtoValue = res?.data?.objHeaderDTO;
      let newData = {
        objHeaderDTO: {
          ...res?.data?.objHeaderDTO,
          SBU: {
            label: setDtoValue.sbuname,
            value: setDtoValue.sbuid,
          },
          purchaseOrg: {
            label: setDtoValue.purchaseOrganizationName,
            value: setDtoValue.purchaseOrganizationId,
          },
          plant: {
            label: setDtoValue.plantName,
            value: setDtoValue.plantId,
          },
          warehouse: {
            label: setDtoValue.warehouseName,
            value: setDtoValue.warehouseId,
          },
          supplierName: {
            label: setDtoValue.businessPartnerName,
            value: setDtoValue.businessPartnerId,
          },
          purchaseOrder: {
            label: setDtoValue.purchaseOrderNo,
            value: setDtoValue.purchaseOrderId,
            purchaseOrganizationName: setDtoValue.purchaseOrganizationName,
            plant: setDtoValue.plantName,
            warehouseName: setDtoValue.warehouseName,
            supplierName: setDtoValue.supplierName,
            advanceAdjustmentAmount: setDtoValue.advanceAdjustmentAmount,
            totalPOAmount: setDtoValue.totalPOAmount,
          },
          checked: false,
          attachmentId: setDtoValue?.attachmentId,
        },
        objRowListDTO: [...res?.data?.objRowListDTO],
      };
      setter(newData);
    }
  } catch (error) {}
};

export const getSingleData = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/SupplierInvoice/GetSupplierInvoiceById?SupplierInvoiceId=${id}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const savePurchaseEditInvoice = async (
  data,
  cb,
  setDisabled,
  singleDataCB
) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/procurement/SupplierInvoice/EditSupplierInvoice`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Update successfully");
      setDisabled(false);
      singleDataCB();
      //cb()
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const purchaseInvoiceAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const purchaseInvoiceImageFile_api = async (id) => {
  try {
    const res = await Axios.get(
      `${APIUrl}/domain/Document/DownlloadFile?id=${id}`
    );

    if (res.status === 200 && res.data) {
      return res?.config?.url;
    }
  } catch (error) {}
};



export const postCancelInvoiceAction = async (
  POId
) => {
  try {
    const res = await Axios.put(
      //`/procurement/PurchaseOrder/CancelPurchaseRequest?PurchaseOrderId=${POId}&OrderType=${POorderTypeID}&RefType=${refTypeId}`
    );
    if (res.status === 200) {
      toast.success("Cancel Successfully")
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Cancel Failed")
  }
};











