const numberWithCommas = (x) => {
  if (x == null) return '';
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\d(?=(\d{3})+$)/g, '$&,');
  return parts.join('.');
};

export default numberWithCommas;
