import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  sbuDDL: [],
  salesOrganaizationDDL: [],
  distributionChannelDDL: [],
  salesTerrioryDDL: [],
  transportZoneDDL: [],
  GeneralLedgerDDL: [],
  soldToPartyDDL: [],
  shippingPointDDL: [],
  alternateShippingPointDDL: [],
  priceStructureDDL: [],
  gridData: [],
  alternateGenerale: [],
  singleData: "",
};

export const partnerSalesSlice = createSlice({
  name: "partnerSales",
  initialState: initState,
  reducers: {
    SetSbuDDL: (state, action) => {
      const { payload } = action;
      state.sbuDDL = payload;
    },

    SetSalesOrganaizationDDL: (state, action) => {
      const { payload } = action;
      state.salesOrganaizationDDL = payload;
    },

    SetDistributionChannelDDL: (state, action) => {
      const { payload } = action;
      state.distributionChannelDDL = payload;
    },

    SetSalesTerrioryDDL: (state, action) => {
      const { payload } = action;
      state.salesTerrioryDDL = payload;
    },

    SetTransportZoneDDL: (state, action) => {
      const { payload } = action;
      state.transportZoneDDL = payload;
    },

    SetGeneralLedgerDDL: (state, action) => {
      const { payload } = action;
      state.GeneralLedgerDDL = payload;
    },
    SetAlternateGeneraleDDL: (state, action) => {
      const { payload } = action;
      state.alternateGenerale = payload;
    },

    SetAlternetGeneralLedgerDDL: (state, action) => {
      const { payload } = action;
      state.alternetGeneralLedgerDDL = payload;
    },

    SetSoldToPartyDDL: (state, action) => {
      const { payload } = action;
      state.soldToPartyDDL = payload;
    },

    SetShippingPointDDL: (state, action) => {
      const { payload } = action;
      state.shippingPointDDL = payload;
    },

    SetAlternateShippingPointDDL: (state, action) => {
      const { payload } = action;
      state.alternateShippingPointDDL = payload;
    },

    SetPriceStructureDDL: (state, action) => {
      const { payload } = action;
      state.priceStructureDDL = payload;
    },
  },
});
