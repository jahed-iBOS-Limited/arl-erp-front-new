// warehouse stock modal
export const warehouseStockModalInitData = {};

// fetch warehouse stock details data
export const fetchWarehouseStockDetailsData = (obj) => {
  // destrcuture
  const {
    getWarehouseStockData,
    singleRowData,
    setSingleRowData,
    values,
  } = obj;
  // single row
  const { itemId, itemName } = singleRowData;
  // params
  const params = `businessUnitId=${values?.businessUnit?.value}&intPlantId=0&fromDate=${values?.fromDate}&toDate=${values?.toDate}&intItemTypeId=0&itemId=${itemId}&warehouseId=142&pageNo=0&pageSize=100&search=${itemName}`;
  // url
  const url = `/procurement/Report/GetInventoryStatement`;

  getWarehouseStockData(`${url}?${params}`, () => {
    setSingleRowData({});
  });
};

// common item details reducer
export function commonItemReducer(state, action) {
  // destrcuture
  const { type, payload } = action;

  // update state
  const updateState = (newSingleRowData, newPartName, modalShow) => ({
    ...state,
    singleRowData: newSingleRowData,
    partName: newPartName,
    modalShow,
  });

  switch (type) {
    case 'FloatingStock':
      return updateState(payload?.singleRowData, type, true);
    case 'OpenPo':
      return updateState(payload?.singleRowData, type, true);
    case 'OpenPR':
      return updateState(payload?.singleRowData, type, true);
    case 'Close':
      // Close the modal when "Close" action is dispatched
      return updateState({}, null, false);
    default:
      return state;
  }
}

// common item details state
export const commonItemInitialState = {
  modalShow: false,
  partName: 'OpenPo',
  singleRowData: {},
};

// fetch common item details data
export const fetchCommonItemDetailsData = (obj) => {
  // destrcuture
  const { getCommonItemData, commonItemDetailsState, values } = obj;

  // single row
  const { itemId = 0 } = commonItemDetailsState?.singleRowData;

  // url
  const url = `/procurement/AutoPurchase/GetItemBusinessUnitDetails`;

  const { partName } = commonItemDetailsState;

  // params
  const params = `businessUnitId=${values?.businessUnit?.value}&itemId=${itemId}&partName=${partName}`;

  getCommonItemData(`${url}?${params}`);
};

// common table header
export const floatingStockTableHeader = [
  'SL',
  'Plant Name',
  'Warehouse Name',
  'PR Code',
  'Qty',
];

export const openPOTableHeader = [
  'SL',
  'Plant Name',
  'Warehouse Name',
  'PO No',
  'Qty',
];
