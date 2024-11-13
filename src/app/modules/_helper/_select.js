/* eslint-disable no-lone-blocks */
import React, { useState, useRef } from "react";
import Select from "react-select";
import customStyles from "../selectCustomStyle";
import CreatableSelect from 'react-select/creatable';
import FormikError from "./_formikError";
import { Overlay, Tooltip } from "react-bootstrap";
const NewSelect = (props) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const {
    name,
    options,
    value,
    label,
    placeholder,
    errors,
    touched,
    onChange,
    setClear,
    isHiddenLabel,
    isHiddenToolTip,
    labelIcon,
    isRequiredSymbol,
    isCreatableSelect
  } = props;
  return (
    <div
      className='newSelectWrapper'
      ref={target}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {!isHiddenToolTip && (
        <Overlay
          target={target.current}
          show={value?.value && show}
          placement='top-start'
        >
          {(props) => (
            <Tooltip id='overlay-example' {...props}>
              {value?.label}
            </Tooltip>
          )}
        </Overlay>
      )}

      {!isHiddenLabel && (label || placeholder) && (
        <label>
          {isRequiredSymbol && <b style={{ color: "red" }}>*</b>}{" "}
          {label || placeholder} {labelIcon && labelIcon()}{" "}
        </label>
      )}

      <div>
        {
          isCreatableSelect ? (
            <CreatableSelect
              isClearable={true}
              onChange={onChange}
              options={options || []}
              value={value}
              isSearchable={true}
              name={name}
              styles={customStyles}
              placeholder={placeholder}
              onBlur={() => setShow(false)}
              {...props}

            />
          ) : (<Select
            isClearable={true}
            onChange={onChange}
            options={options || []}
            value={value}
            isSearchable={true}
            name={name}
            styles={customStyles}
            placeholder={placeholder}
            onBlur={() => setShow(false)}
            {...props}

          />)
        }

        {setClear && (
          <i
            class='far fa-times-circle globalCircleIcon'
            onClick={() => {
              setClear(name, "");
            }}
          ></i>
        )}
        <FormikError errors={errors && errors} name={name} touched={touched} />
      </div>
    </div>
  );
};

export default NewSelect;

/* 
    
    <NewSelect
    name="category"
    options={[]}
    value={values?.category}
    label="Category"
    onChange={(valueOption) => {
          setFieldValue(name, valueOption);
        }}
    placeholder="Category"
    errors={errors}
    touched={touched}
    /> 

*/
