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
  shippointDDL: [],
  loadingPointDDL: [],
  pendingDeliveryDDL: [],
  gridData: [],
  incompleteGridData: [],
  deliverydata: "",
  singleData: "",
  vehicleSingeData: "",
  deliveryItemVolumeInfo: "",
  itemWeightInfo: "",
  shipPointDDL: [],
  stockStatusOnShipment: false,
  isSubsidyRunning: false,
  vehicleNo: "",
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
    setIsSubsidyRunning: (state, action) => {
      const { payload } = action;
      state.isSubsidyRunning = payload;
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
    SetShippointDDL: (state, action) => {
      const { payload } = action;
      state.shippointDDL = payload;
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
    SetIncompleteGridData: (state, action) => {
      const { payload } = action;
      state.incompleteGridData = payload;
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
      state.vehicleSingeData = "";
      state.vehicleNo = "";
    },
    setGridEmpty: (state) => {
      state.incompleteGridData = [];
      state.gridData = [];
      state.vehicleSingeData = "";
      state.vehicleNo = "";
    },

    SetDeliveryItemVolumeInfo: (state, action) => {
      const { payload } = action;
      state.deliveryItemVolumeInfo = payload;
    },
    setItemWeightInfo: (state, action) => {
      const { payload } = action;
      state.itemWeightInfo = payload;
    },
    SetShipPointDDL: (state, action) => {
      const { payload } = action;
      state.shipPointDDL = payload;
    },
    SetStockStatusOnShipment: (state, action) => {
      const { payload } = action;
      state.stockStatusOnShipment = payload;
    },
    setVehicleNo: (state, action) => {
      const { payload } = action;
      state.vehicleNo = payload;
    },
  },
});
