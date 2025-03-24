import React, { useRef, useState } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { createCustomSelectStyles } from '../selectCustomStyle';
// { value, onChange, loadOptionsAction, inputValue, setInputValue }

const customStylesSelectMulti = {
  ...createCustomSelectStyles({
    isOptionPaddingRight: false,
    control: (provided, state) => ({
      ...provided,
      minHeight: '22px',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: '0 6px',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
    }),
  }),
};

const SearchAsyncSelectMulti = ({
  selectedValue,
  loadOptions,
  handleChange,
  isDisabled,
  name,
  placeholder,
  isSearchIcon,
  paddingRight,
  isDebounce,
  isHiddenToolTip,
  isMulti,
  onChange,
}) => {
  // const [inputValue, setValue] = useState("");
  // const [selectedValue, setSelectedValue] = useState(null);
  const [show, setShow] = useState(false);
  const target = useRef(null);
  // handle input change event
  // const handleInputChange = (value) => {
  //   setValue(value);
  // };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <i style={{ fontSize: '12px' }} className="fas fa-search"></i>
      </components.DropdownIndicator>
    );
  };

  // const debounce = useDebounce();

  return (
    <div
      className="newSelectWrapper"
      ref={target}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {!isHiddenToolTip && (
        <Overlay
          target={target.current}
          show={selectedValue?.value && show}
          placement="top-start"
        >
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              {selectedValue?.label}
            </Tooltip>
          )}
        </Overlay>
      )}
      <AsyncSelect
        isMulti
        cacheOptions
        defaultOptions
        name={name}
        value={selectedValue}
        loadOptions={loadOptions}
        onChange={onChange}
        styles={customStylesSelectMulti}
        menuPosition="fixed"
        placeholder={placeholder ? placeholder : 'Search (min 3 letter) '}
        isClearable={false}
        isDisabled={isDisabled}
        getOptionLabel={(e) => e?.label}
        getOptionValue={(e) => e?.value}
        components={isSearchIcon && { DropdownIndicator }}
      />
    </div>
  );
};

export default SearchAsyncSelectMulti;
