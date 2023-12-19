import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../App";

export const getLandingData = async (
  setLoading,
  setter,
  buId,
  vesselTypeId,
  vesselId,
  fromDate,
  toDate,
  pageNo,
  pageSize
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetShippingAgencyConfig?businessUnitId=${buId}&vesselTypeId=${vesselTypeId}&vesselId=${vesselId}&fromDate=${fromDate}&toDate=${toDate}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const getVesselTypeDDL = async (setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/ASLLAgency/GetVesselTypeDDL`
    );
    setter(res.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const getVesselDDL = async (buId, accId, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    setter(res.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
export const createShippingAgency = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/CreateShippingAgencyConfig`,
      payload
    );

    toast.success("Submitted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const updateShippingAgency = async (payload, setLoading, cb) => {
  try {
    setLoading(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/EditShippingAgencyConfig`,
      payload
    );

    toast.success("Submitted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
export const deleteShipAgency = async (id, buId, setLoading, cb) => {
  try {
    setLoading(true);
    await axios.post(
      `${imarineBaseUrl}/domain/ASLLAgency/DeleteShippingAgencyConfig?businessUnitId=${buId}&id=${id}`
    );
    toast.success("Deleted Successfully");
    cb();
    setLoading(false);
  } catch (error) {
    console.log("error", error);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
