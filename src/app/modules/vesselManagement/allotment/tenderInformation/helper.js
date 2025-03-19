import Axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";



export const GetLighterStevedoreDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetLighterStevedoreDDL`
    );
    if (res.status === 200) {
      setter(res?.data);
    }
  } catch (error) {
    setter([]);
  }
};

export const getMotherVesselDDL = async (accId, buId, setter, portId) => {
  try {
    const res = await Axios.get(
      `/wms/FertilizerOperation/GetMotherVesselDDL?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${portId ||
      0}`
    );
    setter(res.data);
  } catch (error) {
    setter([]);
  }
};

export const validationSchema = Yup.object().shape({
  motherVessel: Yup.object().shape({
    label: Yup.string().required("Mother Vessel is required"),
    value: Yup.string().required("Mother Vessel is required"),
  }),
  item: Yup.object().shape({
    label: Yup.string().required("Item is required"),
    value: Yup.string().required("Item is required"),
  }),
  lotNo: Yup.string().required("Lot No is required"),
  cnf: Yup.object().shape({
    label: Yup.string().required("CNF is required"),
    value: Yup.string().required("CNF is required"),
  }),
  steveDore: Yup.object().shape({
    label: Yup.string().required("Steve dore is required"),
    value: Yup.string().required("Steve dore is required"),
  }),
});

export const deleteTenderInfo = async (id, setLoading, cb) => {
  setLoading && setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/LigterLoadUnload/DeleteGTOGProgramInfo?ProgramId=${id}`
    );
    toast.success(res?.data?.message);
    cb && cb();
    setLoading && setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading && setLoading(false);
  }
};

export const editTenderInfo = async (payload) => {
  try {
    const res = await Axios.put(
      `/tms/LigterLoadUnload/EditGTOGProgramInfo`,
      payload
    );
    toast.success(res?.data?.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const tenderInfoApprove = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.put(
      `/tms/LigterLoadUnload/ApproveGTOGProgramInfo`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
