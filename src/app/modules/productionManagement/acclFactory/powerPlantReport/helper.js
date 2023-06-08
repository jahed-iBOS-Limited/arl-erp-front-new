export const filterHandler = (data, id) => {
  const filterData = data?.filter((item) => item.sectionId === id);
  return filterData || [];
};
