import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import * as auth from '../app/modules/Auth/_redux/authRedux';
import { authSlice } from '../app/modules/Auth/_redux/Auth_Slice';
import { usersSlice } from '../app/modules/config/domainControll/createUser/_redux/createUserSlice';
import { roleextantionsSlice } from '../app/modules/config/domainControll/roleExtension/_redux/roleExtensionSlice';
import { costControllingUnitSlice } from '../app/modules/financialManagement/costControlling/controllingUnit/_redux/Slice';
import { costCenterTypeSlice } from '../app/modules/financialManagement/costControlling/costCenterType/_redux/Slice';
import { costElementSlice } from '../app/modules/financialManagement/costControlling/costElement/_redux/Slice';
import { profitCenterGroupSlice } from '../app/modules/financialManagement/costControlling/profitCenterGroup/_redux/Slice';
import { costCenterSlice } from '../app/modules/financialManagement/costControlling/costCenter/_redux/Slice';
import { billOfMaterialSlice } from '../app/modules/productionManagement/manufacturingExecutionSystem/billOfMaterial/_redux/Slice';
import { costCenterGroupSlice } from '../app/modules/financialManagement/costControlling/costCenterGroup/_redux/Slice';
import { generalLedgerSlice } from '../app/modules/financialManagement/configuration/generalLedger/_redux/Slice';
import { salesOrganizationSlice } from '../app/modules/salesManagement/configuration/salesOrganization/_redux/Slice';
import { profitCenterSlice } from '../app/modules/internalControl/configuration/profitCenter/_redux/Slice';
import { tradeOfferSlice } from '../app/modules/config/material-management/tradeOfferSetup/_redux/Slice';
import { priceSetupSlice } from '../app/modules/config/material-management/priceSetup/_redux/Slice';
import { ProductDivisionSlice } from '../app/modules/salesManagement/configuration/productDivision/_redux/Slice';
import { transportRouteSlice } from '../app/modules/transportManagement/configuration/transportRoute/_redux/Slice';
import { salesOfficeSlice } from '../app/modules/salesManagement/configuration/salesOffice/_redux/Slice';
import { salesTerritorySlice } from '../app/modules/salesManagement/configuration/salesTerritory/_redux/Slice';
import { salesTerritoryTypeSlice } from '../app/modules/salesManagement/configuration/salesTerritoryType/_redux/Slice';
import { productDivisionTypeSlice } from '../app/modules/salesManagement/configuration/productDivisionType/_redux/Slice';
import { tradeOfferItemGroupSlice } from '../app/modules/config/material-management/tradeOfferItemGroup/_redux/Slice';
import { distributionChannelSlice } from '../app/modules/salesManagement/configuration/distributionChannel/_redux/Slice';
import { LoadingPointSlice } from '../app/modules/inventoryManagement/configuration/loadingPoint/_redux/Slice';
import { shippingPointSlice } from '../app/modules/inventoryManagement/configuration/shippingPoint/_redux/Slice';

import { saleForceTerriotryConfigSlice } from '../app/modules/salesManagement/configuration/territorySalesforceConfig/_redux/Slice';
import { transportZoneSlice } from '../app/modules/transportManagement/configuration/transportZone/_redux/Slice';
import { commonDDLSlice } from '../app/modules/_helper/_redux/Slice';
import { rfqSlice } from '../app/modules/procurement/purchase-management/rfq/_redux/Slice';
import { deliverySlice } from '../app/modules/inventoryManagement/warehouseManagement/delivery/_redux/Slice';
import { purchaseOrderSlice } from '../app/modules/procurement/purchase-management/purchaseOrder/_redux/Slice';
import { salesContactSlice } from '../app/modules/salesManagement/orderManagement/salesContract/_redux/Slice';

import { salesQuotationSlice } from '../app/modules/salesManagement/orderManagement/salesQuotation/_redux/Slice';
import { shipmentSlice } from '../app/modules/transportManagement/shipmentManagement/shipping/_redux/Slice';
import { performanceMgtSlice } from '../app/modules/performanceManagement/_redux/Slice';

import { PGISlice } from '../app/modules/salesManagement/orderManagement/pgi/_redux/Slice';
import { salesOrderSlice } from '../app/modules/salesManagement/orderManagement/salesOrder/_redux/Slice';

