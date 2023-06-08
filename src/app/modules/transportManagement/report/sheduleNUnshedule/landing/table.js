import React from "react";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import moment from "moment";

function Table({ printRef, gridData }) {
  let totalQty = 0;
  return (
    <>
      <div className="react-bootstrap-table table-responsive">
        <table
          className="table table-striped table-bordered global-table"
          componentRef={printRef}
          ref={printRef}
        >
          <thead>
            <tr>
              <th>SL</th>
              <th>Request No</th>
              <th>Delivery Order</th>
              <th style={{ minWidth: "130px" }}>Delivery Order Date & Time</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Party Name</th>
              <th>Delivery Address</th>
              <th>Sold To Partner Name</th>
              <th>Vehicle Provider Type</th>
              <th>Vehicle No</th>
              <th>Supplier Name</th>
              <th>Challan Number</th>
              <th>Vehicle Type</th>
              <th>Delivery Mode</th>
              <th>Car Type</th>
              {/* <th>Bag Type</th> */}
              <th>Proceed Day</th>
              <th>Remaining Time</th>
              {/* <th>Date Sheduled </th> */}
              <th>Region</th>
              <th>Area</th>
              <th>Territory</th>
              <th>Total Qty</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => {
              totalQty += item?.decTotalQty || 0;
              return (
                <tr key={index}>
                  <td> {index + 1}</td>
                  <td>
                    <div className="pl-1">{item?.intShipmentRequestID}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strSalesOrderCode}</div>
                  </td>
                  <td>
                    <div className="">
                      {moment(item?.deliveryOrderDate).format(
                        "DD/MM/YYYY - h:mm a"
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strItemName}</div>
                  </td>
                  <td>
                    <div className="pr-2 text-right">
                      {_fixedPoint(item?.decTotalQty)}
                    </div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strPartyName}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strPickingPointName}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strSoldToPartnerName}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strVehicleProviderType}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strVehicleName}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strSupplierName}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strDeliveryCode}</div>
                  </td>

                  <td>
                    <div className="pl-1">{item?.strVehicleType}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strDeliveryMode}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strCarType}</div>
                  </td>
                  {/* <td>
                    <div className="pl-1">{item?.strBagType}</div>
                  </td> */}
                  <td>
                    <div className="pl-1">{item?.ProceedDay}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.RemaingTime}</div>
                  </td>
                  {/* <td>
                    <div className="pl-1">
                      {_dateFormatter(item?.dteSheduledDate)}
                    </div>
                  </td> */}
                  <td>
                    <div className="pl-1">{item?.nl5}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.nl6}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.strTerritoryName}</div>
                  </td>
                  <td>
                    <div className="pl-1">{item?.numOrderQnt}</div>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colspan="21" className="pr-2 text-right">
                {" "}
                <b>Total</b>
              </td>

              <td>
                <div className="pr-2 text-right">
                  <b> {_fixedPoint(totalQty)}</b>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
