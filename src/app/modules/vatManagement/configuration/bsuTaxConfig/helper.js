import Axios from "axios";
import { toast } from "react-toastify";
import { _todayDate } from "../../../_helper/_todayDate";

export const getTaxCircle_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxCircleDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getTaxZone_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxZoneDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBusinessUnit_api = async (accountId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetBusinessUnitByAccIdDDL?AccountId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getRepresentative_api = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getRepresentativeRank_api = async (
  accountId,
  buId,
  employeeId,
  setter,
  setFieldValue
) => {
  try {
    const res = await Axios.get(
      `domain/EmployeeBasicInformation/GetEmployeeByEmpIdDDL?AccountId=${accountId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data.map((itm) => {
        return {
          ...itm,
          value: itm?.employeeDesignationnId,
          label: itm?.employeeDesignatioName,
        };
      });
      setter(newData);
      setFieldValue("representativeRankDDL", {
        value: res?.data[0]?.employeeDesignationnId,
        label: res?.data[0]?.employeeDesignatioName,
      });
    }
  } catch (error) {}
};

export const GetBusinessUnitTaxInfoPagination = async (
  accountId,
  buId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/vat/BusinessUnitTaxInfo/GetBusinessUnitTaxInfoPagination?accountId=${accountId}&businessUnitId=${buId}&status=true&PageNo=1&PageSize=100&viewOrder=desc`
    );
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data?.data);
    }
  } catch (error) {}
};

export const GetBusinessUnitTaxView = async (buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/BusinessUnitTaxInfo/GetBusinessUnitTaxInfoById?BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];
      const newData = {
        ...data,
        taxZoneDDL: {
          value: data?.taxZoneId,
          label: data?.taxZoneName,
        },
        taxCircleDDL: {
          value: data?.taxCircleId,
          label: data?.taxCircleName,
        },
        representativeDDL: {
          value: data?.representativeId,
          label: data?.representativeName,
        },
        representativeRankDDL: {
          value: data?.representativeRank,
          label: data?.representativeRank,
        },
        representativeAddress: data.representativeAddress,
        returnSubmissionDate: _todayDate(),
        binNo: data?.binNo,
        taxBracket: {
          value: data?.taxBracketId,
          label: data?.taxBracketName,
        },
        economicActivityName: data?.economicActivityName,
        businesUnitAddress: data?.businessUnitAddress,
        ownerShipType: {
          value: data?.typeOfOwnership,
          label: data?.typeOfOwnershipName
        },
        vatDeductionSourceTax : data?.isVatDeductionSourceTax,
        surchargeType: {
          value: data?.surchargeTypeId,
          label: data?.surchargeTypeName
        },
        businessNature: {
          value: data?.businessUnitNatureTypeId,
          label: data?.businessUnitNatureTypeName
        }
      };
      setter(newData);
    }
  } catch (error) {}
};
// double buTax
export const saveBusinessUnitTaxInfo = async (data, cb, setSingleData) => {
  try {
    const res = await Axios.post(
      `/vat/BusinessUnitTaxInfo/CreateBusinessUnitTaxInfo`,
      data
    );
    GetBusinessUnitTaxView(res?.data?.key, setSingleData);
    toast.success(res.data?.message || "Submitted successfully", {
      toastId: "saveBuTaxConfigAction",
    });
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getTaxBracketDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/TaxBracketDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSurchargeTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetSurchargeTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
export const getBusinessNaturetypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetBusinessNaturetypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};
