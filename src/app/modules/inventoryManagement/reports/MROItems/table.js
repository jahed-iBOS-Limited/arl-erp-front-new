import React from "react";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import PaginationSearch from "../../../_helper/_search";

export default function MROItemPlanningTable({ obj }) {
  const { values, rowData, paginationSearchHandler } = obj;
  let totalIssueYear = 0,
    totalIssueMonth = 0,
    totalRequirement = 0;
  const numberFlooring = (number) => {
    if (number > 0 && number < 1) {
      return 1;
    } else {
      return +number.toFixed();
    }
  };
  return (
    <>
      <div className="my-1 d-flex justify-content-between">
        <PaginationSearch
          values={values}
          placeholder="Item Name And Code Search"
          paginationSearchHandler={paginationSearchHandler}
        />
      </div>
      <div className="">
        <div className="scroll-table _table">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Plant</th>
                  <th>Warehouse</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>UOM Name</th>
                  <th>Last One Year Avg Issue</th>
                  <th>Last Month Issue</th>
                  <th>Requirement</th>
                </tr>
              </thead>
              <tbody>
                {rowData?.length > 0 &&
                  rowData?.map((item, index) => {
                    totalIssueYear += item?.averageIssueYear;
                    totalIssueMonth += item?.averageIssueMonth;
                    totalRequirement += item?.requirement;
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item?.plantName}</td>
                        <td>{item?.warehouseName}</td>
                        <td>{item?.itemCode}</td>
                        <td>{item?.itemName}</td>
                        <td>{item?.uomName}</td>
                        <td className="text-right">{item?.averageIssueYear}</td>
                        <td className="text-right">
                          {item?.averageIssueMonth}
                        </td>
                        <td className="text-right">
                          {numberFlooring(item?.requirement)}
                        </td>
                      </tr>
                    );
                  })}
                <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                  <td colSpan={6} className="text-right">
                    <b>Total</b>
                  </td>
                  <td>{_fixedPoint(totalIssueYear, true, 6)}</td>
                  <td>{totalIssueMonth}</td>
                  <td>{totalRequirement}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
