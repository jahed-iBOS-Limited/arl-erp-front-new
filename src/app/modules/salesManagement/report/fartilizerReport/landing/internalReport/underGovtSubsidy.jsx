import React, { Fragment } from "react";

export default function UnderGovSubsidyTable({ rowData }) {
  return (
    <div>
      <h6 className="mb-0 mt-3">Report of Fertilizers Under Govt. Subsidy</h6>
      <div className="table-responsive">
        <table
          id="table-to-xlsx"
          className="table table-striped table-bordered global-table table-font-size-sm"
        >
          <thead>
            <tr>
              <th>Sales Center</th>
              <th>District</th>
              <th>Allotment (MT)</th>
              <th>Sold (MT)</th>
              <th>Residual (MT)</th>
            </tr>
          </thead>

          <tbody>
            {rowData?.map((item, index) => (
              <tr
                style={{
                  backgroundColor: item?.includes("-") ? "lightblue" : "none",
                }}
                key={index}
              >
                {item?.map((nested, key) => (
                  <Fragment key={key}>
                    <td
                      className={
                        key === 0 || key === 1 ? "text-left" : "text-right"
                      }
                    >
                      {nested}
                    </td>
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
