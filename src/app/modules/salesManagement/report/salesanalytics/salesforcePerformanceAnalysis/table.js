import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function SalesforcePerformanceAnalysisTable({ obj }) {
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
                <th>Fiscal Year</th>
                <th>Year</th>
                <th>Month</th>
                <th>Region</th>
                <th>Area</th>
                <th>Territory</th>
                <th>Distribution Channel</th>
                <th>Channel Type</th>
                <th>Customer ID</th>
                <th>Customer Code</th>
                <th>Customer Name</th>
                <th>Customer Address</th>
                <th>Sales Target</th>
                <th>Sales Achievement</th>
                <th>TM Target</th>
                <th>TM Sales</th>
                <th>TM Variance</th>
                <th>YTD Target</th>
                <th>YTD Sales</th>
                <th>YTD Variance</th>
                <th>TG Achv.(TM)%</th>
                <th>TG Achv.(YTD)%</th>
                <th>Growth % [LM Vs.TM]</th>
                <th>Growth % [LM TM Vs.TY TM]</th>
                <th>Growth (YTD)%</th>
              </thead>
              <tbody>
                {gridData?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center">{i + 1}</td>
                      <td className="">{item?.FiscalYear}</td>
                      <td className="">{values?.year?.label}</td>
                      <td className="">{values?.month?.label}</td>
                      <td className="">{item?.Region}</td>
                      <td className="">{item?.Area}</td>
                      <td className="">{item?.Territory}</td>
                      <td className="">{item?.ChannelName}</td>
                      <td className="">{item?.ChannelType}</td>
                      <td className="">{item?.CustomerId}</td>
                      <td className="">{item?.CustomerCode}</td>
                      <td className="">{item?.CustomerName}</td>
                      <td className="">{item?.CustomerAddress}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.TargetQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.DeliveryQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TargetQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.DeliveryQty)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TMVariance)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.YTDTarget)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.YTDSales)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.YTD_Variance)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.Achievement)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.TGAchv_YTD)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.Growth_LMVsTM)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.Growth_LYTMVsTYTM)}
                      </td>
                      <td className="text-right">
                        {_fixedPoint(item?.Growth_LYvsTY)}
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

export default SalesforcePerformanceAnalysisTable;
