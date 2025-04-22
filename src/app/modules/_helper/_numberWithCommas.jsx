const numberWithCommas = (x) => {
  if (x == null || isNaN(x)) return '';
  return new Intl.NumberFormat('en-US').format(x);
};

export default numberWithCommas;
