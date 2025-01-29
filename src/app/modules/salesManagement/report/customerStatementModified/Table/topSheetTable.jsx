import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const TopSheetTable = ({ rowData, excelRef }) => {
  const headers = [
    "SL",
    "Customer Name",
    "Customer Code",
    "Distribution Channel",
    "Region",
    "Area",
    "Territory",
    "Quantity",
    "Amount",
  ];
  return (
    <div>
      <ReactHTMLTableToExcel
        ref={excelRef}
        id="test-table-xls-button-att-reports"
        className="d-none"
        table={"table-to-xlsx"}
        filename="Customer Statement (Top Sheet)"
        sheet="Customer Statement (Top Sheet)"
        buttonText="Export Excel"
      />
      <ICustomTable id="table-to-xlsx" ths={headers}>
        <>
          {rowData?.map((e, i) => {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{e.strBusinessPartnerName}</td>
                <td>{e.strBusinessPartnerCode}</td>
                <td>{e.strDistributionChannelName}</td>
                <td>{e.strRegion}</td>
                <td>{e.strArea}</td>
                <td>{e.strTerritory}</td>
                <td className="text-right">
                  {_fixedPoint(e.numQuantity, true)}
                </td>
                <td className="text-right">{_fixedPoint(e.numAmount, true)}</td>
              </tr>
            );
          })}
          <tr style={{ textAlign: "right", fontWeight: "bold" }}>
            <td className="text-right" colSpan={7}>
              Total
            </td>
            <td>
              {_fixedPoint(
                rowData.reduce((acc, cur) => {
                  return acc + cur.numQuantity;
                }, 0),
                true
              )}
            </td>
            <td>
              {_fixedPoint(
                rowData.reduce((acc, cur) => {
                  return acc + cur.numAmount;
                }, 0),
                true
              )}
            </td>
          </tr>
        </>
      </ICustomTable>
    </div>
  );
};

export default TopSheetTable;
