import axios from "axios";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

export const singleDataById = async (id, type, setter) => {
    try {
      const res = await axios.get(
        `/fino/BankJournal/GetBankJournalById?BankJournalId=${id}&AccountingJournalTypeId=${type}`
      );
      if (res.status === 200 && res?.data) {
        if (type === 4) {
          const item = res?.data?.[0];
          // const objRow = item.objRow.filter((itm) => itm.amount < 0);
          const ObjMap = item?.objRow?.map((itm) => ({
            ...itm,
            rowId: itm?.rowId,
            transaction: {
              value: itm?.subGLId,
              label: itm?.subGLName,
              code: itm?.subGlCode,
            },
            gl: {
              value: itm?.generalLedgerId,
              label: itm?.generalLedgerName,
              code: itm?.generalLedgerCode,
            },
            amount: Math.abs(itm?.amount),
            narration: itm?.narration,
            bankAccountId: itm?.bankAccountId,
            bankAccNo: itm?.bankAccNo,
            partner: {
              value: itm?.businessPartnerId,
              label: itm?.businessPartnerName,
              code: itm?.businessPartnerCode,
            },
            partnerType: {
              value: itm?.subGLTypeId,
              label: itm?.subGLTypeName,
              reffPrtTypeId: itm?.subGLTypeId
            },
          }));
  
          const data = {
            objHeader: {
              transactionDate: _dateFormatter(item?.objHeader?.voucherDate),
              bankJournalCode: item?.objHeader?.bankJournalCode,
              bankAcc: {
                value: item?.objHeader?.bankAccountId,
                label: `${item?.objHeader?.bankShortName}: ${item?.objHeader?.bankAccountNumber}`,
                bankAccNo: item?.objHeader?.bankAccountNumber,
                bankId: item?.objHeader?.bankId,
                bankName: item?.objHeader?.bankName,
                generalLedgerId: item?.objHeader?.generalLedgerId,
                generalLedgerName: item?.objHeader?.generalLedgerName,
                generalLedgerCode: item?.objHeader?.generalLedgerCode,
                bankBranch_Id: item?.objHeader?.bankBranchId,
                bankBranchName: item?.objHeader?.bankBranchName,
              },
              partner: item?.objHeader?.businessPartnerId
                ? {
                    value: item?.objHeader?.businessPartnerId || 0,
                    label: item?.objHeader?.businessPartnerName || "",
                    businessPartnerCode:
                      item?.objHeader?.businessPartnerCode || "",
                  }
                : "",
              isCheck: item?.objHeader?.businessPartnerId ? false : true,
              // partnerType: item?.objHeader?.businessPartnerTypeId
              //   ? {
              //       value: item?.objHeader?.businessPartnerTypeId,
              //       label: item?.objHeader?.businessPartnerTypeName,
              //     }
              //   : "",
              receiveFrom: item?.objHeader?.receiveFrom || "",
              instrumentType: {
                value: item?.objHeader?.instrumentId || 0,
                label: item?.objHeader?.instrumentName || "",
              },
              instrumentNo: item?.objHeader?.instrumentNo || "",
              instrumentDate:
                _dateFormatter(item?.objHeader?.instrumentDate) || "",
              headerNarration: item?.objHeader?.narration || "",
              placedInBank: item?.objHeader?.placedInBank,
              placingDate: _dateFormatter(item?.objHeader?.placingDate) || "",
              paidTo: item?.objHeader?.paidTo || "",
              transferTo: "",
              sendToGLBank: "",
              // transaction: {value : item?.objHeader?.businessPartnerId, label : item?.objHeader?.businessPartnerName, code : item?.objHeader?.businessPartnerCode},
              // amount is for bank receive and bank payment row
              amount: "",
              // transferAmount is for bank transfer header
              transferAmount: "",
              narration: "",
              bankJournalId: item?.objHeader?.bankJournalId,
              customerSupplierStatus: item?.objHeader?.businessPartnerTypeName,
              revenueCenter:{label:item?.objHeader?.costRevenueName,value:item?.objHeader?.costRevenueId},
              revenueElement:{label:item?.objHeader?.elementName,value:item?.objHeader?.elementId}
            },
            objRow: ObjMap,
            headerRowId: item?.objRow?.[0]?.rowId,
          };
          setter(data);
        }
        if (type === 5) {
          const item = res?.data?.[0];
          // const objRow = item.objRow.filter((itm) => itm.amount > 0);
          const ObjMap = item?.objRow?.map((itm) => ({
            ...itm,
            rowId: itm?.rowId,
            transaction: {
              value: itm?.subGLId,
              label: itm?.subGLName,
              code: itm?.subGlCode,
            },
            gl: {
              value: itm?.generalLedgerId,
              label: itm?.generalLedgerName,
              code: itm?.generalLedgerCode,
            },
            amount: itm?.amount,
            narration: itm?.narration,
            bankAccountId: itm?.bankAccountId,
            bankAccNo: itm?.bankAccNo,
            partner: {
              value: itm?.businessPartnerId,
              label: itm?.businessPartnerName,
              code: itm?.businessPartnerCode,
            },
            partnerType: {
              value: itm?.subGLTypeId,
              label: itm?.subGLTypeName,
              reffPrtTypeId: itm?.subGLTypeId
            },
          }));
  
          const data = {
            objHeader: {
              transactionDate: _dateFormatter(item?.objHeader?.voucherDate),
              bankJournalCode: item?.objHeader?.bankJournalCode,
              bankAcc: {
                value: item?.objHeader?.bankAccountId,
                label: `${item?.objHeader?.bankShortName}: ${item?.objHeader?.bankAccountNumber}`,
                bankAccNo: item?.objHeader?.bankAccountNumber,
                bankId: item?.objHeader?.bankId,
                bankName: item?.objHeader?.bankName,
                generalLedgerId: item?.objHeader?.generalLedgerId,
                generalLedgerName: item?.objHeader?.generalLedgerName,
                generalLedgerCode: item?.objHeader?.generalLedgerCode,
                bankBranch_Id: item?.objHeader?.bankBranchId,
                bankBranchName: item?.objHeader?.bankBranchName,
              },
              partner: item?.objHeader?.businessPartnerId
                ? {
                    value: item?.objHeader?.businessPartnerId || 0,
                    label: item?.objHeader?.businessPartnerName || "",
                    businessPartnerCode:
                      item?.objHeader?.businessPartnerCode || "",
                  }
                : "",
              isCheck: item?.objHeader?.businessPartnerId ? false : true,
              // partnerType: item?.objHeader?.businessPartnerTypeId
              //   ? {
              //       value: item?.objHeader?.businessPartnerTypeId,
              //       label: item?.objHeader?.businessPartnerTypeName,
              //     }
              //   : "",
              receiveFrom: item?.objHeader?.receiveFrom || "",
              instrumentType: {
                value: item?.objHeader?.instrumentId || 0,
                label: item?.objHeader?.instrumentName || "",
              },
              instrumentNo: item?.objHeader?.instrumentNo || "",
              instrumentDate:
                _dateFormatter(item?.objHeader?.instrumentDate) || "",
              headerNarration: item?.objHeader?.narration || "",
              placedInBank: item?.objHeader?.placedInBank,
              placingDate: _dateFormatter(item?.objHeader?.placingDate) || "",
              paidTo: item?.objHeader?.paidTo || "",
              transferTo: item?.objHeader?.transferTo || "",
              sendToGLBank: "",
              transaction: "",
              // amount is for bank receive and bank payment row
              amount: "",
              // transferAmount is for bank transfer header
              transferAmount: "",
              narration: "",
              bankJournalId: item?.objHeader?.bankJournalId,
              customerSupplierStatus: item?.objHeader?.businessPartnerTypeName,
              costCenter:{label:item?.objHeader?.costRevenueName,value:item?.objHeader?.costRevenueId},
              costElement:{label:item?.objHeader?.elementName,value:item?.objHeader?.elementId}
            },
            objRow: ObjMap,
            headerRowId: item?.objRow?.[0]?.rowId,
          };
          setter(data);
        }
        if (type === 6) {
          const item = res?.data?.[0];
          // const objRow = item.objRow.filter((itm) => itm.amount > 0);
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
            bankAccountId: itm?.bankAccountId,
            bankAccNo: itm?.bankAccNo,
            bankAcc: {value : itm?.bankAccountId, bankAccNo:  itm?.bankAccNo, bankName: itm?.bankShortName}
          }));
  
          const data = {
            objHeader: {
              transactionDate: _dateFormatter(item?.objHeader?.voucherDate),
              bankJournalCode: item?.objHeader?.bankJournalCode,
              bankAcc: {
                value: item?.objHeader?.bankAccountId,
                label: `${item?.objHeader?.bankShortName}: ${item?.objHeader?.bankAccountNumber}`,
                bankAccNo: item?.objHeader?.bankAccountNumber,
                bankId: item?.objHeader?.bankId,
                bankName: item?.objHeader?.bankName,
                generalLedgerId: item?.objHeader?.generalLedgerId,
                generalLedgerName: item?.objHeader?.generalLedgerName,
                generalLedgerCode: item?.objHeader?.generalLedgerCode,
                bankBranch_Id: item?.objHeader?.bankBranchId,
                bankBranchName: item?.objHeader?.bankBranchName,
              },
              partner: {
                value: item?.objHeader?.businessPartnerId || 0,
                label: item?.objHeader?.businessPartnerName || "",
                businessPartnerCode: item?.objHeader?.businessPartnerCode || "",
              },
              partnerType: {
                value: item?.objHeader?.businessPartnerTypeId,
                label: item?.objHeader?.businessPartnerTypeName,
              },
              receiveFrom: item?.objHeader?.receiveFrom || "",
              instrumentType: {
                value: item?.objHeader?.instrumentId || 0,
                label: item?.objHeader?.instrumentName || "",
              },
              instrumentNo: item?.objHeader?.instrumentNo || "",
              instrumentDate:
                _dateFormatter(item?.objHeader?.instrumentDate) || "",
              headerNarration: item?.objHeader?.narration || "",
              placedInBank: item?.objHeader?.placedInBank,
              placingDate: _dateFormatter(item?.objHeader?.placingDate) || "",
              paidTo: item?.objHeader?.paidTo || "",
              transferTo:
                item?.objHeader?.transferTo === "Bank"
                  ? { value: 2, label: "Bank" }
                  : { value: 1, label: "Cash" },
              sendToGLBank:
                item?.objHeader?.transferTo === "Cash"
                  ? {
                      value: item?.objRow?.[0]?.generalLedgerId,
                      label: item?.objRow?.[0]?.generalLedgerName,
                      generalLedgerCode: item?.objRow?.[0]?.generalLedgerCode,
                    }
                  : {
                      value: item?.objRow?.[0]?.bankAccountId,
                      // label: item?.objRow?.[0]?.bankAccNo,
                      label: `${item?.objRow?.[0]?.bankShortName}: ${item?.objRow?.[0]?.bankAccNo}`,
                      bankAccNo: item?.objRow?.[0]?.bankAccNo,
                      generalLedgerId: item?.objRow?.[0]?.generalLedgerId,
                      generalLedgerCode: item?.objRow?.[0]?.generalLedgerCode,
                      generalLedgerName: item?.objRow?.[0]?.generalLedgerName,
                    },
              transaction: "",
              // amount is for bank receive and bank payment row
              amount: "",
              // transferAmount is for bank transfer header
              transferAmount: item?.objRow?.[0]?.amount,
              narration: "",
              bankJournalId: item?.objHeader?.bankJournalId,
              costCenter:{label:item?.objHeader?.costRevenueName,value:item?.objHeader?.costRevenueId},
              costElement:{label:item?.objHeader?.elementName,value:item?.objHeader?.elementId},
            },
            objRow: ObjMap,
            headerRowId: item?.objRow?.[0]?.rowId,
          };
  
          setter(data);
        }
      }
    } catch (error) {}
  };


  export const getBankAc = async (accId, BuId, setter) => {
    try {
      const res = await axios.get(
        `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${BuId}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {}
  };

  // getRevenueCenterListDDL 
export const getRevenueCenterListDDL = async (businessUnitId,setter) => {
    try {
      const res = await axios.get(
        `/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${businessUnitId}`
      );
      setter(res?.data);
    } catch (error) {
    }
  };

  // getRevenueElementListDDL 
export const getRevenueElementListDDL = async (businessUnitId,setter) => {
    try {
      const res = await axios.get(
        `/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${businessUnitId}`
      );
      setter(res?.data);
    } catch (error) {
    }
  };

  // getCostCenterDDL 
export const getCostCenterDDL = async (UnitId,AccountId,setter) => {
    try {
      const res = await axios.get(
        `/procurement/PurchaseOrder/CostCenter?AccountId=${AccountId}&UnitId=${UnitId}`
      );
      setter(res?.data);
    } catch (error) {
    }
  };

  export const getCostElementDDL = async (UnitId,AccountId,setter) => {
    try {
      const res = await axios.get(
        `/procurement/PurchaseOrder/CostElement?AccountId=${AccountId}&UnitId=${UnitId}`
      );
      setter(res?.data);
    } catch (error) {
    }
  };

  export const getPartnerTypeDDL = async (setter) => {
    try {
      const res = await axios.get(
        "/fino/AccountingConfig/GetAccTransectionTypeDDL"
      );
      setter(res?.data);
    } catch (error) {
    }
  };

  export const getSendToGLBank = async (accId, BuId, journalType, setter) => {
    try {
      const res = await axios.get(
        `/costmgmt/BankAccount/GetBusinessUnitGeneralLedgerDDLTypeById?AccountId=${accId}&BusinssUnitId=${BuId}&AccountingGroupId=${journalType}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {}
  };

  export const getInstrumentType = async (setter) => {
    try {
      const res = await axios.get(`/costmgmt/Instrument/GetInstrumentTypeDDL`);
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {}
  };