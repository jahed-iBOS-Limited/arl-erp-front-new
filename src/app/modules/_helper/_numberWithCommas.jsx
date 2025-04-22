const numberWithCommas = (x) => {
  if (x == null) return '';
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export default numberWithCommas;