import { performanceChartTwoSlice } from '../app/modules/performanceManagement/individualKpi/PerformanceChart/_redux/Slice';
import { inDividualBalancedScoreSlice } from '../app/modules/performanceManagement/individualKpi/balancedScore/_redux/Slice';
import { kipDeshboardTwoSlice } from '../app/modules/performanceManagement/individualKpi/kpiDashboard/_redux/Slice';
import { coreValuesTwoSlice } from '../app/modules/performanceManagement/coreValues/_redux/Slice';
import { competencyTwoSlice } from '../app/modules/performanceManagement/competency/_redux/Slice';
import { measuringScaleTwoSlice } from '../app/modules/performanceManagement/measuringScale/_redux/Slice';
import { customerInvoiceSlice } from '../app/modules/financialManagement/invoiceManagementSystem/customerSalesInvoice/_redux/Slice';

import { indPmsAchievementSlice } from '../app/modules/performanceManagement/individualKpi/achievement/_redux/Slice';
import { pmsDimensionTwoSlice } from '../app/modules/performanceManagement/pmsDimension/_redux/Slice';
import { strategicParticularsTwoSlice } from '../app/modules/performanceManagement/strategicParticulars/_redux/Slice';
// import { vehicleUnitSlice } from "../app/modules/salesManagement/transportManagementSystem/vehicle/_redux/Slice";
import { partnerSalesSlice } from '../app/modules/config/partner-management/partnerBasicInfo/patnerEdit/collpaseComponent/partnerSales/_redux/Slice';
import { codeGenerateSlice } from '../app/modules/config/domainControll/code-generate/_redux/Slice';

import { cashJournalSlice } from './../app/modules/financialManagement/financials/cashJournal/_redux/Slice';
import { bankAccountSlice } from '../app/modules/financialManagement/configuration/bankAccount/_redux/Slice';
import { adjustmentJournalSlice } from '../app/modules/financialManagement/financials/adjustmentJournal/_redux/Slice';
import { bankJournalSlice } from '../app/modules/financialManagement/financials/bankJournal/_redux/Slice';
import { adInternalExp } from '../app/modules/financialManagement/expense/advanceForInternalExp/_redux/Slice';
import { taxBranchSlice } from '../app/modules/vatManagement/configuration/branch/_redux/Slice';
import { buTaxConfigSlice } from '../app/modules/vatManagement/configuration/bsuTaxConfig/_redux/Slice';
import { taxPriceSetupSlice } from '../app/modules/vatManagement/configuration/priceSetup/_redux/Slice';
import { invTransactionSlice } from '../app/modules/inventoryManagement/warehouseManagement/invTransaction/_redux/Slice';
import { localStorageSlice } from '../app/modules/_helper/reduxForLocalStorage/Slice';
import { purchaseOrgSlice } from './../app/modules/procurement/configuration/purchase-organization/_redux/Slice';

import { pendingOrderSlice } from '../app/modules/salesManagement/report/pendingOrder/_redux/Slice';
import { vehicleUnitSlice } from '../app/modules/transportManagement/configuration/vehicle/_redux/Slice';
import { chatAppSlice } from '../app/modules/chats/chats/_redux/Slice';
import { partnerLedgerSlice } from '../app/modules/procurement/reports/partnerLedger/_redux/Slice';
import { corporatePerformanceChartSlice } from './../app/modules/performanceManagement/corporateKpi/PerformanceChart/_redux/Slice';
import { corporatePmsAchievementSlice } from './../app/modules/performanceManagement/corporateKpi/achievement/_redux/Slice';
import { corporateInDividualBalancedScoreSlice } from './../app/modules/performanceManagement/corporateKpi/balancedScore/_redux/Slice';
import { coporateKpiDeshboardSlice } from './../app/modules/performanceManagement/corporateKpi/kpiDashboard/_redux/Slice';
import { iChatAppSlice } from '../app/modules/chatApp/redux/Slice';
import { chattingAppSlice } from '../../src/app/modules/_helper/chattingAppRedux/Slice';

