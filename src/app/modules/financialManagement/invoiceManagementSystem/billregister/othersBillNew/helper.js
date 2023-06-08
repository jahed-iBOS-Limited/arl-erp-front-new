import axios from "axios";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../../App";

export const getSalesInvoiceLanding = async (
  accId,
  buId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/CommercialInvoice/GetCommercialInvoiceLanding?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message + "Check Date Range");
    console.log(error);
  }
};

export const getDeliveryInformationByDeliveryId = async (
  deliveryId,
  setLoading,
  setRowDto
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/CommercialInvoice/GetDeliveryInformationByDeliveryId?DeliveryId=${deliveryId}`
    );
    setLoading(false);
    if (res?.data?.length > 0) {
      setRowDto((prv) => {
        return [...prv, ...res?.data];
      });
    }
  } catch (error) {
    setLoading(false);
    console.log(error);
  }
};

export const getCommercialInvoiceById = async (
  invoiceId,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/wms/CommercialInvoice/GetCommercialInvoiceById?InvoiceId=${invoiceId}`
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    console.log(error);
  }
};

export const getDeliveryDDLFromOrder = async (
  accId,
  buId,
  salesOrderId,
  v,
  setter
) => {
  try {
    const res = await axios.get(
      `/wms/CommercialInvoice/GetDeliveryInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}&SalesOrderId=${salesOrderId}&Search=${v}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const getCustomerDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const getOrderDDL = async (accId, buId, search, partnerId, setter) => {
  try {
    const res = await axios.get(
      `/wms/CommercialInvoice/GetOrderInfoDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerId=${partnerId}&Search=${search}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const getPartnerInfoByOrder = async (orderId, setter) => {
  try {
    const res = await axios.get(
      `/wms/CommercialInvoice/GetPartnerInfoByOrder?OrderId=${orderId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const getBankAccountDDL = async (accountId, businssUnitId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accountId}&BusinssUnitId=${businssUnitId}`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const getSBUListDDL = async (accountId, businssUnitId, setter) => {
  try {
    const res = await axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accountId}&BusinessUnitId=${businssUnitId}&Status=true`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const getOrganizationalUnitUserPermission = async (
  userId,
  accountId,
  businssUnitId,
  setter
) => {
  try {
    const res = await axios.get(
      `${APIUrl}/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${businssUnitId}&OrgUnitTypeId=7`
    );
    setter(res?.data);
  } catch (error) {
    console.log(error);
  }
};

export const uploadAtt = async (attachment) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file);
  });
  return axios.post("/domain/Document/UploadFile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const othersBillEntries = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/fino/OthersBillEntry/OthersBillEntries`,
      payload
    );
    setLoading(false);
    cb();
    toast.success(res?.data?.message);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const getBankDDL = async (setter) => {
  try {
    const res = await axios.get(
      `${APIUrl}/partner/BusinessPartnerBankInfo/GetBankInfo`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.bankName,
        value: item?.bankId,
      }))
    );
  } catch (error) {
    console.log(error);
  }
};
export const getBranchDDL = async (bankId, setter) => {
  try {
    const res = await axios.get(
      `${APIUrl}/partner/BusinessPartnerBankInfo/GetBranchDDLInfo?BankId=${bankId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        label: item?.bankBranchName,
        value: item?.bankBranchId,
      }))
    );
  } catch (error) {
    console.log(error);
  }
};

export const getExpenseBusinessTransactionList = async (
  businessUnitId,
  setter
) => {
  try {
    const res = await axios.get(
      `/fino/Expense/GetExpenseBusinessTransactionList?BusinessUnitId=${businessUnitId}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        value: item?.businessTransactionId,
        label: item?.businessTransactionName,
      }))
    );
  } catch (err) {}
};
export const billApproved = async (
  actionById,
  data,
  setDisabled,
  cb
) => {

  try {
      setDisabled(true);
      const res = await axios.post(
          `/fino/BillRegister/BillApproved?ActionById=${actionById}`,
          data
      );

      toast.success(res?.data?.message || "Submitted successfully", {
          toastId: "BillApproved",
      });
      setDisabled(false);
      cb()
  } catch (error) {
      setDisabled(false);
      toast.error(error?.response?.data?.message, {
          toastId: "BillApproved",
      });
  }
};

export const othersBillEntriesGetById = async (id, setter, setDisabled) => {
  try {
      setDisabled(true)
      const res = await axios.get(
          `/fino/OthersBillEntry/OthersBillEntriesGetById?billId=${id}`
      );
      setter(res?.data);
      setDisabled(false)
  } catch (error) {
      console.log(error);
      setDisabled(false)
  }
};