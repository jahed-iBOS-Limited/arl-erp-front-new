export const _numberValidation = (e) => {
  if (e.target.value === "") return "";

  if (+e.target.value === 0) return 0;
  if (e.target.value) {
    if (e.target.value === "00") return false;

    if (e.target.value.toString().length > 18 || e.target.value < 0) {
      return false;
    }

    let intValue = parseInt(e.target.value);
    if (intValue !== +e.target.value) {
      let lensplit = e.target.value?.toString()?.split(".")[1]?.length;
      if (lensplit > 6) {
        return false;
      }
    } else {
      let len = e.target.value?.toString()?.length;
      if (len > 18) {
        return false;
      }
    }
    return e.target.value.replace(/\D/, "");
  }
};

export const _validationNumber = (e) => {
  if (String(e).includes(".0")) {
    return e;
  } else {
    const valid = String(Number(e));
    return isNaN(valid) ? "0" : valid;
  }
};
