export const storiedList = () => {
  const storiedList = [];

  for (let i = 1; i <= 20; i++) {
    storiedList.push({ value: i, label: i });
  }

  return storiedList;
};
