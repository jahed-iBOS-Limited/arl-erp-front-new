import moment from "moment";
import React from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

function TableGird({ rowDto, values, buId }) {
  let GrandQuantity = 0;
  let GrandQuantityTon = 0;
  let GrandAmount = 0;

  const colSpanLen =
    values?.shippointDDL?.value === 0
      ? buId === 175
        ? 10
        : 9
      : buId === 175
      ? 9
      : 8;

  return (
    <div className="react-bootstrap-table table-responsive">
      <table className={"table table-striped table-bordered global-table "}>
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>Partner Code</th>
            <th>SO Number</th>
            <th>Challan No</th>
            {buId === 175 && <th>Manual Challan No</th>}
            <th>Product Code</th>
            <th>Product Name</th>
            {values?.shippointDDL?.value === 0 && <th>Shippoint</th>}
            <th>UoM</th>
            <th>Quantity</th>
            <th>Qnt (Ton)</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <>
            {rowDto.map((itmOne) => {
              GrandQuantity += itmOne?.objList?.reduce(
                (acc, cur) => (acc += cur?.deliveryQty),
                0
              );
              GrandQuantityTon += itmOne?.objList?.reduce(
                (acc, cur) => (acc += cur?.quantityInTon),
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
                        values?.shippointDDL?.value === 0
                          ? buId === 175
                            ? 14
                            : 13
                          : buId === 175
                          ? 13
                          : 12
                      }
                      className="text-left"
                    >
                      <b>{itmOne?.customerName}</b>
                    </td>
                  </tr>

                  {itmOne?.objList?.map((itm, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{moment(itm?.deliveryDate).format("lll")}</td>
                        {/* <td>{_dateFormatter(itm?.deliveryDate)}</td> */}
                        <td>{itm?.partnerCode}</td>
                        <td>{itm?.so}</td>
                        <td>{itm.deliveryCode}</td>
                        {buId === 175 && <td>{itm.manualChallan}</td>}
                        <td> {itm.itemCode}</td>
                        <td> {itm.itemName}</td>
                        {values?.shippointDDL?.label === "All" && (
                          <td>{itm.shipPointName}</td>
                        )}
                        <td className="text-center">{itm.uomName}</td>
                        <td className="text-center">
                          {numberWithCommas(_fixedPoint(itm.deliveryQty))}
                        </td>
                        <td className="text-center">
                          {numberWithCommas(itm?.quantityInTon || 0)}
                        </td>
                        <td className="text-right">
                          {numberWithCommas(_fixedPoint(itm.itemRate))}
                        </td>
                        <td className="text-right">
                          {numberWithCommas(_fixedPoint(itm.deliveryValue))}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={colSpanLen} className="text-right">
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
                    <td className="text-center">
                      <b>
                        {Number.isInteger(
                          _fixedPoint(
                            itmOne?.objList?.reduce(
                              (acc, cur) => (acc += cur?.quantityInTon),
                              0
                            )
                          )
                        )
                          ? numberWithCommas(
                              _fixedPoint(
                                itmOne?.objList?.reduce(
                                  (acc, cur) => (acc += cur?.quantityInTon),
                                  0
                                )
                              )
                            )
                          : _formatMoney(
                              _fixedPoint(
                                itmOne?.objList?.reduce(
                                  (acc, cur) => (acc += cur?.quantityInTon),
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
              <td colSpan={colSpanLen} className="text-right">
                <b>Grand Total </b>
              </td>
              <td className="text-center">
                <b>{numberWithCommas(_fixedPoint(GrandQuantity))}</b>
              </td>
              <td className="text-center">
                <b>{numberWithCommas(_fixedPoint(GrandQuantityTon))}</b>
              </td>
              <td></td>
              <td className="text-right">
                <b>{numberWithCommas(_fixedPoint(GrandAmount))}</b>
              </td>
            </tr>
          </>
        </tbody>
      </table>
    </div>
  );
}

export default TableGird;
