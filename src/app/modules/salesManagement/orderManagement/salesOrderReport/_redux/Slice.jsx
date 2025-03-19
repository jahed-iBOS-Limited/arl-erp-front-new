import { createSlice } from "@reduxjs/toolkit";

const initState = {
  isLoading: false,
  error: "",
  msg: "",
  SBUDDL: [],
  salesOrgDDL: [],
  distributionChannelDDL: [],
  salesOfficeDDL: [],
  salesOrderTypeDDL: [],
  salesReferanceType: [],
  shipPointDDL: [],
  soldToPartnerDDL: [],
  currencyListDDL: [],
  orderReferanceTypeDDL: [],
  BUalesOrgIncotermDDL: [],
  paymentTermsListDDL: [],
  shipToPartner: [],
  itemPlantDDL: [],
  referenceNo: [],
  itemUOMDDL: [],
  referenceItemDetailsById: "",
  referenceWithItemListById: [],
  priceForInternalUse: "",
  partnerBalance: "",
  undeliveryValues: "",
  priceStructureCheck: true,
  discountStructureCheck: true,
  availableBalance: "",
  gridData: [],
  uoMitemPlantWarehouseDDL: [],
  singleData: "",
  salesDiscount: "",
  salesOrderApproveCheck: false,
  creditLimitForInternalUser: "",
  alotementDDL: [],
  isBalanceCheck: {},
};

export const salesOrderSlice = createSlice({
  name: "salesOrder",
  initialState: initState,
  reducers: {
    SetSBUDDL: (state, action) => {
      const { payload } = action;
      state.SBUDDL = payload;
    },
    SetSalesOrgDDL: (state, action) => {
      const { payload } = action;
      state.salesOrgDDL = payload;
    },
    SetTotalPendingQuantity: (state, action) => {
      const { payload } = action;
      state.alotementDDL = payload;
    },
    SetTotalPendingQuantityEmpty: (state, action) => {
      state.alotementDDL = [];
    },
    SetDistributionChannelDDL: (state, action) => {
      const { payload } = action;
      state.distributionChannelDDL = payload;
    },
    SetSalesOfficeDDL: (state, action) => {
      const { payload } = action;
      state.salesOfficeDDL = payload;
    },
    SetSalesOrderTypeDDL: (state, action) => {
      const { payload } = action;
      state.salesOrderTypeDDL = payload;
    },
    SetSalesReferanceType: (state, action) => {
      const { payload } = action;
      state.salesReferanceType = payload;
    },
    SetShipPointDDL: (state, action) => {
      const { payload } = action;
      state.shipPointDDL = payload;
    },
    SetSoldToPartnerDDL: (state, action) => {
      const { payload } = action;
      state.soldToPartnerDDL = payload;
    },
    SetCurrencyListDDL: (state, action) => {
      const { payload } = action;
      state.currencyListDDL = payload;
    },
    SetOrderReferanceTypeDDL: (state, action) => {
      const { payload } = action;
      state.orderReferanceTypeDDL = payload;
    },
    SetBUalesOrgIncotermDDL: (state, action) => {
      const { payload } = action;
      state.BUalesOrgIncotermDDL = payload;
    },
    SetPaymentTermsListDDL: (state, action) => {
      const { payload } = action;
      state.paymentTermsListDDL = payload;
    },
    SetShipToPartner: (state, action) => {
      const { payload } = action;
      state.shipToPartner = payload;
    },
    SetItemPlantDDL: (state, action) => {
      const { payload } = action;
      state.itemPlantDDL = payload;
    },
    SetUoMitemPlantWarehouseDDL: (state, action) => {
      const { payload } = action;
      state.uoMitemPlantWarehouseDDL = payload;
    },
    SetPartnerBalance: (state, action) => {
      const { payload } = action;
      state.partnerBalance = payload;
    },
    SetUndeliveryValues: (state, action) => {
      const { payload } = action;
      state.undeliveryValues = payload;
    },
    SetReferenceNo: (state, action) => {
      const { payload } = action;
      state.referenceNo = payload;
    },
    SetItemUOMDDL: (state, action) => {
      const { payload } = action;
      state.itemUOMDDL = payload;
    },
    SetGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },

    SetDataById: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
    SetPriceStructureCheck: (state, action) => {
      const { payload } = action;
      state.priceStructureCheck = payload;
    },
    SetDiscountStructureCheck: (state, action) => {
      const { payload } = action;
      state.discountStructureCheck = payload;
    },
    SetReferenceItemDetailsById: (state, action) => {
      const { payload } = action;
      state.referenceItemDetailsById = payload;
    },
    SetReferenceWithItemListById: (state, action) => {
      const { payload } = action;
      state.referenceWithItemListById = payload;
    },
    SetReferenceItemlistById: (state, action) => {
      const { payload } = action;
      state.itemPlantDDL = payload;
    },
    SetPriceForInternalUse: (state, action) => {
      const { payload } = action;
      state.priceForInternalUse = payload;
    },
    SetAvailableBalance: (state, action) => {
      const { payload } = action;
      state.availableBalance = payload;
    },
    //slice empty
    SetSingleStoreEmpty: (state) => {
      state.singleData = "";
    },
    SetGridDataEmpty: (state) => {
      state.gridData = [];
    },
    SetPartnerBalanceEmpty: (state, action) => {
      state.partnerBalance = "";
    },
    SetAvailableBalanceEmpty: (state, action) => {
      state.availableBalance = "";
    },
    SetUndeliveryValuesEmpty: (state, action) => {
      state.undeliveryValues = "";
    },
    SetSalesDiscount: (state, action) => {
      const { payload } = action;
      state.salesDiscount = payload;
    },
    SetSalesDiscountEmpty: (state, action) => {
      state.salesDiscount = "";
    },
    setSalesOrderApproveCheck: (state, action) => {
      const { payload } = action;
      state.salesOrderApproveCheck = payload;
    },
    setCreditLimitForInternalUser: (state, action) => {
      const { payload } = action;
      state.creditLimitForInternalUser = payload;
    },
    setIsBalanceCheck: (state, action) => {
      const { payload } = action;
      state.isBalanceCheck = payload;
    },
  },
});
