import * as requestFromServer from "./Api";
import { deliverySlice } from "./Slice";
import { toast } from "react-toastify";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
const { actions: slice } = deliverySlice;

//GetShipPointDDLAction action
export const GetShipPointDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetShipPointDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetShipPointDDL(data));
    }
  });
};

export const GetCategoryDDLAction = () => (dispatch) => {
  return requestFromServer.GetCategoryDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCategoryDDL(data));
    }
  });
};
//GetWarehouseDDLAction action
export const GetWarehouseDDLAction = (accId, buId, shipPointId) => (
  dispatch
) => {
  dispatch(slice.SetWarehouseDDL([]));
  return requestFromServer
    .GetWarehouseDDL(accId, buId, shipPointId)
    .then((res) => {
      const { data } = res;
      dispatch(slice.SetWarehouseDDL(data));
    });
};
//GetSoldToPartyDDLAction action
export const GetSoldToPartyDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.GetSoldToPartyDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSoldToParty(data));
    }
  });
};
//GetShipToPartyDDLAction action
export const GetShipToPartyDDLAction = (
  accId,
  buId,
  soldToPartnerId,
  shipPointId
) => (dispatch) => {
  return requestFromServer
    .GetShipToPartyDDL(accId, buId, soldToPartnerId, shipPointId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetShipToParty(data));
      }
    });
};
//GetSalesOrderListDDLAction action
export const GetSalesOrderListDDLAction = (
  buId,
  soldToPartnerId,
  shipToPartyId
) => (dispatch) => {
  return requestFromServer
    .GetSalesOrderListDDL(buId, soldToPartnerId, shipToPartyId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSalesOrderDDL(data));
      }
    });
};
//GetDataBySalesOrderAction action
export const GetDataBySalesOrderAction = (
  salesOrderId,
  wearHouseId,
  setDisabled
) => (dispatch) => {
  setDisabled && setDisabled(true);
  return requestFromServer
    .GetDataBySalesOrder(salesOrderId, wearHouseId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSalesOrderList(data[0]));
      }
      setDisabled && setDisabled(false);
    })
    .catch((error) => {
      setDisabled && setDisabled(false);
      dispatch(slice.SetSalesOrderList([]));
    });
};

//GetDeliveryTypeAction action
export const GetDeliveryTypeAction = () => (dispatch) => {
  return requestFromServer.GetDeliveryTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetDeliveryTypeDDL(data));
    }
  });
};

//GetDeliveryTypeAction action
export const GetItemPlantLocationAction = (whId, ItemId) => (dispatch) => {
  return requestFromServer.GetItemPlantLocationDDL(whId, ItemId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetItemPlantLocationDDL(data));
    }
  });
};

// action for save created data
export const saveCreateDelivery = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.cb();
        payload.responseDataCB(res.data?.deliveryCode);
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      payload.setDisabled(false);
    });
};
// action for save edited data
export const saveEditedDelivery = (payload, setDisabled, history) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setDisabled(false);
        history &&
          history.push("/inventory-management/warehouse-management/delivery");
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisabled(false);
    });
};
// action for get grid data
export const getDeliveryGridData = (
  accId,
  buId,
  setLoading,
  pageNo,
  pageSize,
  search,
  sbuId,
  shipPointId,
  channelId,
  status,
  fromDate,
  toDate
) => (dispatch) => {
  setLoading(true);
  return requestFromServer
    .getGridData(
      accId,
      buId,
      pageNo,
      pageSize,
      search,
      sbuId,
      shipPointId,
      channelId,
      status,
      fromDate,
      toDate
    )
    .then((res) => {
      setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      setLoading(false);
    });
};

