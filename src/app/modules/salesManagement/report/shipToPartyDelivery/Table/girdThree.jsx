import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function TableGirdThree({ rowDto, values }) {
  let numLabourCost = 0,
    numQuantity = 0,
    numLabourRate = 0;
  return (
    <div className="react-bootstrap-table table-responsive">
      <table className={"table table-striped table-bordered global-table "}>
        <thead>
          <tr>
            <th>SL </th>
            <th>Delivery Code </th>
            <th>Shipment Code </th>
            <th>Labor Supplier Name </th>
            <th>ShipPoint Name </th>
            <th>Vehicle Name </th>
            <th>SoldToPartner Name </th>
            <th>ShipToPartner Name </th>
            <th>Quantity </th>
            <th>Labour Rate </th>
            <th>Labour Cost </th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((itm, idx) => {
            numQuantity += itm?.numQuantity || 0;
            numLabourCost += itm?.numLabourCost || 0;
            numLabourRate += itm?.numLabourRate || 0;
            return (
              <tr>
                <td>{idx + 1}</td>
                <td>{itm?.strDeliveryCode}</td>
                <td>{itm?.strShipmentCode}</td>
                <td>{itm?.strLaborSupplierName}</td>
                <td>{itm?.strShipPointName}</td>
                <td>{itm?.strVehicleName}</td>
                <td>{itm?.strSoldToPartnerName}</td>
                <td>{itm?.strShipToPartnerName}</td>
                <td className="text-right">{_fixedPoint(itm?.numQuantity)}</td>
                <td className="text-right">
                  {_fixedPoint(itm?.numLabourRate)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.numLabourCost)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td colspan={8}>
              <b>Total</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(numQuantity, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(numLabourRate, true, 0)}</b>
            </td>{" "}
            <td className="text-right">
              <b>{_fixedPoint(numLabourCost, true, 0)}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableGirdThree;
