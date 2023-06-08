import axios from "axios";
import { toast } from "react-toastify";

export const getPurchaseInvoiceDDL_api = async (setter) => {
  try {
    const res = await axios.get("/vat/TaxDDL/PurchaseInvoiceDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getItemNameDDL = async (headerId, setter) => {
  try {
    if (headerId) {
      const res = await axios.get(
        `/vat/TaxPurchase/GetTaxPurchaseItemDetailsALL?taxPurchaseHeaderId=${headerId}`
      );

      if (res.status === 200 && res.data) {
        setter(res.data);
      }
    }
  } catch (error) {}
};

export const getFiscalYearDDL_api = async (setter) => {
  try {
    const res = await axios.get("/vat/TaxDDL/FiscalYearDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getTaxBranchDDL_api = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const creditNoteLandingPasignation_api = async (
  branchId,
  fromDate,
  toDate,
  setter,
  pageNo,
  pageSize,
  searchValue
) => {
  const searchPath = searchValue ? `search=${searchValue}&` : "";
  try {
    const res = await axios.get(
      `/vat/CreditNoteSupplierBalanceIncrease/GetCreditNoteSupplierbalanceIncreseLanding?${searchPath}&BranchId=${branchId}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc&Transactiondate=${fromDate}`
    );
    // const res = await axios.get(
    //   `/vat/CreditNoteSupplierBalanceIncrease/GetCreditNoteSupplierbalanceIncreseLanding?${searchPath}BranchId=${branchId}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc`
    // );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getTaxItemByPurchaseInvoiceId_api = async (invoiceId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxItemByPurchaseInvoiceId?SalesInvoiceId=${invoiceId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getBusinessPartnerbyIdDDL_api = async (
  accId,
  buId,
  partnerTypeId,
  setter
) => {
  try {
    const res = await axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=${partnerTypeId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getTaxPurchaseItemDetailsSingle_api = async (
  itemGroupId,
  PurchaseCode,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseItemDetailsByTaxItemGroupId?taxItemGroupId=${itemGroupId}&TaxPurchaseCode=${PurchaseCode}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getTaxPurchaseItemDetailsALL_api = async (
  PurchaseCode,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseItemDetailsALL?TaxPurchaseCode=${PurchaseCode}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getCreditNoteSupplierBalancById = async (
  taxPurchaseId,
  accId,
  buId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/vat/CreditNoteSupplierBalanceIncrease/GetCreditNoteSupplierBalanceIncreaseById?TaxPurchaseId=${taxPurchaseId}&AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const ereateCreditNote_api = async (
  payload,
  cb,
  setRowDto,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      "/vat/CreditNoteSupplierBalanceIncrease/CreateCreditNoteSupplierBalancencrease",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setRowDto([]);
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const getPurchaseInvoiceDDL = async (partnerId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/PurchaseInvoiceDDL?partnerId=${partnerId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
