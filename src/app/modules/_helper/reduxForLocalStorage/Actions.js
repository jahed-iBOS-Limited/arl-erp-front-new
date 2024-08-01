import { localStorageSlice } from "./Slice";
const { actions: slice } = localStorageSlice;

// this redux is for store data to local storage by redux persist

export const clearLocalStorageAction = (data) => (dispatch) => {
  dispatch(slice.clearLocalStorageToInitState(data));
};
export const setLeaveMovementDataAction = (data) => (dispatch) => {
  dispatch(slice.setLeaveMovementData(data));
};

export const setInvTransactionAction = (data) => (dispatch) => {
  dispatch(slice.setInvTransaction(data));
};
export const setInvAdjustmentAction = (data) => (dispatch) => {
  dispatch(slice.setInvAdjustment(data));
};

export const setBankJournalCreateAction = (data) => (dispatch) => {
  dispatch(slice.setBankJournalCreateData(data));
};

export const setServiceReceiveAction = (data) => (dispatch) => {
  dispatch(slice.setServiceReceive(data));
};
export const setPartnerAllotmentChallanLadingAction = (data) => (dispatch) => {
  dispatch(slice.setPartnerAllotmentChallanLading(data));
};
export const pendingDeliveryReportLandingAction = (data) => (dispatch) => {
  dispatch(slice.setPendingDeliveryReportLanding(data));
};
export const setExistingtransportpolicyLandingAction = (data) => (dispatch) => {
  dispatch(slice.setExistingtransportpolicyLanding(data));
};
export const setAssetReceiveAction = (data) => (dispatch) => {
  dispatch(slice.setAssetReceive(data));
};
export const setWorkOrderAction = (data) => (dispatch) => {
  dispatch(slice.setWorkOrder(data));
};
export const setIBOS_app_activityAction = (data) => (dispatch) => {
  dispatch(slice.setIBOS_app_activity(data));
};
export const setAdvanceForInternalExpLandingAction = (data) => (dispatch) => {
  dispatch(slice.setAdvanceForInternalExpLanding(data));
};

export const setPOLandingDataAction = (data) => (dispatch) => {
  dispatch(slice.setPOLandingData(data));
};
export const setRentalVehilceCostLandingAction = (data) => (dispatch) => {
  dispatch(slice.setRentalVehilceCostLanding(data));
};

export const setSalaryTopSheetDetailsDataAction = (data) => (dispatch) => {
  dispatch(slice.setSalaryTopSheetData(data));
};

export const setCreditNoteLandingAction = (data) => (dispatch) => {
  dispatch(slice.setCreditNoteLanding(data));
};

export const setLastPoDataAction = (data) => (dispatch) => {
  dispatch(slice.setPOLastData(data));
};

export const setLastInvDataAction = (data) => (dispatch) => {
  dispatch(slice.setInvLastData(data));
};
export const setGRNStatementLandingAction = (data) => (dispatch) => {
  dispatch(slice.setGRNStatementLanding(data));
};

export const setTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setTablePOData(data));
};

export const setPRTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setPRTablePOData(data));
};

export const setItemTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setItemTablePOData(data));
};

export const setPreparePaymentLastAction = (data) => (dispatch) => {
  dispatch(slice.setpreparepaymentData(data));
};

export const setAssetListTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setAssetPOData(data));
};

export const setworkOrderTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setworkOrderData(data));
};

export const setInventoryTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setInventoryTablePOData(data));
};

//for approval of

export const setPRApprovalId = (data) => (dispatch) => {
  dispatch(slice.setPrApprovalTablePOData(data));
};

export const setPoApprovalId = (data) => (dispatch) => {
  dispatch(slice.setPOApprovalTableData(data));
};
export const setPurchaseReturnId = (data) => (dispatch) => {
  dispatch(slice.setReturnTableApprovalData(data));
};

//approval end

export const setAssetTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setAssetTableData(data));
};

export const setServiceTableLastAction = (data) => (dispatch) => {
  dispatch(slice.setServiceTableData(data));
};

export const setTransferOutTaxBranchAction = (data) => (dispatch) => {
  dispatch(slice.setToLaningData(data));
};

export const setPlantNameAction = (data) => (dispatch) => {
  dispatch(slice.setPnLandingData(data));
};

