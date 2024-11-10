import React from "react";
import AdjustmentJournalTable from "./adjustmentJournal";
import BankJournalTable from "./bankJournal";
import CashJournalTable from "./cashJournal";

export default function Table({ values, rowData }) {
  return (
    <>
      {[1, 2, 3].includes(values?.journalType?.value) && (
        <CashJournalTable rowData={rowData} values={values}></CashJournalTable>
      )}
      {[4, 5, 6].includes(values?.journalType?.value) && (
        <BankJournalTable rowData={rowData} values={values}></BankJournalTable>
      )}
      {values?.journalType?.value === 7 && (
        <AdjustmentJournalTable rowData={rowData}></AdjustmentJournalTable>
      )}
    </>
  );
}
