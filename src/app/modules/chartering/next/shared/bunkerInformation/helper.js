import axios from "axios";
import { toast } from "react-toastify";
import { iMarineBaseURL } from "../../../helper";
// import * as Yup from "yup";

export const saveBunkerInformation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/BunkerInformation/CreateBunkerInformation`,
      data
    );
    cb(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getPreBORInformationByVoyageId = async (
  accId,
  buId,
  vesselId,
  voyageId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/BunkerInformation/GetBorInformationByVesselIdAndVoyageNo?vesselId=${vesselId}&voyageNoId=${voyageId}&accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);

    // setter(res?.data);
    setLoading(false);
  } catch (error) {
    // setEmptyString(setFieldValue);
    toast.warn(error?.response?.data?.message);
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
      `${iMarineBaseURL}/domain/PurchaseBunker/GetItemInfoFromPurchase?BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}`
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
