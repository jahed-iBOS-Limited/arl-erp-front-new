import { createSlice } from '@reduxjs/toolkit';
import { _currentTime, _todaysStartTime } from '../_currentTime';
import { _todaysEndTime } from './../_currentTime';
import { _todayDate } from './../_todayDate';
import { _monthFirstDate } from '../_monthFirstDate';

const initState = {
  leaveMovementApp: {
    id: undefined,
    leaveType: 1,
    employeeName: '',
    employeeInfo: '',
    reasonType: '',
    fromDate: _todayDate(),
    fromTime: '',
    toDate: _todayDate(),
    toTime: '',
    reason: '',
    address: '',
  },
  poLanding: {
    orderType: '',
    refType: '',
    sbu: '',
    purchaseOrg: '',
    plant: '',
    warehouse: '',
  },
  existingtransportpolicyLanding: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    shipPoint: '',
  },
  lastPOData: '',
  lastInvData: '',
  tablePOIndex: '',
  prtablePOIndex: '',
  lastPOApprovalId: '',
  LastPrApprovalId: '',
  tableworkOrderId: '',
  lastReturnApprovalId: '',
  tableItemIndex: '',
  tableInventoryIndex: '',
  transferOutTaxbranchDDL: '',
  indentTableIndex: '',
  assetTableIndex: '',
  serviceTableIndex: '',
  plantNameDDL: '',
  tableAssetId: '',
  plantDDL: '',
  salesOrderLanding: {
    sbu: '',
    shippoint: '',
    plant: '',
    salesOrg: '',
    salesOffice: '',
    distributionChannel: '',
    orderType: '',
    orderStatus: '',
  },
  purchaseInvoiceLanding: {
    sbu: '',
    purchaseOrg: '',
    plant: '',
    warehouse: '',
  },
  customerSalesLanding: {
    sbu: '',
    business_partner: '',
  },
  deliveryLanding: {
    sbu: '',
    distributionChannel: '',
    shipPoint: '',
    status: { value: false, label: 'Incomplete' },
    from: _todayDate(),
    to: _todayDate(),
  },
  creditNoteLanding: {
    taxbranch: '',
    formDate: _todayDate(),
    toDate: _todayDate(),
  },
  pendingDeliveryReportLanding: {
    reportType: '',
    sbu: '',
    shippingPoint: '',
    distributionChannel: '',
    region: '',
    area: '',
    territory: '',
    warehouse: '',
    soldToParty: '',
    fromDate: _todayDate(),
    fromTime: _todaysStartTime(),
    toDate: _todayDate(),
    toTime: _todaysEndTime(),
  },
  purchaseRequestLanding: {
    wh: '',
    plant: '',
    po: '',
    sbu: '',
    status: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  taxProductionLanding: {
    taxBranch: '',
    toDate: _todayDate(),
    formDate: _todayDate(),
  },
  salesInvoiceiBOSlanding: {
    branch: '',
    status: 'printed',
    shipPoint: '',
    toDate: _todayDate(),
    fromDate: _todayDate(),
  },
  cashJournalLanding: {
    sbu: '',
    accountingJournalTypeId: '',
    transactionDate: _todayDate(),
    completeDate: _todayDate(),
    toDate: _todayDate(),
    fromDate: _todayDate(),
    code: '',
    type: 'notComplated',
  },
  bankJournalLanding: {
    sbu: '',
    accountingJournalTypeId: '',
    transactionDate: _todayDate(),
    completeDate: _todayDate(),
    toDate: _todayDate(),
    fromDate: _todayDate(),
    code: '',
    type: 'notComplated',
  },
  adjustmentJournalLanding: {
    sbu: '',
    accountingJournalTypeId: '',
    transactionDate: _todayDate(),
    completeDate: _todayDate(),
    toDate: _todayDate(),
    fromDate: _todayDate(),
    code: '',
    type: '',
  },
  invTransaction: {
    sbu: '',
    plant: '',
    warehouse: '',
    transGrup: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  invAdjustment: {
    sbu: '',
    plant: '',
    warehouse: '',
    transGrup: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  serviceReceive: {
    sbu: '',
    plant: '',
    warehouse: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  assetReceive: {
    sbu: '',
    plant: '',
    warehouse: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  workOrder: {
    plantName: '',
    sbuName: '',
    warehouseName: '',
    status: '',
    costCenter: '',
  },
  ibos_app_activity: { activityName: '', moduleName: '' },
  advanceForInternalExpLanding: '',
  salesLanding: {
    taxBranch: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  purchaseDebitNoteLanding: {
    taxBranch: '',
    toDate: _todayDate(),
    formDate: _todayDate(),
  },
  purchaseLanding: {
    taxBranch: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  individualKpi: {
    employee: '',
  },

  salesCalendarSetup: {
    month: '',
    year: '',
    calendarStatus: '',
  },
  salesQuotationLanding: {
    status: { value: true, label: 'Quotation Open' },
    formDate: _todayDate(),
    toDate: _todayDate(),
  },
  shipmentCostLading: {
    shipPoint: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
    reportType: '',
  },
  shipmentlanding: {
    pgiShippoint: '',
    reportType: { value: 2, label: 'Shipment Unscheduled' },
    tillDate: _todayDate(),
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  employeeRegisterLanding: {
    driverName: '',
    travelDateFrom: _todayDate(),
    travelDateTo: _todayDate(),
  },
  approvalModuleName: '',
  approvalActivityName: '',
  itemRequestLanding: {
    plant: '',
    sbu: '',
    status: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
    wh: '',
    privacyType: 1,
  },
  businessPartnerLanding: {
    partnerType: '',
    distributionChannel: { value: 0, label: 'All' },
    approveStatus: { value: 1, label: 'Approve' },
  },
  cancelInvLanding: {
    plant: '',
    sbu: '',
    wh: '',
  },
  empValuesAndcompetency: {
    department: '',
    designation: '',
    suppervisor: '',
    year: '',
    type: 0,
  },
  gatePaseLanding: {
    warehouse: '',
    plant: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  receiveOrPayment: {
    transactionType: '',
    ReferanceNo: '',
    employeeEnroll: '',
  },
  personalExpRegLanding: {
    internalAccount: false,
    checkPublic: false,
    expenseFor: '',
    plant: '',
    sbu: '',
    country: '',
    currency: '',
    unsubmitedExpense: true,
    approval: false,
    billSubmit: false,
    supervisor: { value: true, label: 'Supervisor' },
  },
  billregisterLanding: {
    sbu: '',
    costCenter: '',
    billType: '',
    plant: '',
    status: { value: 2, label: 'Pending' },
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  registerReport: {
    sbu: '',
    partnerType: '',
  },
  approvebillregLanding: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    sbu: '',
    costCenter: '',
    billType: '',
    plant: '',
    status: {
      value: 1,
      label: 'Pending',
    },
  },
  indentStatement: {
    wh: '',
    plant: '',
    po: '',
    sbu: '',
    status: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },

  salaryTopSheetDetails: {
    reportType: '',
    buId: '',
    workPlaceGroupId: '',
    positionGrpId: '',
    monthId: '',
    yearId: '',
  },
  rentalVehilceCostLanding: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    reportType: {
      value: 1,
      label: 'Pending',
    },
    reportTypeOne: {
      value: 0,
      label: 'All',
    },
    itemLists: [],
    supplierName: { value: 0, label: 'All' },
  },
  receiveFromShopFloorInitData: {
    sbu: '',
    plant: '',
    warehouse: '',
  },
  itemRequest: '',
  preparepaymentIndex: '',
  empKpiReportInitData: {
    year: '',
    employee: '',
    department: '',
  },
  GRNStatementLanding: {
    businessUnit: '',
    employee: '',
    department: '',
  },
  bankJournalCreate: {
    bankAcc: '',
    partner: '',
    receiveFrom: '',
    instrumentType: '',
    instrumentNo: '',
    instrumentDate: _todayDate(),
    headerNarration: '',
    placedInBank: false,
    placingDate: _todayDate(),
    paidTo: '',
    transferTo: '',
    sendToGLBank: '',
    transaction: '',
    partnerType: '',
    isCheck: false,
    // amount is for bank receive and bank payment row
    amount: '',
    // transferAmount is for bank transfer header
    transferAmount: '',
    narration: '',
    transactionDate: _todayDate(),
    customerSupplierStatus: 'customer',
    partnerBankAccount: '',
  },
  shopFloorInventoryTransaction: {
    plant: '',
    shopFloor: '',
    transactionType: '',
  },
  financialsCustomerBankReceive: {
    accountNo: '',
    toDate: '',
  },
  financialsPaymentAdvice: {
    date: '',
    sbuUnit: '',
    cashGl: '',
    accountNo: '',
    type: '',
    status: '',
    billType: '',
  },
  financialsBankadvice: {
    dateTime: _todayDate(),
    businessUnit: '',
    bankAccountNo: '',
    adviceType: '',
    mandatory: '',
    advice: '',
    voucherPosting: '',
  },
  invoicemanagementSystemClearSalesInvoice: {
    transactionType: '',
    ReferanceNo: '',
    employeeEnroll: '',
    customer: '',
  },
  reportPartnerLedger: {
    supplierName: '',
    sbu: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  reportPoRegister: {
    wh: '',
    plant: '',
    po: '',
    sbu: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
    type: '',
    typeCode: '',
  },
  reportPrPoGrn: {
    wh: '',
    plant: '',
    sbu: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
    type: '',
    typeCode: '',
  },
  reportBillBySupplier: {
    sbu: '',
    issuer: '',
    partner: '',
    po: '',
    status: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
    plant: '',
    wareHouse: '',
  },
  financialsBankStatementUpload: {
    lastCollected: '',
    bankAccountNo: '',
    runningBalance: '',
    openingDate: '',
    openingBalance: '',
  },
  financialsManualReconcile: {
    backAccount: '',
    sbu: '',
    transactionDate: _todayDate(),
    acDDL: '',
    typeDDL: '',
    isManualReconsile: '',
  },
  reportIncomestatement: {
    fromDate: _todayDate(),
    todate: _todayDate(),
    lastPeriodFrom: _todayDate(),
    lastPeriodTo: _todayDate(),
    enterpriseDivision: '',
    SBU: '',
    profitCenter: '',
    conversionRate: 1,
  },
  reportBankReconciliation: {
    date: _todayDate(),
    bankAccount: '',
  },
  reportSubLedgerReport: {
    glLedger: '',
    fromDate: _todayDate(),
    todate: _todayDate(),
  },
  reportsInventoryStatement: {
    plant: '',
    wh: '',
    itemCategory: '',
    itemSubCategory: '',
    fromDate: _todayDate(),
    fromTime: _currentTime(),
    toDate: _todayDate(),
    toTime: _currentTime(),
    itemType: '',
    type: '',
  },
  reportsInventoryStock: {
    plant: '',
    wh: '',
    itemCategory: '',
    itemSubCategory: '',
    fromDate: _todayDate(),
    fromTime: _currentTime(),
    toDate: _todayDate(),
    toTime: _currentTime(),
    itemType: '',
  },
  bankStatementCorrection: {
    backAccount: '',
    acDDL: '',
    transactionDate: '',
  },
  generalInformation: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    shipPoint: '',
  },
  bankingChequeRegister: {
    date: '',
    acc: '',
    sbu: '',
    searchTerm: '',
    isPrint: false,
  },
  financialsInventoryJournal: {
    fromDate: '',
    toDate: '',
  },
  pendingOrderShippointLanding: {
    pendingOrderShippoint: '',
  },
  financialManagementReportRegister: {
    fromDate: '',
    toDate: '',
  },
  financialManagementReportCashFlowStatement: {
    viewType: '',
    enterpriseDivision: '',
    subDivision: '',
    businessUnit: '',
    convertionRate: '',
    fromDate: '',
    toDate: '',
  },
  financialManagementReportAutoReconcile: {
    fromDate: '',
    toDate: '',
  },
  partnerAllotmentChallanLading: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    reportType: { value: 1, label: 'Pending Delivery' },
  },
  salesInvoiceData: {
    whName: '',
    counter: '',
  },
  assetReportMaintanceReport: {
    backAccount: '',
    acDDL: '',
    transactionDate: '',
  },
  salesAndProductionTableLanding: {
    plant: '',
    year: '',
  },
  manufactureBOMTableLanding: {
    plant: '',
    shopfloor: '',
  },
  manufacturePOTableLanding: {
    plant: '',
    shopfloor: '',
  },
  manufacturePETableLanding: {
    plant: '',
    shopfloor: '',
  },
  accountingJournalLanding: {
    sbu: '',
    journalType: '',
    fromDate: _todayDate(),
    toDate: _todayDate(),
    code: '',
  },
  KPIScoreData: null,
  DepartmentalBalancedScorecardData: null,
  SBUBalancedScorecardData: null,
  powerApi: {
    testReportToken: '',
    reportId: '',
    datasetId: '',
    generateToken: '',
    embedUrl: '',
  },
  renewalRegInitData: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    vehicleNo: '',
    status: '',
    renewalType: '',
    plant: '',
  },
  internalControlBudgetInitData: {
    financialYear: '',
    budgetType: '',
  },
  managementImportTransactionShipment: {
    searchPo: '',
  },
  rebConsumptionLanding: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    shift: { value: '', label: 'ALL' },
  },
  generatorRunningHourLanding: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    shift: { value: '', label: 'ALL' },
  },
  fuelConsumptionLanding: {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    shift: { value: '', label: 'ALL' },
  },
  shippingBillRegisterLanding: {
    sbu: '',
    costCenter: '',
    billType: '',
    plant: '',
    status: { value: 2, label: 'Pending' },
    fromDate: _todayDate(),
    toDate: _todayDate(),
  },
  profileOverview: {
    businessUnit: '',
    workPlace: '',
  },
  bankGuarantee: {
    type: { value: 1, label: 'Bank Guarantee' },
  },
  itemBasicInfoInitData: {
    id: undefined,
    itemSearch: '',
    itemType: '',
    itemCategory: { value: 0, label: 'All' },
    itemSubCategory: { value: 0, label: 'All' },
    plant: { value: 0, label: 'All' },
    warehouse: { value: 0, label: 'All' },
  },
  OEECapacityConfigurationInitData: {
    plant: '',
    shopFloor: '',
    machine: '',
  },
  ItemQualityCheckLandingInitData: {
    plant: '',
    warehouse: '',
    fromDate: _monthFirstDate(),
    toDate: _todayDate(),
  },
  SalesCollectionInitData: {
    customer: '',
    type: { value: 1, label: 'Pending for Invoice' },
    paymentType: '',
    billType: '',
    fromDate: '',
    toDate: '',

    sbu: '',
    accountingJournalTypeId: { value: 4, label: 'Bank Receipts ' },
  },
  weightScaleConfigValues: {},
};

export const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: initState,
  reducers: {
    clearLocalStorageToInitState: (state) => {
      return initState;
    },
    setLeaveMovementData: (state, action) => {
      const { payload } = action;
      state.leaveMovementApp = {
        ...state?.leaveMovementApp,
        ...payload,
      };
    },
    setSalaryTopSheetData: (state, action) => {
      const { payload } = action;
      state.salaryTopSheetDetails = payload;
    },
    setBankJournalCreateData: (state, action) => {
      const { payload } = action;
      state.bankJournalCreate = {
        ...state?.bankJournalCreate,
        ...payload,
      };
    },
    setPOLandingData: (state, action) => {
      const { payload } = action;
      state.poLanding = payload;
    },
    setCreditNoteLanding: (state, action) => {
      const { payload } = action;
      state.creditNoteLanding = payload;
    },
    setToLaningData: (state, action) => {
      const { payload } = action;
      state.transferOutTaxbranchDDL = payload;
    },
    setPnLandingData: (state, action) => {
      const { payload } = action;
      state.plantNameDDL = payload;
    },
    setBomLandingData: (state, action) => {
      const { payload } = action;
      state.plantDDL = payload;
    },
    setItemRequest: (state, action) => {
      const { payload } = action;
      state.itemRequest = payload;
    },
    setBalesOrderLanding: (state, action) => {
      const { payload } = action;
      state.salesOrderLanding = payload;
    },
    setPurchaseInvoiceLanding: (state, action) => {
      const { payload } = action;
      state.purchaseInvoiceLanding = payload;
    },
    setPurchaseRequestLanding: (state, action) => {
      const { payload } = action;
      state.purchaseRequestLanding = payload;
    },
    setItemRequestLanding: (state, action) => {
      const { payload } = action;
      state.itemRequestLanding = payload;
    },
    setPendingDeliveryReportLanding: (state, action) => {
      const { payload } = action;
      state.pendingDeliveryReportLanding = payload;
    },
    setIndentStatementLanding: (state, action) => {
      const { payload } = action;
      state.indentStatement = payload;
    },
    setreceiveShopFloorLanding: (state, action) => {
      const { payload } = action;
      state.receiveFromShopFloorInitData = payload;
    },
    setIndentTableLanding: (state, action) => {
      const { payload } = action;
      state.indentTableIndex = payload;
    },
    setBusinessPartnerLanding: (state, action) => {
      const { payload } = action;
      state.businessPartnerLanding = payload;
    },
    setCancelInvLanding: (state, action) => {
      const { payload } = action;
      state.cancelInvLanding = payload;
    },
    setCustomerSalesLanding: (state, action) => {
      const { payload } = action;
      state.customerSalesLanding = payload;
    },
    setDeliveryLanding: (state, action) => {
      const { payload } = action;
      state.deliveryLanding = payload;
    },
    setTaxProductionLanding: (state, action) => {
      const { payload } = action;
      state.taxProductionLanding = payload;
    },
    setSalesInvoiceiBOSlanding: (state, action) => {
      const { payload } = action;
      state.salesInvoiceiBOSlanding = payload;
    },
    setCashJournalLandinglanding: (state, action) => {
      const { payload } = action;
      state.cashJournalLanding = payload;
    },
    setBankJournalLanding: (state, action) => {
      const { payload } = action;
      state.bankJournalLanding = payload;
    },
    setAdjustmentJournalLanding: (state, action) => {
      const { payload } = action;
      state.adjustmentJournalLanding = payload;
    },
    setInvTransaction: (state, action) => {
      const { payload } = action;
      state.invTransaction = payload;
    },
    setInvAdjustment: (state, action) => {
      const { payload } = action;
      state.invAdjustment = payload;
    },
    setServiceReceive: (state, action) => {
      const { payload } = action;
      state.serviceReceive = payload;
    },
    setAssetReceive: (state, action) => {
      const { payload } = action;
      state.assetReceive = payload;
    },
    setWorkOrder: (state, action) => {
      const { payload } = action;
      state.workOrder = payload;
    },
    setAdvanceForInternalExpLanding: (state, action) => {
      const { payload } = action;
      state.advanceForInternalExpLanding = payload;
    },
    setIBOS_app_activity: (state, action) => {
      const { payload } = action;
      state.ibos_app_activity = payload;
    },
    setSalesLanding: (state, action) => {
      const { payload } = action;
      state.salesLanding = payload;
    },
    setPurchaseDebitNoteLanding: (state, action) => {
      const { payload } = action;
      state.purchaseDebitNoteLanding = payload;
    },
    setPurchaseLanding: (state, action) => {
      const { payload } = action;
      state.purchaseLanding = payload;
    },
    setIndividualKpi: (state, action) => {
      const { payload } = action;
      state.individualKpi = payload;
    },
    setEmpValuesAndcompetency: (state, action) => {
      const { payload } = action;
      state.empValuesAndcompetency = payload;
    },
    setEmpValuesAndcompetencyEmpty: (state, action) => {
      state.empValuesAndcompetency = {
        department: '',
        designation: '',
        suppervisor: '',
        year: '',
        type: 0,
      };
    },
    setIndividualKpiEmpty: (state) => {
      state.individualKpi = {
        employee: '',
      };
    },
    setSalesCalendarSetup: (state, action) => {
      const { payload } = action;
      state.salesCalendarSetup = payload;
    },

    setApprovalModuleNameSetup: (state, action) => {
      const { payload } = action;
      state.approvalModuleName = payload;
    },
    setApprovalActivitySetup: (state, action) => {
      const { payload } = action;
      state.approvalActivityName = payload;
    },
    setSalesQuotationLanding: (state, action) => {
      const { payload } = action;
      state.salesQuotationLanding = payload;
    },
    setShipmentCostLading: (state, action) => {
      const { payload } = action;
      state.shipmentCostLading = payload;
    },
    setShipmentlanding: (state, action) => {
      const { payload } = action;
      state.shipmentlanding = payload;
    },
    setReceiveOrPayment: (state, action) => {
      const { payload } = action;
      state.receiveOrPayment = payload;
    },
    setEmployeeRegisterLanding: (state, action) => {
      const { payload } = action;
      state.employeeRegisterLanding = payload;
    },
    setRegisterReport: (state, action) => {
      const { payload } = action;
      state.registerReport = payload;
    },
    setPersonalExpRegLanding: (state, action) => {
      const { payload } = action;
      state.personalExpRegLanding = payload;
    },
    setApprovebillregLanding: (state, action) => {
      const { payload } = action;
      state.approvebillregLanding = payload;
    },
    setGatePassLanding: (state, action) => {
      const { payload } = action;
      state.gatePaseLanding = payload;
    },
    setRentalVehilceCostLanding: (state, action) => {
      const { payload } = action;
      state.rentalVehilceCostLanding = payload;
    },
    setBillregisterLanding: (state, action) => {
      const { payload } = action;
      state.billregisterLanding = payload;
    },
    setPOLastData: (state, action) => {
      const { payload } = action;
      state.lastPOData = payload;
    },
    setInvLastData: (state, action) => {
      const { payload } = action;
      state.lastInvData = payload;
    },
    setTablePOData: (state, action) => {
      const { payload } = action;
      state.tablePOIndex = payload;
    },
    setPRTablePOData: (state, action) => {
      const { payload } = action;
      state.prtablePOIndex = payload;
    },
    setItemTablePOData: (state, action) => {
      const { payload } = action;
      state.tableItemIndex = payload;
    },
    setpreparepaymentData: (state, action) => {
      const { payload } = action;
      state.preparepaymentIndex = payload;
    },
    setGRNStatementLanding: (state, action) => {
      const { payload } = action;
      state.GRNStatementLanding = payload;
    },
    setExistingtransportpolicyLanding: (state, action) => {
      const { payload } = action;
      state.existingtransportpolicyLanding = payload;
    },
    setAssetPOData: (state, action) => {
      const { payload } = action;
      state.tableAssetId = payload;
    },
    setworkOrderData: (state, action) => {
      const { payload } = action;
      state.tableworkOrderId = payload;
    },
    setInventoryTablePOData: (state, action) => {
      const { payload } = action;
      state.tableInventoryIndex = payload;
    },
    setAssetTableData: (state, action) => {
      const { payload } = action;
      state.assetTableIndex = payload;
    },
    setServiceTableData: (state, action) => {
      const { payload } = action;
      state.serviceTableIndex = payload;
    },
    setPrApprovalTablePOData: (state, action) => {
      const { payload } = action;
      state.LastPrApprovalId = payload;
    },
    setPOApprovalTableData: (state, action) => {
      const { payload } = action;
      state.lastPOApprovalId = payload;
    },
    setReturnTableApprovalData: (state, action) => {
      const { payload } = action;
      state.lastReturnApprovalId = payload;
    },
    setPartnerAllotmentChallanLading: (state, action) => {
      const { payload } = action;
      state.partnerAllotmentChallanLading = payload;
    },
    setEmpKpiReportInitData: (state, action) => {
      const { payload } = action;
      state.empKpiReportInitData = payload;
    },
    SetShopFloorInventoryTransaction: (state, action) => {
      const { payload } = action;
      state.shopFloorInventoryTransaction = payload;
    },
    setFinancialsCustomerBankReceive: (state, action) => {
      const { payload } = action;
      state.financialsCustomerBankReceive = payload;
    },
    setFinancialsPaymentAdvice: (state, action) => {
      const { payload } = action;
      state.financialsPaymentAdvice = payload;
    },
    setFinancialsBankadvice: (state, action) => {
      const { payload } = action;
      state.financialsBankadvice = payload;
    },
    setInvoicemanagementSystemClearSalesInvoice: (state, action) => {
      const { payload } = action;
      state.invoicemanagementSystemClearSalesInvoice = payload;
    },
    setReportPartnerLedger: (state, action) => {
      const { payload } = action;
      state.reportPartnerLedger = payload;
    },
    setReportPoRegister: (state, action) => {
      const { payload } = action;
      state.reportPoRegister = payload;
    },
    setReportPrPoGrn: (state, action) => {
      const { payload } = action;
      state.reportPrPoGrn = payload;
    },
    setReportBillBySupplier: (state, action) => {
      const { payload } = action;
      state.reportBillBySupplier = payload;
    },
    setFinancialsBankStatementUpload: (state, action) => {
      const { payload } = action;
      state.financialsBankStatementUpload = payload;
    },
    setFinancialsManualReconcile: (state, action) => {
      const { payload } = action;
      state.financialsManualReconcile = payload;
    },
    setReportIncomestatement: (state, action) => {
      const { payload } = action;
      state.reportIncomestatement = payload;
    },
    setReportBankReconciliation: (state, action) => {
      const { payload } = action;
      state.reportBankReconciliation = payload;
    },
    setReportSubLedgerReport: (state, action) => {
      const { payload } = action;
      state.reportSubLedgerReport = payload;
    },

    setReportsInventoryStatement: (state, action) => {
      const { payload } = action;
      state.reportsInventoryStatement = payload;
    },
    setReportsInventoryStock: (state, action) => {
      const { payload } = action;
      state.reportsInventoryStock = payload;
    },
    setBankStatementCorrection: (state, action) => {
      const { payload } = action;
      state.bankStatementCorrection = payload;
    },
    SetGeneralInformation: (state, action) => {
      const { payload } = action;
      state.generalInformation = payload;
    },
    setBankingChequeRegister: (state, action) => {
      const { payload } = action;
      state.bankingChequeRegister = payload;
    },
    setFinancialsInventoryJournal: (state, action) => {
      const { payload } = action;
      state.financialsInventoryJournal = payload;
    },
    setPendingOrderShippointLanding: (state, action) => {
      const { payload } = action;
      state.pendingOrderShippointLanding = payload;
    },
    setFinancialManagementReportRegister: (state, action) => {
      const { payload } = action;
      state.financialManagementReportRegister = payload;
    },
    setFinancialManagementReportCashFlowStatement: (state, action) => {
      const { payload } = action;
      state.financialManagementReportCashFlowStatement = payload;
    },
    setFinancialManagementReportAutoReconcile: (state, action) => {
      const { payload } = action;
      state.financialManagementReportAutoReconcile = payload;
    },
    SetSalesInvoiceData: (state, action) => {
      const { payload } = action;
      state.salesInvoiceData = payload;
    },
    SetAssetReportMaintanceReport: (state, action) => {
      const { payload } = action;
      state.assetReportMaintanceReport = payload;
    },
    SetSalesAndProductionTableLanding: (state, action) => {
      const { payload } = action;
      state.salesAndProductionTableLanding = payload;
    },
    SetManufactureBOMTableLanding: (state, action) => {
      const { payload } = action;
      state.manufactureBOMTableLanding = payload;
    },
    SetManufacturePOTableLanding: (state, action) => {
      const { payload } = action;
      state.manufacturePOTableLanding = payload;
    },
    SetManufacturePETableLanding: (state, action) => {
      const { payload } = action;
      state.manufacturePETableLanding = payload;
    },
    SetAccountingJournalLanding: (state, action) => {
      const { payload } = action;
      state.accountingJournalLanding = payload;
    },
    // for KPI ScoreCard save
    SetKPIScoreData: (state, action) => {
      state.KPIScoreData = action.payload;
    },
    // for departmental balance scorecard
    SetDepartmentalBalancedScoreData: (state, action) => {
      state.DepartmentalBalancedScorecardData = action.payload;
    },
    // for sbu balanced scorecard
    SetSBUBalancedScoreData: (state, action) => {
      state.SBUBalancedScorecardData = action.payload;
    },
    // for power BI
    SetPowerBiData: (state, action) => {
      const { payload } = action;
      state.powerApi = payload;
    },
    setRenewalRegInitData: (state, action) => {
      const { payload } = action;
      state.renewalRegInitData = {
        ...state.renewalRegInitData,
        [payload?.key]: payload?.value,
      };
    },
    setInternalControlBudgetInitData: (state, action) => {
      const { payload } = action;
      state.internalControlBudgetInitData = payload;
    },
    setManagementImportTransactionShipment: (state, action) => {
      const { payload } = action;
      state.managementImportTransactionShipment = payload;
    },
    setRebConsumptionLanding: (state, action) => {
      const { payload } = action;
      state.rebConsumptionLanding = payload;
    },
    setGeneratorRunningHourLanding: (state, action) => {
      const { payload } = action;
      state.generatorRunningHourLanding = payload;
    },
    setFuelConsumptionLanding: (state, action) => {
      const { payload } = action;
      state.fuelConsumptionLanding = payload;
    },
    setShippingBillregisterLanding: (state, action) => {
      const { payload } = action;
      state.shippingBillRegisterLanding = payload;
    },
    setProfileOverviewStore: (state, action) => {
      const { payload } = action;
      state.profileOverview = payload;
    },
    setBankGuaranteeStore: (state, action) => {
      const { payload } = action;
      state.bankGuarantee = payload;
    },
    setItemBasicInfoInitData: (state, action) => {
      const { payload } = action;
      state.itemBasicInfoInitData = payload;
    },
    setOEECapacityConfigurationData: (state, action) => {
      const { payload } = action;
      state.OEECapacityConfigurationInitData = payload;
    },
    setItemQualityCheckLandingInitData: (state, action) => {
      const { payload } = action;
      state.ItemQualityCheckLandingInitData = payload;
    },
    setSalesCollectionInitData: (state, action) => {
      const { payload } = action;
      state.SalesCollectionInitData = payload;
    },
    setWeightScaleConfigValues: (state, action) => {
      const { payload } = action;
      state.weightScaleConfigValues = payload;
    },
  },
});
