import Axios from "axios";

// Get landing data
export const getItemRequestGridData = async (
  accId,
  buId,
  dueDate,
  transactionDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/OManagementReport/GetAccountReceivablePayableInDueDateRange?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${dueDate}&ToDate=${transactionDate}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false);
      let gridData = res?.data?.map((data) => {
        return {
          businessPartnerName: data?.businessPartnerName,
          invoiceCode: data?.invoiceCode,
          clearedAmount: data?.clearedAmount,
          amount: data?.amount,
          adjustmentPendingAmount: data?.adjustmentPendingAmount,
        };
      });
      setter(gridData);
    }
  } catch (error) {
    setLoading(false);
    // 
  }
};
export const getDistributionDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};


export const getCustomerNameDDL = async (
  accId,
  buId,
  orgId,
  distributionChannelId,
  setter
) => {
  let distributorStr =
    distributionChannelId === 0
      ? ""
      : `&DistribuitionChannelId=${distributionChannelId}`;

  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrganization=${orgId}${distributorStr}`
    );
    const modifiedData = [{ value: 0, label: "All" }, ...res?.data];
    setter(modifiedData);
  } catch (error) {
    setter([]);
  }
};

// Report Type Custom
export const reportType = [
  { value: 0, label: "Receivable Due Report" },
  { value: 1, label: "Day Base Collection" },
  { value: 2, label: "Month Basis" },
  { value: 3, label: 'Sales Analysis as Per Receivable' }
]

export const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";

export const getReportId = (reportType) => {
  const DayAndMonthBasisReportId = "9962e8c5-114a-4b50-8ef4-e3368e0248b6"
  const SalesAnalysisAsPerReceivableReportId = '17af24d4-8e62-45ed-a4d7-08c91808b3c6'

  switch (reportType) {
    case 1:
    case 2:
      return DayAndMonthBasisReportId
    case 3:
      return SalesAnalysisAsPerReceivableReportId
    default:
      return null
  }
}


export const getParameterValues = (values, buId) => {
  const reportType = values?.reportType?.value

  const dayAndMonthBasis = [
    { name: "intunit", value: `${buId}` },
    { name: "YearID", value: `${values?.year?.value}` },
    { name: "MonthID", value: `${values?.month?.value}` },
    { name: "intpartid", value: `${values?.reportType?.value}` },
    { name: "channelid", value: `${values?.distributionChannel?.value}` },
    { name: "partnerid", value: `${values?.customerNameDDL?.value}` },
  ];

  const salesAndRevenueCollection = [
    { name: "intPartid", value: `${1}` },
    { name: "intUnitid", value: `${buId}` },
    { name: "intchannelid", value: `${values?.channel?.value}` },
    { name: "intRegionid", value: `${values?.region?.value}` },
    { name: "intAreaid", value: `${values?.area?.value}` },
    { name: "intTerritoryid", value: `${values?.territory?.value}` },
    { name: "intCustomerId", value: `${values?.customerNameDDL?.value}` },
    { name: "dteInvoiceFromDate", value: `${values?.fromDate}` },
    { name: "dteInvoiceToDate", value: `${values?.toDate}` },
  ]

  const parameters = reportType === 1 || reportType === 2 ? dayAndMonthBasis : reportType === 3 ? salesAndRevenueCollection : []

  return parameters
}