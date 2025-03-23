import React, { useRef, useState } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import useDebounce from './customHooks/useDebounce';
const SearchAsyncSelect = ({
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
  isCreatableSelect,
}) => {
  const [inputValue, setValue] = useState('');
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const handleInputChange = (value) => {
    setValue(value);
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <i style={{ fontSize: '12px' }} className="fas fa-search"></i>
      </components.DropdownIndicator>
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '22px',
      height: '22px',
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: '22px',
      padding: '0 6px',
    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: (state) => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '22px',
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      paddingRight: paddingRight || 2,
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      paddingLeft: 0,
    }),
    option: (provided, state) => ({
      ...provided,
      padding: 1,
      fontSize: 12.5,
      paddingLeft: 7,
      zIndex: 99999999,
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: 11.5,
      textOverflow: 'ellipsis',
      maxWidth: '95%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    }),
    menu: (provided, state) => ({
      ...provided,
      backgroundColor: '#ffffff',
      minWidth: 'max-content',
      width: '100%',
      borderRadius: '2px',
      zIndex: 99999999999999,
    }),
  };

  const debounce = useDebounce();
  const commonSelectProps = {
    menuPosition: "fixed",
    isDisabled,
    isClearable: true,
    defaultOptions: true,
    value: selectedValue,
    getOptionLabel: (e) => e?.label,
    getOptionValue: (e) => e?.value,
    components: isSearchIcon && { DropdownIndicator },
    loadOptions: () => {
      if (isDebounce) {
        return new Promise((resolve, reject) => {
          debounce(() => {
            loadOptions(inputValue, resolve, reject);
          }, 500);
        });
      } else {
        return loadOptions(inputValue);
      }
    },
    onInputChange: handleInputChange,
    onChange: (valueOption) => handleChange(valueOption),
    styles: customStyles,
    placeholder: placeholder ? placeholder : "Search (min 3 letter)",
  };
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
      {isCreatableSelect ? (
        <AsyncCreatableSelect {...commonSelectProps} />
      ) : (
        <AsyncSelect {...commonSelectProps} />
      )}
    </div>
  );
};

export default SearchAsyncSelect;
