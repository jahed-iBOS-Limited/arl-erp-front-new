import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { _dateFormatter } from "../../../_helper/_dateFormate";

// Validation schema
export const SaveInventoryLoanValidationSchema = Yup.object().shape({
  partner: Yup.object().shape({
    label: Yup.string().required("Partner is required"),
    value: Yup.string().required("Partner is required"),
  }),

  asset: Yup.object().shape({
    label: Yup.string().required("Asset is required"),
    value: Yup.string().required("Asset is required"),
  }),

  sbu: Yup.object().shape({
    label: Yup.string().required("SBU is required"),
    value: Yup.string().required("SBU is required"),
  }),

  currency: Yup.object().shape({
    label: Yup.string().required("Currency is required"),
    value: Yup.string().required("Currency is required"),
  }),

  toDate: Yup.object().when("rentType", {
    is: 3,
    then: Yup.object()
      .shape({
        value: Yup.string().required("This field is required"),
        label: Yup.string().required("This field is required"),
      })
      .typeError("This Field is required"),
    otherwise: Yup.object(),
  }),

  rentRate: Yup.string().required("Rent is required"),
  currConversationRate: Yup.string().required("This fields is required"),
});

export const getLandingPaginationData = async (
  accId,
  buId,
  partnerId,
  searchValue,
  pageNo,
  pageSize,
  setter
) => {
  const searchQuery = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await Axios.get(
      `/asset/AssetRent/GetAssetRentInfoLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&BusinessPartnerId=${partnerId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc${searchQuery}`
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

export const getAssetDDL = async (accId, buId, sbuId, setter) => {
  try {
    const res = await Axios.get(
      `/asset/DropDown/GetAssetBySbuIdDDL?accountId=${accId}&businessUnitId=${buId}&SbuId=${sbuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (err) {
    setter([]);
  }
};

export const getCurrencyDDL = async (setter) => {
  try {
    const res = await Axios.get(`/domain/Purchase/GetBaseCurrencyList`);
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

export const saveAssetRent = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await Axios.post(
      `/asset/AssetRent/CreateAssetRentInfo`,
      payload
    );
    if (res.status === 200 && res?.data) {
      toast.success(res.data?.message, { toastId: 1234 });
      setLoading(false);
      cb();
    }
  } catch (err) {
    setLoading(false);
    toast.warning(err?.message || err?.response?.data?.message, {
      toastId: 12355,
    });
  }
};

export const editAssetRent = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(`/asset/AssetRent/EditAssetRentInfo`, payload);
    if (res.status === 200 && res?.data) {
      toast.success("Update Successfully" || res.data?.message, {
        toastId: 1234,
      });
      setLoading(false);
    }
  } catch (err) {
    setLoading(false);
    toast.warning(err?.message || err?.response?.data?.message, {
      toastId: 12355,
    });
  }
};

export const getAssetSingleData = async (rentAssetId, setter, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/asset/AssetRent/GetAssetRentInfo?RentAssetId=${rentAssetId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      setter({
        rentType: { value: data?.rentTypeId, label: data?.rentTypeName },
        rentFromDate: _dateFormatter(data?.rentFromDate),
        rentToDate: _dateFormatter(data?.rentToDate),
        partner: { value: data?.assetId, label: data?.assetName },
        asset: {
          value: data?.assetId,
          label: data?.assetName,
          code: data?.assetCode,
        },
        sbu: data?.sbuId ? { value: data?.sbuId, label: data?.sbuName } : "",
        currency: { value: data?.currencyId, label: data?.currencyName },
        rentRate: data?.rentRate,
        currConversationRate: data?.currConversationRate,
      });
    }
    setDisabled(false);
  } catch (err) {
    setDisabled(false);
    setter([]);
  }
};

export const closeRentAsset = async (id, setDisabled, cb) => {
  try {
    const res = await Axios.put(
      `/asset/AssetRent/EditAssetRentCloseStatus?RentAssetId=${id}&ClosedStatus=true`
    );
    if (res.status === 200 && res?.data) {
      toast.success(res?.data?.message || res?.message, { toastId: 12345 });
      cb();
      setDisabled(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message || err?.message, {
      toastId: 12345,
    });
    setDisabled(false);
  }
};
