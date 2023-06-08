import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";

// Validation schema
export const ValidationSchema = Yup.object().shape({
  partner: Yup.object().shape({
    label: Yup.string().required("Partner is required"),
    value: Yup.string().required("Partner is required"),
  }),
  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),
});

export const getLandingPaginationData = async (
  accId,
  buId,
  fromDate,
  toDate,
  partnerId,
  searchValue,
  pageNo,
  pageSize,
  setter
) => {
  const searchQuery = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await Axios.get(
      `/asset/AssetRentInvoice/GetAssetRentInvoiceLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&fromDate=${fromDate}&toDate=${toDate}&BusinessPartnerId=${partnerId}${searchQuery}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBusinessPartnerDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=2`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getSBUListDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/Disbursement/GetSbuDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getAssetRentInfoForInvoice = async (
  buId,
  sbuId,
  partnerId,
  date,
  setLoading,
  setter
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/asset/AssetRent/GetAssetRentInfoForInvoice?BusinessUnitId=${buId}&BusinessPartnerId=${partnerId}&SbuId=${sbuId}&RequestDate=${date}`
    );
    setter(res?.data?.map((item) => ({ ...item, isSelect: false })));
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const saveAssetRentInvoice = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/asset/AssetRentInvoice/CreateRentInvoice`,
      data
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getAssetRentInvoiceById = async (
  id,
  setHeader,
  setRowDto,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/asset/AssetRentInvoice/GetRentInvoiceById?RentInvoiceId=${id}`
    );
    const {
      businessPartnerId,
      businessPartnerName,
      invoiceDate,
      isClosed,
      rentInvoiceCode,
      rentInvoiceId,
      sbuId,
      sbuName,
      totalCollectionAmount,
      totalInvoiceAmount,
      salesOrganizationId,
      salesOrganizationName,
    } = res?.data?.objGet ? res?.data?.objGet : {};
    const modifyData = {
      date: _dateFormatter(invoiceDate),
      partner: {
        label: businessPartnerName,
        value: businessPartnerId,
      },
      sbu: {
        label: sbuName,
        value: sbuId,
      },
      salesOrganization: {
        label: salesOrganizationName,
        value: salesOrganizationId,
      },
      isClosed,
      rentInvoiceCode,
      rentInvoiceId,
      totalCollectionAmount,
      totalInvoiceAmount,
    };

    setRowDto(res?.data?.objRowList);
    setHeader(modifyData);
    setLoading(false);
  } catch (error) {
    // setter([]);
    setLoading(false);
  }
};

export const collectPayment = async (invoiceId, userId, amount, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/asset/AssetRentInvoice/EditAssetRentInvoicePaymentCollection?RentAssetInvoiceId=${invoiceId}&PaymentAmount=${amount}&ActionBy=${userId}`
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getSalesOrgList = async (
  accId,
  buId,
  sbuId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/oms/SalesOrder/GetSODDLbySBUId?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
