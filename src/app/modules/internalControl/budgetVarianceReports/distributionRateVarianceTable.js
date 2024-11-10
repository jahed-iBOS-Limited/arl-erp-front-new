import React from "react";

export default function DistributionRateVarianceTable({ tableData }) {
  return (
    <div className="mt-3">
      <div className="table-responsive">
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th rowSpan="2">SL</th>
              <th rowSpan="2">Item Code</th>
              <th rowSpan="2">Item Name</th>
              <th rowSpan="2">Uom</th>
              <th colSpan="2">Plan Quantity</th>
              <th colSpan="2">Actual Quantity</th>
              <th colSpan="2">Variance Quantity</th>
            </tr>
            <tr>
              <th>Via Trans Shipment</th>
              <th>Direct</th>
              <th>Via Trans Shipment</th>
              <th>Direct</th>
              <th>Via Trans Shipment</th>
              <th>Direct</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item?.itemCode}</td>
                <td>{item?.itemName}</td>
                <td>{item?.uomName}</td>
                <td className="text-right">{item?.planRateTransShipment}</td>
                <td className="text-right">{item?.planRateDirect}</td>
                <td className="text-right">{item?.actualRateTransShipment}</td>
                <td className="text-right">{item?.actualRateDirect}</td>
                <td className="text-right">
                  {item?.varianceRateTransShipment}
                </td>
                <td className="text-right">{item?.varianceRateDirect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
