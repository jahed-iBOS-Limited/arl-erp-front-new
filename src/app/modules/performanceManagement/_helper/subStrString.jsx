

export const subStrString = (str, maxLength) => {
  let newStr;
  if (str.length > maxLength) {
    newStr = `${str.substr(0, maxLength)}...`;
  } else {
    newStr = str;
  }
  return newStr;
};
