import axios from "axios";
import { toast } from "react-toastify";

export const getFiscalYearDDL = async (setter) => {
  try {
    const res = await axios.get("/vat/TaxDDL/FiscalYearDDL");

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    //
  }
};

export const getTaxBranchDDL = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {
    // toast.warn(error.message);
  }
};

export const getItemNameDDL = async (headerId, setter) => {
  console.log("getting headerId", headerId);
  try {
    if (headerId) {
      const res = await axios.get(
        `/vat/TaxDDL/GetTaxItemBySalesInvoiceId?SalesInvoiceId=${headerId}`
      );

      console.log("response", res);

      if (res.status === 200 && res.data) {
        setter(res.data);
        // console.log(res.data);
      }
    }
  } catch (error) {
    //
  }
};

export const getPartnerDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=2`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getGridData = async (
  branch,
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
    const searchPath = search ? `search=${search}&` : "";

    const res = await axios.get(`/vat/DebitNoteCustBalanceIncrease/GetDebitNoteCustomerbalanceIncreseLanding?${searchPath}TaxBranchId=${branch}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&Fromdate=${fromDate}&Todate=${toDate}
    `);

    if (res.status === 200 && res.data) {
      setter(res.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getSalesInvoiceDDL = async (partnerId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/SalesInvoiceDDL?partnerId=${partnerId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};
export const getSingleItemDetails = async (itemId, salesInvoiceId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesItemDetailsByTaxItemGroupId?taxItemGroupId=${itemId}&TaxSalesId=${salesInvoiceId}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
      console.log(res.data);
    }
  } catch (error) {}
};

export const getAllItemDetails = async (id, setter) => {
  try {
    if (id) {
      const res = await axios.get(
        `/vat/TaxSalesInvoice/GetTaxSalesItemDetailsALL?TaxSalesId=${id}`
      );

      if (res.status === 200 && res.data) {
        setter(res.data);
      }
    }
  } catch (error) {}
};

export const createDebitNoteCustomerBlncIncrease = async (
  payload,
  cb,
  setDisabled
) => {
  console.log(payload);
  setDisabled(true);
  try {
    const res = await axios.post(
      `/vat/DebitNoteCustBalanceIncrease/CreateDebitNoteCustomerBalanceIncrease`,
      payload
    );

    if (res.status === 200) {
      toast.success("Successfully Created");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    //
  }
};

export const editDebitNoteCustomerBlncIncrease = async (
  payload,
  cb,
  setDisabled
) => {
  setDisabled(true);
  console.log(payload);
  try {
    const res = await axios.put(
      `/vat/DebitNoteCustBalanceIncrease/EditDebitNoteCustomerBalanceIncrease`,
      payload
    );

    if (res.status === 200) {
      toast.success("Edited Successfully");
      // cb();
      setDisabled(false);
    }
  } catch (error) {
    console.log(error);
    setDisabled(false);
  }
};

export const getShipToPartnerInfo = async (accId, buId, challan, setter) => {
  try {
    const res = await axios.get(
      `/vat/VatMgtCommonProcess/GetShipToSoldToPartnerInfoByChallanNo?AccountId=${accId}&BusinessUnitId=${buId}&ChallanNo=${challan}`
    );

    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getItemById = async (id, accId, buId, setter1, setter2) => {
  try {
    const res = await axios.get(
      `/vat/DebitNoteCustBalanceIncrease/GetDebitNoteCustomerBalanceIncreaseById?TaxSalesId=${id}&AccountId=${accId}&BusinessUnitId=${buId}`
    );

    if (res.data) {
      setter1(res?.data.objrow);
      setter2(res?.data.objHeader);
    }
  } catch (error) {}
};
