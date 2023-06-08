import { createSlice } from "@reduxjs/toolkit";

const initState = {
  supplierNameDDL: [],
  currencyDDL: [],
  orderTypeDDL: [],
  poReferenceTypeDDL: [],
  poReferenceNoDDL: [],
  paymentTermsDDL: [],
  incoTermsDDL: [],
  poItemsDDL: [],
  plantDDL: [],
  wareHouseDDL: [],
  gridData: [],
  singleData: "",
};

export const purchaseOrderSlice = createSlice({
  name: "purchaseOrder",
  initialState: initState,
  reducers: {
    SetSupplierNameDDL: (state, action) => {
      const { payload } = action;
      state.supplierNameDDL = payload.map((item)=>{
        return {label: item.labelValue, value: item.value}
      });
    },
    setPlantDDL: (state, action) => {
      const { payload } = action;
      state.plantDDL = payload;
    },
    setWareHouseDDL: (state, action) => {
      const { payload } = action;
      state.wareHouseDDL = payload;
    },
    SetCurrencyDDL: (state, action) => {
      const { payload } = action;
      state.currencyDDL = payload;
    },
    SetOrderTypeDDL: (state, action) => {
      const { payload } = action;
      state.orderTypeDDL = payload;
    },
    SetPoReferenceTypeDDL: (state, action) => {
      const { payload } = action;
      state.poReferenceTypeDDL = payload;
    },
    SetPoReferenceNoDDL: (state, action) => {
      const { payload } = action;
      state.poReferenceNoDDL = payload;
    },
    SetPaymentTermsDDL: (state, action) => {
      const { payload } = action;
      state.paymentTermsDDL = payload;
    },
    SetIncoTermsListDDL: (state, action) => {
      const { payload } = action;
      state.incoTermsDDL = payload;
    },
    SetPoItemsDDL: (state, action) => {
      const { payload } = action;
      state.poItemsDDL = payload;
    },
    setGridData: (state, action) => {
      const { payload } = action;
      state.gridData = payload;
    },
    setSingleData: (state, action) => {
      const { payload } = action;
      state.singleData = payload;
    },
  },
});
