export const getReportId = (values) => {
  const typeId = values?.reportType?.value;
  const regularIrregularParty = `bb2df915-a2f8-47d8-a39d-906a547bb852`;
  const sisterConcernOverdue = `b9092f9e-962d-4b87-80a3-29292cb1f579`;
  const receivableReport = `d2ee852a-f129-4167-87f3-3ef0c00c9f8c`;
  const partyStatusReport = `31b073bf-1efb-4fa1-acc2-86ab7a59ef43`;
  const salesAndRevenueCollectionReport = `fb701cc3-194d-461a-920f-30c399229e0c`;
  const BPBACPAnalysisReport = `ad59feaf-a160-4175-bb65-1b37901b1af1`;
  const reportId =
    typeId === 2
      ? regularIrregularParty
      : typeId === 3
      ? sisterConcernOverdue
      : typeId === 4
      ? receivableReport
      : typeId === 5
      ? partyStatusReport
      : typeId === 6
      ? salesAndRevenueCollectionReport
      : typeId === 7
      ? BPBACPAnalysisReport
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
      value: values?.channel?.value?.toString() || "0",
    },
    { name: "region", value: values?.region?.value?.toString() || "0"},
    { name: "area", value: values?.area?.value?.toString() || "0" },
    { name: "territory", value: values?.territory?.value?.toString() || "0" },
    { name: "PartyStatus", value: values?.partyStatus?.value?.toString() || "0" },
    { name: "PartyGroupId", value:  "0" },
  ];
  const sisterConcernOverdue = [
    { name: "intunit", value: values?.businessUnit?.value?.toString() },
    {
      name: "toDate",
      value: values?.date,
    },
    {
      name: "ViewTYPE",
      value: values?.sisViewType?.value?.toString() || "0",
    },
  ];
  const receivableReport = [
    { name: "intunit", value: values?.businessUnit?.value?.toString() },
    {
      name: "TransactionDate",
      value: values?.date,
    },
    {
      name: "intpartid",
      value: values?.viewType?.value?.toString() || "0",
    },
  ];

  const partyStatusReport = [
    { name: "intunit", value: buId?.toString() },
    {
      name: "TransactionDate",
      value: values?.date,
    },
    {
      name: "intchannelid",
      value: values?.channel?.value?.toString() || "0",
    },
    {
      name: "customerId",
      value: values?.customer?.value?.toString() || "0",
    },
    {
      name: "region",
      value: values?.region?.value?.toString() || "0",
    },
    { name: "area", value: values?.area?.value?.toString() || "0" },
    { name: "territory", value: values?.territory?.value?.toString() || "0" },
    // {
    //   name: "PartyStatus",
    //   value: values?.partyStatus?.value?.toString() || "0",
    // },
    {
      name: "PartyGroupId",
      value: values?.partyGroup?.value?.toString() || "0",
    },
  ];

  const salesAndRevenueCollectionReport = [
    { name: "BusinessUnitId", value: values?.businessUnit?.value?.toString() },
    { name: "reportDateFrom", value: values?.fromDate },
    { name: "reportDateTO", value: values?.toDate },
    { name: "intPartid", value: "2" },
  ];

  const BPBACPAnalysisReport = [
    { name: "BusinessUnitId", value: buId?.toString() },
    {
      name: "DistributionChannel",
      value: values?.channel?.value?.toString(),
    },
    { name: "Regionid", value: values?.region?.value?.toString() },
    { name: "Areaid", value: values?.area?.value?.toString() },
    { name: "Territoryid", value: values?.territory?.value?.toString() },
    { name: "dteFromDate", value: values?.fromDate },
    { name: "dteToDate", value: values?.toDate },
  ];

  const parameters =
    typeId === 2
      ? regularIrregularParty
      : typeId === 3
      ? sisterConcernOverdue
      : typeId === 4
      ? receivableReport
      : typeId === 5
      ? partyStatusReport
      : typeId === 6
      ? salesAndRevenueCollectionReport
      : typeId === 7
      ? BPBACPAnalysisReport
      : [];

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
