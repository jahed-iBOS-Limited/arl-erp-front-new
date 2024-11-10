import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import customStyles from "./common/selectCustomStyle";

// const customStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     minHeight: '22px',
//     height: '22px',
//   }),

//   valueContainer: (provided, state) => ({
//     ...provided,
//     height: '22px',
//     padding: '0 6px',
//   }),

//   input: (provided, state) => ({
//     ...provided,
//     margin: '0px',
//   }),
//   indicatorSeparator: (state) => ({
//     display: 'none',
//   }),
//   indicatorsContainer: (provided, state) => ({
//     ...provided,
//     height: '22px',
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     padding: 1,
//     fontSize: 12.5,
//     paddingLeft: 7,
//   }),
//   placeholder: (provided, state) => ({
//     ...provided,
//     fontSize: 11.5,
//   }),
// }

// { value, onChange, loadOptionsAction, inputValue, setInputValue }

const SearchAsyncSelect = ({
  selectedValue,
  loadOptions,
  handleChange,
  isDisabled,
  setClear,
  name,
  placeholder,
}) => {
  const [inputValue, setValue] = useState("");
  // const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  const handleInputChange = (value) => {
    setValue(value);
  };

  return (
    <div className="newSelectWrapper">
      <AsyncSelect
        cacheOptions
        isDisabled={isDisabled}
        defaultOptions
        value={selectedValue}
        getOptionLabel={(e) => e?.label}
        getOptionValue={(e) => e?.value}
        loadOptions={() => loadOptions(inputValue)}
        onInputChange={handleInputChange}
        onChange={(valueOption) => handleChange(valueOption)}
        styles={customStyles}
        placeholder={placeholder ? placeholder : "Minimum 3 letter"}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
        })}
      />
      {setClear && (
        <i
          className="far fa-times-circle globalCircleIcon2"
          onClick={() => {
            setClear(name, "");
          }}
        ></i>
      )}
    </div>
  );
};

export default SearchAsyncSelect;
