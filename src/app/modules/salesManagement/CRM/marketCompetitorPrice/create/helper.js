export function getUniqueGroups(field, dataset) {
  const uniqueValues = {};
  let autoIncrement = 1;

  dataset.forEach((item) => {
    const fieldValue = item[field];

    if (fieldValue !== null && !uniqueValues[fieldValue]) {
      uniqueValues[fieldValue] = {
        ...item,
        value: autoIncrement++,
        label: fieldValue,
      };
    }
  });

  return Object.values(uniqueValues);
}

export function onFilterHandler(allData, values, setter) {
  const result = allData.filter((item) => {
    const filters = [
      { key: "strGroup", label: values.group?.label },
      { key: "strProductBrand", label: values.brandName?.label },
      { key: "strProductCategory", label: values.subCategory?.label },
      { key: "strProductSku", label: values.skuName?.label },
    ];

    return filters.every(({ key, label }) => !label || item[key] === label);
  });

  setter(result);
}

export function onResetFilterHandler(setFieldValue) {
  setFieldValue("group", "");
  setFieldValue("subCategory", "");
  setFieldValue("skuName", "");
  setFieldValue("brandName", "");
}
