import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
function SalesReportTable({ obj }) {
  const { gridData, printRef, values } = obj;
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
                <th>Year</th>
                <th>Month</th>

                <th>Customer ID</th>
                <th>Customer Code</th>
                <th>Customer Name</th>
                {/* <th>Proprietor Name</th>
                <th>Proprietor Contact</th>
                <th>Other Contact name</th>
                <th>Other Contact Number</th>
                <th>Division</th>
                <th>District</th>
                <th>Thana/Upazilla</th>
                <th>Customer Type</th>
                <th>Distribution Channel</th>
                <th>Ship to party ID</th>
                <th>Ship to party Name</th>
                <th>Ship to party Address</th>
                <th>Ship to party Contact</th> */}
                {/* <th>Tranport Zone</th> */}
                <th>Region</th>
                <th>Area</th>
                <th>Territory</th>
                <th>Challan Date</th>
                <th>Challan Number</th>
                <th>Challan Qty</th>
                <th>Challan Value</th>
                <th>SO date</th>
                <th>SO Number</th>
                <th>SO Qty</th>
                <th>SO Value</th>
                <th>Pending Qty</th>
                <th>Pending Qty Value</th>
                {/* <th>Shipping Point</th>
                <th>Item ID</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>UoM</th>
                <th>Item Rate</th>
                <th>Distributor Price (DP)</th>
                <th>Trade Price (TP)</th>
                <th>Landing Price (MRP)</th>
                <th>Item Group</th>
                <th>Item Sub Group</th>
                <th>SKU</th>
                <th>Variant</th>
                <th>Aging</th>
                <th>Color</th>
                <th>Size</th>
                <th>Unit Ctn</th>
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
                <th>Customer Com Unit</th> */}
              </thead>
              <tbody>
                {gridData?.data?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{values?.year?.label}</td>
                      <td className="">{values?.month?.label}</td>
                      <td className="">{item?.customerId}</td>
                      <td className="">{item?.customerCode}</td>
                      <td className="">{item?.customerName}</td>

                      {/* <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td> */}
                      {/* <td className="">{item?.demo}</td> */}
                      <td className="">{item?.regionName}</td>
                      <td className="">{item?.areaName}</td>
                      <td className="">{item?.territoryName}</td>

                      <td className="">{_dateFormatter(item?.challanDate)}</td>
                      <td className="">{item?.challanNumber}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.challanQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.challanValue)}
                      </td>
                      <td className="">
                        {_dateFormatter(item?.salesOrderDate)}
                      </td>
                      <td className="">{item?.salesOrderCode}</td>
                      <td className="text-right">{_fixedPoint(item?.soQty)}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.soValue)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.pendingQty)}
                      </td>

                      <td className="text-right">
                        {_fixedPoint(item?.pendingQtyValue)}
                      </td>

                      {/* <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td>
                      <td className="">{item?.demo}</td> */}
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

export default SalesReportTable;
