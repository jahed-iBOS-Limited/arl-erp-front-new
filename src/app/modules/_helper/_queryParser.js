export const IQueryParser = (name) => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(name);
};
