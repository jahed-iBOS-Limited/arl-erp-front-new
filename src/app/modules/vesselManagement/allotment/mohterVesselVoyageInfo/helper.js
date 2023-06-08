import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const deleteMotherVesselVoyageInfo = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/DeleteMotherVesselVoyageInfo?VoyageNo=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const editMotherVesselVoyageInfo = async (payload, setLoading) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.put(
      `/tms/LigterLoadUnload/EditMotherVesselVoyageInfo`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

// Validation schema
export const validationSchema = Yup.object().shape({
  voyageCode: Yup.string().required("Voyage Code is required"),
  motherVessel: Yup.object().shape({
    label: Yup.string().required("Mother Vessel is required"),
    value: Yup.string().required("Mother Vessel is required"),
  }),
  lcNumber: Yup.string().required("LC Number is required"),
  blQty: Yup.string().required("BL Qty is required"),
  eta: Yup.string().required("ETA is required"),
  loadingPort: Yup.object().shape({
    label: Yup.string().required("Loading Port is required"),
    value: Yup.string().required("Loading Port is required"),
  }),
  dischargingPort: Yup.object().shape({
    label: Yup.string().required("Discharging Port is required"),
    value: Yup.string().required("Discharging Port is required"),
  }),
  cnf: Yup.object().shape({
    label: Yup.string().required("CNF is required"),
    value: Yup.string().required("CNF is required"),
  }),
  stevedore: Yup.object().shape({
    label: Yup.string().required("Steve Dore is required"),
    value: Yup.string().required("Steve Dore is required"),
  }),
});
