import React from "react";

export default function ICustomTable({ ths, children, className, id }) {
  return (
    <div className="react-bootstrap-table table-responsive">
      <table className={"table table-striped table-bordered global-table "+className} id={id}>
        <thead>
          <tr>
            {ths?.map((th, index) => {
              return <th key={index}> {th} </th>;
            })}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
