import * as requestFromServer from "./Api";
import { salesOrderSlice } from "./Slice";
import { toast } from "react-toastify";
import { isArray } from "lodash";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
const { actions: slice } = salesOrderSlice;

// action for getSBUDDL
export const getSBUDDL_Aciton = (accId, buId) => (dispatch) => {
  return requestFromServer.getSBUDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSBUDDL(data));
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
export const getTotalPendingQuantityAction = (accId, buId, values) => (
  dispatch
) => {
  const { soldtoParty, pricingDate } = values;
  /* if 'Bongo Traders Ltd' BUI Select */
  if (soldtoParty?.value && pricingDate && buId?.isTredingBusiness) {
    return requestFromServer
      .getTotalPendingQuantity(
        accId,
        buId?.value,
        soldtoParty?.value,
        pricingDate
      )
      .then((res) => {
        const { data } = res;
        dispatch(slice.SetTotalPendingQuantity(data || ""));
      });
  }
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
// action for getSalesOfficeDDL
export const getSalesOfficeDDL_Action = (accId, buId, SalesOrgId) => (
  dispatch
) => {
  return requestFromServer
    .getSalesOfficeDDL(accId, buId, SalesOrgId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSalesOfficeDDL(data));
      }
    });
};
// action for getSalesOrderTypeDDL
export const getSalesOrderTypeDDL_Action = (accId, buId) => (dispatch) => {
  return requestFromServer.getSalesOrderTypeDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesOrderTypeDDL(data));
    }
  });
};
// action for getSalesOrderTypeDDL
export const getShipPoint_Action = (userId, accId, buId) => (dispatch) => {
  return requestFromServer.getShipPoint(userId, accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      const newData = data.map((itm) => ({
        value: itm.organizationUnitReffId,
        label: itm.organizationUnitReffName,
      }));
      dispatch(slice.SetShipPointDDL(newData));
    }
  });
};

