import React from "react";

export default function ICustomCard({
  title,
  backHandler,
  saveHandler,
  createHandler,
  viewHandler,
  children,
  renderProps
}) {
  return (
    <>
      <div className="form-card">
        <div className="form-card-heading">
          <p>{title}</p>
          <div>
            {backHandler && (
              <button onClick={backHandler} className="btn btn-light">
                Back
              </button>
            )}
            {saveHandler && (
              <button onClick={saveHandler} className="btn btn-primary save-btn">
                Save
              </button>
            )}
            {viewHandler && (
              <button onClick={viewHandler} className="btn btn-primary">
                View
              </button>
            )}
            {createHandler && (
              <button onClick={createHandler} className="btn btn-primary">
                Create
              </button>
            )}
            {renderProps && renderProps()}
          </div>
        </div>
        <div>
          <div className="form-card-content">{children}</div>
        </div>
      </div>
    </>
  );
}