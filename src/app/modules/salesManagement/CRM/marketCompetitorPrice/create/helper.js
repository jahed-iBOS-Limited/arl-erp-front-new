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

export function filterAndMapOptions(allData, values, fieldName) {
  const filterLogic = (item) => {
    switch (fieldName) {
      case "strProductCategory":
        return (
          (!values?.group || item?.strGroup === values.group.label) &&
          (!values?.subCategory ||
            item.strProductCategory === values.subCategory.label)
        );

      case "strProductSku":
        return (
          (!values?.group || item?.strGroup === values.group.label) &&
          (!values?.subCategory ||
            item.strProductCategory === values.subCategory.label) &&
          (!values?.skuName || item.strProductSku === values?.skuName?.label)
        );

      case "strProductBrand":
        return (
          (!values?.group || item?.strGroup === values.group.label) &&
          (!values?.subCategory ||
            item.strProductCategory === values.subCategory.label) &&
          (!values?.skuName || item.strProductSku === values?.skuName?.label) &&
          (!values?.brandName ||
            item.strProductBrand === values?.brandName?.label)
        );

      case "strGroup":
        return true; // No additional filter for 'strGroup'

      default:
        return true; // Default case, no additional filter
    }
  };

  const uniqueOptions = allData.filter(filterLogic).reduce(
    (uniqueOptions, item, i) => {
      const label = item?.[fieldName];
      if (label && !uniqueOptions.labels.has(label)) {
        uniqueOptions.labels.add(label);
        uniqueOptions.data.push({
          ...item,
          value: i + 1,
          label: label,
        });
      }
      return uniqueOptions;
    },
    { data: [], labels: new Set() }
  ) || { data: [], labels: new Set() };

  return uniqueOptions.data;
}
