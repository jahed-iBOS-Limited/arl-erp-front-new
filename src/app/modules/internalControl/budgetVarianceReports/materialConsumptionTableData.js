import React from "react";
import { _formatMoney } from "../../_helper/_formatMoney";

export default function MaterialConsumptionTableData({ rowDto }) {
  return (
    <div className="row mt-5">
      <div className="table-responsive">
        <table className="table table-striped table-bordered bj-table bj-table-landing material-consumption-variance">
          <thead>
            <tr>
              <th>FG Item</th>
              <th>FG Item Budget[UoM]</th>
              <th>Material Name</th>
              <th>UOM</th>
              <th>Budget Consumption per unit</th>
              <th>Actual Consumption per unit</th>
              <th>Variance</th>
            </tr>
          </thead>
          <tbody>
            {rowDto?.length > 0 &&
              rowDto?.map((item, index) => (
                <tr key={index}>
                  {item?.isShow ? (
                    <>
                      <td rowSpan={item?.intSectionCount}>
                        {item?.fgItemName}
                      </td>
                      <td
                        className="text-center"
                        rowSpan={item?.intSectionCount}
                      >
                        {item?.fgItemBudgetWithUom}
                      </td>
                    </>
                  ) : null}
                  <td
                    className={item?.isTotal ? "text-left bold" : "text-left"}
                  >
                    {item?.materialName}
                  </td>
                  <td>{item?.materialUom}</td>
                  <td
                    className={item?.isTotal ? "text-right bold" : "text-right"}
                  >
                    {_formatMoney(item?.budgetConsumption)}
                  </td>
                  <td
                    className={item?.isTotal ? "text-right bold" : "text-right"}
                  >
                    {_formatMoney(item?.actualConsumption)}
                  </td>
                  <td
                    className={item?.isTotal ? "text-right bold" : "text-right"}
                  >
                    {_formatMoney(item?.variance)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
