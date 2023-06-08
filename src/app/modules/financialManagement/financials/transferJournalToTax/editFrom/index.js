import React from "react";
import AdjustmentJournalCreateForm from "./adjustmentJournal/EditForm/addEditForm";
import BankJournalEditForm from "./bankJournal/EditForm/addEditForm";
import CashJournaEditForm from "./cashJournal/EditForm/addEditForm";

const EditForm = ({ journalTypeId, journalId, sbu, viewData, setShow }) => {
  return (
    <div>
      {[1, 2, 3].includes(journalTypeId) && (
        <CashJournaEditForm journalTypeId={journalTypeId} journalId ={journalId} viewData={viewData} sbu={sbu}/>
      )}
      {[4, 5, 6].includes(journalTypeId) && (<BankJournalEditForm journalTypeId={journalTypeId} journalId ={journalId} sbu={sbu} viewData={viewData} setShow={setShow}/>)}
      {[7].includes(journalTypeId) && (<AdjustmentJournalCreateForm journalId ={journalId} viewData={viewData} sbu={sbu} setShow={setShow}/>)}
    </div>
  );
};

export default EditForm;
