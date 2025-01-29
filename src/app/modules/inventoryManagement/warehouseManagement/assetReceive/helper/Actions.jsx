import Axios from "axios";
import { toast } from "react-toastify";
import { setLastInvDataAction } from '../../../../_helper/reduxForLocalStorage/Actions'


export const getSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getPlantDDL = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getWarehouseDDL = async (userId, accId, buId, plantId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const fetchLandingData = async (
  fromDate,
  toDate,
  accId,
  buId,
  plId,
  whId,
  sbuId,
  setter,
  setLoading,
  PageNo,
  pageSize,
  setTotalCount,
  search
) => {
  const searchPath = search ? `searchTerm=${search}&` : "";
  const pageNo = search ? 0 : PageNo;
  try {
    setter([]);
    setLoading(true);
    const res = await Axios.get(
      `/wms/AssetTransection/GetAssetReceiveSearchLandingPagination?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plId}&fromDate=${fromDate}&toDate=${toDate}&WarehouseId=${whId}&SBUId=${sbuId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res?.status === 200 && res?.data) {
      setTotalCount(res?.data?.totalCount);
      // let newData = res?.data.data.sort(function(a, b) {
      //   // return a.purchaseOrderNo > b.purchaseOrderNo
      //   if (a.purchaseOrderNo < b.purchaseOrderNo) {
      //     return -1
      //   }
      //   if (a.purchaseOrderNo > b.purchaseOrderNo) {
      //     return 1
      //   }
      //   return 0
      // })
      setter(res?.data?.data);
      setLoading(false);
    }
    // if(res.status === 500){
    //   toast.error(res?.message)
    //   setter([]);
    // }
  } catch (error) {
    setLoading(false);
  }
};

export const saveAssetReceive = async (data, cb, setGridData, setDisabled, IConfirmModal, dispatch) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/wms/AssetTransection/CreateAssetTransecionForReceive`,
      data
    );
    if (res?.data?.statuscode === 406) {
      setDisabled(false);
      return toast.warning(res?.data?.message);
    }
    if (res?.status === 200) {
      setGridData([]);
      // toast.success(res?.message || "Created successfully");

      const obj = {
        title: res?.data?.message,
        noAlertFunc: () => {
          //window.location.reload();
        },
      };
      IConfirmModal(obj)
      dispatch(setLastInvDataAction(res?.data?.message))
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getPoNumberDDL = async (
  accId,
  buId,
  plId,
  whId,
  sbuId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/wms/AssetTransection/GetAssetReceiveDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plId}&WarehouseId=${whId}&SBUId=${sbuId}`
    );
    if (res?.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) { }
};

export const getRowDtoData = async (acId, buId, poId, shipId, setter) => {
  try {
    const res = await Axios.get(
      // `/wms/AssetTransection/GetAssetReceiveById?PurchaseOrderId=${id}`
      `/wms/InventoryTransaction/GetItemForAllPOByShipmentId?intAccount=${acId}&intUnit=${buId}&intPOId=${poId}&intShipId=${shipId}&intReffTypeId=0`
    );
    if (res?.status === 200 && res?.data) {
      let newData = res?.data?.map((data) => {
        return {
          itemId: data?.intItemId,
          itemName: data?.strItemName,
          itemCode: data?.strItemCode,
          itemDescription: data?.strPurchaseDescription,
          poQuantity: data?.numOrderQty,
          receiveQuantity: data?.numReceiveQty || 0,
          restQty: data?.numRestQty || 0,
          netValue: data?.numTotalValue || 0,
          uoMId: data?.intUoMId,
          location: "",
          uoMName: data?.strUoMName,
          locationddl: data?.locationddl,
          receiveAmount: 0,
          quantity: 0,
          vatValue: data?.numVatAmount || 0,
          discount: data?.numDiscount || 0,
          totalVat: 0,
          netTotalValue: 0,
          baseBalue: data?.numBasePrice,
          referenceId: data?.intReferenceId
        };
      });
      setter(newData);
    }
  } catch (error) { }
};


export const getRowDtoForForeignPOData = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/wms/AssetTransection/GetAssetReceiveByIdByShipmentId?ShipmentId=${id}`
    );
    if (res.status === 200 && res?.data) {
      let newData = res?.data?.map((data) => {
        return {
          itemId: data?.itemId,
          itemName: data?.itemName,
          itemCode: data?.itemCode,
          itemDescription: data?.itemDescription,
          poQuantity: data?.poQuantity,
          receiveQuantity: data?.receiveQuantity || 0,
          restQty: data?.restQty || 0,
          netValue: data?.transactionValue || 0,
          uoMId: data?.uoMId,
          location: "",
          uoMName: data?.uoMName,
          locationddl: data?.locationddl,
          receiveAmount: 0,
          quantity: 0,
          vatValue: data?.vatValue || 0,
          discount: data?.discount || 0,
          totalVat: 0,
          netTotalValue: 0
        };
      });
      setter(newData);
    }
  } catch (error) { }
};


export const attachment_action = async (attachment) => {
  try {
    let formData = new FormData();
    formData.append("files", attachment[0]);
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    return data;
  } catch (err) {
    toast.error("Document not upload");
  }
};

export const getSingleDataForEdit = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/wms/AssetTransection/GetAssetReceiveByIdfromAsset?AssetId=${id}`
    );
    if (res?.status === 200 && res?.data) {
      let setDtoValue = res?.data[0];
      let objHead = setDtoValue?.objHeader;
      let rowHead = setDtoValue?.objRow?.map((data) => {
        return {
          rowId: data?.rowId,
          itemId: data?.itemId,
          itemName: data?.itemName,
          itemCode: data?.itemCode,
          itemDescription: data?.itemDescription,
          poQuantity: data?.poQuantity,
          receiveQuantity: data?.receiveQuantity,
          uoMId: data?.uoMid,
          uoMName: data?.uoMname,
          quantity: data?.numTransactionQuantity,
          numTransactionQuantity: data?.numTransactionQuantity,
          monTransactionValue: data?.monTransactionValue,
          referenceId: data?.intReferenceId
        };
      });
      let newData = {
        objHeader: {
          ...setDtoValue?.objHeader,
          poNumber: {
            value: objHead?.referenceId,
            label: objHead?.referenceCode,
          },
          poAmount: objHead?.poAmount,
          adjustedAmount: objHead?.poAdjust,
          supplier: {
            value: objHead?.businessPartnerId,
            label: objHead?.businessPartnerName,
          },
          comment: objHead?.comments,
        },
        objRow: rowHead,
      };
      setter(newData);
    }
  } catch (error) { }
};

export const saveCreateServiceEdit = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/wms/AssetTransection/EditServiceTransectionForreceive
      `,
      data
    );
    if (res?.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      //cb()
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};

