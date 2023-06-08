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
