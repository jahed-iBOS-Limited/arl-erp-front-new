import React from "react";
import Select from "react-select";
import FormikError from "./formikError";
import customStyles from "./selectCustomStyle";

const FormikSelect = (props) => {
  const {
    name,
    options,
    value,
    placeholder,
    onChange,
    errors,
    touched,
    label,
    isClearable,
  } = props;
  return (
    <div className="newSelectWrapper">
      {label && <label> {label} </label>}
      <Select
        isClearable={isClearable === "false" ? isClearable : true}
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
          borderRadius: 5,
        })}
      />
      <FormikError errors={errors} name={name} touched={touched} />
    </div>
  );
};

export default FormikSelect;

// Uses
/* 
<FormikSelect
  name="category"
  options={[]}
  value={values?.category}
  onChange={(valueOption) => {
    setFieldValue(name, valueOption);
  }}
  errors={errors}
  touched={touched}
  placeholder="Category"
/>;
 */
