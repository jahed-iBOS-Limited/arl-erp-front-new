import React, { Fragment } from "react";

export default function MokamOrWarehouseInfoTable({ rowData }) {
  return (
    <div>
      <h6 className="mb-0 mt-3">Mokam/Warehouse Info:</h6>
      <div className="table-responsive scroll-table _table">
        <table className="table table-striped table-bordered global-table table-font-size-sm">
          <thead>
            <tr>
              {rowData[0]?.map((item, key) => (
                <th key={key} style={{ width: "100px" }} rowSpan="2">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rowData?.map((item, index) => (
              <Fragment key={index}>
                {index === 0 ? null : (
                  <tr key={index}>
                    {item?.map((nested) => (
                      <td>{nested}</td>
                    ))}
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
