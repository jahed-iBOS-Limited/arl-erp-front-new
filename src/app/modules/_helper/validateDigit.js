/* eslint-disable eqeqeq */

// make your input field type="tel", and use this function, it will only return valid digit, not allowed any character/special character/negative value

/**
 
 usage : 

  const validNum = validateDigit(e.target.value)


        if you need to check max value : 
        if (validNum > item?.restofQty) {
            alert(`Maximum ${item?.restofQty}`);
            validNum = "";
          }

 setFieldValue("basicPrice", validNum);



 */

export const validateDigit = (number) => {
  if (number === "") return "";
  if (number == "0" || number == "00") return 0;

  let splited = number.split("");

  if (splited[0] == "0") {
    splited.shift();
  }

  let string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-\\~`?/>'{[|=_(*&^%$#@!)]}<,:;";

  let stringArr = string.split("");

  for (let i = 0; i < stringArr.length; i++) {
    if (splited[splited?.length - 1] == stringArr[i]) {
      splited.pop();
    }
  }

  let filter = splited.filter((i) => i != '"').join("");

  if (!filter) {
    return "";
  }

  return filter;
};
