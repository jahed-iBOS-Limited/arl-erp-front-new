import React from "react";

export default function ICustomTable({ ths, children, id }) {
  return (
    <div>
      <table id={id ? id : ""} className="table mt-3 bj-table bj-table-landing">
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
  );
}
