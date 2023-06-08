import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

function SalesContactReportTable({ obj }) {
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
                <th>End Date</th>
                <th>Pricing Date</th>
                <th>Sales Contact Date</th>
                <th>Start Date</th>
                <th>Offer Include</th>
                <th>Partial Shipment</th>
                <th>Unlimited</th>
                <th>Item Price</th>
                <th>Total Contact Qty</th>
                <th>Total Contact Value</th>
                <th>BusinessUnit Name</th>
                <th>Delivery Address</th>
                <th>Distribution Channel Name</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Partner Reff. No</th>
                <th>Payment Terms Name</th>
                <th>Plant Address</th>
                <th>Plant Name</th>
                <th>Remark</th>
                <th>Sales Contact Code</th>
                <th>Sales Office Name</th>
                <th>Sales Organization Name</th>
                <th>SoldToPartner Name</th>
                <th>SoldToPartner Address</th>
                <th>UOM</th>
                <th>Vehicle By</th>
              </thead>
              <tbody>
                {gridData?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{_dateFormatter(item?.dteEndDate)}</td>
                      <td className="">
                        {_dateFormatter(item?.dtePricingDate)}
                      </td>
                      <td className="">
                        {_dateFormatter(item?.dteSalesContactDate)}
                      </td>
                      <td className="">{_dateFormatter(item?.dteStartDate)}</td>
                      <td className="">{item?.isOfferInclude}</td>
                      <td className="">{item?.isPartialShipment}</td>
                      <td className="">{item?.isUnlimited}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.numItemPrice || 0)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.numTotalContactQty || 0)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.numTotalContactValue || 0)}
                      </td>
                      <td className="">{item?.strBusinessUnitName}</td>
                      <td className="">{item?.strDeliveryAddress}</td>
                      <td className="">{item?.strDistributionChannelName}</td>
                      <td className="">{item?.strItemCode}</td>
                      <td className="">{item?.strItemName}</td>
                      <td className="">{item?.strPartnerReffNo}</td>
                      <td className="">{item?.strPaymentTermsName}</td>
                      <td className="">{item?.strPlantAddress}</td>
                      <td className="">{item?.strPlantName}</td>
                      <td className="">{item?.strRemark}</td>
                      <td className="">{item?.strSalesContactCode}</td>
                      <td className="">{item?.strSalesOfficeName}</td>
                      <td className="">{item?.strSalesOrganizationName}</td>
                      <td className="">{item?.strSoldToPartnerName}</td>
                      <td className="">{item?.strSoldToPartnerAddress}</td>
                      <td className="">{item?.strUOM}</td>
                      <td className="">{item?.strVehicleBy}</td>
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

export default SalesContactReportTable;
