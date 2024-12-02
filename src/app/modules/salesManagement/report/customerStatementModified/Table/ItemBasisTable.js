import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ItemBasisTable = ({ rowData, excelRef }) => {
  const headers = [
    "SL",
    "Item Name",
    "Quantity (Bags)",
    "Quantity (Tons)",
    "Rate per Bag",
    "Total Amount",
  ];

  return (
    <div>
      <ReactHTMLTableToExcel
        ref={excelRef}
        id="test-table-xls-button-att-reports"
        className="d-none"
        table={"table-to-xlsx"}
        filename="Item Basis Report"
        sheet="Item Basis Report"
        buttonText="Export Excel"
      />
      <ICustomTable id="table-to-xlsx" ths={headers}>
        <>
          {rowData?.map((e, i) => {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{e.strItemName}</td>
                <td className="text-right">
                  {_fixedPoint(e.QuantityInBag, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(e.QuantityInTon, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(e.RatePerBag, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(e.TotalAmount, true)}
                </td>
              </tr>
            );
          })}
          <tr style={{ textAlign: "right", fontWeight: "bold" }}>
            <td className="text-right" colSpan={2}>
              Total
            </td>
            <td>
              {_fixedPoint(
                rowData.reduce((acc, cur) => acc + cur.QuantityInBag, 0),
                true
              )}
            </td>
            <td>
              {_fixedPoint(
                rowData.reduce((acc, cur) => acc + cur.QuantityInTon, 0),
                true
              )}
            </td>
            <td className="text-right" colSpan={2}>
              {_fixedPoint(
                rowData.reduce((acc, cur) => acc + cur.TotalAmount, 0),
                true
              )}
            </td>
          </tr>
        </>
      </ICustomTable>
    </div>
  );
};

export default ItemBasisTable;
