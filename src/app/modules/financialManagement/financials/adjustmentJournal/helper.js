import axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getTransactionAction = async (accId, BuId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDL?AccountId=${accId}&BusinessUnitId=${BuId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

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
      costRevenueName: item?.costRevenueName || "",
      costRevenueId: item?.costRevenueId || 0,
      elementName: item?.elementName || "",
      elementId: item?.elementId || 0,
      controlType: item?.controlType || "",
    }));
    setRowDto(newData);
    const objHeader = res?.data?.objHeader;
    setSingleData({
      transactionDate: _dateFormatter(objHeader?.journalDate),
      headerNarration: objHeader?.narration || "",
      transaction: "",
      debitCredit: "",
      amount: "",
      partnerType: "",
      partner: "",
      adjustmentJournalCode: objHeader?.adjustmentJournalCode,
      costCenter:
        objHeader?.controlType === "cost"
          ? {
              label: objHeader?.costRevenueName,
              value: objHeader?.costRevenueId,
            }
          : "",
      costElement:
        objHeader?.controlType === "cost"
          ? { label: objHeader?.elementName, value: objHeader?.elementId }
          : "",
      revenueCenter:
        objHeader?.controlType === "revenue"
          ? {
              label: objHeader?.costRevenueName,
              value: objHeader?.costRevenueId,
            }
          : "",
      revenueElement:
        objHeader?.controlType === "revenue"
          ? { label: objHeader?.elementName, value: objHeader?.elementId }
          : "",
      costRevenue: objHeader?.controlType,
    });
  } catch (error) {
  }
};

export const getCostElementByCostCenterDDL = async (unitId, accountId, costCenterId, setter) => {
  try {
    const res = await axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) {
  }
};
