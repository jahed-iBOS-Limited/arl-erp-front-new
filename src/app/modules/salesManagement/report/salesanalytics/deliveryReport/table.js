import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
function DeliveryReportTable({ obj }) {
  const { gridData, printRef } = obj;
  return (
    <div className="mt-4">
      <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
        <div className="sta-scrollable-table scroll-table-auto">
          <div
            style={{ maxHeight: "500px" }}
            className="scroll-table _table scroll-table-auto"
          >
            <table
              id="table-to-xlsx"
              ref={printRef}
              className="table table-striped table-bordered global-table table-font-size-sm"
            >
              <thead>
                <th>SL</th>
                <th>Challan Date</th>
                <th>Challan Number</th>
                <th>Challan Qty</th>
                <th>Challan Value</th>
                <th>SO date</th>
                <th>SO Number</th>
                <th>SO Qty</th>
                <th>SO Value</th>
                {/* <th>Pending Qty</th>
                <th>Pending Qty Value</th> */}
                <th>Shipping Point</th>
                <th>Customer ID</th>
                <th>Customer Code</th>
                <th>Customer Name</th>
                <th>Shipment Code</th>
                <th>Vehicle ID</th>
                <th>Vehicle No</th>
                <th>Vahicle Name</th>
                <th>Delivery Mode</th>
                <th>Car Type</th>
                <th>Proceed Day</th>
                <th>VAT Number</th>
                <th>Fuel Memo No.</th>
                <th>Deisel</th>
                <th>CNG</th>
                <th>Octen</th>
                <th>Total Fuel</th>
                <th>Daily Allowance</th>
                <th>Bridge Toll & Chada</th>
                <th>Mileage Allowance</th>
                <th>Carrying Allowance</th>
                <th>Labor Tips</th>
                <th>Police Tips</th>
                <th>Maintenance</th>
                <th>Down Trip allowance</th>
                <th>Others</th>
                <th>Trip allowance</th>
                <th>Total Amount</th>
                <th>Advance Amount</th>
                <th>Net Amount</th>
                <th>Driver Name</th>
                <th>Driver Contact</th>
                <th>Supplier ID</th>
                <th>Supplier Name</th>
                <th>Transport Cost</th>
                <th>Loading/ Unloading Date</th>
                <th>Labour Cost</th>
                <th>Factory loading Cost Truck/Trawler</th>
                <th>Transfer Cost Trawler/Truck</th>
                <th>Ghat Handling Cost</th>
                <th>Transport(Truck) Cost Factory/Ghat</th>
                <th>Transport Cost/ Uom</th>
                <th>Ex. Factory Rate/UoM</th>
                <th>Manpower Cost/ Units</th>
                <th>Net To Company</th>
                <th>Trade Offer Unit</th>
                <th>Trade Offer Dzn</th>
                <th>Trade Com Unit</th>
                <th>Customer Com Unit</th>
                <th>Business Unit</th>
              </thead>
              <tbody>
                {gridData?.data?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{_dateFormatter(item?.challanDate)}</td>
                      <td>{item?.challanNumber}</td>
                      <td className="text-right">{_fixedPoint(item?.challanQty)}</td>
                      <td className="text-right">{_fixedPoint(item?.challanValue)}</td>
                      <td className="">{_dateFormatter(item?.salesOrderDate)}</td>
                      <td>{item?.salesOrderCode}</td>
                      <td className="text-right">{_fixedPoint(item?.soQty)}</td>
                      <td className="text-right">{_fixedPoint(item?.soValue)}</td>
                      {/* <td className="text-righ">{_fixedPoint(item?.pendingQty)}</td>
                      <td className="text-righ">{_fixedPoint(item?.pendingQtyValue)}</td> */}
                      <td>{item?.shippingPoint}</td>
                      <td>{item?.customerId}</td>
                      <td>{item?.customerCode}</td>
                      <td>{item?.customerName}</td>
                      <td>{item?.shipmentCode}</td>
                      <td>{item?.vehicleID}</td>
                      <td>{item?.vehicleNo}</td>
                      <td>{item?.vehicleName}</td>
                      <td>{item?.deliveryMode}</td>
                      <td>{item?.carType}</td>
                      <td className="">{_dateFormatter(item?.proceedDay)}</td>
                      <td>{item?.vatNumber}</td>
                      <td>{item?.demo}</td>

                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td className="text-right">{_fixedPoint(item?.dailyAllowance)}</td>
                      <td className="text-right">{_fixedPoint(item?.bridgeTollChada)}</td>
                      <td className="text-right">{_fixedPoint(item?.mileageAllowance)}</td>
                      <td className="text-right">{_fixedPoint(item?.carryingAllowance)}</td>
                      <td className="text-right">{_fixedPoint(item?.laborTips)}</td>
                      <td className="text-right">{_fixedPoint(item?.policeTips)}</td>
                      <td className="text-right">{_fixedPoint(item?.maintenance)}</td>
                      <td className="text-right">{_fixedPoint(item?.downTripallowance)}</td>
                      <td className="text-right">{_fixedPoint(item?.others)}</td>
                      <td className="text-right">{_fixedPoint(item?.tripallowance)}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.driverName}</td>
                      <td>{item?.driverContact}</td>
                      <td>{item?.supplierId}</td>
                      <td>{item?.supplierName}</td>
                      <td className="text-right">{_fixedPoint(item?.transportCost)}</td>
                      <td className="">{_dateFormatter(item?.loadingUnloading)}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                      <td>{item?.demo}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryReportTable;
