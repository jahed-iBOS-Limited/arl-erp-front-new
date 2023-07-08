export const getReportId = (values) => {
  const typeId = values?.reportType?.value;
  const regularIrregularParty = `bb2df915-a2f8-47d8-a39d-906a547bb852`;
  const sisterConcernOverdue = `b9092f9e-962d-4b87-80a3-29292cb1f579`;
  const receivableReport = `d2ee852a-f129-4167-87f3-3ef0c00c9f8c`;
  const reportId =
    typeId === 2
      ? regularIrregularParty
      : typeId === 3
      ? sisterConcernOverdue
      : typeId === 4
      ? receivableReport
      : "";
  return reportId;
};

export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";

export const parameterValues = (values, buId, employeeId) => {
  const typeId = values?.reportType?.value;

  const regularIrregularParty = [
    { name: "intunit", value: buId?.toString() },
    {
      name: "TransactionDate",
      value: values?.date,
    },
    {
      name: "customerId",
      value: values?.customer?.value?.toString() || "0",
    },
    {
      name: "intchannelid",
      value: values?.distributionChannel?.value?.toString() || "0",
    },
    { name: "intEmployeeid", value: employeeId?.toString() },
    { name: "region", value: "0" },
    { name: "area", value: "0" },
    { name: "territory", value: "0" },
  ];
  const sisterConcernOverdue = [
    { name: "intunit", value: buId?.toString() },
    {
      name: "TransactionDate",
      value: values?.date,
    },
    {
      name: "customerId",
      value: values?.customer?.value?.toString() || "0",
    },
    {
      name: "intchannelid",
      value: values?.distributionChannel?.value?.toString() || "0",
    },
    { name: "intLevelId", value: "0" },
    { name: "RATId", value: "0" },
  ];
  const receivableReport = [
    { name: "intunit", value: buId?.toString() },
    {
      name: "TransactionDate",
      value: values?.date,
    },
    {
      name: "intpartid",
      value: values?.viewType?.value?.toString() || "0",
    },
  ];

  const parameters =
    typeId === 2
      ? regularIrregularParty
      : typeId === 3
      ? sisterConcernOverdue
      : typeId === 4
      ? receivableReport
      : "";

  return parameters;
};

export // Table Header
const dayThs = [
  "Sl",
  "Partner Code",
  "Partner Name",
  "Ledger Balance",
  "Credit Days",
  "Permanent Credit Limit",
  "Short Time Credit Limit",
  "Total Credit Limit",
  "Sales Amount",
  "Deposit Amount",
  "Limit Base Overdue",
  "Days Base Overdue",
  "Region",
  "Area",
  "Territory",
  "Last Delivery Date",
  "Last Payment Date",
  "Product Delivery Gap",
  "Payment Gap",
  // "Delivery Date Difference",
  // "Collection Date Difference",
];
