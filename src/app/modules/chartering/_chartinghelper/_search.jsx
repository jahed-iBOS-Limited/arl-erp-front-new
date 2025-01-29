import React, { useState } from "react";

function PaginationSearch({ placeholder, paginationSearchHandler, values }) {
  const [fieldValue, setFieldValue] = useState("");
  return (
    <div className="paginationSearch">
      <div className="input-group">
        <input
          type="text"
          //className="form-control"
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby="basic-addon2"
          onChange={(e) => {
            setFieldValue(e.target.value);
          }}
          onKeyDown={(e) => {
            // setFieldValue(e.target.value);
            if (e.keyCode === 13) {
              e.preventDefault();
              paginationSearchHandler(e.target.value, values);
            }
          }}
          style={{
            paddingLeft: "8px",
            border: "1px solid rgb(204, 204, 204)",
            borderRadius: "5px 0px 0px 5px",
          }}
        />
        <div className="input-group-append">
          <button
            style={{
              border: "1px solid rgb(204, 204, 204)",
            }}
            className="btn btn-light"
            type="button"
            onClick={() => {
              paginationSearchHandler(fieldValue, values);
            }}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaginationSearch;
