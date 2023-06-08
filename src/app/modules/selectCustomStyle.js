const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    height: "30px",
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
  }),

  input: (provided, state) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "26px",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    paddingRight: 2
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    paddingLeft: 0
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 1,
    fontSize: 12.5,
    paddingLeft: 7,
    zIndex: 99999999,
    paddingRight: 7,
  }),
  multiValue: (provided, state) => ({
    ...provided,
    height: "18px",
    marginTop: "1px",
    paddingRight: "6px"
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    paddingTop: "2px"
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: 11.5,
    textOverflow: "ellipsis",
    maxWidth: "95%",
    whiteSpace: "nowrap",
    overflow: "hidden",
  }),
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#ffffff",
    minWidth: "max-content",
    width: "100%",
    borderRadius: "2px",
    zIndex: 99999999999999,
  }),
};

export default customStyles;
