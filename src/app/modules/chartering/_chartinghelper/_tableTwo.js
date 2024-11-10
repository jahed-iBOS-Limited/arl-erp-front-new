import React from "react";
import { useHistory } from "react-router-dom";
export function ITableTwo({
  renderProps,
  children,
  title,
  viewLink,
  createLink,
  isHidden,
}) {
  let history = useHistory();
  return (
    <>
      <div className="table-card">
        <div className="table-card-heading">
          <p>{title}</p>
        </div>
        <div className="table-responsive">
          {renderProps()}
          <div className="d-flex justify-content-end my-3">
            {
              !isHidden && <>
                <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push(viewLink)}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-primary save-btn ml-3"
              onClick={() => history.push(createLink)}
            >
              Create
            </button>
              </> 
            }
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
