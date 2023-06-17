export const calculateTotalConsumption = (value, values, excludeField) => {
  const fieldsToSum = [
    values.presentPressure || 0,
    values.presentPressureTwo || 0,
    values.presentPressureThree || 0,
    values.presentPressureFour || 0,
    values.previousPressure || 0,
    values.previousPressureTwo || 0,
    values.previousPressureThree || 0,
    values.previousPressureFour || 0,
  ];

  let sum = 0;

  for (let i = 0; i < fieldsToSum.length; i++) {
    if (i !== excludeField) {
      sum += Number(fieldsToSum[i]) || 0;
    }
  }

  const totalConsumption = sum + (Number(value) || 0);
  return totalConsumption;
};

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
