import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

function TableGirdFive({ rowDto, values }) {
  let numLabourCost = 0,
    numQuantity = 0;

  return (
    <div className="react-bootstrap-table table-responsive">
      <table className={"table table-striped table-bordered global-table "}>
        <thead>
          <tr>
            <th>SL </th>
            <th>Date </th>
            {values?.reportType?.value === 9 && <th>Vehicle Capacity Name</th>}

            <th>Labour Cost </th>
            <th>Quantity </th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((itm, idx) => {
            numLabourCost += itm?.numLabourCost || 0;
            numQuantity += itm?.numQuantity || 0;
            return (
              <tr>
                <td>{idx + 1}</td>
                <td>{_dateFormatter(itm?.dteServerDateTime)}</td>
                {values?.reportType?.value === 9 && (
                  <td>{itm?.strVehicleCapacityName}</td>
                )}
                <td className="text-right">
                  {_fixedPoint(itm?.numLabourCost)}
                </td>
                <td className="text-right">{_fixedPoint(itm?.numQuantity)}</td>
              </tr>
            );
          })}
          <tr>
            <td colspan={values?.reportType?.value === 9 ? 3 : 2}>
              <b>Total</b>
            </td>

            <td className="text-right">
              <b>{_fixedPoint(numLabourCost, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(numQuantity, true, 0)}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableGirdFive;
