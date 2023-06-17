export const generateSecondLevelList = ({
  list,
  matchField,
  secondLevelField,
}) => {
  if (!Array.isArray(list)) return [];
  const result = [];
  const unique = {};

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item?.[matchField]) break;
    if (!unique[item[matchField]]) {
      const secondLevelList = list?.filter(
        (x) => x[matchField] === item[matchField]
      );
      result.push({ ...item, [secondLevelField]: secondLevelList });
      unique[item[matchField]] = true;
    }
  }

  return result;
};
