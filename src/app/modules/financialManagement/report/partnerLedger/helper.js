import axios from "axios";
import { toast } from "react-toastify";

export const getSbuDDLAction = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getPartnerLedgerReport = async (
  accId,
  buId,
  sbuId,
  channelId,
  fromDate,
  toDate,
  setLoading,
  setter,
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/fino/BankBranch/GetAccountingRegisterSummaryPartnerWithDate?intAccountId=${accId}&intBusinessUnitId=${buId}&intSBUId=${sbuId}&intPartnerType=2&ChannelId=${channelId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
    setter([]);
  }
};

// export const getRegisterDetailsByIdAction = async (
//   buId,
//   bankAccId,
//   fromDate,
//   toDate,
//   setLoading,
//   setter
// ) => {
//   try {
//     setLoading(true);
//     const res = await axios.get(
//       `/fino/BankBranch/GetBankBook?BusinessUnitId=${buId}&BankAccountId=${bankAccId}&FromDate=${fromDate}&ToDate=${toDate}`
//     );
//     setLoading(false);
//     setter(res?.data);
//   } catch (error) {
//     setLoading(false);
//     setter([]);
//   }
// };

export const getPartnerBooks = async (
  businessUnitId,
  partnerId,
  partnerType,
  fromDate,
  toDate,
  setLoading,
  setter,
  glId
) => {
  try {
    setLoading(true);
    let query = `/fino/BankBranch/GetPartnerBook?BusinessUnitId=${businessUnitId}&PartnerId=${partnerId}&PartnerType=${partnerType}&FromDate=${fromDate}&ToDate=${toDate}`;
    if (glId) {
      query += `&GeneralId=${glId}`;
    }
    const res = await axios.get(query);
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const getDistributionChannels = async (
  accId,
  buId,
  sbuId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);

    const res = await axios.get(
      `/oms/SalesOrder/GetDistributionChannelDDLBySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};
