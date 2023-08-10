import { createSlice } from "@reduxjs/toolkit";

const initState = {
  buDDL: [],
  plantDDL: [],
  sbuDDL: [],
  itemSaleDDL: [],
  shippingDDL: [],
  wareHouseDDL: [],
  costCenterDDL: [],
  currencyDDL: [],
  uomDDL: [],
  shippointDDL: [],
  countryDDL: [],
  partnerDDL: [],
  controllingDDL: [],
  salesOfficeDDL: [],
  salesOrgDDL: [],
  distributionChannelDDL: [],
  supplierDDL: [],
  purchaseOrgDDL: [],
  empDDL: [],
  frequencyDDL: [],
  imageView: {},
  multipleImageView: {},
  port : null,
  OID: '',
};

export const commonDDLSlice = createSlice({
  name: "commonDDL",
  initialState: initState,
  reducers: {
    SetBuDDL: (state, action) => {
      const { payload } = action;
      state.buDDL = payload;
    },
    SetPlantDDL: (state, action) => {
      const { payload } = action;
      state.plantDDL = payload;
    },

    SetWareHouseDDL: (state, action) => {
      const { payload } = action;
      state.wareHouseDDL = payload;
    },

    SetPurchaseDDL: (state, action) => {
      const { payload } = action;
      state.purchaseOrgDDL = payload;
    },

    SetSbuDDL: (state, action) => {
      const { payload } = action;
      state.sbuDDL = payload;
    },

    SetItemSaleDDL: (state, action) => {
      const { payload } = action;
      state.itemSaleDDL = payload;
    },

    SetShippingDDL: (state, action) => {
      const { payload } = action;
      state.shippingDDL = payload;
    },

    SetCostCenterDDL: (state, action) => {
      const { payload } = action;
      state.costCenterDDL = payload;
    },

    SetCurrencyDDL: (state, action) => {
      const { payload } = action;
      state.currencyDDL = payload;
    },

    SetUomDDL: (state, action) => {
      const { payload } = action;
      state.uomDDL = payload;
    },
    SetCountryDDL: (state, action) => {
      const { payload } = action;
      state.countryDDL = payload;
    },
    SetPartnerDDL: (state, action) => {
      const { payload } = action;
      state.partnerDDL = payload;
    },
    SetControllingDDL: (state, action) => {
      const { payload } = action;
      state.controllingDDL = payload;
    },
    SetSalesOfficeDDL: (state, action) => {
      const { payload } = action;
      state.salesOfficeDDL = payload;
    },
    SetSalesOrgDDL: (state, action) => {
      const { payload } = action;
      state.salesOrgDDL = payload;
    },
    SetShippointDDL: (state, action) => {
      const { payload } = action;
      state.shippointDDL = payload;
    },
    SetDistributionChannelDDL: (state, action) => {
      const { payload } = action;
      state.distributionChannelDDL = payload;
    },
    SetSupplierDDL: (state, action) => {
      const { payload } = action;
      state.supplierDDL = payload;
    },
    SetEmpDDL: (state, action) => {
      const { payload } = action;
      state.empDDL = payload;
    },
    SetPMSFrequencyDDL: (state, action) => {
      const { payload } = action;
      state.frequencyDDL = payload;
    },
    SetImageView: (state, action) => {
      const { payload } = action;
      state.imageView = payload;
    },
    SetMultipleImageView: (state, action) => {
      const { payload } = action;
      state.multipleImageView = payload;
    },
    setSerialPort: (state, action) => {
      const { payload } = action;
      state.port = payload;
    },

    SetDownlloadFileViewEmpty: (state) => {
      state.imageView = {
        url: "",
        type: "",
        model: false,
      };
    },
    setOID: (state, action) => {
      const { payload } = action;
      state.OID = payload;
    },
  },
});
