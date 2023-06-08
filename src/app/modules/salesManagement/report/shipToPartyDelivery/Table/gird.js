import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

const ths = [
  "Sl",
  "Ship To Party",
  "Ship To Party Id",
  "Sold To Party",
  "Region",
  "Area",
  "Territory",
  "Ship Point",
  "UoM",
  "Quantity",
  "Rate",
  "Amount"
];

function TableGird({ rowDto, values }) {
  let GrandQuantity = 0;
  let GrandAmount = 0;

  return (
    <ICustomTable
      ths={values?.reportType?.value === 1 ? ths : [...ths, "Delivery Date", "Product Name"]}
    >
      <>
        {rowDto.map((itmOne) => {
          GrandQuantity += itmOne?.objList?.reduce(
            (acc, cur) => (acc += cur?.deliveryQty),
            0
          );
          GrandAmount += itmOne?.objList?.reduce(
            (acc, cur) => (acc += cur?.deliveryValue),
            0
          );
          return (
            <>
              {itmOne?.objList?.map((itm, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{itm?.shipToPartnerName}</td>
                    <td>{itm?.shipToPartnerId}</td>
                    <td>{itmOne?.customerName}</td>
                    <td>{itm.region}</td>
                    <td>{itm.area}</td>
                    <td>{itm.territory}</td>
                    <td>{itm.shipPointName}</td>
                    <td> {itm.uomName}</td>
                    <td> {itm.deliveryQty}</td>
                    <td> {itm.itemRate}</td>
                    <td> {itm.deliveryValue}</td>
                    {
                      values?.reportType?.value === 2 &&
                      <>
                        <td>{_dateFormatter(itm?.deliveryDate)}</td>
                        <td>{itm?.itemName}</td>
                      </>

                    }
                  </tr>
                );
              })}
              <tr>
                <td
                  colSpan="9"
                  className="text-right"
                >
                  <b> Total </b>
                </td>
                <td className="text-center">
                  <b>
                    {Number.isInteger(
                      _fixedPoint(
                        itmOne?.objList?.reduce(
                          (acc, cur) => (acc += cur?.deliveryQty),
                          0
                        )
                      )
                    )
                      ? numberWithCommas(
                        _fixedPoint(
                          itmOne?.objList?.reduce(
                            (acc, cur) => (acc += cur?.deliveryQty),
                            0
                          )
                        )
                      )
                      : _formatMoney(
                        _fixedPoint(
                          itmOne?.objList?.reduce(
                            (acc, cur) => (acc += cur?.deliveryQty),
                            0
                          )
                        )
                      )}
                  </b>
                </td>
                <td></td>
                <td className="text-right">
                  <b>
                    {numberWithCommas(
                      _fixedPoint(
                        itmOne?.objList?.reduce(
                          (acc, cur) => (acc += cur?.deliveryValue),
                          0
                        )
                      )
                    )}
                  </b>
                </td>
              </tr>
            </>
          );
        })}
        <tr>
          <td
            colSpan="9"
            className="text-right"
          >
            <b>Grand Total </b>
          </td>
          <td className="text-center">
            <b>{numberWithCommas(_fixedPoint(GrandQuantity))}</b>
          </td>
          <td></td>
          <td className="text-right">
            <b>{numberWithCommas(_fixedPoint(GrandAmount))}</b>
          </td>
        </tr>
      </>
    </ICustomTable>
  );
}

export default TableGird;
