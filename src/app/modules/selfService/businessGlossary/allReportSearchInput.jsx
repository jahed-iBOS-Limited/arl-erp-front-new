import React from "react";
import ReactSpeechRecognition from "./react-speech-recognition";
import { debounce } from "lodash";

const search = debounce((paginationSearchHandler, value) => {
  paginationSearchHandler(value);
}, 400);

function AllReportSearchInput({
  placeholder,
  paginationSearchHandler,
  isDisabledFiled,
  setter,
  classes,
  secondClasses,
  setSearchInput,
  searchInput,
  searchHandlerCB,
}) {
  return (
    <div
      className={classes ? `paginationSearch ${classes}` : "paginationSearch"}
    >
      <div
        className={
          secondClasses ? `input-group ${secondClasses}` : "input-group"
        }
      >
        <div className='input-group-append'>
          <button
            className='btn btn-outline-secondary'
            type='button'
            disabled={isDisabledFiled}
            onClick={() => {
              paginationSearchHandler(searchInput);
            }}
          >
            <i className='fas fa-search'></i>
          </button>
        </div>
        <input
          type='text'
          disabled={isDisabledFiled}
          className='form-control'
          placeholder={placeholder}
          aria-label={placeholder}
          aria-describedby='basic-addon2'
          onChange={(e) => {
            setter && setter(e.target.value);
            setSearchInput(e.target.value);
            search(paginationSearchHandler, e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              paginationSearchHandler(e.target.value);
            }
          }}
          value={searchInput}
        />
        <ReactSpeechRecognition
          setSearchInput={setSearchInput}
          searchHandlerCB={searchHandlerCB}
        />
      </div>
    </div>
  );
}

export default AllReportSearchInput;
