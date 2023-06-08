import axios from "axios";

export const getBusinessTransactionDDL = async (
  accId,
  buId,
  generalLedgerId,
  setter
) => {
  try {
    const res = await axios.get(
      `/fino/FinanceCommonDDL/GetBusinessTransactionDDL?accountId=${accId}&businessUnitId=${buId}&generalLedgerId=${generalLedgerId}`
    );
    const modifyData = res?.data?.map(item => ({
        ...item,
        value: item?.buesinessTransactionId,
        label: item?.buesinessTransactionName
    }))
    setter(modifyData);
  } catch (err) {}
};
