import React from "react";
import AdjustmentJournalTable from "./adjustmentJournal";
import BankJournalTable from "./bankJournal";
import CashJournalTable from "./cashJournal";

export default function Table({ values, rowData, setRowData, updatePopUp, reversePopUp }) {

  /* All Check Handler */
  const setAllSelectHandler = (isAllSelect) => {
    const data = rowData?.map((item) => ({
      ...item,
      isSelect: isAllSelect,
    }));
    setRowData({data: data});
  };

  /* Single Check Handler */
  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = [...rowData];
    newRowDto[index].isSelect = value;
    setRowData({data: newRowDto});
  };

  return (
    <>
      {[1, 2, 3].includes(values?.journalType?.value) && (
        <CashJournalTable 
          rowData={rowData} 
          values={values} 
          updatePopUp={updatePopUp}
          singleCheckBoxHandler={singleCheckBoxHandler}
          setAllSelectHandler={setAllSelectHandler}
          reversePopUp={reversePopUp}>
          </CashJournalTable>
      )}
      {[4, 5, 6].includes(values?.journalType?.value) && (
        <BankJournalTable 
          rowData={rowData} 
          values={values} 
          updatePopUp={updatePopUp}
          singleCheckBoxHandler={singleCheckBoxHandler}
          setAllSelectHandler={setAllSelectHandler}
          reversePopUp={reversePopUp}>
        </BankJournalTable>
      )}
      {values?.journalType?.value === 7 && (
        <AdjustmentJournalTable 
          rowData={rowData} 
          values={values} 
          updatePopUp={updatePopUp}
          singleCheckBoxHandler={singleCheckBoxHandler}
          setAllSelectHandler={setAllSelectHandler}
          reversePopUp={reversePopUp}>
        </AdjustmentJournalTable>
      )}
    </>
  );
}
