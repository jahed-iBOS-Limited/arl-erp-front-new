/* eslint-disable no-lone-blocks */
import React from 'react'
import Select from 'react-select'
import customStyles from '../helper/common/selectCustomStyle'
import FormikError from './_formikError'

const NewSelect = (props) => {
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
  } = props
  return (
    <div className="newSelectWrapper">
      <label> {label || placeholder} </label>
      <Select
        {...props}
        onChange={onChange}
        options={options || []}
        value={value}
        isSearchable={true}
        name={name}
        styles={customStyles}
        placeholder={placeholder}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
        })}
      />
      {setClear && (
        <i
          className="far fa-times-circle globalCircleIcon"
          onClick={() => {
            setClear(name, '')
          }}
        ></i>
      )}
      <FormikError errors={errors} name={name} touched={touched} />
    </div>
  )
}

export default NewSelect

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
