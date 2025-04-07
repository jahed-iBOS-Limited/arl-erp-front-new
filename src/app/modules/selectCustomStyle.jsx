const defaultFunction = (provided, state) => ({
  ...provided,
});

export const createCustomSelectStyles = ({
  height = '22px',
  minHeight = '22px',
  indicatorsHeight = '22px',
  isMulti = false,
  isAutoHeight = false,
  isOptionPaddingRight = true,
  control = defaultFunction,
  valueContainer = defaultFunction,
  indicatorsContainer = defaultFunction,
  input = defaultFunction,
  option = defaultFunction,
  clearIndicator = defaultFunction,
  dropdownIndicator = defaultFunction,
  placeholder = defaultFunction,
  menu = defaultFunction,
} = {}) => {
  const styles = {
    control: (provided, state) =>
      control(
        {
          ...provided,
          minHeight,
          height: isAutoHeight ? 'auto' : height,
        },
        state
      ),

    valueContainer: (provided, state) =>
      valueContainer(
        {
          ...provided,
          height: isAutoHeight ? 'auto' : height,
          padding: '0 6px',
        },
        state
      ),

    input: (provided, state) =>
      input(
        {
          ...provided,
          margin: '0px',
        },
        state
      ),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    indicatorsContainer: (provided, state) =>
      indicatorsContainer(
        {
          ...provided,
          height: indicatorsHeight,
        },
        state
      ),

    clearIndicator: (provided, state) =>
      clearIndicator(
        {
          ...provided,
          paddingRight: 2,
        },
        state
      ),

    dropdownIndicator: (provided, state) =>
      dropdownIndicator(
        {
          ...provided,
          paddingLeft: 0,
        },
        state
      ),

    option: (provided, state) =>
      option(
        {
          ...provided,
          padding: 1,
          fontSize: 12.5,
          zIndex: 99999999,
          paddingLeft: 7,
          ...(isOptionPaddingRight ? { paddingRight: 7 } : {}),
        },
        state
      ),

    placeholder: (provided, state) =>
      placeholder(
        {
          ...provided,
          fontSize: 11.5,
          textOverflow: 'ellipsis',
          maxWidth: '95%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        },
        state
      ),

    menu: (provided, state) =>
      menu(
        {
          ...provided,
          backgroundColor: '#ffffff',
          minWidth: 'max-content',
          width: '100%',
          borderRadius: '2px',
          zIndex: 99999999999999,
        },
        state
      ),
  };

  if (isMulti) {
    styles.multiValue = (provided, state) => ({
      ...provided,
      height: '18px',
      marginTop: '1px',
      paddingRight: '6px',
    });

    styles.multiValueRemove = (provided, state) => ({
      ...provided,
      paddingTop: '2px',
    });
  }

  return styles;
};

const customStyles = createCustomSelectStyles({});

export default customStyles;
