import React from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const G2GSalesDetailsTable = ({ rowData, excelRef }) => {
  const headers = [
    "SL",
    "Delivery Date",
    "Mother Vessel",
    "Lighter Vessel",
    "Challan No",
    "Sold to Partner",
    "Ship to Partner",
    "ShipPoint",
    "Item",
    "Quantity (ton)",
    "Price",
    "Amount",
    "JV Amount",
  ];

  return (
    <div>
      <ReactHTMLTableToExcel
        ref={excelRef}
        id="test-table-xls-button-att-reports"
        className="d-none"
        table={"table-to-xlsx"}
        filename="G2G Sales Details (Top Sheet)"
        sheet="G2G Sales Details (Top Sheet)"
        buttonText="Export Excel"
      />

      <h3>
        Total Amount:{" "}
        {_fixedPoint(
          rowData.reduce((total, cur) => {
            return total + cur?.salesValue;
          }, 0),
          true
        )}
      </h3>
      <ICustomTable id="table-to-xlsx" ths={headers}>
        <>
          {rowData?.map((e, i) => {
            return (
              <tr
                key={i}
                style={{
                  background:
                    e.itemPrice <= 0
                      ? "#fd2626a1"
                      : e.salesValue < e.JVAmount
                      ? "#ffe627a8"
                      : "",
                }}
              >
                <td>{i + 1}</td>
                <td>{_dateFormatter(e.deliveryDate)}</td>
                <td>{e.motherVesselName}</td>
                <td>{e.lighterVesselName}</td>
                <td>{e.deliveryCode}</td>
                <td>{e.soldToPartnerName}</td>
                <td>{e.shipToPartnerName}</td>
                <td>{e.shipPointName}</td>
                <td>{e.itemName}</td>
                <td className="text-right">
                  {_fixedPoint(e.quantityTon, true)}
                </td>
                <td className="text-right">{_fixedPoint(e.itemPrice, true)}</td>
                <td className="text-right">
                  {_fixedPoint(e.salesValue, true)}
                </td>
                <td className="text-right">{_fixedPoint(e.JVAmount, true)}</td>
              </tr>
            );
          })}
          <tr style={{ textAlign: "right", fontWeight: "bold" }}>
            <td className="text-right" colSpan={9}>
              Total
            </td>
            <td>
              {_fixedPoint(
                rowData.reduce((acc, cur) => {
                  return acc + cur.quantityTon;
                }, 0),
                true
              )}
            </td>
            <td></td>
            <td>
              {_fixedPoint(
                rowData.reduce((acc, cur) => {
                  return acc + cur.salesValue;
                }, 0),
                true
              )}
            </td>
            <td>
              {_fixedPoint(
                rowData.reduce((acc, cur) => {
                  return acc + cur.JVAmount;
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

export default G2GSalesDetailsTable;
