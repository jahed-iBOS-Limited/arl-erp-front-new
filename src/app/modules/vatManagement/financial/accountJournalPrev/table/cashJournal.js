import React, { useState } from "react";
import { InvTransViewTableRow } from "../../../../financialManagement/financials/cashJournal/report/tableRow";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";

export default function CashJournalTable({ rowData, values }) {
  const headers = [
    "SL",
    "Journal Date",
    "Journal Code",
    "Receive From",
    "Amount",
    "Narration",
    "Action",
  ];

  const [open, setOpen] = useState(false);
  const [row, setRow] = useState({});
  return (
    <div>
      <table
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
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
              <td style={{ width: "100px" }}>
                {_dateFormatter(item?.journalDate)}
              </td>
              <td>{item?.accJournalCode}</td>
              <td>{item?.nameFor}</td>
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
        <InvTransViewTableRow
          id={row?.accJournalId}
          headerData={{ accountingJournalTypeId: values?.journalType?.value }}
        />
      </IViewModal>
    </div>
  );
}
