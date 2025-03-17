import Axios from "axios";
import { _dateFormatter } from './../../../_helper/_dateFormate';

//getBusinessTransactionDDL_api


//getBankAccountDDL_api
export const getcashJournalSingleData_api = async (
  cashJournalId,
  accCashJournalId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/fino/CashJournal/GetCashJournalById?CashJournalId=${cashJournalId}&AccountingJournalTypeId=${accCashJournalId}`
    );
    if (res.status === 200 && res?.data) {

      // Cash Receipts Journal
      if (accCashJournalId === 1) {
        const item = res?.data?.[0];
        const ObjMap = item?.objRow?.map((itm) => ({
          transaction: itm?.subGLId ? {
            value: itm?.subGLId,
            label: itm?.subGLName,
            code: itm?.subGlCode,
          } : "",
          gl: itm?.generalLedgerId ? {
            value: itm?.generalLedgerId,
            label: itm?.generalLedgerName,
            code: itm?.generalLedgerCode,
          } : "",
          rowId: itm?.rowId,
          amount: Math.abs(itm?.amount),
          narration: itm?.narration,
          headerNarration: itm?.narration,
          bankAccountId: itm?.bankAccountId,
          bankAccNo: itm?.bankAccNo,
          partner: itm?.businessPartnerId ? {
            value: itm?.businessPartnerId,
            label: itm?.businessPartnerName,
            code: itm?.businessPartnerCode,
          } : "",
          partnerType: itm?.subGLTypeId ? {
            value: itm?.subGLTypeId,
            label: itm?.subGLTypeName,
            reffPrtTypeId: itm?.subGLTypeId
          } : "",
        }));

        const data = {
          objHeader: {
            cashGLPlus: item?.objHeader?.generalLedgerId ? {
              value: item?.objHeader?.generalLedgerId,
              label: item?.objHeader?.generalLedgerName,
              generalLedgerCode: item?.objHeader?.generalLedgerCode,
            } : "",
            partnerType: item?.objHeader?.businessPartnerTypeId ?  {
              value: item?.objHeader?.businessPartnerTypeId,
              label: item?.objHeader?.businessPartnerTypeName,
            } : "",
            partner: item?.objHeader?.businessPartnerId ? {
              value: item?.objHeader?.businessPartnerId,
              label: item?.objHeader?.businessPartnerName,
              businessPartnerCode: item?.objHeader?.businessPartnerCode,
            } : "",
            headerNarration: item?.objHeader?.narration,
            receiveFrom: item?.objHeader?.receiveFrom,
            narration: item?.objHeader?.narration,
            sbu: "",
            profitCenter: "",
            transaction: item?.objHeader?.businessPartnerId ? {value : item?.objHeader?.businessPartnerId, label: item?.objHeader?.businessPartnerName, code : item?.objHeader?.businessPartnerCode} : "",
            amount: "",
            paidTo: "",
            costCenter: "",
            trasferTo: "",
            gLBankAc: "",
            cashJournalId: item?.objHeader?.cashJournalId,
            transactionDate: _dateFormatter(item?.objHeader?.journalDate),
            revenueCenter:{label:item?.objHeader?.costRevenueName,value:item?.objHeader?.costRevenueId},
            revenueElement:{label:item?.objHeader?.elementName,value:item?.objHeader?.elementId}
          },
          objRow: ObjMap,
          headerRowId: item?.objRow?.[0]?.rowId
        };
        setter(data);
      }

      // Cash Payments Journal
      if (accCashJournalId === 2) {
        const item = res?.data?.[0];
        
        const ObjMap = item?.objRow?.map((itm) => ({
          rowId: itm?.rowId,
          transaction: itm?.subGLId ? {
            value: itm?.subGLId,
            label: itm?.subGLName,
            code: itm?.subGlCode,
          } : "",
          gl: itm?.generalLedgerId ? {
            value: itm?.generalLedgerId,
            label: itm?.generalLedgerName,
            code: itm?.generalLedgerCode,
          } : "",
          amount: itm?.amount,
          narration: itm?.narration,
          headerNarration: itm?.narration,
          bankAccountId: itm?.bankAccountId,
          bankAccNo: itm?.bankAccNo,
          partner: itm?.businessPartnerId ? {
            value: itm?.businessPartnerId,
            label: itm?.businessPartnerName,
            code: itm?.businessPartnerCode,
          } : "",
          partnerType: itm?.subGLTypeId ? {
            value: itm?.subGLTypeId,
            label: itm?.subGLTypeName,
            reffPrtTypeId: itm?.subGLTypeId
          } : "",
        }));

        const data = {
          objHeader: {
            cashGLPlus: item?.objHeader?.generalLedgerId ? {
              value: item?.objHeader?.generalLedgerId,
              label: item?.objHeader?.generalLedgerName,
              generalLedgerCode: item?.objHeader?.generalLedgerCode,
            } : "",
            partnerType: item?.objHeader?.businessPartnerTypeId ? {
              value: item?.objHeader?.businessPartnerTypeId,
              label: item?.objHeader?.businessPartnerTypeName,
            } : "",
            partner: item?.objHeader?.businessPartnerId ? {
              value: item?.objHeader?.businessPartnerId,
              label: item?.objHeader?.businessPartnerName,
              businessPartnerCode: item?.objHeader?.businessPartnerCode,
            } : "",
            headerNarration: item?.objHeader?.narration,
            narration: item?.objHeader?.narration,
            receiveFrom: item?.objHeader?.receiveFrom,
            sbu: "",
            profitCenter: "",
            transaction: item?.objHeader?.businessPartnerId ? {value : item?.objHeader?.businessPartnerId, label: item?.objHeader?.businessPartnerName, code : item?.objHeader?.businessPartnerCode} : "",
 
            amount: "",
            paidTo: item?.objHeader?.paidTo,
            trasferTo: "",
            gLBankAc: "",
            cashJournalId: item?.objHeader?.cashJournalId,
            transactionDate: _dateFormatter(item?.objHeader?.journalDate),
            costCenter:{label:item?.objHeader?.costRevenueName,value:item?.objHeader?.costRevenueId},
            costElement:{label:item?.objHeader?.elementName,value:item?.objHeader?.elementId}
          },
          objRow: ObjMap,
          headerRowId: item?.objRow?.[0]?.rowId
        };
        setter(data);
      }

      // Cash Transfer Journal
      if (accCashJournalId === 3) {
        const item = res?.data?.[0];
        
        const ObjMap = item?.objRow?.map((itm) => ({
          rowId: itm?.rowId,
          businessTransactionId: itm?.subGLId,
          businessTransactionCode: itm?.subGlCode,
          businessTransactionName: itm?.subGLName,
          generalLedgerId: itm?.generalLedgerId,
          generalLedgerCode: itm?.generalLedgerCode,
          generalLedgerName: itm?.generalLedgerName,
          amount: itm?.amount,
          narration: itm?.narration,
          headerNarration: itm?.narration,
          bankAccountId: itm?.bankAccountId,
          bankAccNo: itm?.bankAccNo,
        }));

        const data = {
          objHeader: {
            transactionDate: _dateFormatter(item?.objHeader?.journalDate),
            cashGLPlus: item?.objHeader?.generalLedgerId ? {
              value: item?.objHeader?.generalLedgerId,
              label: item?.objHeader?.generalLedgerName,
              generalLedgerCode: item?.objHeader?.generalLedgerCode,
            } : "",
            partnerType: item?.objHeader?.businessPartnerTypeId ? {
              value: item?.objHeader?.businessPartnerTypeId,
              label: item?.objHeader?.businessPartnerTypeName,
            } : "",
            partner: item?.objHeader?.businessPartnerId ? {
              value: item?.objHeader?.businessPartnerId,
              label: item?.objHeader?.businessPartnerName,
              businessPartnerCode: item?.objHeader?.businessPartnerCode,
            } : "",
            headerNarration: item?.objHeader?.narration,
            narration: item?.objHeader?.narration,
            receiveFrom: item?.objHeader?.receiveFrom,
            sbu: "",
            profitCenter: "",
            transaction: "",
            amount: item?.objRow?.[0]?.amount,
            paidTo: item?.objHeader?.paidTo,
            trasferTo:
              item?.objHeader?.transferTo === "Bank"
                ? { value: 3, label: "Bank" }
                : { value: 2, label: "Cash" },
            // gLBankAc: {
            //   value:
            //     item.objRow[1].bankAccountId || item.objRow[1].generalLedgerId,
            //   label:
            //     item.objRow[1].bankAccNo || item.objRow[1].generalLedgerName,
            //   businessPartnerCode: item.objRow[1].generalLedgerCode,
            // },
            gLBankAc: item?.objHeader?.transferTo === "Cash" ? {
              value: item?.objRow?.[0]?.generalLedgerId,
              label: item?.objRow?.[0]?.generalLedgerName,
              generalLedgerCode: item?.objRow?.[0]?.generalLedgerCode,


            }:  {
              value: item?.objRow?.[0]?.bankAccountId,
              label: item?.objRow?.[0]?.bankAccNo,
              generalLedgerId: item?.objRow?.[0]?.generalLedgerId,
              generalLedgerCode: item?.objRow?.[0]?.generalLedgerCode,
              generalLedgerName: item?.objRow?.[0]?.generalLedgerName,

            },
            cashJournalId: item?.objHeader?.cashJournalId,
            costCenter:{label:item?.objHeader?.costRevenueName,value:item?.objHeader?.costRevenueId},
            costElement:{label:item?.objHeader?.elementName,value:item?.objHeader?.elementId}
          },
          objRow: ObjMap,
          headerRowId: item?.objRow?.[0]?.rowId
        };
        setter(data);
      }
    }
  } catch (error) {
    
  }
};

// getBusinessPartnerSalesDDL
export const getBusinessPartnerSalesDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerSales/GetBusinessPartnerSales?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};

// getBusinessPartnerSalesDDL
export const getBusinessPartnerPurchaseDDLAction = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerPurchaseDDL?AccountId=${accId}&BusniessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    
  }
};


export const getOthersPartner = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerPurchaseInfo/GetBusinessPartnerOthersDdl?accountId=${accId}&businessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
  }
};


export const getPartnerTypeDDLAction = async (setPartnerTypeDDL) => {
  try {
    const res = await Axios.get(
      "/fino/AccountingConfig/GetAccTransectionTypeDDL"
    );
    setPartnerTypeDDL(res?.data);
  } catch (error) {
    setPartnerTypeDDL([])
  }
};

// https://localhost:44339/costmgmt/BusinessTransaction/GetBusinessTransactionByPartnerDDL?AccountId=1&BusinessUnitId=8&partnerTypeId=3&partnerId=0
export const getBusinessTransactionByPartnerDDL = async (accountId, businessUnitId,partnerTypeId,partnerId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionByPartnerDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&partnerTypeId=${partnerTypeId}&partnerId=${partnerId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
  }
};


export const getCostElementDDL = async (unitId, accountId, costCenterId, setter) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};