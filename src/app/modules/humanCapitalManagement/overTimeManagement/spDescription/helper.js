import axios from "axios";
import { toast } from "react-toastify";

export const getDocumentTypeDDL = async (setter) => {
  try {
    let res = await axios.get("/hcm/DevConfiguration/GetAllDevDocumentType");
    let modifiedData = res?.data?.map((item) => ({
      value: item?.intId,
      label: item?.strName,
    }));
    setter(modifiedData);
  } catch (error) {
    setter([]);
  }
};

export const addDocumentType = async (saveData, cb) => {
  try {
    let res = await axios.post(
      `/hcm/DevConfiguration/SaveMultipleDevDocumentType`,
      saveData
    );
    toast.success(res?.data?.message);
    cb && cb();
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const saveAllDevDocumentDetails = async (saveData, cb) => {
  try {
    let res = await axios.post(
      `/hcm/DevConfiguration/SaveDevDocumentDetails`,
      saveData
    );
    toast.success(res?.data?.message);
    cb && cb();
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

export const getDocumentDetails = async (setter, id) => {
  try {
    let res = await axios.get(
      `/hcm/DevConfiguration/GetAllDevDocumentDetailsByDocumentTypeId?typeId=${id}`
    );

    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export function removeTags(str) {
  if (!str) return false;
  else str = str.toString();
  let result = str.replace(/(<([^>]+)>)/gi, "");
  if (result.length < 235) {
    return result;
  } else {
    let newResult = result.slice(0, 235);
    return newResult;
  }
}
