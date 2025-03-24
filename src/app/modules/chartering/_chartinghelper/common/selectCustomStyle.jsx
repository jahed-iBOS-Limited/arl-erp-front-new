import { createCustomSelectStyles } from "../../../selectCustomStyle";

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
//     zIndex: 99999999,
//     paddingRight: 7,
//   }),
//   placeholder: (provided, state) => ({
//     ...provided,
//     fontSize: 11.5,
//   }),
//   menu: (provided, state) => ({
//     ...provided,
//     backgroundColor: '#ffffff',
//     minWidth: 'max-content',
//     width: '100%',
//     borderRadius: '2px',
//     zIndex: 99999999999999,
//   }),
// };

const customStyles = {
  ...createCustomSelectStyles({
    isOptionPaddingRight: false,
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: 11.5
    })
  }),
};

export default customStyles;
