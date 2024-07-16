import * as requestFromServer from "./Api";
import { setLastPoDataAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { purchaseOrderSlice } from "./Slice";
import { toast } from "react-toastify";
import axios from "axios";
import { imarineBaseUrl } from "../../../../../App";
const { actions: slice } = purchaseOrderSlice;

export const getSupplierNameDDLAction = (accId, buId, sbuId) => (dispatch) => {
  return requestFromServer
    .getSupplierNameDDL(accId, buId, sbuId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSupplierNameDDL(data));
      }
    });
};

export const getCurrencyDDLAction = (accId, orgId, buId) => (dispatch) => {
  return requestFromServer.getCurrencyDDL(accId, orgId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCurrencyDDL(data));
    }
  });
};

// get orderTypeDDL
export const getOrderTypeListDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getOrderTypeListDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetOrderTypeDDL(data));
    }
  });
};

// get poreference type ddl
export const getPoReferenceTypeDDLAction = (orderTypeId) => (dispatch) => {
  return requestFromServer.getPOReferenceTypeDDL(orderTypeId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPoReferenceTypeDDL(data));
    }
  });
};

// get POReferenceNoDDL
export const getPOReferenceNoDDLAction = (id, wareHouseId, orderTypeId) => (
  dispatch
) => {
  return requestFromServer
    .getPOReferenceNoDDL(id, wareHouseId, orderTypeId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetPoReferenceNoDDL(data));
      }
    });
};

// get item based on reference or without reference
export const getPOItemDDLAction = (
  orderTypeId,
  accId,
  buId,
  sbuId,
  orgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getPOItemDDL(
      orderTypeId,
      accId,
      buId,
      sbuId,
      orgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        let newData = [];
        data.forEach((item) => {
          let index = newData.findIndex((x) => x.label === item.label);
          if (index === -1) {
            newData.push(item);
          }
        });
        dispatch(slice.SetPoItemsDDL(newData));
      }
    });
};

// get service item based on reference or without reference
export const getPOItemForStandradItemDDLAction = (
  orId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getStandradPOItemDDL(
      orId,
      accId,
      buId,
      sbuId,
      purchaseOrgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { data } = res;
      let newData = data?.filter((item) => item?.restofQty > 0);
      dispatch(slice.SetPoItemsDDL(newData));
    });
};

// get service item based on reference or without reference
export const getPOItemForContractItemDDLAction = (
  orId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getContractPOItemDDL(
      orId,
      accId,
      buId,
      sbuId,
      purchaseOrgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetPoItemsDDL(data));
      }
    });
};

// get service item based on service po
export const getPOItemForServiceItemDDLAction = (
  orId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getServicePOItemApi(
      orId,
      accId,
      buId,
      sbuId,
      purchaseOrgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { data } = res;
      let newData = data?.filter((item) => item?.restofQty > 0);
      dispatch(slice.SetPoItemsDDL(newData));
    });
};

// get service item based on asset po
export const getPOItemForAssetItemDDLAction = (
  orId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getAssetPOItemApi(
      orId,
      accId,
      buId,
      sbuId,
      purchaseOrgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { data } = res;
      let newData = data?.filter((item) => item?.restofQty > 0);
      dispatch(slice.SetPoItemsDDL(newData));
    });
};

// get service item based on return po
export const getPOItemForReturnItemDDLAction = (
  orId,
  accId,
  buId,
  sbuId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getReturnPOItemApi(
      orId,
      accId,
      buId,
      sbuId,
      purchaseOrgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetPoItemsDDL(data));
      }
    });
};

// get service item based on reference or without reference
export const getPOWihoutServiceItemDDLAction = (
  accId,
  buId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getServicePOItemDDL(
      accId,
      buId,
      purchaseOrgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { data } = res;
      let newData = data?.filter((item) => item?.restofQty > 0);
      dispatch(slice.SetPoItemsDDL(newData));
    });
};

// get item based on reference or without reference
export const getPOItemWithoutRefDDLAction = (
  accId,
  buId,
  purchaseOrgId,
  plantId,
  whId,
  partnerId,
  refTypeId,
  refNoId
) => (dispatch) => {
  return requestFromServer
    .getPOItemWithoutRefDDL(
      accId,
      buId,
      purchaseOrgId,
      plantId,
      whId,
      partnerId,
      refTypeId,
      refNoId
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetPoItemsDDL(data));
      }
    });
};

// get payment terms list ddl
export const getPaymentTermsListDDLAction = () => (dispatch) => {
  return requestFromServer.getPaymentTermsListDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPaymentTermsDDL(data));
    }
  });
};

// get inco terms list ddl
export const getIncoTermsListDDLAction = () => (dispatch) => {
  return requestFromServer.getIncotermListDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetIncoTermsListDDL(data));
    }
  });
};

export const getPlantListDDLAction = (userId, accId, buId) => (dispatch) => {
  return requestFromServer.getPlantDDL(userId, accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setPlantDDL(data));
    }
  });
};