export const rootReducer = combineReducers({
  auth: auth.reducer,
  user: usersSlice.reducer,
  roleextantion: roleextantionsSlice.reducer,
  authData: authSlice.reducer,
  costControllingUnit: costControllingUnitSlice.reducer,
  profitCenterGroup: profitCenterGroupSlice.reducer,
  purchaseOrg: purchaseOrgSlice.reducer,
  profitCenter: profitCenterSlice.reducer,
  costCenterGroup: costCenterGroupSlice.reducer,
  costCenter: costCenterSlice.reducer,
  costCenterType: costCenterTypeSlice.reducer,
  costElement: costElementSlice.reducer,
  billOfMaterial: billOfMaterialSlice.reducer,
  generalLedger: generalLedgerSlice.reducer,
  salesOrganization: salesOrganizationSlice.reducer,
  transportRoute: transportRouteSlice.reducer,
  salesOffice: salesOfficeSlice.reducer,
  tradeOffer: tradeOfferSlice.reducer,
  priceSetup: priceSetupSlice.reducer,
  productDivision: ProductDivisionSlice.reducer,
  salesTerritory: salesTerritorySlice.reducer,
  salesTerritoryType: salesTerritoryTypeSlice.reducer,
  productDivisionType: productDivisionTypeSlice.reducer,
  tradeOfferItemGroup: tradeOfferItemGroupSlice.reducer,
  distributionChannel: distributionChannelSlice.reducer,
  LoadingPoint: LoadingPointSlice.reducer,
  shippingPoint: shippingPointSlice.reducer,
  salesForceTerritoryConig: saleForceTerriotryConfigSlice.reducer,
  transportZone: transportZoneSlice.reducer,
  commonDDL: commonDDLSlice.reducer,
  rfq: rfqSlice.reducer,
  delivery: deliverySlice.reducer,
  purchaseOrder: purchaseOrderSlice.reducer,
  salesContact: salesContactSlice.reducer,
  salesQuotation: salesQuotationSlice.reducer,
  performanceMgt: performanceMgtSlice.reducer,
  performanceChartTwo: performanceChartTwoSlice.reducer,
  corporatePerformanceChart: corporatePerformanceChartSlice.reducer,
  shipment: shipmentSlice.reducer,
  pgi: PGISlice.reducer,
  salesOrder: salesOrderSlice.reducer,
  inDividualBalancedScore: inDividualBalancedScoreSlice.reducer,
  corporateInDividualBalancedScore:
    corporateInDividualBalancedScoreSlice.reducer,
  kipDeshboardTwo: kipDeshboardTwoSlice.reducer,
  coporateKpiDeshboard: coporateKpiDeshboardSlice.reducer,
  coreValuesTwo: coreValuesTwoSlice.reducer,
  competencyTwo: competencyTwoSlice.reducer,
  measuringScaleTwo: measuringScaleTwoSlice.reducer,
  pmsDimensionTwo: pmsDimensionTwoSlice.reducer,
  strategicParticularsTwo: strategicParticularsTwoSlice.reducer,
  customerSalesInvoice: customerInvoiceSlice.reducer,
  indPmsAchievement: indPmsAchievementSlice.reducer,
  corporatePmsAchievement: corporatePmsAchievementSlice.reducer,
  vehicleUnit: vehicleUnitSlice.reducer,
  partnerSales: partnerSalesSlice.reducer,
  codeGenerate: codeGenerateSlice.reducer,
  pendingOrder: pendingOrderSlice.reducer,
  cashJournal: cashJournalSlice.reducer,
  bankAccount: bankAccountSlice.reducer,
  adjustmentJournal: adjustmentJournalSlice.reducer,
  partnerLedger: partnerLedgerSlice.reducer,
  bankJournal: bankJournalSlice.reducer,
  adInternalExp: adInternalExp.reducer,
  taxBranch: taxBranchSlice.reducer,
  buTaxConfig: buTaxConfigSlice.reducer,
  taxPriceSetup: taxPriceSetupSlice.reducer,
  invTransa: invTransactionSlice.reducer,
  localStorage: localStorageSlice.reducer,
  chatApp: chatAppSlice.reducer,
  iChatApp: iChatAppSlice.reducer,
  chattingApp: chattingAppSlice?.reducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
