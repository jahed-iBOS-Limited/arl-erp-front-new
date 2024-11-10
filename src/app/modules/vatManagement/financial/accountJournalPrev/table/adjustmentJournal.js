import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import { AdjustmentJournalViewTableRow } from "../../../../financialManagement/financials/adjustmentJournal/report/tableRow";

export default function AdjustmentJournalTable({ rowData }) {
  const headers = [
    "SL",
    "Transaction Date",
    "Journal Code",
    "Amount",
    "Header Narration",
    "Action",
  ];

  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({});

  return (
    <div>
      <table
        className={
          "table table-striped table-bordered mt-0 bj-table bj-table-landing table-font-size-sm"
        }
      >
        <thead>
          <tr>
            {headers.map((th, index) => {
              return <th key={index}> {th} </th>;
            })}
          </tr>
        </thead>
        {rowData?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ width: "40px" }} className="text-center">
                {index + 1}
              </td>
              <td>{_dateFormatter(item?.journalDate)}</td>
              <td style={{ width: "140px" }}>{item?.accJournalCode}</td>
              <td className="text-right">
                {_formatMoney(Math.abs(item?.amount), 0)}
              </td>
              <td>{item?.narration}</td>
              <td className="text-center">
                <IView
                  clickHandler={() => {
                    setRow(item);
                    setOpen(true);
                  }}
                />
              </td>
            </tr>
          );
        })}
      </table>
      <IViewModal show={open} onHide={() => setOpen(false)}>
        <AdjustmentJournalViewTableRow id={row?.accJournalId} />
      </IViewModal>
    </div>
  );
}
