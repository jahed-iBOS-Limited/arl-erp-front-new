export const reportId = {
  first: `bb2df915-a2f8-47d8-a39d-906a547bb852`,
  second: `b9092f9e-962d-4b87-80a3-29292cb1f579`,
};

export const groupId = {
  first: `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`,
  second: `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`,
};

export const parameterValues = (values, selectedBusinessUnit, profileData) => {
  return [
    { name: "intunit", value: selectedBusinessUnit?.value?.toString() },
    {
      name: "TransactionDate",
      value: values?.date,
    },
    { name: "customerId", value: values?.customer?.value?.toString() || "0" },
    {
      name: "intchannelid",
      value: values?.distributionChannel?.value?.toString() || "0",
    },
    { name: "intEmployeeid", value: profileData?.employeeId?.toString() },
    { name: "region", value: "0" },
    { name: "area", value: "0" },
    { name: "territory", value: "0" },
  ];
};

export const parameterValuesTwo = (values, selectedBusinessUnit) => {
  return [
    { name: "intunit", value: selectedBusinessUnit?.value?.toString() },
    {
      name: "TransactionDate",
      value: values?.date,
    },
    { name: "customerId", value: values?.customer?.value?.toString() || "0" },
    {
      name: "intchannelid",
      value: values?.distributionChannel?.value?.toString() || "0",
    },
    { name: "intLevelId", value: "0" },
    { name: "RATId", value: "0" },
  ];
};
