import axios from "axios";
import { toast } from "react-toastify";

export const partnerBasicAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

// createPartnerBasic_api
export const createPartnerBasic_api = async (data, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await axios.post(
      `/partner/BusinessPartnerBasicInfo/CreateBusinessPartner`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const editPartnerBasic_api = async (data, cb, setDisabled) => {
  try {
    setDisabled(true);
    const res = await axios.put(
      `/partner/BusinessPartnerBasicInfo/EditBusinessPartner`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};
export const partnerApproveApi = async (data, setDisabled, cb) => {
  try {
    setDisabled(true);
    const res = await axios.put(
      `/partner/BusinessPartnerBasicInfo/PartnerApprove`,
      data
    );
    if (res.status === 200) {
      toast.success(res?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const EditBPShippingAddressDefaultById_api = async (
  data,

  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await axios.put(
      `/partner/BusinessPartnerShippingAddress/EditBPShippingAddressDefaultById`,
      data
    );
    if (res.status === 200) {
      // toast.success(res?.message || 'Submitted successfully', {
      //   toastId: 'editBPShipping',
      // })
      setDisabled(false);
    }
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const getdivisionDDL = async (coId, setter) => {
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetDivisionDDL?countryId=${coId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getdistrictDDL = async (coId, divId, setter) => {
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetDistrictDDL?countryId=${coId}&divisionId=${divId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getpoliceStationDDL = async (coId, divId, disId, setter) => {
  try {
    const res = await axios.get(
      `/oms/TerritoryInfo/GetThanaDDL?countryId=${coId}&divisionId=${divId}&districtId=${disId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getDistrictUpzillaStatus = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetDistrictUpzillaStatus?AccountId=${accId}&BusienssUnitId=${buId}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter(false);
  }
};

export const getPartnerData = async (partnerTypeId, search, setter) => {
  try {
    const res = await axios.get(
      `/partner/PartnerInformation/PartnerListByAcount?partnerTypeId=${partnerTypeId}&search=${search}`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const savepartnerInformation = async (
  sbuId,
  partnerId,
  buId,
  partnerTypeId
) => {
  try {
    const res = await axios.post(
      `/partner/BusinessPartnerPurchaseInfo/CreateSupplierCopy?partnerId=${partnerId}&partnerTypeId=${partnerTypeId}&businessUnitId=${buId}&sbuId=${sbuId}`
    );
    if (res.status === 200) {
      toast.success(res?.data?.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getAssetSBUDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/asset/DropDown/GetSbuByUnitId?AccountId=${accId}&UnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const SalesOrderApproveCheck_api = async (userId, setter) => {
  try {
    const res = await axios.get(
      `/oms/SalesOrder/SalesOrderApproveCheck?userId=${userId}&ApproveType=1`
    );
    setter(res?.data);
  } catch (error) {
    setter(false);
  }
};

export const AGUnitSetup = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/partner/BusinessPartnerBasicInfo/SetUpPartnerWithAGConcernUnit`,
      payload
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
