import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";

export const GetCreditNotePasignation = async (
  accId,
  buId,
  branchId,
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
    const searchPath = search ? `searchTerm=${search}&` : "";
    const res = await Axios.get(
      `/vat/CreditNote/CreditNoteLandingSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${branchId}&fromDate=${fromDate}&toDate=${toDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetCreditNoteSingleData = async (
  taxSalesId,
  setter,
  setRowDto
) => {
  try {
    const res = await Axios.get(
      `/vat/CreditNote/GetCreditNoteById?TaxSalesId=${taxSalesId}
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newRowDto = data?.objRowList?.map((item) => ({
        ...item,
        itemName: {
          label: item?.taxItemGroupName,
          value: item?.taxItemGroupId,
        },
        salesAmount: item?.grandTotal,
        salesSd: item?.sdtotal,
        salesVat: item?.vatTotal,
        returnQty: item?.quantity,
        returnVat: item?.vatTotal,
        returnSd: item?.sdtotal,
        uomid: item?.uomid,
        uomname: item?.uomname,
        rowId: item?.rowId,
      }));

      if (newRowDto.length > 0) {
        const newData = {
          objHeader: {
            ...data?.objHeader,
            branchName: {
              value: data?.objHeader?.taxBranchId,
              label: data?.objHeader?.taxBranchName,
            },
            fiscalYear: {
              value: data?.objHeader?.fisaclYear,
              label: data?.objHeader?.fisaclYear,
            },
            salesInvoice: {
              value: data?.objHeader?.taxSalesId,
              label: data?.objHeader?.taxSalesCode,
            },
            itemName: {
              value: data?.objHeader?.taxItemGroupId,
              label: data?.objHeader?.taxItemGroupName,
            },
          },
          objRow: newRowDto,
        };
        setRowDto(newRowDto);

        setter(newData);
      }
    }
  } catch (error) {}
};

export const saveCreditNote = async (data, cb, setDisabled) => {
  window.payload = data;
  setDisabled(true);
  try {
    const res = await Axios.post(`/vat/CreditNote/CreateCreditNote`, data);
    if (res.status === 200) {
      toast.success("Submitted Successfully", {
        toastId: shortid(),
      });
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editCreditNote = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/vat/CreditNote/EditCreditNote`, data);
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getTaxBranchDDL_api = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getPartnerNameDDL_api = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accid}&BusinessUnitId=${buid}&PartnerTypeId=2`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

//getPurchaseInvoiceDDl
export const getPurchaseInvoiceDDl = async (partnerId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/SalesInvoiceDDL?partnerId=${partnerId}`
    );
    if (res.status === 200 && res.data) {
      setter(res.data);
    }
  } catch (error) {}
};

export const getViewData_api = async (accId, buId, salesId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/CreditNote/GetSalesInfoBySalesId?AccountId=${accId}&BusinessUnitId=${buId}&SalesID=${salesId}`
    );
    if (res.status === 200 && res?.data) {
      // console.log(res)
      setter(res?.data);
    }
  } catch (error) {}
};

export const getItemNameDDL_api = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/ItemNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getFiscalYearDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/FiscalYearDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSalesInvoiceByBranchIdDDL_api = async (
  accId,
  buId,
  taxBranchId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/SalesInvoiceByBranchIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${taxBranchId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getAmountSdVat = async (grpId, codeValue, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesItemDetailsByTaxItemGroupId?taxItemGroupId=${grpId}&TaxSalesId=${codeValue}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.length > 0) {
        setter("salesAmount", res?.data[0]?.grandTotal);
        setter("salesSd", res?.data[0]?.sdtotal);
        setter("salesVat", res?.data[0]?.vatTotal);
        setter("uomid", res?.data[0]?.uomid);
        setter("uomname", res?.data[0]?.uomname);
        setter("quantity", res?.data[0]?.quantity);
      } else {
        toast.warning("Data not found");
      }
    }
  } catch (error) {}
};

export const getAllItemDetails = async (id, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxSalesInvoice/GetTaxSalesItemDetailsALL?TaxSalesId=${id}`
    );
    if (res.status === 200 && res?.data) {
      let payload = res?.data?.map((item) => {
        return {
          value: item?.taxItemGroupId,
          label: item?.taxItemGroupName,
          uomid: item?.uomid,
          uomname: item?.uomname,
          quantity: item?.quantity,
          sdtotal: item?.sdtotal,
          subTotal: item?.subTotal,
          vatTotal: item?.vatTotal,
          grandTotal: item?.grandTotal,
          isFree: item?.isFree,
          isActive: item?.isActive,
        };
      });
      setter(payload);
    }
  } catch (error) {}
};
