import React from "react";
import { _formatMoney } from "../../_helper/_formatMoney";

export default function CostOfProductionReportTable({ rowDto }) {
  return (
    <div className="row mt-5">
      <div className="col-lg-12 cost-of-production">
        <div className="table-responsive">
          <table
            id="table-to-xlsx"
            className="table table-striped table-bordered bj-table bj-table-landing"
          >
            <thead>
              <tr>
                {/* <th>Machine</th> */}
                <th>Item Code</th>
                <th>Item Name</th>
                <th>UoM</th>
                <th>Particulars</th>
                <th>Uom</th>
                <th>Budget</th>
                <th>Actual</th>
                <th>Variance</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.length > 0 &&
                rowDto?.map((item, index) => (
                  <tr key={index}>
                    {item?.isShow ? (
                      <>
                        {/* <td
                      className="text-center"
                      rowSpan={item?.intSectionCount}
                    >
                      {item?.machineName}
                    </td> */}
                        <td
                          className="text-center"
                          rowSpan={item?.intSectionCount}
                        >
                          {item?.fgItemCode}
                        </td>
                        <td
                          className="text-center"
                          rowSpan={item?.intSectionCount}
                        >
                          {item?.fgItemName}
                        </td>
                        <td
                          className="text-center"
                          rowSpan={item?.intSectionCount}
                        >
                          {item?.fgItemUom}
                        </td>
                      </>
                    ) : null}
                    <td
                      className={item?.isTotal ? "text-left bold" : "text-left"}
                    >
                      {item?.particularsName}
                    </td>
                    <td>{item?.particularsUom}</td>
                    <td
                      className={
                        item?.isTotal ? "text-right bold" : "text-right"
                      }
                    >
                      {_formatMoney(item?.budgetConsumption)}
                    </td>
                    <td
                      className={
                        item?.isTotal ? "text-right bold" : "text-right"
                      }
                    >
                      {_formatMoney(item?.actualConsumption)}
                    </td>
                    <td
                      className={
                        item?.isTotal ? "text-right bold" : "text-right"
                      }
                    >
                      {_formatMoney(item?.variance)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