// action for getSalesReferanceType
export const getSalesReferanceType_Action = (accId, buId) => (dispatch) => {
  return requestFromServer.getSalesReferanceType(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesReferanceType(data));
    }
  });
};
// action for getSoldToPartner
export const getSoldToPartner_Action = (
  accId,
  buId,
  sbuId,
  salesOrg,
  shipPoint,
  distributionChannel
) => (dispatch) => {
  return requestFromServer
    .getSoldToPartner(
      accId,
      buId,
      sbuId,
      salesOrg,
      shipPoint,
      distributionChannel
    )
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSoldToPartnerDDL(data));
      }
    });
};
// action for getCurrencyListDDL
export const getCurrencyListDDL_Action = (accId, buId) => (dispatch) => {
  return requestFromServer.getCurrencyListDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetCurrencyListDDL(data));
    }
  });
};
// action for getOrderReferanceTypeDDL
export const getOrderReferanceTypeDDL_Action = () => (dispatch) => {
  return requestFromServer.getOrderReferanceTypeDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetOrderReferanceTypeDDL(data));
    }
  });
};
// action for getBUalesOrgIncotermDDL
export const getBUalesOrgIncotermDDL_Action = () => (dispatch) => {
  return requestFromServer.getBUalesOrgIncotermDDL().then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetBUalesOrgIncotermDDL(data));
    }
  });
};
// action for getPaymentTermsListDDL
export const getPaymentTermsListDDL_Action = (accId, buId, salesOrgId) => (
  dispatch
) => {
  return requestFromServer
    .getPaymentTermsListDDL(accId, buId, salesOrgId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const newDDL = data?.filter((itm) => itm?.value !== 3);
        dispatch(slice.SetPaymentTermsListDDL(newDDL));
      }
    });
};
// action for getShipToPartner
export const getShipToPartner_Action = (accId, buId, soldToParty) => (
  dispatch
) => {
  return requestFromServer
    .getShipToPartner(accId, buId, soldToParty)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetShipToPartner(data));
      }
    });
};
// action for getItemPlant
export const getItemPlant_Action = (
  accId,
  buId,
  disChaId,

  salesOrgId
) => (dispatch) => {
  return requestFromServer
    .getItemPlant(accId, buId, disChaId, salesOrgId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetItemPlantDDL(data));
      }
    });
};
export const getAllocateItemDDLAction = (accId, buiId, allotmentId) => (
  dispatch
) => {
  return requestFromServer
    .GetAllocateItemDDL(accId, buiId, allotmentId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetItemPlantDDL(data));
      }
    });
};
// action for getSalesContactDDL
export const getSalesContactDDL_Action = (accId, buId, soldToPartyId) => (
  dispatch
) => {
  return requestFromServer
    .getSalesContactDDL(accId, buId, soldToPartyId)
    .then((res) => {
      const { data } = res;
      dispatch(slice.SetReferenceNo(data));
    })
    .catch((err) => {
      dispatch(slice.SetReferenceNo([]));
    });
};
// action for getSalesQuotationDDL
export const getSalesQuotationDDL_Action = (accId, buId, soldToPartyId) => (
  dispatch
) => {
  return requestFromServer
    .getSalesQuotationDDL(accId, buId, soldToPartyId)
    .then((res) => {
      const { data } = res;
      dispatch(slice.SetReferenceNo(data));
    })
    .catch((err) => {
      dispatch(slice.SetReferenceNo([]));
    });
};
// action for getSalesOrderDDL
export const getSalesOrderDDL_action = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getSalesOrderDDL(accId, buId)
    .then((res) => {
      const { data } = res;
      dispatch(slice.SetReferenceNo(data));
    })
    .catch((err) => {
      dispatch(slice.SetReferenceNo([]));
    });
};
// action for getItemUOMDDL
export const getItemUOMDDL_Action = (accId, buId) => (dispatch) => {
  return requestFromServer.getItemUOMDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetItemUOMDDL(data));
    }
  });
};
// action for getPartnerBalance
export const getPartnerBalance_action = (plantId) => (dispatch) => {
  return requestFromServer.getPartnerBalance(plantId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPartnerBalance(data[0]));
    }
  });
};
// action for uoMitemPlantWarehouseDDL_action
export const uoMitemPlantWarehouseDDL_action = (
  accountId,
  buId,
  plantId,
  itemId,
  setFieldValue
) => (dispatch) => {
  return requestFromServer
    .uoMitemPlantWarehouseDDL(accountId, buId, plantId, itemId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetUoMitemPlantWarehouseDDL(data));
        setFieldValue && setFieldValue("uom", data?.[0] || "");
      }
    });
};
// action for getPartnerBalance
export const getUndeliveryValues_action = (soldToParty) => (dispatch) => {
  return requestFromServer.getUndeliveryValues(soldToParty).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetUndeliveryValues(data));
    }
  });
};
// action for getPriceStructureCheck
export const getPriceStructureCheck_Acion = (partnerId, type) => (dispatch) => {
  return requestFromServer
    .getPriceStructureCheck(partnerId, type)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetPriceStructureCheck(data));
      }
    });
};
// action for getDiscountStructureCheck
export const getDiscountStructureCheck_Action = (partnerId, type) => (
  dispatch
) => {
  return requestFromServer
    .getPriceStructureCheck(partnerId, type)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetDiscountStructureCheck(data));
      }
    });
};
// action for getReferenceItemDetailsById
export const getReferenceItemDetailsById_Action = (
  typeId,
  refId,
  itemId,
  setFieldValue
) => (dispatch) => {
  return requestFromServer
    .getReferenceItemDetailsById(typeId, refId, itemId, setFieldValue)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        setFieldValue("uom", {
          label: res?.data[0]?.uom,
          value: res?.data[0]?.uomId,
        });
        dispatch(slice.SetReferenceItemDetailsById(data[0]));
      }
    });
};
// action for getReferenceItemlistById
export const getReferenceItemlistById_Action = (typeId, refId) => (
  dispatch
) => {
  return requestFromServer
    .getReferenceItemlistById(typeId, refId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetReferenceItemlistById(data));
      }
    })
    .catch((err) => {
      dispatch(slice.SetReferenceItemlistById([]));
    });
};
// action for getReferenceWithItemListById
export const getReferenceWithItemListById_Action = (typeId, refId) => (
  dispatch
) => {
  return requestFromServer
    .getReferenceWithItemListById(typeId, refId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetReferenceWithItemListById(data));
      }
    })
    .catch((err) => {
      dispatch(slice.SetReferenceWithItemListById([]));
    });
};
// action for getPriceForInternalUse
export const getPriceForInternalUse_Action = (
  buId,
  partner,
  itemId,
  dtePricingDate,
  terr,
  channelId,
  sorgid,
  setDisabled,
  setFieldValue,
  selectedBusinessUnit
) => (dispatch) => {
  selectedBusinessUnit?.value === 4 && setDisabled && setDisabled(true);
  return requestFromServer
    .getPriceForInternalUse(
      buId,
      partner,
      itemId,
      dtePricingDate,
      terr,
      channelId,
      sorgid
    )
    .then((res) => {
      const { status, data } = res;
      setDisabled && setDisabled(false);
      if (status === 200 && data) {
        dispatch(slice.SetPriceForInternalUse(data));
      }
    })
    .catch((erro) => {
      setDisabled && setDisabled(false);
      selectedBusinessUnit?.value === 4 &&
        setFieldValue &&
        setFieldValue("item", "");
    });
};

