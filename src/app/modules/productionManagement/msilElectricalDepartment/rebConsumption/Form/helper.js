export const setTotalConsumptionUnit = (
  fieldValue,
  values,
  setFieldValue,
  selectedBusinessUnit
) => {
  if ([144].includes(selectedBusinessUnit?.value)) {
    setFieldValue("totalConsumptionUnit", "");
  }

  if ([188, 189].includes(selectedBusinessUnit?.value)) {
    setFieldValue(
      "totalConsumptionUnit",
      (+fieldValue - +values?.previousPressure) * 264.59
    );
  }

  if ([188].includes(selectedBusinessUnit?.value)) {
    setFieldValue(
      "totalConsumptionUnit",
      (+fieldValue - +values?.previousPressure) * 1058.33
    );
  }

  if (
    [171].includes(selectedBusinessUnit?.value) &&
    (values?.rebConsumptionDDL?.value === 3 ||
      values?.rebConsumptionDDL?.value === 4)
  ) {
    setFieldValue(
      "totalConsumptionUnit",
      (+fieldValue +
        (+values?.presentPressureTwo || 0) -
        ((+values?.previousPressure || 0) +
          (+values?.previousPressureTwo || 0))) *
        13750 // 13750 given by user
    );
  }
  if (
    [4].includes(selectedBusinessUnit?.value) &&
    (values?.rebConsumptionDDL?.value === 5 ||
      values?.rebConsumptionDDL?.value === 6)
  ) {
    setFieldValue(
      "totalConsumptionUnit",
      (+fieldValue +
        (+values?.presentPressureTwo || 0) -
        ((+values?.previousPressure || 0) +
          (+values?.previousPressureTwo || 0))) *
        30000 // 30000 given by user
    );
  }
};

export const setPreviousPressure = (setFieldValue, data) => {
  setFieldValue("previousPressure", data?.intPreviousKwh || "");
  setFieldValue("previousPressureTwo", data?.intPreviousKwhm2 || "");
  setFieldValue("previousPressureThree", data?.intPreviousKwhm3 || "");
  setFieldValue("previousPressureFour", data?.intPreviousKwhm4 || "");
};

export const getMultipleBy = (buId, typeId) => {
  if ([144].includes(buId) && [7].includes(typeId)) {
    return 264.59;
  }

  if ([188].includes(buId) && [8].includes(typeId)) {
    return 1058.33;
  }

  if ([189].includes(buId) && [9].includes(typeId)) {
    return 529.167;
  }

  if ([4].includes(buId) && [5, 6].includes(typeId)) {
    return 30000;
  }

  if ([171, 244].includes(buId) && [3, 4].includes(typeId)) {
    return 13750;
  }

  return 1;
};