export const empAttachment_action = async (attachment, cb) => {
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
    //toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};



export const getReportAssetReceive = async (prId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/InventoryView/GetAssetReceiveByIdView?AssetId=${prId}`
    );
    setter(res?.data[0]);
  } catch (error) { }
};



export const saveAttchmentForPo = async (data, cb) => {
  try {
    const res = await Axios.post(`/wms/InventoryDocument/CreateInventoryDocumentAttachment`, data);
    if (res?.status === 200) {
      cb()
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
    )
    if (res?.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {

  }
}


export const CancelDocumentAction = async (
  docId,
  refId,
  cb
) => {
  try {
    const res = await Axios.put(
      `/wms/InventoryDocument/CancelDocumentAttachmets?DocId=${docId}&ReferenceId=${refId}`
    );
    if (res.status === 200) {
      //setter(res?.data);
      cb()
      toast.success("Cancel Successfully")
      //setLoading(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Cancel Failed")
  }
};

export const inventoryTransactionCancelAction = async (
  code,
  buId,
  userId,
  viewGridData,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.post(
      `/wms/InventoryTransaction/CancelInventory?InvCode=${code}&UnitId=${buId}&ActionById=${userId}`
    );
    setLoading(false);
    toast.success(res?.data?.message || "Cancel successfully");
    viewGridData();
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message || "Something went wrong");
  }
};