export const getWareHouseDDLAction = (userId, accId, buId, plantId) => (
  dispatch
) => {
  return requestFromServer
    .getWareHouseDDL(userId, accId, buId, plantId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setWareHouseDDL(data));
      }
    });
};

export const getGridAction = (
  accId,
  buId,
  sbuId,
  plantId,
  whId,
  poTypeId,
  pOrgId,
  refTypeId,
  status,
  fromDate,
  toDate,
  setLoading,
  pageNo,
  pageSize,
  searchValue,
  isClose
) => (dispatch) => {
  setLoading(true);

  if (fromDate) {
    if (!toDate) {
      setLoading(false);
      return toast.warning("To date is Required");
    }
  }

  if (toDate) {
    if (!fromDate) {
      setLoading(false);
      return toast.warning("From date is Required");
    }
  }

  return requestFromServer
    .getGridData(
      accId,
      buId,
      sbuId,
      plantId,
      whId,
      poTypeId,
      pOrgId,
      refTypeId,
      status,
      fromDate,
      toDate,
      pageNo,
      pageSize,
      searchValue,
      isClose
    )
    .then((res) => {
      setLoading(false);
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.setGridData(data));
      }
    })
    .catch((err) => {
      setLoading(false);
    });
};
export const getSingleDataAction = (id, poType) => (dispatch) => {
  return requestFromServer.getSingleData(id, poType).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setSingleData(data[0]));
    }
  });
};

export const getSingleDataForReturnAction = (id) => (dispatch) => {
  return requestFromServer.getSingleforReturnData(id).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.setSingleData(data[0]));
    }
  });
};
//org
export const savePurchaseOrderForAssetStandardService = (
  payload,
  IConfirmModal
) => (dispatch) => {
  return requestFromServer
    .saveCreateDataForAssetStandardService(payload?.data)
    .then((res) => {
      if (res.status === 200) {
        // toast.success(res.data?.message || "Submitted successfully");
        payload.cb(res);
        payload.setDisabled(false);
        const obj = {
          title: res.data?.message,
          code: "00987",
          noAlertFunc: () => {
            //window.location.reload();
          },
        };
        payload.IConfirmModal(obj);

        if (payload.estimatePDAPOPage) {
          const estimatePdaid =
            payload.estimatePDAPOPage?.estimatePDAList?.[0]?.estimatePdaid;
          savePoEstimatePDARowApi({
            payload,
            message: res.data?.message,
            setDisabled: payload.setDisabled,
            cb: () => {
              setTimeout(() => {
                payload.history.push(
                  `/ShippingAgency/Transaction/EstimatePDA/edit/${estimatePdaid}`
                );
              }, 2000);
            },
          });
        }
      }
      dispatch(setLastPoDataAction(res.data?.message));
    })
    .catch((err) => {
      payload.setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};

export const savePurchaseOrderForReturnStandardService = (
  payload,
  IConfirmModal
) => () => {
  return requestFromServer
    .saveCreateDataForReturnStandardService(payload?.data)
    .then((res) => {
      if (res.status === 200) {
        // toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        //payload.setDisabled(false);
        const obj = {
          title: res.data?.message,
          code: "00987",
          noAlertFunc: () => {},
        };
        payload.IConfirmModal(obj);
      }
    })
    .catch((err) => {
      // payload.setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};

export const saveCreateDataForPurchaseContractAction = (
  payload,
  IConfirmModal
) => () => {
  return requestFromServer
    .saveCreateDataForPurchaseContract(payload?.data)
    .then((res) => {
      if (res.status === 200) {
        // toast.success(res.data?.message);
        payload.cb();
        payload.setDisabled(false);
        const obj = {
          title: res.data?.message,
          code: "00987",
          noAlertFunc: () => {},
        };
        payload.IConfirmModal(obj);
      }
    })
    .catch((err) => {
      payload.setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};

const savePoEstimatePDARowApi = async ({
  payload,
  message,
  setDisabled,
  cb,
}) => {
  const estimatePDAList =
    payload.estimatePDAPOPage?.estimatePDAList?.map(
      (itm) => itm?.estimatePdarowId
    ) || [];

  const splitMessage = message.split(":");
  const purchaseOrderNo = splitMessage[1].trim();

  const _payload = {
    poCode: purchaseOrderNo,
    estimatePdaid: payload.estimatePdaid,
    estimatePdarowId: estimatePDAList,
  };

  try {
    setDisabled(true);
    const res = await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/SavePoEstimatePDARow`,
      _payload
    );

    toast.success("Submitted Successfully");
    cb(res?.data);
    setDisabled(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

// Edit

export const editPurchaseOrderForAssetStandardService = (payload) => () => {
  return requestFromServer
    .editCreateDataForAssetStandardService(payload?.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
        payload.singleCB();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};

export const editPurchaseReturn = (payload) => () => {
  return requestFromServer
    .editPurchaseReturnApi(payload?.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        //payload.setDisabled(false);
        payload.singlereturnCB();
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      //payload.setDisabled(false);
    });
};

export const editCreateDataForPurchaseContractAction = (payload) => () => {
  return requestFromServer
    .editCreateDataForPurchaseContract(payload?.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};
