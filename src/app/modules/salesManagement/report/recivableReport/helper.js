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