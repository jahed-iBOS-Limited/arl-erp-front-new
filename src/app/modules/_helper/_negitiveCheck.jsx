export const NegetiveCheck = (value, setFieldValue, name) => {
  if (+value <= 0) {
    setFieldValue(name, "");
  } else {
    setFieldValue(name, +value);
  }
};
