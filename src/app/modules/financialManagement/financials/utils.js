export const dynamicSerial = (pageNo, pageSize, index) => {
  const serial = pageNo === 0 ? index + 1 : pageSize * pageNo + index + 1;
  return serial;
};