export const setBomLandingAction = (data) => (dispatch) => {
  dispatch(slice.setBomLandingData(data));
};

export const setSalesOrderLandingAction = (data) => (dispatch) => {
  dispatch(slice.setBalesOrderLanding(data));
};
export const setPurchaseInvoiceLandingAction = (data) => (dispatch) => {
  dispatch(slice.setPurchaseInvoiceLanding(data));
};

export const setCustomerSalesLandingAction = (data) => (dispatch) => {
  dispatch(slice.setCustomerSalesLanding(data));
};

export const setDeliveryLandingAction = (data) => (dispatch) => {
  dispatch(slice.setDeliveryLanding(data));
};

export const setPurchaseRequestPPRAction = (data) => (dispatch) => {
  dispatch(slice.setPurchaseRequestLanding(data));
};

export const setItemRequestPPRAction = (data) => (dispatch) => {
  dispatch(slice.setItemRequestLanding(data));
};

export const setIndentStatementAction = (data) => (dispatch) => {
  dispatch(slice.setIndentStatementLanding(data));
};

export const setreceiveShopFloorLandingAction = (data) => (dispatch) => {
  dispatch(slice.setreceiveShopFloorLanding(data));
};

export const setIndentTableIndexAction = (data) => (dispatch) => {
  dispatch(slice.setIndentTableLanding(data));
};

//business partner
export const setBusinessPartnerAction = (data) => (dispatch) => {
  dispatch(slice.setBusinessPartnerLanding(data));
};

export const setCancelInvPPRAction = (data) => (dispatch) => {
  dispatch(slice.setCancelInvLanding(data));
};

export const setTaxProductionLanding_Action = (data) => (dispatch) => {
  dispatch(slice.setTaxProductionLanding(data));
};

export const setEmpValuesAndcompetency_Action = (data) => (dispatch) => {
  dispatch(slice.setEmpValuesAndcompetency(data));
};

export const setEmpValuesAndcompetencyEmpty_Action = (data) => (dispatch) => {
  dispatch(slice.setEmpValuesAndcompetencyEmpty(data));
};

export const setTaxProductionLandingEmpty_Action = (data) => (dispatch) => {
  dispatch(slice.setTaxProductionLandingEmpty());
};

export const setSalesInvoiceiBOSlanding_Action = (data) => (dispatch) => {
  dispatch(slice.setSalesInvoiceiBOSlanding(data));
};

export const setCashJournalLandinglanding_Action = (data) => (dispatch) => {
  dispatch(slice.setCashJournalLandinglanding(data));
};

export const setSalesLanding_Action = (data) => (dispatch) => {
  dispatch(slice.setSalesLanding(data));
};

export const setPurchaseDebitNoteLanding_Actions = (data) => (dispatch) => {
  dispatch(slice.setPurchaseDebitNoteLanding(data));
};

export const setPurchaseLanding_Action = (data) => (dispatch) => {
  dispatch(slice.setPurchaseLanding(data));
};

export const setIndividualKpi_Action = (data) => (dispatch) => {
  dispatch(slice.setIndividualKpi(data));
};

export const setSalesCalendarSetupAction = (data) => (dispatch) => {
  dispatch(slice.setSalesCalendarSetup(data));
};

export const setApprovalSetupModuleNameAction = (data) => (dispatch) => {
  dispatch(slice.setApprovalModuleNameSetup(data));
};

export const setApprovalSetupActivityNameAction = (data) => (dispatch) => {
  dispatch(slice.setApprovalActivitySetup(data));
};
export const setSalesQuotationLandingAction = (data) => (dispatch) => {
  dispatch(slice.setSalesQuotationLanding(data));
};
export const setShipmentCostLadingAction = (data) => (dispatch) => {
  dispatch(slice.setShipmentCostLading(data));
};
export const setShipmentlandingAction = (data) => (dispatch) => {
  dispatch(slice.setShipmentlanding(data));
};
export const setEmployeeRegisterLandingAction = (data) => (dispatch) => {
  dispatch(slice.setEmployeeRegisterLanding(data));
};
export const setReceiveOrPaymentAction = (data) => (dispatch) => {
  dispatch(slice.setReceiveOrPayment(data));
};
export const setGatePassLandingAction = (data) => (dispatch) => {
  dispatch(slice.setGatePassLanding(data));
};
export const setPersonalExpRegLandingAction = (data) => (dispatch) => {
  dispatch(slice.setPersonalExpRegLanding(data));
};