// action for get data by id single
export const getDeliveryById = (id) => (dispatch) => {
  return requestFromServer
    .getDataById(id)
    .then((res) => {
      if (res.status === 200) {
        const item = res?.data;
        console.log("item",item);

        const modifiedSalesOrderList = [];
        if (res?.data?.objListDeliveryRowDetailsDTO?.length > 0) {
          res.data.objListDeliveryRowDetailsDTO.forEach((ele, idx) => {
            const obj = {
              ...ele,
              warehouse: item?.objDeliveryHeaderLandingDTO?.warehouseName || "",
              warehouseId: item?.objDeliveryHeaderLandingDTO?.warehouseId || 0,
              shipToParty:
                item?.objDeliveryHeaderLandingDTO?.shipToPartnerName || "",
              shipToPartnerAddress:
                res?.data?.objDeliveryHeaderLandingDTO?.shipToPartnerAddress ||
                "",

              deliveryQty: +ele?.quantity || 0,
              salesOrderId: ele?.salesOrderId || 0,
              salesOrder: ele?.salesOrderCode || "",
              salesOrderRowId: ele.salesOrderRowId || 0,
              amount: +ele?.itemPrice * +ele?.quantity,
              specification: ele.specification,
              selectLocation: {
                value: ele?.locationId,
                label: ele?.locationName,
              },
              vatAmount: (ele?.vatItemPrice || 0) * (+ele?.quantity || 0),
              isItemShow: true,
              maxDeliveryQty: +ele?.quantity + ele?.pendingQty,
              uomId: ele?.uomid,
              uomName: ele?.uom,
              freeItem: ele?.isFreeItem,
              numItemPrice: +ele?.itemPrice - (+ele?.shipmentExtraRate || 0),
              extraRate: +ele?.shipmentExtraRate || 0,
              numOrderQuantity: +ele?.orderQuantity,
              scannedItemSerialList:ele?.rowItemSerialList,
              objLocation: [
                {
                  value: ele?.locationId,
                  label: ele?.locationName,
                },
              ],
            };
            if (ele?.isTradeFreeItem) {
              const itemFindIdx = modifiedSalesOrderList?.findIndex(
                (i) =>
                  i?.itemId === ele?.itemAgainstOffer &&
                  i?.salesOrderId === ele?.salesOrderId
              );
              if (itemFindIdx !== -1) {
                const prvOffer =
                  modifiedSalesOrderList[itemFindIdx]?.offerItemList || [];
                modifiedSalesOrderList[itemFindIdx] = {
                  ...modifiedSalesOrderList[itemFindIdx],
                  offerItemList: [...prvOffer, obj],
                };
              }
            } else {
              modifiedSalesOrderList.push(obj);
            }
          });
        }

        const data = {
          ...item,
          shipPoint: item?.objDeliveryHeaderLandingDTO?.shipPointId
            ? {
                value: item?.objDeliveryHeaderLandingDTO?.shipPointId,
                label: item?.objDeliveryHeaderLandingDTO?.shipPointName,
              }
            : "",

          soldToParty: item?.objDeliveryHeaderLandingDTO?.soldToPartnerId
            ? {
                value: item?.objDeliveryHeaderLandingDTO?.soldToPartnerId,
                label: item?.objDeliveryHeaderLandingDTO?.soldToPartnerName,
                territoryId: item?.objDeliveryHeaderLandingDTO?.territoryId
              }
            : "",
          shipToParty: item?.objDeliveryHeaderLandingDTO?.shipToPartnerId
            ? {
                value: item?.objDeliveryHeaderLandingDTO?.shipToPartnerId,
                label: item?.objDeliveryHeaderLandingDTO?.shipToPartnerName,
              }
            : "",
          deliveryType: item?.objDeliveryHeaderLandingDTO?.deliveryTypeId
            ? {
                value: item?.objDeliveryHeaderLandingDTO?.deliveryTypeId,
                label: item?.objDeliveryHeaderLandingDTO?.deliveryTypeName,
              }
            : "",
          warehouse: item?.objDeliveryHeaderLandingDTO?.warehouseId
            ? {
                value: item?.objDeliveryHeaderLandingDTO?.warehouseId,
                label: item?.objDeliveryHeaderLandingDTO?.warehouseName,
              }
            : "",
          mode: { value: 1, label: item?.objShipmentRequsetDTO?.mode } || "",
          carType:
            { value: 2, label: item?.objShipmentRequsetDTO?.carType } || "",
          bagType:
            { value: 3, label: item?.objShipmentRequsetDTO?.bagType } || "",
          category:
            { value: 4, label: item?.objShipmentRequsetDTO?.category } || "",
          deliveryMode:
            { value: 5, label: item?.objShipmentRequsetDTO?.deliveryMode } ||
            "",
          deliveryDate: item?.objDeliveryHeaderLandingDTO?.deliveryDate
            ? _dateFormatter(item?.objDeliveryHeaderLandingDTO?.deliveryDate)
            : "",
          shipmentType: item?.objDeliveryHeaderLandingDTO?.shipmentTypeId
            ? {
                value: item?.objDeliveryHeaderLandingDTO?.shipmentTypeId,
                label: item?.objDeliveryHeaderLandingDTO?.shipmentType,
                extraRate: modifiedSalesOrderList?.[0]?.extraRate || 0,
              }
            : "",
          itemLists: modifiedSalesOrderList,
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {});
};
// set single store empty
export const setDeliverySingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};

// action for getSBUDDL
export const getSBUDDLDelivery_Aciton = (accId, buId) => (dispatch) => {
  return requestFromServer.getSBUDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSBUDDL(data));
    }
  });
};

// action for getDistributionChannelDDL
export const getDistributionChannelDDLAction = (accId, buId, sbuId) => (
  dispatch
) => {
  return requestFromServer
    .getDistributionChannelDDL(accId, buId, sbuId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetDistributionChannelDDL(data));
      }
    });
};

// action for getSalesOrgDDL
export const getSalesOrgDDL_Action = (accId, buId, sbuId) => (dispatch) => {
  return requestFromServer.getSalesOrgDDL(accId, buId, sbuId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesOrgDDL(data));
    }
  });
};

// action for getSoldToPartner
export const getSoldToPartner_Action = (
  accId,
  buId,
  sbuId,
  shipPoint,
  distributionChannel
) => (dispatch) => {
  dispatch(slice.SetSoldToPartnerDDL([]));
  return requestFromServer
    .getSoldToPartner(accId, buId, sbuId, shipPoint, distributionChannel)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSoldToPartnerDDL(data));
      }
    });
};

// action for getShipToPartner
export const getShipToPartner_Action = (
  accId,
  buId,
  orderId,
  setFieldValue
) => (dispatch) => {
  return requestFromServer
    .getShipToPartner(accId, buId, orderId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetShipToPartner(data));
        setFieldValue && setFieldValue("shipToParty", data?.[0] || "");
      }
    });
};

export const clearGridDataActions = (payload) => (dispatch) => {
  return dispatch(slice.ClearGridData(payload));
};
