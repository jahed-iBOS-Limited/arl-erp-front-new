import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";

export default function BankJournalTable({
  rowData,
  allSelect,
  rowDataHandler,
  selectedAll,
  setIsShowModal,
  setViewData,
  setShow,
  setJournalId,
  setJournalTypeId

}) {
  const headers = [
    "SL",
    "Journal Date",
    "Journal Code",
    "Complete Date",
    "Instrument Date",
    "Instrument No",
    "Receive From",
    "Amount",
    "Bank Name",
    "Action"
  ];
  return (
    <div >
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
            <th>
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
              style={item?.isSelected ? {backgroundColor: "#ECF0F3"} : {}}
            >
              <td className="text-center" style={{ width: "40px" }}>
                <input
                  type="checkbox"
                  value={item?.isSelected}
                  checked={item?.isSelected}
                  onChange={() => {}}
                />
              </td>
              <td className="text-center">{index + 1}</td>
              <td>{_dateFormatter(item?.journalDate)}</td>
              <td>{item?.bankJournalCode}</td>
              <td>{_dateFormatter(item?.dteCompleteDateTime)}</td>
              <td>{_dateFormatter(item?.instrumentcheckdate)}</td>
              <td>{item?.checkNo}</td>
              <td>{item?.nameFor}</td>
              <td className="text-right">
                {_formatMoney(Math.abs(item?.numAmount), 0)}
              </td>
              <td>{item?.bankName}</td>
              <td className="text-center" style={{ width: "40px" }}>
                <div className="d-flex justify-content-around">
                <div onClick={(e)=>{
                e.stopPropagation()
                setViewData(item)
                setIsShowModal(true)
                }}>
                  <IView classes={"transfer-icon-size"} />
                </div>
                {/* <div>
                <IApproval classes={"transfer-icon-size"} />
                </div> */}
                <div onClick={(e)=>{
                e.stopPropagation()
                setViewData(item);
                setShow(true)
                setJournalId(item?.bankJournalId)
                setJournalTypeId(item?.accountingJournalTypeId)
                }}> 
                  <IEdit classes={"transfer-icon-size"}/>
                </div>
                </div>
                </td>
            </tr>
          );
        })}
      </table>
    </div>
    </div>
  );
}
