// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";
export const getLandingData = async (
  accId,
  typeId,
  setDisabled,
  setter,
  pageNo,
  pageSize
) => {
  setDisabled(true);

  let isType = typeId === 1 ? true : false
  let status = typeId === 0 ? "" : `&status=${isType}`

  

  try {
    let res = await axios.get(
      `/hcm/AdditionDeductionType/AdditionDeductionTypeLandingData?AccountId=${accId}${status}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    setter(res?.data);
    setDisabled(false);
  } catch (err) {
    setter([]);
    toast.warning(err?.response?.data?.message);
    setDisabled(false);
  }
};

export const createAdditionDeductionType = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    let res = await axios.post(
      `/hcm/AdditionDeductionType/CreateAdditionDeductionType`,
      payload
    );
    cb();
    toast.success(res?.data?.message, {
      toastId: "createAdditionDeductionType",
    });
    setDisabled(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "createAdditionDeductionTypeError",
    });
    setDisabled(false);
  }
};

export const deleteSingleData = async (payload, setDisabled, cb) => {
  setDisabled(true);
  try {
    let res = await axios.put(
      `/hcm/AdditionDeductionType/EditAdditionDeductionType`,
      payload
    );
    cb();
    toast.success(res?.data?.message, {
      toastId: "deleteSingleData",
    });
    setDisabled(false);
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "deleteSingleDataError",
    });
    setDisabled(false);
  }
};
