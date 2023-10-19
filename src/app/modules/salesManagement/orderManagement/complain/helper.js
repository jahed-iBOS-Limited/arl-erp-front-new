import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const employeEnroll_Api = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const modify = res?.data?.map((itm) => ({
        value: itm.value,
        label: `${itm.label} (${itm.value})`,
      }));
      setter(modify);
    }
  } catch (error) {}
};
export const getComplainStatus = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainStatus?businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getComplainCategory = async (buId, setter) => {
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainCategory?businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {}
};
export const getComplainById = async (
  complainId,
  accId,
  buId,
  setLoaing,
  setSingleData
) => {
  setLoaing(true);
  try {
    const res = await axios.get(
      `/oms/CustomerPoint/GetComplainById?complainId=${complainId}&accountId=${accId}&businessUnitId=${buId}`
    );
    setLoaing(false);
    setSingleData({
      ...res?.data,
      customerName: res?.data?.customerId
        ? {
            value: res?.data?.customerId,
            label: res?.data?.customerName,
          }
        : "",
      complainCategoryName: res?.data?.complainCategoryId
        ? {
            value: res?.data?.complainCategoryId,
            label: res?.data?.complainCategoryName,
          }
        : "",
      attachment: res?.data?.attachment || "",
      requestDateTime: res?.data?.requestDateTime
        ? _dateFormatter(res?.data?.requestDateTime)
        : "",
      complainByName: res?.data?.strComplainByEmployee || "",
    });
  } catch (error) {
    setLoaing(false);
  }
};

export const attachment_action = async (
  attachment,
  setFieldValue,
  setLoading
) => {
  setLoading(true);
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  setFieldValue("attachment", "");
  try {
    let { data } = await axios.post("/domain/Document/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Upload  successfully");
    setFieldValue("attachment", data?.[0]?.id);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error("Document not upload");
  }
};

export const createComplain = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/oms/CustomerPoint/CreateComplain`, payload);
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
export const updateComplain = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`/oms/CustomerPoint/UpdateComplain`, payload);
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};
export const customerListDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
export const complainLandingPasignation = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading,
  search
) => {
  setLoading(true);
  setter([]);
  try {
    const _search = search ? `&search=${search}` : "";
    const res = await axios.get(
      `/oms/CustomerPoint/ComplainLandingPasignation?accountId=${accId}&businessUnitId=${buId}&leadId=0&pageNo=${pageNo}&pageSize=${pageSize}${_search}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};
