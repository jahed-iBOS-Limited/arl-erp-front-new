import React from "react";
import numberWithCommas from "../../../../_helper/_numberWithCommas";

const AVGCoverageTable = ({ setTableItem, inventoryStatement }) => {
  return (
    inventoryStatement?.length > 0 && (
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
          <thead>
            <tr>
              <th>SL</th>
              <th>Item Code</th>
              <th style={{ width: "200px" }}>Item Name</th>
              <th style={{ minWidth: "100px" }}>UoM Name</th>
              <th>Current Stock</th>
              <th>Avg. D. Cons.</th>
              <th>Coverage Days</th>
            </tr>
          </thead>
          <tbody>
            {inventoryStatement?.length > 0 &&
              inventoryStatement?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{ width: "30px" }} className="text-center">
                      {index + 1}
                    </td>
                    <td>
                      <span className="pl-2">{item?.strCode}</span>
                    </td>
                    <td>
                      <span className="pl-2">{item?.strItemName}</span>
                    </td>
                    <td>
                      <span className="pl-2">{item?.strUoM}</span>
                    </td>
                    <td className="text-right">
                      <span>
                        {numberWithCommas(
                          (item?.numCurrentStock || 0).toFixed(2)
                        )}
                      </span>
                    </td>
                    <td className="text-right">
                      <span>
                        {numberWithCommas(
                          (item?.numAvgDailyCons || 0).toFixed(2)
                        )}
                      </span>
                    </td>
                    <td className="text-right">
                      <span>{item?.numCoverageDays}</span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    )
  );
};

export default AVGCoverageTable;
