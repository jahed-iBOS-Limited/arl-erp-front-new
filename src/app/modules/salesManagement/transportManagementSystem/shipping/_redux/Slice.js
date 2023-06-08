import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  salesOfficeDDL: [],
  soldToPartyDDL: [],
  BUsalesOrgIncotermDDL: [],
  paymentTermsDDL: [],
  vehicleDDL: [],
  routeListDDL: [],
  transportModeDDL: [],
  transportZoneDDL: [],
  shipmentTypeDDL: [],
  loadingPointDDL: [],
  pendingDeliveryDDL: [],
  gridData: [],
  deliverydata: "",
  singleData: "",
  vehicleSingeData: "",
  deliveryItemVolumeInfo: "",
};

export const shipmentSlice = createSlice({
  name: "shipment",
  initialState: initState,
  reducers: {
    SetSalesOfficeDDL: (state, action) => {
      const { payload } = action;
      state.salesOfficeDDL = payload;
    },
    SetSoldToPPDDL: (state, action) => {
      const { payload } = action;
      state.soldToPartyDDL = payload;
    },
    SetBUsalesOrgIncotermDDL: (state, action) => {
      const { payload } = action;
      state.BUsalesOrgIncotermDDL = payload;
    },
    SetPaymentTermsDDL: (state, action) => {
      const { payload } = action;
      state.paymentTermsDDL = payload;
    },
    SetVehicleDDL: (state, action) => {
      const { payload } = action;
      state.vehicleDDL = payload;
    },
    SetRouteListDDL: (state, action) => {
      const { payload } = action;
      state.routeListDDL = payload;
    },
    SetTransportModeDDL: (state, action) => {
      const { payload } = action;
      state.transportModeDDL = payload;
    },
    SetTransportZoneDDL: (state, action) => {
      const { payload } = action;
      state.transportZoneDDL = payload;
    },
    SetshipmentTypeDDL: (state, action) => {
      const { payload } = action;
      state.shipmentTypeDDL = payload;
    },
    SetLoadingPointDDL: (state, action) => {
      const { payload } = action;
      state.loadingPointDDL = payload;
    },
    SetPendingDeliveryDDL: (state, action) => {
      const { payload } = action;
      state.pendingDeliveryDDL = payload;
    },
    SetDeliverydatabyId: (state, action) => {
      const { payload } = action;
      state.deliverydata = payload;
    },
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    SetVehicleSingleData: (state, action) => {
      const { payload } = action;
      state.vehicleSingeData = payload;
    },
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },

    SetDeliveryItemVolumeInfo: (state, action) => {
      const { payload } = action;
      state.deliveryItemVolumeInfo = payload;
    },
  },
});
