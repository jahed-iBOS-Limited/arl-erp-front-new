import axios from "axios";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

export const getAdjustmentJournalById = async (
    id,
    setSingleData,
    setRowDto
  ) => {
    try {
      const res = await axios.get(
        `/fino/AdjustmentJournal/GetAdjustmentJournalById?adjustmentJournalId=${id}&accountingJournalTypeId=7`
      );
      const newData = res?.data?.objRow?.map((item) => ({
        rowId: item?.rowId,
        transaction: {
          value: item?.subGLId,
          label: item?.subGLName,
          code: item?.subGlCode,
        },
  
        partnerType: {
          value: item?.subGLTypeId,
          label: item?.subGLTypeName,
          reffPrtTypeId: item?.subGLTypeId,
        },
        gl: {
          value: item?.generalLedgerId,
          label: item?.generalLedgerName,
          code: item?.generalLedgerCode,
        },
        headerNarration: item?.narration,
        debitCredit: item?.debitCredit,
        amount: Math.abs(item?.amount || 0),
      }));
      setRowDto(newData);
      const objHeader = res?.data?.objHeader;
      setSingleData({
        transactionDate: _dateFormatter(objHeader?.journalDate),
        headerNarration: "",
        transaction: "",
        debitCredit: "",
        amount: "",
        partnerType: "",
        partner: "",
        adjustmentJournalCode:objHeader?.adjustmentJournalCode,
        costCenter: objHeader?.controlType === "cost" ? { label: objHeader?.costRevenueName, value: objHeader?.costRevenueId } : "",
        costElement: objHeader?.controlType === "cost" ?{ label: objHeader?.elementName, value: objHeader?.elementId }:"",
        revenueCenter: objHeader?.controlType === "revenue" ?{ label: objHeader?.costRevenueName, value: objHeader?.costRevenueId }:"",
        revenueElement: objHeader?.controlType === "revenue" ?{ label: objHeader?.elementName, value: objHeader?.elementId }:"",
        costRevenue: objHeader?.controlType
      });
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

  // getCostElementDDL 
export const getCostElementDDL = async (UnitId,AccountId,setter) => {
    try {
      const res = await axios.get(
        `/procurement/PurchaseOrder/CostElement?AccountId=${AccountId}&UnitId=${UnitId}`
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
  