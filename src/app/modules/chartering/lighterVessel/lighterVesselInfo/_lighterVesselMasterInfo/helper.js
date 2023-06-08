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

export const saveMasterBankInformation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `https://imarine.ibos.io/domain/LighterVessel/CRUDLighterVesselMastersBankInfo`,
      // `https://imarine.ibos.io/domain/LighterVessel/CreateLighterVesselMastersBankInfo`,
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

export const saveEditedMasterBankInformation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `https://imarine.ibos.io/domain/LighterVessel/EditLighterVesselMastersBankInfo`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "An error occurred while updating!"
    );
    setLoading(false);
  }
};

export const getMasterBankInformation = async (
  vesselId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `https://imarine.ibos.io/domain/LighterVessel/GetLighterVesselMastersBankInfoByid?LighterVesselId=${vesselId}`
    );
    // const data = res?.data.map((item) => ({
    //   ...item,
    //   acHolderName: item?.strAccountHolderName,
    //   acHolderNumber: item?.strAccountHolderNumber,
    //   bankName: item?.strBankName,
    //   bankBranchName: item?.strBankBranchName,
    //   bankAddress: item?.strBankAddress,
    //   routingNumber: item?.strRoutingNumber,
    //   isActive: true,
    // }));

    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const editMasterBankInformation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `https://imarine.ibos.io/domain/LighterVessel/EditLighterVesselMastersBankInfo`,
      data
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "An error occurred while updating!"
    );
    setLoading(false);
  }
};

export const changeBankInfoStatus = async (id, value, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `https://imarine.ibos.io/domain/LighterVessel/ActiveOrInActive?Id=${id}&activeOrInActive=${value}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "An error occurred while updating!"
    );
    setLoading(false);
  }
};
