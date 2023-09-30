import React from "react";

export default function WareHouseInventoryReportTable({ rowData }) {
  return (
    <div className="mt-5">
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0">
          <thead>
            <tr>
              <th>Sl</th>
              <th>MVessel Name</th>
              <th>Warehouse Name</th>
              <th>Open Qty</th>
              <th>Open Value</th>
              <th>In Qty</th>
              <th>In Value</th>
              <th>Out Qty</th>
              <th>Out Value</th>
              <th>Close Qty</th>
              <th>Rate</th>
              <th>Closing Value</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.length > 0 &&
              rowData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item?.strMVesselName}</td>
                    <td>{item?.strWarehouseName}</td>
                    <td className="text-center">{item?.numOpenQty}</td>
                    <td className="text-center">{item?.numOpenValue}</td>
                    <td className="text-center">{item?.numInQty}</td>
                    <td className="text-center">{item?.numInValue}</td>
                    <td className="text-center">{item?.numOutQty}</td>
                    <td className="text-center">{item?.numOutValue}</td>
                    <td className="text-center">{item?.numCloseQty}</td>
                    <td className="text-center">{item?.numRate}</td>
                    <td className="text-center">{item?.numClosingValue}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
