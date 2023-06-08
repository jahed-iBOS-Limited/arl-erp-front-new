import Axios from "axios";
import { toast } from "react-toastify";

export const GetAllGLExtendPagination = async (
  accountId,
  busId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/partner/GeneralLedgerExtend/GeneralLedgerExtendLandingPagination?AccountId=${accountId}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}&BusinessUnitId=${busId}`
    );
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data?.data);
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetVatItemView = async (taxItemGroupId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupById?taxItemGroupId=${taxItemGroupId}
      `
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data[0];
      const newData = {
        ...data,
        taxItemTypeId: {
          value: data.taxItemTypeId,
          label: data.taxItemTypeName,
        },
        taxItemCategoryId: {
          value: data.taxItemCategoryId,
          label: data.taxItemCategoryName,
        },
        supplyTypeId: {
          value: data.supplyTypeId,
          label: data.supplyTypeName,
        },
        hsCode: {
          value: data.hsCode,
          label: data.hsCode,
        },
        uomName: {
          value: data.uomId,
          label: data.uomName,
        },
        businessUnitId: {
          value: data.businessUnitId,
          label: data.businessUnitName,
        },
        itemTypeId: {
          value: data?.taxItemTypeId,
          label: data?.taxItemTypeName,
        },
      };
      setter(newData);
    }
  } catch (error) {}
};
export const getPermissionBuID_api = async (userId, accountId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${accountId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = data.map((item) => {
        return {
          value: item.organizationUnitReffId,
          label: item.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

export const saveAllGlExtend = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/partner/GeneralLedgerExtend/CreateGeneralLedgerExtend`,
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
