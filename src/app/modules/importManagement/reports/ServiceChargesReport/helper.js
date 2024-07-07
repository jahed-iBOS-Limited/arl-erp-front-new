export const getReportId = (values) => {
  const typeId = values?.reportType?.value;
  const ServiceChargesReportId = `07d8f2ae-a17c-4f11-b26c-6f636ac80914`;
  const reportId = typeId === 1 ? ServiceChargesReportId : "";
  return reportId;
};

export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";

export const parameterValues = (values) => {
  const typeId = values?.reportType.value;

  const ServiceChargesReportParameter = [
    { name: "POid", value: values?.poId?.value.toString() || "" },
    { name: "FromDate", value: values?.fromDate || "" },
    { name: "ToDate", value: values?.toDate || "" },
  ];

  const parameters = typeId === 1 ? ServiceChargesReportParameter : [];
  return parameters;
};

export const serviceChargeReportTypeOptions = [
  { value: 1, label: "Service Charges Report" },
];
