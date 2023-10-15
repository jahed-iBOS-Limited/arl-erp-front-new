import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const ValidationSchema = Yup.object().shape({
  channel: Yup.object().shape({
    label: Yup.string().required("Channel is required"),
    value: Yup.string().required("Channel is required"),
  }),
  customer: Yup.object().shape({
    label: Yup.string().required("Customer is required"),
    value: Yup.string().required("Customer is required"),
  }),
  overDueAmount: Yup.string().required("Over Due Amount is required"),
  reqQty: Yup.string().required("Request Qty is required"),
  reqAmount: Yup.string().required("Request Amount is required"),
  presentDebitAmount: Yup.string().required("Present Debit Amount is required"),
  lastDeliveryDate: Yup.string().required("Last Delivery Date is required"),
});

export const getCusterInformation = async (
  getPartnerBalance,
  getUndeliveredAmount,
  getPriceStructureCheck,
  getAvailableBalance,
  getCreditLimit,
  partnerId,
  setLoading
) => {
  setLoading(true);
  try {
    getPartnerBalance(
      `/partner/BusinessPartnerSales/GetBPartnerBalanceByPartnerId?BusinessPartnerId=${partnerId}`
    );
    getUndeliveredAmount(
      `/oms/SalesOrder/GetUndeliveryValues?SoldToPartnerId=${partnerId}`
    );
    getPriceStructureCheck(
      `/oms/SalesOrder/GetPriceStructureCheck?PartnerId=${partnerId}&PriceComponentTypeId=${1}`
    );
    getAvailableBalance(
      `/oms/SalesOrder/GetAvailableBalanceForInternalUser?pId=${partnerId}`
    );
    getCreditLimit(
      `/oms/SalesOrder/GetCreditLimitForInternalUser?pId=${partnerId}`
    );
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getPartnerOverDueRequestList = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setLoading,
  setter,
  setGridData,
  setTotalCount
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/partner/PartnerOverDue/GetPartnerOverDue?AccountId=${accId}&BusniessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data?.data?.map((item) => ({ ...item, isSelected: false })));
    setGridData(
      res?.data?.data?.map((item) => ({ ...item, isSelected: false }))
    );
    setTotalCount(res?.data?.totalCount);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const approveOrReject = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/partner/PartnerOverDue/ApproveOverDues`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const checkPermission = async (userId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/SalesInformation/GetAllowForModification?Partid=11&UserId=${userId}&UnitId=${buId}`
    );
    setter(res?.data[0]?.ysnPermission);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const getOverDueApprovalUserApi = async (
  accId,
  buId,
  userId,
  setter,
  setLoading
) => {
  setLoading(true);
  setter('')
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetOverDueApprovalUser?accountId=${accId}&businessUnitId=${buId}&userId=${userId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
