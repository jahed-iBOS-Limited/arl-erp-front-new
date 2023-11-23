import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../../App";

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel name is required"),
    value: Yup.string().required("Vessel name is required"),
  }),
  voyageNo: Yup.object().shape({
    label: Yup.string().required("Voyage No is required"),
    value: Yup.string().required("Voyage No is required"),
  }),
});

export const getAdditionalCostLandingData = async (
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  const vesselID = vesselId ? `VesselId=${vesselId}` : "";
  const voyageID = voyageId ? `&VoyageId=${voyageId}` : "";
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/AdditionalCost/GetAddionalCostLanding?${vesselID}${voyageID}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    if (res?.data?.data?.length) {
      setter(res?.data);
    } else {
      setter([]);
      toast.warn("Data not found");
    }

    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const createAdditionalCost = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/AdditionalCost/CreateAdditionalCost`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const getCostTypeDDL = async (typeId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/PortPDA/GetAdditionalCost?VoyageTypeId=${typeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const saveNewCostType = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/AdditionalCost/CreateAdditionalCostConfig`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const deleteAdditionalCost = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/AdditionalCost/InActiveAdditionalCost?AdditionalCostId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};

export const getAdditionalCostById = async (
  vesselId,
  voyageId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/AdditionalCost/GetAdditonalCostById?VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data);
    cb && cb(res?.data[0]);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const getBusinessPartnerDDL = async (
  buId,
  voyageId,
  stackHolderTypeId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetVoyageStackHolderInfo?BusinessUnitId=${buId}&VoyageId=${voyageId}&StackTypeId=${stackHolderTypeId}`
    );
    const modifyData = res?.data?.map((item) => {
      return {
        label: item.stackHolderName,
        value: item.stackHolderId,
      };
    });
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    setter([]);
  }
};

export const editOrCashReceive = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/AdditionalCost/EditAdditionalCost`,
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
