import React, { useState } from "react";
import "./autoSuggest.css";
import Autosuggest from "react-autosuggest";
import FormikError from "./common/formikError";

const AutoSuggest = ({
  label,
  placeholder,
  name,
  options,
  touched,
  errors,
  value,
  setValue,
  suggestHandler,
  disabled,
}) => {
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : options.filter(
          (item) =>
            item?.label?.toLowerCase()?.slice(0, inputLength) === inputValue
        );
  };

  const getSuggestionValue = (suggestion) => suggestion.label;

  const renderSuggestion = (suggestion) => <div>{suggestion.label}</div>;

  const [suggestions, setSuggestions] = useState([]);

  const onChangeHandler = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    //Here you do whatever you want with the values
    suggestHandler(suggestion);
  };

  const inputProps = {
    placeholder: placeholder,
    value,
    onChange: onChangeHandler,
    disabled: disabled,
  };

  return (
    <>
      <label>{label}</label>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        onSuggestionSelected={onSuggestionSelected}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <FormikError errors={errors} name={name} touched={touched} />
    </>
  );
};

export default AutoSuggest;
