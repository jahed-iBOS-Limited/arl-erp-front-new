/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const Table = ({ rows }) => {
  return (
    <>
      <div className="table-responsive">
      <table
        id="table-to-xlsx"
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
        }
      >
        <thead>
          <tr className="cursor-pointer">
            {[
              "SL",
              "Challan No",
              "Order Code",
              "Order Qty",
              "Delivered Qty",
              "Undelivered Qty",
              "Challan Status",
            ]?.map((th, index) => {
              return <th key={index}> {th} </th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows?.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ width: "40px" }} className="text-center">
                  {index + 1}
                </td>
                <td>{item?.strchallan}</td>
                <td>{item?.stroder}</td>
                <td className="text-right">
                  {_fixedPoint(item?.orderqnt, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.orderDeliverdqnt, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.orderundeliverqnt, true, 0)}
                </td>
                <td>{item?.strChallanStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default Table;