export const setBillregisterLandingAtion = (data) => (dispatch) => {
  dispatch(slice.setBillregisterLanding(data));
};

export const setRegisterReportAction = (data) => (dispatch) => {
  dispatch(slice.setRegisterReport(data));
};

export const setApprovebillregLandingAction = (data) => (dispatch) => {
  dispatch(slice.setApprovebillregLanding(data));
};
export const setEmpKpiReportInitData_Action = (data) => (dispatch) => {
  dispatch(slice.setEmpKpiReportInitData(data));
};

export const setItemRequestAction = (data) => (dispatch) => {
  dispatch(slice.setItemRequest(data));
};
export const setCashJournalLandingAction = (data) => (dispatch) => {
  dispatch(slice.setCashJournalLandinglanding(data));
};
export const setBankJournalLandingAction = (data) => (dispatch) => {
  dispatch(slice.setBankJournalLanding(data));
};
export const setAdjustmentJournalLandingAction = (data) => (dispatch) => {
  dispatch(slice.setAdjustmentJournalLanding(data));
};
export const SetShopFloorInventoryTransactionAction = (data) => (dispatch) => {
  dispatch(slice.SetShopFloorInventoryTransaction(data));
};
export const SetFinancialsCustomerBankReceiveAction = (data) => (dispatch) => {
  dispatch(slice.setFinancialsCustomerBankReceive(data));
};
export const SetFinancialsPaymentAdviceAction = (data) => (dispatch) => {
  dispatch(slice.setFinancialsPaymentAdvice(data));
};
export const SetFinancialsBankAdviceAction = (data) => (dispatch) => {
  dispatch(slice.setFinancialsBankadvice(data));
};
export const SetInvoicemanagementSystemClearSalesInvoiceAction = (data) => (
  dispatch
) => {
  dispatch(slice.setInvoicemanagementSystemClearSalesInvoice(data));
};
export const SetReportPartnerLedgerAction = (data) => (dispatch) => {
  dispatch(slice.setReportPartnerLedger(data));
};
export const SetReportPoRegisterAction = (data) => (dispatch) => {
  dispatch(slice.setReportPoRegister(data));
};
export const SetReportPrPoGrnAction = (data) => (dispatch) => {
  dispatch(slice.setReportPrPoGrn(data));
};
export const SetReportBillBySupplierAction = (data) => (dispatch) => {
  dispatch(slice.setReportBillBySupplier(data));
};
export const SetFinancialsBankStatementUploadAction = (data) => (dispatch) => {
  dispatch(slice.setFinancialsBankStatementUpload(data));
};
export const SetFinancialsManualReconcileAction = (data) => (dispatch) => {
  dispatch(slice.setFinancialsManualReconcile(data));
};
export const SetReportIncomestatementAction = (data) => (dispatch) => {
  dispatch(slice.setReportIncomestatement(data));
};
export const SetReportBankReconciliationAction = (data) => (dispatch) => {
  dispatch(slice.setReportBankReconciliation(data));
};
export const SetReportSubLedgerReportAction = (data) => (dispatch) => {
  dispatch(slice.setReportSubLedgerReport(data));
};
export const SetReportsInventoryStatementAction = (data) => (dispatch) => {
  dispatch(slice.setReportsInventoryStatement(data));
};
export const SetReportsInventoryStockAction = (data) => (dispatch) => {
  dispatch(slice.setReportsInventoryStock(data));
};
export const SetBankStatementCorrectionAction = (data) => (dispatch) => {
  dispatch(slice.setBankStatementCorrection(data));
};
//general information
export const SetGeneralInformationAction = (data) => (dispatch) => {
  dispatch(slice.SetGeneralInformation(data));
};
export const SetBankingChequeRegisterAction = (data) => (dispatch) => {
  dispatch(slice.setBankingChequeRegister(data));
};
export const SetFinancialsInventoryJournalAction = (data) => (dispatch) => {
  dispatch(slice.setFinancialsInventoryJournal(data));
};
export const setPendingOrderShippointLandingAction = (data) => (dispatch) => {
  dispatch(slice.setPendingOrderShippointLanding(data));
};
export const SetFinancialManagementReportRegisterAction = (data) => (
  dispatch
) => {
  dispatch(slice.setFinancialManagementReportRegister(data));
};
export const SetFinancialManagementReportCashFlowStatementAction = (data) => (
  dispatch
) => {
  dispatch(slice.setFinancialManagementReportCashFlowStatement(data));
};
export const SetFinancialManagementReportAutoReconcileAction = (data) => (
  dispatch
) => {
  dispatch(slice.setFinancialManagementReportAutoReconcile(data));
};