// action for save created data
export const saveSalesOrder = (payload) => () => {
  payload.setDisabled(true);
  return requestFromServer
    .saveCreateData(payload.data)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        payload.responseData(
          res?.data?.soldToPartnerId,
          res?.data?.soId,
          res?.data?.salesOrderCode
        );
        payload.cb();
        payload.setRowDto([]);
        payload.setDisabled(false);
      }
    })
    .catch((err) => {
      payload.setDisabled(false);
      console.log(err);
      toast.error(err?.response?.data?.message);
    });
};
// action for save edited data
export const saveEditedSalesOrder = (payload, setDisabled) => () => {
  setDisabled(true);
  return requestFromServer
    .saveEditData(payload)
    .then((res) => {
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
        setDisabled(false);
      }
    })
    .catch((err) => {
      setDisabled(false);
      toast.error(err?.response?.data?.message);
    });
};
// action for get grid data
export const getSalesOrderGridData = (
  accId,
  buId,
  shipPointId,
  reportTypeId,
  pageNo,
  pageSize,
  search
) => (dispatch) => {
  // setLoading(true);
  return requestFromServer
    .getGridData(accId, buId, shipPointId,reportTypeId, pageNo, pageSize, search)
    .then((res) => {
      // setLoading(false);
      return dispatch(slice.SetGridData(res.data));
    })
    .catch((err) => {
      //
      // setLoading(false);
    });
};
// action for get getAvailableBalance data
export const getAvailableBalance_Action = (partnerId, data, refType) => (
  dispatch
) => {
  return requestFromServer
    .getAvailableBalance(partnerId, data, refType)
    .then((res) => {
      return dispatch(slice.SetAvailableBalance(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

// action for get data by id single
export const getDataBySalesOrderId_Action = (
  accId,
  buId,
  salesOrderId,
  setLoading
) => (dispatch) => {
  setLoading && setLoading(true);
  return requestFromServer
    .getDataBySalesOrderId(accId, buId, salesOrderId)
    .then((res) => {
      setLoading && setLoading(false);
      if (res.status === 200 && isArray(res.data)) {
        const item = res.data[0];
        const data = {
          ...item,
          objHeader: {
            ...item?.objHeader,
            soldtoParty: {
              value: item?.objHeader?.soldToPartnerId,
              label: item?.objHeader?.soldToPartnerName,
            },
            shipToParty: {
              value: item?.objHeader?.soldToPartnerId,
              label: item?.objHeader?.soldToPartnerName,
              territoryId: item?.objHeader?.intTerritoryId,
            },
            incoterm: item?.objHeader?.incotermId
              ? {
                  value: item?.objHeader?.incotermId,
                  label: item?.objHeader?.incotermsName,
                }
              : "",
            paymentTerms: {
              value: item?.objHeader?.paymentTermId,
              label: item?.objHeader?.paymentTermsName,
            },
            currency: {
              value: item?.objHeader?.currencyId,
              label: item?.objHeader?.currencyName,
            },
            refType: {
              value: item?.objHeader?.refferenceTypeId,
              label: item?.objHeader?.refferenceTypeName,
            },
            shipToPartnerContactNo:
              item?.objHeader?.shipToPartnerContactNo || "",
            pricingDate: _dateFormatter(item?.objHeader?.pricingDate),
            dueShippingDate: _dateFormatter(item?.objHeader?.dueShippingDate),
            quantityTop: "",
            customerItemName: "",
            shiptoPartnerAddress: item?.objHeader?.shiptoPartnerAddress || "",
            alotement: item?.objHeader?.allotmentId
              ? {
                  value: item?.objHeader?.allotmentId,
                  label: item?.objHeader?.allotmentIdName,
                }
              : "",

            productType: item?.objHeader?.productType
              ? {
                  value: item?.objHeader?.productType,
                  label: item?.objHeader?.productType,
                }
              : "",
          },
        };
        return dispatch(slice.SetDataById(data));
      }
    })
    .catch((err) => {
      console.log(err);
      setLoading && setLoading(false);
    });
};
// set single store empty
export const setSalesOrderSingleEmpty = () => async (dispatch) => {
  return dispatch(slice.SetSingleStoreEmpty());
};
export const SetGridDataEmpty_Action = () => async (dispatch) => {
  return dispatch(slice.SetGridDataEmpty());
};

// action for getSalesOrderApproval_Aciton data
export const getSalesOrderApproval_Aciton = (
  salesOrderId,
  approveBy,
  cb
) => () => {
  return requestFromServer
    .getSalesOrderApproval(salesOrderId, approveBy)
    .then((res) => {
      cb();
      if (res.status === 200) {
        toast.success(res.data?.message || "Submitted successfully");
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
    });
};

// action for get getAvailableBalance data
export const getSalesDiscount_Action = (payload, isDisabled) => (dispatch) => {
  isDisabled && isDisabled(true);
  return requestFromServer
    .getSalesDiscount(payload)
    .then((res) => {
      isDisabled && isDisabled(false);
      return dispatch(slice.SetSalesDiscount(res?.data));
    })
    .catch((err) => {
      isDisabled && isDisabled(false);
      toast.error(err?.response?.data?.message);
      console.log(err);
    });
};
// action for get getAvailableBalance data
export const getSalesOrderApproveCheck_action = (userId) => (dispatch) => {
  return requestFromServer
    .salesOrderApproveCheck(userId)
    .then((res) => {
      return dispatch(slice.setSalesOrderApproveCheck(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getCreditLimitForInternalUser_action = (userId) => (dispatch) => {
  return requestFromServer
    .getCreditLimitForInternalUser(userId)
    .then((res) => {
      return dispatch(slice.setCreditLimitForInternalUser(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};
export const GetSalesConfigurationBalanceCheck_acion = (accId, buId) => (dispatch) => {
  return requestFromServer
    .GetSalesConfigurationBalanceCheck(accId, buId)
    .then((res) => {
      return dispatch(slice.setIsBalanceCheck(res?.data || {}));
    })
    .catch((err) => {
      console.log(err);
      return dispatch(slice.setIsBalanceCheck({}));
    });
};

// set SetPartnerBalanceEmpty_Action empty
export const SetPartnerBalanceEmpty_Action = () => async (dispatch) => {
  return dispatch(slice.SetPartnerBalanceEmpty());
};
// set SetAvailableBalanceEmpty_Action empty
export const SetAvailableBalanceEmpty_Action = () => async (dispatch) => {
  return dispatch(slice.SetAvailableBalanceEmpty());
};
// set SetUndeliveryValuesEmpty_Action empty
export const SetUndeliveryValuesEmpty_Action = () => async (dispatch) => {
  return dispatch(slice.SetUndeliveryValuesEmpty());
};
export const SetSalesDiscountEmpty_action = () => async (dispatch) => {
  return dispatch(slice.SetSalesDiscountEmpty());
};
export const SetTotalPendingQuantityEmptyAction = () => async (dispatch) => {
  return dispatch(slice.SetTotalPendingQuantityEmpty());
};
