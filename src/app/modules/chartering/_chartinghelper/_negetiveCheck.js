export const NegetiveCheck = (value, name, setFieldValue) => {
  if (+value >= 0) {
    setFieldValue(name, value);
  } else {
    setFieldValue(name, "");
  }
};
