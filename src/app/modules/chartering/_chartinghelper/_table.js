import React from "react";
import { useHistory } from "react-router-dom";
export function ITable({ title, children, link }) {
  let history = useHistory();
  return (
    <>
      <div className="table-card">
        <div className="table-card-heading">
          <p>{title}</p>
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push(link)}
            >
              Create
            </button>
          </div>
        </div>
        <div className="table-responsive">{children}</div>
      </div>
    </>
  );
}
