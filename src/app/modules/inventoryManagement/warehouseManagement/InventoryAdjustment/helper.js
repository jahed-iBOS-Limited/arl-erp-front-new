import Axios from "axios";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../App";

export const inventoryTransactionCancelAction = async (
  code,
  buId,
  userId,
  viewGridData,
  values,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.post(
      `/wms/InventoryTransaction/CancelInventory?InvCode=${code}&UnitId=${buId}&ActionById=${userId}`
    );
    setLoading(false);
    toast.success(res?.data?.message || "Cancel successfully");
    viewGridData(values);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
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

export const getWareForTransferDDL = async (
  userId,
  accId,
  buId,
  plantId,
  prevWare,
  currentPlnt,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      let wareData;
      if (plantId === currentPlnt) {
        wareData = res?.data.filter((data) => data?.value !== prevWare);
      } else {
        wareData = res?.data;
      }
      setter(wareData);
    }
  } catch (error) {}
};

export const getWareDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const transGrupDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryTransaction/GetTransectionGroupDDL`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const empAttachment_action = async (attachment, setUploadImage) => {
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
    setUploadImage && setUploadImage(data);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Document not upload");
  }
};

export const uploadAttachment = (attachment) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  return Axios.post("/domain/Document/UploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getImageFile_api = async (id) => {
  try {
    const res = await Axios.get(
      `${APIUrl}/domain/Document/DownlloadFile?id=${id}`
    );

    if (res.status === 200 && res.data) {
      return res?.config?.url;
    }
  } catch (error) {}
};

export const getReportForInvReq = async (prId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryView/GetInvTransectionByIdView?TransectionId=${prId}`
    );
    setter(res?.data[0]);
  } catch (error) {}
};

export const getReportForInvReqW2w = async (prId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryView/GetInvTransectionByIdViewWtoW?TransectionId=${prId}`
    );
    setter(res?.data[0]);
  } catch (error) {}
};

export const getReportForInvReqInternal = async (prId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryView/GetInternalInventoryTransaction?TransectionId=${prId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const saveAttchmentForPo = async (data, cb) => {
  try {
    const res = await Axios.post(
      `/wms/InventoryDocument/CreateInventoryDocumentAttachment`,
      data
    );
    if (res.status === 200) {
      cb();
      toast.success(res?.message || "Submitted successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getAttachmentLandingData = async (refId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryDocument/GetInventoryDocumentAttachment?ReferenceId=${refId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const CancelDocumentAction = async (docId, refId, cb) => {
  try {
    const res = await Axios.put(
      `/wms/InventoryDocument/CancelDocumentAttachmets?DocId=${docId}&ReferenceId=${refId}`
    );
    if (res.status === 200) {
      //setter(res?.data);
      cb();
      toast.success("Cancel Successfully");
      //setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Cancel Failed");
  }
};

export const getForeignPurchaseDDL = async (poId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/Import/GetImportShipmentDDL?PoId=${poId}&PlantId=${sbuId}`
    );
    setter(res?.data);
  } catch (error) {}
};

export const uplaodAttachment = async (attachment, setUploadImage) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setUploadImage(data);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Document not upload");
  }
};

export const GetMESConfigurationBusinessUnitWiseByAccountId = async (
  accId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/mes/BOM/GetMESConfigurationBusinessUnitWiseByAccountId?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res.data);
  } catch (error) {}
};
