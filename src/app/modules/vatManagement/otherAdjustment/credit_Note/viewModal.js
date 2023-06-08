import React, { useRef } from "react";
import IViewModal from "../../../_helper/_viewModal";
import ICustomTable from "./../../../_helper/_customTable";

const tableHeader = [
  "SL",
  "Item Name",
  "UOM Name",
  "Purchase Amount",
  "Increse Qty",
  "Increse  SD",
  "Increse  VAT",
];

export default function CreditNoteModal({ id, show, onHide, rowDto }) {
  const printRef = useRef();

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"View Credit Note"}
        btnText="Close"
        componentRef={printRef}
      >
        <ICustomTable ths={tableHeader}>
          {rowDto?.objRowList?.map((tableData, index) => (
            <tr key={index}>
              <td> {index + 1} </td>
              <td> {tableData?.itemName} </td>
              <td> {tableData?.uomname} </td>
              <td className="text-right"> {tableData?.salesAmount} </td>
              <td className="text-right"> {tableData?.salesQuantity} </td>
              <td className="text-right"> {tableData?.salesSD} </td>
              <td className="text-right"> {tableData?.salesVat} </td>
            </tr>
          ))}
        </ICustomTable>
      </IViewModal>
    </div>
  );
}
