import React, { useState } from "react";

function PaginationSearch({
  placeholder,
  paginationSearchHandler,
  values,
  setFieldValue,
  isDisabledFiled,
  setter,
  classes,
  secondClasses
}) {
  const [fieldValue, setFieldValues] = useState("");
  return (
    <div className={classes ? `paginationSearch ${classes}` : "paginationSearch"}>
      <div className={secondClasses ? `input-group ${secondClasses}` : "input-group"}>
        <input
          type="text"
          disabled={isDisabledFiled}
          className="form-control"
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby="basic-addon2"
          onChange={(e) => {
            setter && setter(e.target.value);
            setFieldValues(e.target.value);
            if (!values && e.target.value?.length === 0) {
              paginationSearchHandler(e.target.value, values);
            }
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              paginationSearchHandler(e.target.value, values);
            }
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            type="button"
            disabled={isDisabledFiled}
            onClick={() => {
              paginationSearchHandler(fieldValue, values, setFieldValue);
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
