import * as Yup from "yup";
import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const validationSchema = Yup.object().shape({
  lCno: Yup.string().required("LC No is required"),
  lCdate: Yup.string().required("LC Date is required"),
  supplierCountry: Yup.object().required("Supplier Country is required"),
  bankName: Yup.object().required("Bank Name is required"),
  branchName: Yup.object().required("Branch Name is required"),
  shipName: Yup.string().required("Ship Name is required"),
  color: Yup.string().required("Color is required"),
  allotmentRefNo: Yup.string().required("Allotment Ref No is required"),
  allotmentRefDate: Yup.string().required("Allotment Ref Date is required"),
});

export const getSupplierCountryDDL = async (setter) => {
  try {
    const res = await Axios.get(`/oms/TerritoryInfo/GetCountryDDL`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getLCNoDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBankNameDDL = async (setter) => {
  try {
    const res = await Axios.get(`/costmgmt/BankAccount/GETBankDDl`);
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const getBranchNameDDL = async (bId, cId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/BankAccount/GETBankBranchDDl?BankId=${bId}&CountryId=${cId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const CreatePartnerProductAllocationLcInfo = async (
  data,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/partner/PartnerAllotmentHeader/CreatePartnerAllotmentHeader`,
      data
    );
    toast.success(res?.data?.message || "Submitted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const EditPartnerProductAllocationLcInfo = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/partner/PartnerAllotmentHeader/EditPartnerAllotmentHeader`,
      data
    );
    toast.success(res?.data?.message || "Updated Successfully");
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetPartnerProductAllocationLcInfoLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/partner/PartnerAllotmentHeader/GetPartnerAllotmentHeaderLanding?AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter({ data: [] });
    setLoading(false);
  }
};

export const GetPartnerProductAllocationLcInfoById = async (
  id,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const { data } = await Axios.get(
      `/partner/PartnerAllotmentHeader/GetPartnerAllotmentHeader?AutoId=${id}
      `
    );
    const modifyData = {
      lCno: {
        value: data?.lCno,
        label: data?.lCno,
      },
      lCdate: _dateFormatter(data?.lCdate),
      supplierCountry: {
        value: data?.supplierCountryId,
        label: data?.supplierCountry,
      },
      bankName: {
        value: data?.bankId,
        label: data?.bankName,
      },
      branchName: {
        value: data?.branchId,
        label: data?.branchName,
      },
      shipName: data?.shipName,
      color: data?.color,
      allotmentRefNo: data?.allotmentRefNo,
      allotmentRefDate: _dateFormatter(data?.allotmentRefDate),
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getLcDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/imp/ImportCommonDDL/GetLCDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
  }
};
