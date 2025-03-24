import { createCustomSelectStyles } from "../../../selectCustomStyle";

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
