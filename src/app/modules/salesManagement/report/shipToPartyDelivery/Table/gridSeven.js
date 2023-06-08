import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const ths = [
  "Sl",
  "Date",
  "SO Number",
  "Challan No",
  "Product Name",
  "UoM",
  "Trs. Zone Rate",
  "Trs. Zone Quantity",
  "Amount",
  "Handling Rate",
  "Handling Cost",
  "Loading Labour Rate",
  "Loading Labour Cost",
  "Grand Amount",
];

const thsWithShipPointAll = [
  "Sl",
  "Date",
  "SO Number",
  "Challan No",
  "Product Name",
  "Shippoint",
  "UoM",
  "Trs. Zone Rate",
  "Trs. Zone Quantity",
  "Amount",
  "Handling Rate",
  "Handling Cost",
  "Loading Labour Rate",
  "Loading Labour Cost",
  "Grand Amount",
];

function TableGirdSeven({ rowDto, values }) {
  let GrandQuantity = 0;
  let GrandAmount = 0;

  return (
    <ICustomTable
      ths={values?.shippointDDL?.label === "All" ? thsWithShipPointAll : ths}
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
              <tr style={{ background: "#f1dbdb" }}>
                <td
                  colSpan={
                    values?.shippointDDL?.label === "All"
                      ? thsWithShipPointAll.length
                      : ths.length
                  }
                  className="text-left"
                >
                  <b>{itmOne?.customerName}</b>
                </td>
              </tr>

              {itmOne?.objList?.map((itm, i) => {
                let totalGrandAmount =
                  (itm?.deliveryValue || 0) +
                  (itm?.handlingCost || 0) +
                  (itm?.loadingLabourCostAmaount || 0);
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{_dateFormatter(itm?.deliveryDate)}</td>
                    <td>{itm?.so}</td>
                    <td>{itm?.deliveryCode}</td>
                    <td> {itm?.itemName}</td>
                    {values?.shippointDDL?.label === "All" && (
                      <td>{itm?.shipPointName}</td>
                    )}
                    <td className="text-center">{itm?.uomName}</td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.itemRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.deliveryQty))}
                    </td>

                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.deliveryValue))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.handlingRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.handlingCost))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.loadingLabourRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(
                        _fixedPoint(itm?.loadingLabourCostAmaount)
                      )}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(totalGrandAmount))}
                    </td>
                  </tr>
                );
              })}

              <tr className="text-right font-weight-bold">
                <td
                  colSpan={values?.shippointDDL?.label === "All" ? "7" : "6"}
                  className="text-right"
                >
                  Total
                </td>
                <td></td>
                <td className="text-right">
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
                </td>

                <td className="text-right">
                  {numberWithCommas(
                    _fixedPoint(
                      itmOne?.objList?.reduce(
                        (acc, cur) => (acc += cur?.deliveryValue),
                        0
                      )
                    )
                  )}
                </td>
                <td></td>
                <td>
                  {" "}
                  {_formatMoney(
                    itmOne?.objList?.reduce(
                      (acc, cur) => (acc += cur?.handlingCost),
                      0
                    )
                  )}{" "}
                </td>
                <td></td>
                <td>
                  {" "}
                  {_formatMoney(
                    itmOne?.objList?.reduce(
                      (acc, cur) => (acc += cur?.loadingLabourCostAmaount),
                      0
                    )
                  )}{" "}
                </td>

                <td></td>
              </tr>
            </>
          );
        })}
        <tr>
          <td
            colSpan={values?.shippointDDL?.label === "All" ? "8" : "7"}
            className="text-right"
          >
            <b>Grand Total </b>
          </td>
          <td className="text-right">
            <b>{numberWithCommas(_fixedPoint(GrandQuantity))}</b>
          </td>
          <td></td>
          <td className="text-right">
            <b>{numberWithCommas(_fixedPoint(GrandAmount))}</b>
          </td>
          <td colSpan={5}></td>
        </tr>
      </>
    </ICustomTable>
  );
}

export default TableGirdSeven;
