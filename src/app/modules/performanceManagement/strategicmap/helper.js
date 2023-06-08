import Axios from "axios";
import { toast } from "react-toastify";

export const getDepartmentDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDepertmentDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getSbuDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveAttachment_action = async (attachment, cb) => {
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await Axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success("Attachment Upload  successfully");
    return data;
  } catch (error) {
    toast.error("Document not upload");
  }
};

export const saveStrategicMap = async (payload, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const res = await Axios.post(`/pms/StrategicMap/PostStrategicMap`, payload);
    toast.success(res?.data?.message || "Submitted successfully");
    if (setLoading) setLoading(false);
  } catch (error) {
    if (setLoading) setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const getStrategicMapById = async (sbuId, cb, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const res = await Axios.get(
      `/pms/StrategicMap/GetStrategicMap?sbuId=${sbuId}`
    );
    if (setLoading) setLoading(false);
    cb(res?.data);
  } catch (error) {
    if (setLoading) setLoading(false);
  }
};

export const getFileView_Action = async (id,setImgSrc) => {
  try {
    const res = await Axios.get(`/domain/Document/DownlloadFile?id=${id}`);
    if (res?.status === 200 && res?.data) {
      const obj = {
        url: res?.config?.url,
        type: res?.headers?.["content-type"],
        model: true,
        data:res?.data
      };
      console.log("got file data",obj)
      setImgSrc(obj)
    }
  } catch (error) {
  
  }
};


