import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
// import IApproval from "../../../../_helper/_helperIcons/_approval";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";

export default function CashJournalTable({
  rowData,
  allSelect,
  rowDataHandler,
  selectedAll,
  setIsShowModal,
  setViewData,
  setShow,
  setJournalId,
  setJournalTypeId,
}) {
  const headers = [
    "SL",
    "Journal Date",
    "Journal Code",
    "Receive From",
    "Amount",
    "Narration",
    "Action",
  ];
  return (
    <div className="table-responsive">
      <table
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
        }
      >
        <thead>
          <tr
            onClick={() => allSelect(!selectedAll())}
            className="cursor-pointer"
          >
            <th style={{ width: "40px" }}>
              <input
                type="checkbox"
                value={selectedAll()}
                checked={selectedAll()}
                onChange={() => {}}
              />
            </th>
            {headers.map((th, index) => {
              return <th key={index}> {th} </th>;
            })}
          </tr>
        </thead>
        {rowData?.map((item, index) => {
          return (
            <tr
              className="cursor-pointer"
              key={index}
              onClick={() => {
                rowDataHandler(index, "isSelected", !item.isSelected);
              }}
              style={item?.isSelected ? { backgroundColor: "#ECF0F3" } : {}}
            >
              <td className="text-center" style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  value={item?.isSelected}
                  checked={item?.isSelected}
                  onChange={() => {}}
                />
              </td>
              <td style={{ width: "40px" }} className="text-center">
                {index + 1}
              </td>
              <td style={{ width: "100px" }}>
                {_dateFormatter(item?.journalDate)}
              </td>
              <td>{item?.cashJournalCode}</td>
              <td>{item?.nameFor}</td>
              <td className="text-right">
                {_formatMoney(Math.abs(item?.numAmount))}
              </td>
              <td>{item?.narration}</td>
              <td className="text-center" style={{ width: "40px" }}>
                <div className="d-flex justify-content-around">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewData(item);
                      setIsShowModal(true);
                    }}
                  >
                    <IView classes={"transfer-icon-size"} />
                  </div>
                  {/* <div>
                <IApproval classes={"transfer-icon-size"} />
                </div> */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewData(item);
                      setShow(true);
                      setJournalId(item?.cashJournalId);
                      setJournalTypeId(item?.accountingJournalTypeId);
                    }}
                  >
                    <IEdit classes={"transfer-icon-size"} />
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
