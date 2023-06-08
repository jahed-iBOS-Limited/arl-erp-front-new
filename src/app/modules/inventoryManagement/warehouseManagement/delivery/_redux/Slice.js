import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  shipPointDDL: [],
  warehouseDDL: [],
  soldToPartyDDL: [],
  shipToPartyDDL: [],
  salesOrderDDL: [],
  salesOrderList: [],
  plantLocationDDL: [],
  deliveryTypeDDL: [],
  gridData: [],
  singleData: "",
  SBUDDL: [],
  salesOrgDDL: [],
  soldToPartnerDDL: [],
  shipToPartner: [],
  categoryDDL: [],
};

export const deliverySlice = createSlice({
  name: "delivery",
  initialState: initState,
  reducers: {
    SetShipPointDDL: (state, action) => {
      const { payload } = action;
      state.shipToPartyDDL = [];
      state.shipPointDDL = payload;
    },

    SetWarehouseDDL: (state, action) => {
      const { payload } = action;
      state.warehouseDDL = payload;
    },
    SetSoldToParty: (state, action) => {
      const { payload } = action;
      state.soldToPartyDDL = payload;
    },
    SetShipToParty: (state, action) => {
      const { payload } = action;
      state.shipToPartyDDL = payload;
    },
    SetSalesOrderDDL: (state, action) => {
      const { payload } = action;
      state.salesOrderDDL = payload;
    },
    SetSalesOrderList: (state, action) => {
      const { payload } = action;
      state.salesOrderList = payload;
    },
    SetDeliveryTypeDDL: (state, action) => {
      const { payload } = action;
      state.deliveryTypeDDL = payload;
    },
    SetItemPlantLocationDDL: (state, action) => {
      const { payload } = action;
      state.plantLocationDDL = payload;
    },
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
    ClearGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
    SetSBUDDL: (state, action) => {
      const { payload } = action;
      state.SBUDDL = payload;
    },

    SetDistributionChannelDDL: (state, action) => {
      const { payload } = action;
      state.distributionChannelDDL = payload;
    },
    SetSalesOrgDDL: (state, action) => {
      const { payload } = action;
      state.salesOrgDDL = payload;
    },
    SetSoldToPartnerDDL: (state, action) => {
      const { payload } = action;
      state.soldToPartnerDDL = payload;
    },
    SetShipToPartner: (state, action) => {
      const { payload } = action;
      state.shipToPartner = payload;
    },
    SetCategoryDDL: (state, action) => {
      const { payload } = action;
      state.categoryDDL = payload;
    },
  },
});
