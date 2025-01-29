export const searchMatch = (list, searchValue) => {
  let matchList = [];
  if (!searchValue) {
    return list;
  }
  const processList = processMatch(list, searchValue);
  if (processList?.length > 0) {
    matchList.push(...processList);
  }
  const standardReportNameList = standardReportNameMatch(list, searchValue);
  if (standardReportNameList?.length > 0) {
    matchList.push(...standardReportNameList);
  }
  const allObjectKeyList = allObjectKeyMatch(list, searchValue);
  if (allObjectKeyList?.length > 0) {
    matchList.push(...allObjectKeyList);
  }
  return matchList;
};

// Process Match
const processMatch = (list, searchValue) => {
  const _searchValue = (searchValue || "").trim().toLowerCase();
  const _list = list.filter((item) => {
    const _keys = (item?.process || "").trim().toLowerCase();
    return _keys === _searchValue;
  });
  return _list;
};
//standard Report Name Match
const standardReportNameMatch = (list, searchValue) => {
  const _searchValue = (searchValue || "").trim().toLowerCase();
  const _list = list.filter((item) => {
    let key = `standardreportname`;
    const _keys = (item?.[`${key}`] || "").trim().toLowerCase();
    return _keys.includes(_searchValue);
  });
  return _list;
};

// all object key match
const allObjectKeyMatch = (list, searchValue) => {
  const _searchValue = (searchValue || "").trim().toLowerCase();
  const _list = list.filter((item) => {
    const _keys = Object.keys(item);
    const _match = _keys.filter((key) => {
      const _key = (key || "").trim().toLowerCase();
      return _key.includes(_searchValue);
    });
    return _match?.length > 0;
  });
  return _list;
};

export function convertKeysSpace(obj) {
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  const newObj = {}; // Create a new object to store the result
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const stringWithoutSpaces = key.replace(/\s/g, "");
      const newKey = stringWithoutSpaces.toLowerCase();
      newObj[newKey] = obj[key];
    }
  }

  return newObj;
}
