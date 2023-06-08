import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  mvesselName: Yup.string().required("Mother Vessel is required"),
});

export const createMotherVessel = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `https://imarine.ibos.io/domain/LighterVessel/CreateLighterMotherVessel`,
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
