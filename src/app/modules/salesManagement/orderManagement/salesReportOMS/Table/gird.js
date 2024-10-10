import React from "react";
import { _formatMoney } from "./../../../../_helper/_formatMoney";

function TableGird({ rowDto, values, selectedBusinessUnit }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            {/* IFFE For Table Header Render */}
            {((selectedBusinessUnit) => {
              return selectedBusinessUnit?.value === 4
                ? tableHeaderForAkijCement?.map((item, index) => (
                    <td key={index}>{item}</td>
                  ))
                : tableHeaderForAllUnitExceptAkij?.map((item, index) => (
                    <td key={index}>{item}</td>
                  ));
            })(selectedBusinessUnit)}
          </tr>
          {/* <th>SL</th>
            <th>Item Name</th>
            <th>UOM Name</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total Amount</th> */}
        </thead>
        <tbody>
          {selectedBusinessUnit?.value === 4
            ? tableForAkijCement(rowDto)
            : tableForAllUnitExceptAkij(rowDto)}
        </tbody>
      </table>
    </div>
  );
}

// table for all unit except akij cement
function tableForAllUnitExceptAkij(rowDto) {
  let totalQty = 0;
  let totalRate = 0;
  let grandTotalAmount = 0;
  return (
    <>
      {rowDto?.map((item, i) => {
        totalQty += +item?.qty;
        totalRate += +item?.rate;
        grandTotalAmount += +item?.totalAmount;
        return (
          <tr key={i + 1}>
            <td>{i + 1}</td>
            <td>{item?.strTaxItemGroupName}</td>
            <td>{item?.strUOMName}</td>
            <td className="text-right">{_formatMoney(item?.qty, 0)}</td>
            <td className="text-right">{_formatMoney(item?.rate, 0)}</td>
            <td className="text-right">{_formatMoney(item?.totalAmount, 0)}</td>
          </tr>
        );
      })}
      <tr>
        <td className="text-right" colspan="3">
          <b> Total</b>
        </td>

        <td className="text-right">
          <b>{_formatMoney(totalQty, 0)}</b>
        </td>
        <td className="text-right">
          <b>{_formatMoney(totalRate, 0)}</b>
        </td>
        <td className="text-right">
          <b>{_formatMoney(grandTotalAmount, 0)}</b>
        </td>
      </tr>
    </>
  );
}

// table unit except akij cement
function tableForAkijCement(rowDto) {
  let totalQtyInBag = 0;
  let totalQtyInTon = 0;
  let totalRate = 0;
  let grandTotalAmount = 0;
  return (
    <>
      {rowDto?.map((item, i) => {
        totalQtyInBag += +item?.quantityInBag;
        totalQtyInTon += +item?.quantityInTon;
        totalRate += +item?.rate;
        grandTotalAmount += +item?.totalAmount;

        return (
          <tr key={i + 1}>
            <td>{i + 1}</td>
            <td>{item?.taxItemGroupName}</td>
            <td>{item?.uomName}</td>
            <td className="text-right">
              {_formatMoney(item?.quantityInBag, 4)}
            </td>
            <td className="text-right">
              {_formatMoney(item?.quantityInTon, 4)}
            </td>
            <td className="text-right">{_formatMoney(item?.rate, 4)}</td>
            <td className="text-right">{_formatMoney(item?.totalAmount, 4)}</td>
          </tr>
        );
      })}
      <tr>
        <td className="text-right" colspan="3">
          <b> Total</b>
        </td>

        <td className="text-right">
          <b>{_formatMoney(totalQtyInBag, 4)}</b>
        </td>
        <td className="text-right">
          <b>{_formatMoney(totalQtyInTon, 4)}</b>
        </td>
        <td className="text-right">
          <b>{_formatMoney(totalRate, 4)}</b>
        </td>
        <td className="text-right">
          <b>{_formatMoney(grandTotalAmount, 4)}</b>
        </td>
      </tr>
    </>
  );
}

// header for all unit
const tableHeaderForAllUnitExceptAkij = [
  "SL",
  "Item Name",
  "UOM Name",
  "Qty",
  "Rate",
  "Total Amount",
];

// header for akij cement
const tableHeaderForAkijCement = [
  "SL",
  "Item Name",
  "UOM Name",
  "Qty (Bag)",
  "Qty (Ton)",
  "Rate",
  "Total Amount",
];

export default TableGird;
