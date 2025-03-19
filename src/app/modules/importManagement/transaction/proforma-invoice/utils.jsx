//set row data
export const setRowAmount = (key, index, amount, gridData, setRowDto) => {
  let data = [...gridData];
  data[index][key] = amount ? amount : "";
  data[index]["totalAmount"] = Number(
    (+data[index].quantity * +data[index].rate).toFixed(2)
  );
  return setRowDto([...data]);
};

// export const setter = (values, rowDto, setRowDto) => {
//   let data = [...rowDto];

//   let obj = {
//     ...values?.itemDDL,
//   };
//   return setRowDto([...data, obj]);
// };
