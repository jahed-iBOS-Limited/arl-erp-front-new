import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

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

export const saveBunkerInformation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `https://imarine.ibos.io/domain/BunkerInformation/CreateBunkerInformation`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editBunkerInformation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `https://imarine.ibos.io/domain/BunkerInformation/EditBunkerInformation`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getBunkerInformationLandingData = async (
  accId,
  buId,
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  searchValue,
  setter,
  setLoading
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/BunkerInformation/GetBunkerInformation?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getBunkerInformationByVoyageId = async (
  voyageId,
  setFieldValue,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/Voyage/GetBunkerInformationByVoyage?VoyageId=${voyageId}`
    );
    const {
      bodLsfoQty,
      bodLsfoRate,
      bodLsfoValue,
      bodLsmgoQty,
      bodLsmgoRate,
      bodLsmgoValue,
      borLsfoQty,
      borLsfoRate,
      borLsfoValue,
      borLsmgoQty,
      borLsmgoRate,
      borLsmgoValue,
    } = res?.data;
    setFieldValue("bodLsfoQty", bodLsfoQty);
    setFieldValue("bodLsfoRate", bodLsfoRate);
    setFieldValue("bodLsfoValue", bodLsfoValue);
    setFieldValue("bodLsmgoQty", bodLsmgoQty);
    setFieldValue("bodLsmgoRate", bodLsmgoRate);
    setFieldValue("bodLsmgoValue", bodLsmgoValue);
    setFieldValue("borLsfoQty", borLsfoQty);
    setFieldValue("borLsfoRate", borLsfoRate);
    setFieldValue("borLsfoValue", borLsfoValue);
    setFieldValue("borLsmgoQty", borLsmgoQty);
    setFieldValue("borLsmgoRate", borLsmgoRate);
    setFieldValue("borLsmgoValue", borLsmgoValue);
    setLoading(false);
  } catch (error) {
    setEmptyString(setFieldValue);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getPreBORInformationByVoyageId = async (
  accId,
  buId,
  vesselId,
  voyageId,
  setFieldValue,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/BunkerInformation/GetBorInformationByVesselIdAndVoyageNo?vesselId=${vesselId}&voyageNoId=${voyageId}&accountId=${accId}&businessUnitId=${buId}`
    );
    setFieldValue("bodLsmgoQty", res?.data?.borLsmgoQty);
    setFieldValue("bodLsfo1Qty", res?.data?.borLsfo1Qty);
    setFieldValue("bodLsfo2Qty", res?.data?.borLsfo2Qty);

    // setter(res?.data);
    setLoading(false);
  } catch (error) {
    setEmptyString(setFieldValue);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getItemRateByVoyageId = async (
  accId,
  buId,
  vesselId,
  voyageId,
  setLoading,
  setter,
  setFieldValue
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/BunkerInformation/GetItemRateForBunker?AccountId=${accId}&BusinessUnitId=${buId}&VoyageNoId=${voyageId}&VesselId=${vesselId}`
    );
    if (setFieldValue) {
      setFieldValue("bunkerSaleLsmgoRate", res?.data?.lsmgoPrice);
      setFieldValue("bunkerSaleLsfo1Rate", res?.data?.lsifoPrice);
      setFieldValue("bunkerSaleLsfo2Rate", res?.data?.lsifoPrice);
      setFieldValue("bunkerPurchaseLsmgoRate", res?.data?.lsmgoPrice);
      setFieldValue("bunkerPurchaseLsfo1Rate", res?.data?.lsifoPrice);
      setFieldValue("bunkerPurchaseLsfo2Rate", res?.data?.lsifoPrice);
    }
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    if (setFieldValue) {
      setEmptyString(setFieldValue);
    }
    // toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};
export const GetItemInfoFromPurchase = async (
  buId,
  vesselId,
  voyageId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/PurchaseBunker/GetItemInfoFromPurchase?BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    // setEmptyString(setFieldValue);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};

export const setEmptyString = (setFieldValue) => {
  setFieldValue("bodLsmgoQty", "");
  setFieldValue("bodLsfo1Qty", "");
  setFieldValue("bodLsfo2Qty", "");
  setFieldValue("bunkerSaleLsmgoRate", "");
  setFieldValue("bunkerSaleLsfo1Rate", "");
  setFieldValue("bunkerSaleLsfo2Rate", "");
  setFieldValue("bunkerPurchaseLsmgoRate", "");
  setFieldValue("bunkerPurchaseLsfo1Rate", "");
  setFieldValue("bunkerPurchaseLsfo2Rate", "");
};

export const GetBunkerInformationById = async (
  bunkerId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/BunkerInformation/GetBunkerInformationById?BunkerId=${bunkerId}`
    );
    cb(res?.data);
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    // setEmptyString(setFieldValue);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};
