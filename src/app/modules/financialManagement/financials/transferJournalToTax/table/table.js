import React, { useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import EditForm from "../editFrom";
import AdjustmentJournalTable from "./adjustmentJournal";
import BankJournalTable from "./bankJournal";
import CashJournalTable from "./cashJournal";
import { BankJournalViewTableRow } from "./viewModal";

export default function Table({
  values,
  rowData,
  allSelect,
  rowDataHandler,
  selectedAll,
}) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [viewData, setViewData] = useState("");
  const [journalId, setJournalId] = useState("");
  const [journalTypeId, setJournalTypeId] = useState("");
  return (
    <>
      {[1, 2, 3].includes(values?.journalType?.value) && (
        <CashJournalTable
          rowData={rowData}
          rowDataHandler={rowDataHandler}
          allSelect={allSelect}
          selectedAll={selectedAll}
          setIsShowModal={setIsShowModal}
          setViewData={setViewData}
          setShow={setShow}
          setJournalId={setJournalId}
          setJournalTypeId={setJournalTypeId}
        ></CashJournalTable>
      )}
      {[4, 5, 6].includes(values?.journalType?.value) && (
        <BankJournalTable
          rowData={rowData}
          rowDataHandler={rowDataHandler}
          allSelect={allSelect}
          selectedAll={selectedAll}
          setIsShowModal={setIsShowModal}
          setViewData={setViewData}
          setShow={setShow}
          setJournalId={setJournalId}
          setJournalTypeId={setJournalTypeId}
        ></BankJournalTable>
      )}
      {values?.journalType?.value === 7 && (
        <AdjustmentJournalTable
          rowData={rowData}
          rowDataHandler={rowDataHandler}
          allSelect={allSelect}
          selectedAll={selectedAll}
          setIsShowModal={setIsShowModal}
          setViewData={setViewData}
          setShow={setShow}
          setJournalId={setJournalId}
          setJournalTypeId={setJournalTypeId}
        ></AdjustmentJournalTable>
      )}
      {viewData && (
        <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
          <BankJournalViewTableRow
            viewData={viewData}
            journalType={values?.journalType?.value}
          />
        </IViewModal>
      )}

      <IViewModal show={show} onHide={() => setShow(false)}>
        <EditForm
          journalTypeId={journalTypeId}
          journalId={journalId}
          sbu={values?.sbu}
          viewData={viewData}
          setShow={setShow}
        />
      </IViewModal>
    </>
  );
}
