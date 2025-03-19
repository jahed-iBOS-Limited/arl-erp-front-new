import React from "react";

export default function ICustomTable({ ths, children, id, scrollable }) {
  return (
    <>
      {scrollable ? (
        <div className="loan-scrollable-table inventory-statement-report">
          <div style={{ maxHeight: "500px" }} className="scroll-table">
            <table
              className="table table-striped table-bordered bj-table bj-table-landing"
              id={id ? id : ""}
            >
              <thead>
                <tr className="cursor-pointer">
                  {ths.map((th, index) => {
                    return th && !th.isHide ? (
                      <th key={index} style={th.style}>
                        {" "}
                        {th.name}{" "}
                      </th>
                    ) : null;
                  })}
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table
            id={id ? id : ""}
            className="table mt-3 bj-table bj-table-landing"
          >
            <thead style={{ borderTop: "1px solid rgb(207, 203, 203)" }}>
              <tr>
                {ths.map((th, index) => {
                  return th && !th.isHide ? (
                    <th key={index} style={th.style}>
                      {" "}
                      {th.name}{" "}
                    </th>
                  ) : null;
                })}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