export const SetSalesInvoiceDataAction = (data) => (dispatch) => {
  console.log(data);
  dispatch(slice.SetSalesInvoiceData(data));
};
export const SetAssetReportMaintanceReportAction = (data) => (dispatch) => {
  // console.log(data)
  dispatch(slice.SetAssetReportMaintanceReport(data));
};

export const SetSalesAndProductionTableLandingAction = (data) => (dispatch) => {
  dispatch(slice.SetSalesAndProductionTableLanding(data));
};

export const SetManufactureBOMTableLandingAction = (data) => (dispatch) => {
  dispatch(slice.SetManufactureBOMTableLanding(data));
};
export const SetManufacturePOTableLandingAction = (data) => (dispatch) => {
  dispatch(slice.SetManufacturePOTableLanding(data));
};
export const SetManufacturePETableLandingAction = (data) => (dispatch) => {
  dispatch(slice.SetManufacturePETableLanding(data));
};
export const SetAccountingJournalLandingAction = (data) => (dispatch) => {
  dispatch(slice.SetAccountingJournalLanding(data));
};
export const SetKPIScoreData = (data) => (dispatch) => {
  dispatch(slice.SetKPIScoreData(data));
};
export const SetDepartmentalBalancedScoreData = (data) => (dispatch) => {
  dispatch(slice.SetDepartmentalBalancedScoreData(data));
};
export const SetSBUBalancedScoreData = (data) => (dispatch) => {
  dispatch(slice.SetSBUBalancedScoreData(data));
};
export const SetPowerBiAction = (data) => (dispatch) => {
  dispatch(slice.SetPowerBiData(data));
};
export const setRenewalRegInitDataAction = (key, value) => (dispatch) => {
  dispatch(slice.setRenewalRegInitData({ key, value }));
};
export const setInternalControlBudgetInitAction = (data) => (dispatch) => {
  dispatch(slice.setInternalControlBudgetInitData(data));
};
export const managementImportTransactionShipmentAction = (data) => (
  dispatch
) => {
  dispatch(slice.setManagementImportTransactionShipment(data));
};
export const setRebConsumptionLandingAction = (data) => (dispatch) => {
  dispatch(slice.setRebConsumptionLanding(data));
};
export const setGeneratorRunningHourLandingAction = (data) => (dispatch) => {
  dispatch(slice.setGeneratorRunningHourLanding(data));
};
export const setFuelConsumptionLandingAction = (data) => (dispatch) => {
  dispatch(slice.setFuelConsumptionLanding(data));
};

export const setShippingBillregisterLandingAction = (data) => (dispatch) => {
  dispatch(slice.setShippingBillregisterLanding(data));
};

export const setProfileOverviewStoreAction = (data) => (dispatch) => {
  dispatch(slice.setProfileOverviewStore(data));
};

export const setBankGuaranteeStoreAction = (data) => (dispatch) => {
  dispatch(slice.setBankGuaranteeStore(data));
};

export const setItemBasicInfoInitDataAction = (data) => (dispatch) => {
  dispatch(slice.setItemBasicInfoInitData(data));
};
export const setOEECapacityConfigurationAction = (data) => (dispatch) => {
  dispatch(slice.setOEECapacityConfigurationData(data));
};
export const setItemQualityCheckLandingInitDataAction = (data) => (dispatch) => {
  dispatch(slice.setItemQualityCheckLandingInitData(data));
};
export const setSalesCollectionInitDataAction = (data) => (dispatch) => {
  dispatch(slice.setSalesCollectionInitData(data));
};