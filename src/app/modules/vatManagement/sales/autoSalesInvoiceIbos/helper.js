import Axios from 'axios';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import { _dateFormatter } from './../../../_helper/_dateFormate';
//getTaxBranchDDL_api
export const getTaxBranchDDL_api = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res?.data?.length > 0) {
      const modify = res?.data;
      const all = {
        value: 0,
        label: 'All',
      };
      modify.unshift(all);
      setter(modify);
    }
  } catch (error) {
    setter([]);
  }
};
//getShipPointByBranchId_api
export const getShipPointByBranchId_api = async (
  accId,
  buId,
  taxBranchId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/getShipPointByBranchId?AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${taxBranchId}`
    );
    setter(res?.data);
  } catch (error) {}
};
//getTaxPendingDeliveryList_api
export const getTaxPendingDeliveryList_api = async (
  accId,
  buId,
  shippointId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/getTaxPendingDeliveryList?AccountId=${accId}&BusinessUnitId=${buId}&ShippointId=${shippointId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//GetDeliveryInfoByDeliveryNum
export const getDeliveryInfoByDeliveryNum_api = async (
  accId,
  buId,
  deliveryCode,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoiceIbos/GetDeliveryInfoByDeliveryNum?AccountId=${accId}&BusinessUnitId=${buId}&DeliveryCode=${deliveryCode}`
    );
    if (res.status === 200 && res?.data) {
      setFieldValue('shiptoPartnerAddress', res?.data[0]?.shipToPartnerAddress);
      setFieldValue('vehicleNo', res?.data[0]?.deliveryCode);
      setFieldValue(
        'actualDeliveryDate',
        _dateFormatter(res?.data[0]?.deliveryDate)
      );
    }
  } catch (error) {}
};
//GetManualTaxSalesInvoiceById
export const GetManualTaxSalesInvoiceById = async (taxSalesId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetManualTaxSalesInvoiceById?TaxSalesId=${taxSalesId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

//create CreateSalesInvoiceIbos_api
export const createSalesInvoiceIbos_api = async (
  data,
  cb,
  setTaxSalesInvoiceById,
  setModelShow
) => {
  try {
    const res = await Axios.post(
      `/vat/TaxSalesInvoiceIbos/CreateSalesInvoiceIbos`,
      data
    );
    if (res.status === 200) {
      toast.success('Submitted Successfully', {
        toastId: shortid(),
      });
      cb();
      GetManualTaxSalesInvoiceById(res?.data?.key, setTaxSalesInvoiceById);
      setModelShow(true);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const AutoTaxCompleteApi = async (deliveryId, buid, setLoading, cb) => {
  try {
    setLoading(true);
    const res = await Axios.put(
      `/vat/SalesInformationReport/AutoTaxComplete?deliveryId=${deliveryId}&BusinessUnitId=${buid}`
    );
    if (res.status === 200) {
      setLoading(false);
      toast.success('Submitted Successfully', {
        toastId: shortid(),
      });
      cb();
    }
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

//create createAutoSalesInvoiceiBOSPrint
export const createAutoSalesInvoiceiBOSPrint_api = async (
  data,
  setTaxSalesInvoiceById,
  setModelShow,
  updateRowDto,
  setRowDto,
  setLoading
) => {
  setRowDto && setLoading(true);
  try {
    const res = await Axios.post(
      `/vat/TaxSalesInvoiceIbos/CreateSalesInvoiceIbosManual`,
      data
    );
    setRowDto && setLoading(false);
    if (res.status === 200) {
      toast.success('Submitted Successfully', {
        toastId: shortid(),
      });
      GetManualTaxSalesInvoiceById(res?.data?.key, setTaxSalesInvoiceById);
      setModelShow(true);
      setRowDto(updateRowDto);
    }
    setRowDto && setLoading(false);
  } catch (error) {
    setRowDto && setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

//GetSalesInvoiceIbosPagination
export const getManualSalesInvoiceIbos = async (
  accId,
  buId,
  taxBranchId,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : '';

    const res = await Axios.get(
      `/vat/TaxSalesInvoiceIbos/GetManualSalesInvoiceIbosSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&taxBranchId=${taxBranchId}&status=true&fromdate=${fromDate}&todate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

//GetTaxSalesInvoiceList
export const GetTaxSalesInvoiceListApi = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesInvoiceList?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getSalesInvoiceIbosSearchPaginationShippointId = async (
  accId,
  buId,
  shippointId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : '';

    const res = await Axios.get(
      `/vat/TaxSalesInvoiceIbos/GetSalesInvoiceIbosSearchPaginationShippointId?${searchPath}accountId=${accId}&businessUnitId=${buId}&shippointId=${shippointId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetDetailTaxPendingDeliveryListAuto = async (
  accId,
  buId,
  shippointId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `search=${search}&` : '';

    const res = await Axios.get(
      `/vat/TaxDDL/GetDetailTaxPendingDeliveryListAuto?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&ShippointId=${shippointId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const GetTaxSalesInvoicePrintStatus_api = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoiceIbos/GetTaxSalesInvoicePrintStatus?TaxSalesInvoiceId=${id}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};
