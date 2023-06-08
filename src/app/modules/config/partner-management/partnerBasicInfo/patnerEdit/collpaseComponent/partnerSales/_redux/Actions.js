import * as requestFromServer from "./Api";
import { partnerSalesSlice } from "./Slice";
const { actions: slice } = partnerSalesSlice;

// action for sbuDDL data
export const getSbuDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getSbuDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSbuDDL(data));
    }
  });
};

// action for salesOrganaizationDDL data
export const getSalesOrganaizationDDLAction = (accId, buId, sbuId) => (
  dispatch
) => {
  return requestFromServer
    .getSalesOrganaizationDDL(accId, buId, sbuId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetSalesOrganaizationDDL(data));
      }
    });
};

// action for distributionChannelDDL data
export const getDistributionChannelDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer
    .getDistributionChannelDDL(accId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetDistributionChannelDDL(data));
      }
    });
};

// action for salesTerrioryDDL data
export const getSalesTerrioryDDLAction = (accId, buId, channelId) => (dispatch) => {
  return requestFromServer.getSalesTerrioryDDL(accId, buId, channelId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSalesTerrioryDDL(data));
    }
  });
};

// action for transportZoneDDL data
export const getTransportZoneDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getTransportZoneDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetTransportZoneDDL(data));
    }
  });
};

// action for reconGeneralLedgerDDL data
export const GeneralLedgerDDLAction = (accId, buId, accountGroupId) => (
  dispatch
) => {
  return requestFromServer
    .getGeneralLedgerDDL(accId, buId, accountGroupId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const newData = data.map((itm) => {
          return {
            ...itm,
            value: itm?.generalLedgerId,
            label: itm?.generalLedgerName,
          };
        });
        dispatch(slice.SetGeneralLedgerDDL(newData));
      }
    });
};
//Alternate Generale
export const AlternateGeneraleDDLAction = (accId, buId, accountGroupId) => (
  dispatch
) => {
  return requestFromServer
    .getGeneralLedgerDDL(accId, buId, accountGroupId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        const newData = data.map((itm) => {
          return {
            ...itm,
            value: itm?.generalLedgerId,
            label: itm?.generalLedgerName,
          };
        });
        dispatch(slice.SetAlternateGeneraleDDL(newData));
      }
    });
};

// action for soldToPartyDDL data
export const getSoldToPartyDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getSoldToPartyDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetSoldToPartyDDL(data));
    }
  });
};

// action for shippingPointDDL data
export const getShippingPointDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getShippingPointDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetShippingPointDDL(data));
    }
  });
};

// action for alternateShippingPointDDL data
export const getAlternateShippingPointDDLAction = (accId, buId) => (
  dispatch
) => {
  return requestFromServer
    .getAlternateShippingPointDDL(accId, buId)
    .then((res) => {
      const { status, data } = res;
      if (status === 200 && data) {
        dispatch(slice.SetAlternateShippingPointDDL(data));
      }
    });
};

// action for priceStructureDDL data
export const getPriceStructureDDLAction = (accId, buId) => (dispatch) => {
  return requestFromServer.getPriceStructureDDL(accId, buId).then((res) => {
    const { status, data } = res;
    if (status === 200 && data) {
      dispatch(slice.SetPriceStructureDDL(data));
    }
  });
};
