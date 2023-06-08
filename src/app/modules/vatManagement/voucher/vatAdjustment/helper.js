import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import shortid from "shortid";
//Get Tax Transaction Type List DDL
export const getTaxTransactionTypeListDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxTransactionTypeListDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//Get Tax Branch DDL
export const getTaxBranchDDL = async (userId, accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//Get TaxAdjustmentType
export const getTaxAdjustmentType_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/AdjustmentType/GetTaxAdjustmentType`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//Get Tax Component DDL
export const getTaxComponentDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxComponentDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
//create vat adjustment
export const createVatAdjustment = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/vat/VatAdjustment/CreateVatAdjustment`,
      data
    );
    if (res.status === 200) {
      toast.success("Submitted Successfully", {
        toastId: shortid(),
      });
      cb();
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};
//vat adjustment landing pagination
export const getVatAdjustmentLandingPasignation = async (
  accId,
  buId,
  taxBranchId,
  setter,
  pageNo,
  pageSize,
  setLoading,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    const res = await Axios.get(
      `/vat/VatAdjustment/VatAdjustmentSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${taxBranchId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200) {
      setter(res?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
// get vat adjustment by id
export const getVatAdjustmentById = async (adjustmentId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/VatAdjustment/GetVatAdjustmentById?AdjustmentId=${adjustmentId}`
    );
    if (res.status === 200 && res?.data) {
      let newData = {
        ...res?.data,
        taxBranchName: {
          value: res?.data?.taxBranchId,
          label: res?.data?.taxBranchName,
        },
        adjustmentPurpose: {
          value: res?.data?.adjustmentPurposeId,
          label: res?.data?.adjustmentPurposeName,
        },
        taxBranchAddress: res?.data?.taxBranchAddress,
        taxTransactionType: {
          value: res?.data?.taxTransactionTypeId,
          label: res?.data?.taxTransactionTypeName,
        },
        componentName: {
          value: res?.data?.componentId,
          label: res?.data?.componentName,
        },
        adjustmentDate: _dateFormatter(res?.data?.adjustmentDate),
        adjustmentType: {
          value: res?.data?.adjustmentTypeId,
          label: res?.data?.adjustmentTypeName,
        },
      };
      setter(newData);
    }
  } catch (error) {}
};
// edit vat adjustment
export const editVatAdjustment = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(`/vat/VatAdjustment/EditVatAdjustment`, data);
    if (res.status === 200) {
      toast.success(res?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
  }
};
