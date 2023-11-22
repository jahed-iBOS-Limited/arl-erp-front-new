import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { iMarineBaseURL } from "../../../helper";

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
  ballastStartDate: Yup.string().required("Ballast Start Date is required"),
  ballastEndDate: Yup.string().required("Ballast End Date is required"),
  ballastDuration: Yup.string().required("Ballast Duration is required"),
  lsmgoperDayQty: Yup.string().required("This Field is required"),
  lsmgoballastQty: Yup.string().required("This Field is required"),
  lsmgoballastRate: Yup.string().required("This Field is required"),
  lsmgoballastAmount: Yup.string().required("This Field is required"),
  lsfoperDayQty: Yup.string().required("This Field is required"),
  lsfoballastQty: Yup.string().required("This Field is required"),
  lsfoballastRate: Yup.string().required("This Field is required"),
  lsfoballastAmount: Yup.string().required("This Field is required"),
});

export const getBallastPassageLandingData = async ({
  vesselId,
  voyageId,
  pageNo,
  pageSize,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/BallastPassage/GetBallastPassageLanding?VesselId=${vesselId}&VoyageId=${voyageId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const getItemRateForBunker = async ({
  accId,
  buId,
  vesselId,
  voyageId,
  setter,
  setLoading,
}) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${iMarineBaseURL}/domain/BunkerInformation/GetItemRateForBunker?AccountId=${accId}&BusinessUnitId=${buId}&VoyageNoId=${voyageId}&VesselId=${vesselId}`
    );
    setter("lsfoballastRate", data?.lsifoPrice);
    setter("lsmgoballastRate", data?.lsmgoPrice);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

export const createBallastPassage = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/BallastPassage/CreateBallastPassage`,
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

export const editBallastPassge = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/BallastPassage/EditBallastPassage`,
      data
    );

    toast.success(res?.data?.message, { toastId: 123 });
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || err?.message, {
      toastId: 1234,
    });
    setLoading(false);
  }
};

export const getSingleBallastDataById = async ({ id, setLoading, setter }) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${iMarineBaseURL}/domain/BallastPassage/GetBallastPassage?BallastId=${id}`
    );

    setter({
      ...data,
      vesselName: {
        value: data?.vesselId,
        label: data?.vesselName,
      },
      voyageNo: {
        value: data?.voyageId,
        label: data?.voyageNo,
      },
      ballastStartDate: moment(data?.ballastStartDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
      ballastEndDate: moment(data?.ballastEndDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      ),
    });
    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};
