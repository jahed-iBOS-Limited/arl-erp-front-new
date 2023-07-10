import Axios from "axios";
import { _todayDate } from "../../../../_helper/_todayDate";

export const getTaxAccountingJournalByCode = async (accountingJournalCode, setter) => {
  try {
    const res = await Axios.get(`/fino/CommonFino/GetTaxAccountingJournal?accountingJournalCode=${accountingJournalCode}`);
    if (res.status === 200 && res?.data) {
      const findItem = res?.data?.find((item) => item?.subGLTypeId === 6);
      const modifyRowDto = res?.data?.map((item) => {
        return {
          ...item,
          amount: Math?.abs(item?.numAmount),
          partnerType: item?.subGLTypeId
            ? {
                value: item?.subGLTypeId,
                label: item?.subGLTypeName,
              }
            : "",
          gl: item?.generalLedgerId ? { value: item?.generalLedgerId, label: item?.generalLedgerName, code: item?.generalLedgerCode } : "",
          paytoName:item?.paytoName,
          journalId:findItem?.journalId,
          headerSubGlName: findItem?.subGLName,
          headerSubGlId: findItem?.subGLId,
          headerSubGlCode: findItem?.subGlCode,
          headerGLName: findItem?.generalLedgerName,
          headerGLId: findItem?.generalLedgerId,
          headerGLCode: findItem?.generalLedgerCode,
        };
      });
      setter(modifyRowDto);
    }
  } catch (error) {
    console.log(error);
  }
};
export const getAdjustmentJournalByCode = async (accountingJournalCode, setter) => {
  try {
    const res = await Axios.get(`/fino/CommonFino/GetTaxAccountingJournal?accountingJournalCode=${accountingJournalCode}`);
    if (res.status === 200 && res?.data) {
      const modifyRowDto = res?.data?.map((item) => {
        return {
          ...item,
          partnerType: item?.subGLTypeId
            ? {
                value: item?.subGLTypeId,
                label: item?.subGLTypeName,
              }
            : "",
          gl: item?.generalLedgerId ? { value: item?.generalLedgerId, label: item?.generalLedgerName, code: item?.generalLedgerCode } : "",
          journalId:item?.journalId,
          debitCredit: item?.credit < 0 ? "Credit" : item?.debit > 0 ? "Debit" :"",
          amount: Math.abs(item?.credit < 0 ? item?.credit : item?.debit > 0 ? item?.debit :0),
          transaction:item?.subGLId?{
            value: item?.subGLId,
            label: item?.subGLName,
            code: item?.subGlCode,
          }:""
        };
      });
      setter(modifyRowDto);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getCashJournalByCode = async (accountingJournalCode, setter) => {
  try {
    const res = await Axios.get(`/fino/CommonFino/GetTaxAccountingJournal?accountingJournalCode=${accountingJournalCode}`);
    if (res.status === 200 && res?.data) {
      const item = res.data;
      const modifyRowDto = item?.map((itm, indx) => {
        return {
          ...itm,
          transactionDate: _todayDate(),
          transaction: itm?.subGLId
            ? {
                value: itm?.subGLId,
                label: itm?.subGLName,
                code: itm?.subGlCode,
              }
            : "",
            cashGLPlus: itm?.generalLedgerId ? {
              value: itm?.generalLedgerId,
              label: itm?.generalLedgerName,
              code: itm?.generalLedgerCode,
            } : "",
          gl: itm?.generalLedgerId
            ? {
                value: itm?.generalLedgerId,
                label: itm?.generalLedgerName,
                code: itm?.generalLedgerCode,
              }
            : "",
          credit: itm?.credit,
          debit: itm?.debit,
          amount: Math.abs(itm?.numAmount),
          narration: itm?.narration,
          headerNarration: itm?.narration,
          partner: itm?.businessPartnerId
            ? {
                value: itm?.businessPartnerId,
                label: itm?.businessPartnerName,
                code: itm?.businessPartnerCode,
              }
            : "",
          partnerType: itm?.subGLTypeId
            ? {
                value: itm?.subGLTypeId,
                label: itm?.subGLTypeName,
                reffPrtTypeId: itm?.subGLTypeId,
              }
            : "",
            headerGLName: item?.[0]?.generalLedgerName,
            headerGLId: item?.[0]?.generalLedgerId,
            headerGLCode: item?.[0]?.generalLedgerCode,
            headerGLTransaction: item?.[0]?.generalLedgerCode,
        };
      });
      
      setter(modifyRowDto);
    }
  } catch (error) {
    console.log(error);
  }
};
