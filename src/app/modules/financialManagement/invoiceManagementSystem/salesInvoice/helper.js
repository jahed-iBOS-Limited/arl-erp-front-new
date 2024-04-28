import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getSalesInvoiceLanding = async (
  accId,
  buId,
  fromDate,
  toDate,
  channelId,
  pageNo,
  pageSize,
  search,
  setLoading,
  setter
) => {
  setLoading(true);
  const searchTerm = search ? `&search=${search}` : "";
  // const commonURL = `/wms/CommercialInvoice/GetCommercialInvoiceLanding?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc&channelId=${channelId}`;

  const urlForSomeSelectedUnit = `/oms/OManagementReport/GetSalesInvoiceLanding?BusinessunitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${searchTerm}&channelId=${channelId}`;

  try {
    const res = await axios.get(
      // [186, 175, 4, 94, 8, 138].includes(buId)
      //   ? urlForSomeSelectedUnit
      //   : commonURL
      urlForSomeSelectedUnit
    );
    setLoading(false);
    setter(res?.data);
  } catch (error) {
    setLoading(false);
    toast.warn(error?.response?.data?.message);
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

export const createCommercialInvoice = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/wms/CommercialInvoice/CreateCommercialInvoice`,
      payload
    );
    setLoading(false);
    cb();
    toast.success(res?.data?.message);
    // setter(res?.data);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
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

export const getPartnerInfoByOrder = async (orderId, setter, setFieldValue) => {
  try {
    const res = await axios.get(
      `/wms/CommercialInvoice/GetPartnerInfoByOrder?OrderId=${orderId}`
    );
    setter(res?.data);
    setFieldValue("purchaseDate", _dateFormatter(res?.data?.pricingDate));
  } catch (error) {
    console.log(error);
  }
};

export const getInvoiceDataByDate = async (
  accId,
  buId,
  fromDate,
  toDate,
  customerId,
  ref,
  location,
  setDisabled,
  setter
) => {
  try {
    setDisabled(true);

    const readyMix = `/oms/OManagementReport/GetInvoiceByDate?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&customerid=${customerId}&reference=${ref}&projLocation=${location}`;

    const bluePill = `/oms/OManagementReport/GetInvoiceByCustomer?accountId=${accId}&businessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&customerid=${customerId}&reference=${ref}&projLocation=${location}`;

    const res = await axios.get([94, 175].includes(buId) ? readyMix : bluePill);
    if (res?.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const createSalesInvoice = async (
  buId,
  payload,
  setDisabled,
  setter,
  cb
) => {
  try {
    setDisabled(true);

    const bluePill = `/oms/OManagementReport/CreateSalesInvoiceByCustomer`;
    const readyMix = `/oms/OManagementReport/CreateSalesInvoice`;
    const polyFibre = `/oms/OManagementReport/CreateSalesInvoiceByPO`;

    const res = await axios.post(
      [4, 186]?.includes(buId)
        ? bluePill
        : [8].includes(buId)
        ? polyFibre
        : readyMix,
      payload
    );
    if (res?.status === 200) {
      setDisabled(false);
      setter(res?.data);
      toast.success(res?.data?.message);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const createSalesInvoiceNew = async (
  payload,
  setDisabled,
  setter,
  cb
) => {
  try {
    setDisabled(true);

    const api = `/oms/OManagementReport/CreateSalesInvoiceByCustomer`;

    const res = await axios.post(api, payload);
    if (res?.status === 200) {
      setDisabled(false);
      setter(res?.data);
      toast.success(res?.data?.message);
      cb();
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const cancelSalesInvoice = async (
  accId,
  buId,
  invoiceId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/oms/OManagementReport/CancelSalesInvoice?BusinessUnitId=${buId}&AccountId=${accId}&SalesInvoiceId=${invoiceId}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getEmployeeList = async (accId, buId, setter, setLoading) => {
  setLoading(true);
  try {
    const unitId = buId === 138 ? 186 : buId;
    const res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${unitId}`
    );
    setter(
      res?.data?.map((element) => ({ ...element, label: element?.labelCode }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getInvoiceDataForPrint = async (
  buId,
  invoiceNo,
  partnerId,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/oms/OManagementReport/ReprintSalesInvoice?unitId=${buId}&InvoiceNo=${invoiceNo}&PartnerId=${partnerId}`
    );
    cb(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
