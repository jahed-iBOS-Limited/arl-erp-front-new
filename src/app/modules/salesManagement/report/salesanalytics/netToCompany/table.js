import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function NetToCompanyTable({ obj }) {
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
                <th>Region</th>
                <th>Area</th>
                <th>Territory</th>
                <th>Distribution Channel</th>
                <th>Channel Type</th>
                <th>Customer ID</th>
                <th>Customer Code</th>
                <th>Customer Address</th>
                <th>Distributor Price (DP)</th>
                <th>Trade Price (TP)</th>
                <th>Ex. Factory Rate/UoM</th>
                <th>Customer Total Benefit</th>
                <th>Customer Avg. Benefit/UoM</th>
                <th>Retailer Total Benefit</th>
                <th>Retailer Avg. Benefit/UoM</th>
                <th>Total Avg. Benefit</th>
                <th>Manpower Cost/ Units</th>
                <th>Net to Company</th>
              </thead>
              <tbody>
                {gridData?.data?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{values?.year?.label}</td>
                      <td className="">{values?.month?.label}</td>
                      <td className="">{item?.region}</td>
                      <td className="">{item?.area}</td>
                      <td className="">{item?.teriitory}</td>
                      <td className="">{item?.distributionChannel}</td>
                      <td className="">{item?.channelType}</td>
               
                      <td className="">{item?.customerID}</td>
                      <td className="">{item?.customerCode}</td>
                      <td className="">{item?.customerName}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.distributorPrice)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.tradePrice)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.exFactoryRate)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.customerTotalBenefit)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.customerAvgBenefit)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.retailerTotalBenefit)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.retailerAvgBenefit)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.totalAvgBenefit)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.manpowerCost)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.netToCompany)}
                      </td>
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

export default NetToCompanyTable;
