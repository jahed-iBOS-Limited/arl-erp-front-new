import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function Table({ rowDto, printRef, values }) {
  const ths = [
    "SL",
    "SO Number",
    "Owner Type",
    "ShipPoint",
    "Customer Name",
    "Labour Supplier Name",
    "Transport Zone",
    "Zone Rate",
    "Quantity",
    "Vehicle No",
  ];
  let totalQty = 0;
  return (
    <>
      {rowDto?.length ? (
        <div>
          {values?.reportName?.value === 1 ? (
            <div className="table-responsive">
              <table
                ref={printRef}
                className="table table-striped table-bordered global-table table-font-size-sm"
              >
                <thead>
                  <tr>
                    <th style={{ width: "30px" }} rowSpan="2">
                      SL
                    </th>
                    <th style={{ width: "100px" }} rowSpan="2">
                      Sales Code
                    </th>
                    <th style={{ width: "100px" }} rowSpan="2">
                      Order Qty
                    </th>
                    <th style={{ width: "100px" }} rowSpan="2">
                      Pending Qty
                    </th>
                    <th style={{ width: "120px" }} colSpan="2" rowSpan="1">
                      Delivery
                    </th>
                    <th style={{ width: "120px" }} colSpan="2" rowSpan="1">
                      Shipment
                    </th>
                    <th style={{ width: "120px" }} colSpan="2" rowSpan="1">
                      Complete Shipment
                    </th>
                  </tr>
                  <tr>
                    <th colSpan="1" rowSpan="1">
                      Code
                    </th>
                    <th colSpan="1" rowSpan="1">
                      Qty
                    </th>
                    <th colSpan="1" rowSpan="1">
                      Code
                    </th>
                    <th colSpan="1" rowSpan="1">
                      Qty
                    </th>
                    <th colSpan="1" rowSpan="1">
                      Code
                    </th>
                    <th colSpan="1" rowSpan="1">
                      Qty
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.salesOrderCode}</td>
                      <td className="text-center">{item?.orderQty}</td>
                      <td className="text-center">{item?.pendingQty}</td>
                      <td>{item?.deliveryCode}</td>
                      <td className="text-center">{item?.deliveryQty}</td>
                      <td>{item?.shipmentCode}</td>
                      <td className="text-center">{item?.shipmentQty}</td>
                      <td>{item?.shipmentCompleteCode}</td>
                      <td className="text-center">
                        {item?.shipmentCompleteQty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) :  (
            <>
              <ICustomTable ths={ths}>
                {rowDto?.map((item, index) => {
                  totalQty += item?.numQuantity;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.SalesOrderNumber}</td>
                      <td>{item?.strOwnerType}</td>
                      <td>{item?.strShipPointName}</td>
                      <td>{item?.strSoldToPartnerName}</td>
                      <td>{item?.strLaborSupplierName}</td>
                      <td>{item?.strtransportzonename}</td>
                      <td className="text-right">{item?.Zonerate}</td>
                      <td className="text-right">{item?.numQuantity}</td>
                      <td>{item?.strVehicleName}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="8" className="text-center">
                    <b>Total</b>
                  </td>
                  <td className="text-right">
                    <b>{_fixedPoint(totalQty, true, 0)}</b>
                  </td>
                  <td></td>
                </tr>
              </ICustomTable>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}
