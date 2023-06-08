import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getVatBranches_api = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getContractManufactureById_api = async (taxId, typeId, setter) => {
  try {
    const res = await axios.get(
      `/vat/ContractManufacture/GetContractManufactureById?TaxId=${taxId}&TypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      // typeId 1 (row)
      if (+typeId === 1) {
        const typeOneData = res?.data?.getTaxPurchaseCommonDTO?.objHeaderDTO;
        const obj = {
          objHeaderDTO: {
            ...typeOneData,
            type: { value: 1, label: "Raw" },
            partner: {
              value: typeOneData?.supplierId,
              label: typeOneData?.supplierName,
              address: typeOneData?.supplierAddress,
            },
            transactionDate: _dateFormatter(typeOneData?.purchaseDateTime),
          },
          objListRowDTO: res?.data?.getTaxPurchaseCommonDTO?.objListRowDTO,
        };
        setter(obj);
      } else {
        const typeOneData = res?.data?.getTaxSalesCommonDTO?.objHeader;
        const obj = {
          objHeaderDTO: {
            ...typeOneData,
            type: { value: 2, label: "FG" },
            partner: {
              value: typeOneData?.soldtoPartnerId,
              label: typeOneData?.soldtoPartnerName,
              address: typeOneData?.soldtoPartnerAddress,
            },
            transactionDate: _dateFormatter(typeOneData?.deliveryDateTime),
          },
          objListRowDTO: res?.data?.getTaxSalesCommonDTO?.objList,
        };
        setter(obj);
      }
    }
  } catch (error) {}
};
export const getContractManufacturePagination_api = async (
  accId,
  buid,
  branchId,
  fromDate,
  toDate,
  pageNo,
  pageSize,
  typeId,
  setter,
  setLoading
) => {
  try {
    setLoading && setLoading(true);
    const res = await axios.get(
      `/vat/ContractManufacture/GetContractManufacturePagination?accountId=${accId}&businessUnitId=${buid}&TaxBranchId=${branchId}&FromDate=${fromDate}&ToDate=${toDate}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&TypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading && setLoading(false);
      +typeId === 1
        ? setter(res?.data?.getTaxPurchaseLandingPagination)
        : setter(res?.data?.getTaxSalesLandingPagination);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const getTaxItem_api = async (accid, buid, typeId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxItemListByContractManufactureTypeDDL?AccountId=${accid}&BusinessUnitId=${buid}&TypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getPartnerDDL_api = async (accId, buId, partnerType, setter) => {
  try {
    const res = await axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=${partnerType}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createContractManufacture_api = async (
  payload,
  cb,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.post(
      "/vat/ContractManufacture/CreateContractManufacture",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const editContractManufacture_api = async (payload, setDisabled) => {
  setDisabled(true);
  try {
    const res = await axios.put(
      "/vat/ContractManufacture/EditContractManufacture",
      payload
    );
    if (res.status === 200) {
      toast.success(res?.data?.message || "Submitted Successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editContractManufacturePrintStatus_api = async (
  taxId,
  typeId
) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const res = await axios.post(
      `/vat/ContractManufacture/EditContractManufacturePrintStatus?TaxId=${taxId}&TypeId=${typeId} `
    );
  } catch (error) {
    toast.error(error?.response?.data?.message);
    
  }
};
