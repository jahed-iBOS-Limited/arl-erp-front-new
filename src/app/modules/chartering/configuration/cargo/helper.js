import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { iMarineBaseURL } from "../../helper";

// Validation schema
export const validationSchema = Yup.object().shape({
  cargoName: Yup.string().required("Cargo name is required"),
  // cargoType: Yup.object().shape({
  //   label: Yup.string().required("Cargo type is required"),
  //   value: Yup.string().required("Cargo type is required"),
  // }),
  // cargoCode: Yup.string().required("Cargo code is required"),
});

export const GetCargoLandingData = async (
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
      `${iMarineBaseURL}/domain/Cargo/GetCargoLandingPagination?viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}`
    );
    setter(res.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const createCargo = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/Cargo/CreateCargo`,
      data
    );
    cb();
    toast.success(res.data.message);
    setLoading(false);
  } catch (error) {
    toast.error(error.response.data.message);
    setLoading(false);
  }
};

export const editCargo = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/Cargo/EditCargo`,
      data
    );

    toast.success(res.data.message);
    setLoading(false);
  } catch (error) {
    toast.error(error.response.data.message);
    setLoading(false);
  }
};

export const DeleteCargo = async (id, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.delete(
      `${iMarineBaseURL}/domain/Cargo/DeleteCargo?cargoId=${id}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const activeInactiveCargo = async (id, status, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/Cargo/ActiveOrInActive?cargoId=${id}&activeOrInActive=${status}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
