import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const GetProdutionPagination = async (
  accountId,
  buId,
  fromDate,
  toDate,
  TaxBranchId,
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
      `/vat/ProductionInvoice/ProductionInvoiceSearchLandingPasignationByDate?${searchPath}AccountId=${accountId}&BusinessUnitId=${buId}&StartDate=${fromDate}&EndDate=${toDate}&TaxBranchId=${TaxBranchId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetProductionView = async (TaxPurchaseId, setter, setRowDto) => {
  try {
    const res = await Axios.get(
      `/vat/ProductionInvoice/GetProductionInvoiceById?TaxPurchaseId=${TaxPurchaseId}
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const newData = {
        objHeader: {
          ...data?.objHeader,
          branchName: {
            value: data?.objHeaderDTO?.taxBranchId,
            label: data?.objHeaderDTO?.taxBranchName,
          },
          branchAddress: data?.objHeaderDTO?.taxBranchAddress,
          transactionType: {
            value: data?.objHeaderDTO?.taxTransactionTypeId,
            label: data?.objHeaderDTO?.taxTransactionTypeName,
          },
          transactionDate: _dateFormatter(data?.objHeaderDTO?.transactionDate),
          referanceNo: data?.objHeaderDTO?.referanceNo,
          referenceDate: _dateFormatter(data?.objHeaderDTO?.referanceDate),
        },
        objRow: [...data?.objListRowDTO],
      };
      const newRowDto = newData?.objRow.map((item) => ({
        rowId: item?.rowId,
        itemName: item?.taxItemGroupName,
        itemId: item?.taxItemGroupId,
        quantity: item?.quantity,
        uomName: item?.uomname,
        uomId: item?.uomid,
        basePrice: item?.invoicePrice,
        sd: item?.sdtotal,
        vat: item?.vatTotal,
        surcharge: item?.numSurchargeTotal,
        totalAmount: item?.grandTotal,
      }));
      setRowDto(newRowDto);
      setter(newData);
    }
  } catch (error) {}
};

export const saveProduction = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/vat/ProductionInvoice/CreateProductionInvoice`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const saveEditedProduction = async (data, setDisabled) => {
  try {
    setDisabled(true);
    const res = await Axios.put(
      `/vat/ProductionInvoice/EditProductioninvoice`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
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
  } catch (error) {}
};

export const getTransactionTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTransactionTypeDDL`);
    if (res.status === 200 && res?.data) {
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

export const CancelProductionEntry_api = async (
  purchaseId,
  setDisabled,
  cb
) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/vat/ProductionInvoice/CancelProductionEntry?TaxPurchaseId=${purchaseId}`
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
