/* eslint-disable no-useless-escape */
import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Validation schema
export const validationSchema = Yup.object().shape({
  // ownerName: Yup.string().required("Owner Name is required"),
  companyName: Yup.string().required("Company Name is required"),
  companyAddress: Yup.string().required("Company Address is required"),
  ownerEmail: Yup.string()
    .required("Email is required")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid"
    ),
  contactNumber: Yup.string().required("Contact Number is required"),
  // .matches(/^(\+?\d{0,3}[- ]?)?\d{11}$/, "Contact Number is not valid"),
  // .test("len", "Contact number is invalid", (value) => value?.length === 11),
});

export const getOwnerInfoLandingData = async (
  pageNo,
  pageSize,
  searchValue,
  status,
  setLoading,
  setter
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `/domain/OwnerInfo/GetOwnerInfoLandingPagination?viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}&status=${status}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const CreateOwnerInfo = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(`/domain/OwnerInfo/CreateOwnerInfo`, payload);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const EditOwnerInfo = async (payload, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(`/domain/OwnerInfo/EditOwnerInfo`, payload);
    toast.success(res?.data?.message);

    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const DeleteOwnerInfo = async (ownerId, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.delete(
      `/domain/OwnerInfo/DeleteOwnerInfo?OwnerId=${ownerId}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetOwnerInfoById = async (ownerId, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/domain/OwnerInfo/GetOwnerInfoDetailsById?OwnerId=${ownerId}`
    );
    setter({
      ...res?.data,
      bankName: {
        value: res?.data?.bankId,
        label: res?.data?.bankName,
        bankId: res?.data?.bankId,
        bankName: res?.data?.bankName,
        bankAddress: res?.data?.bankAddress,
        swiftCode: res?.data?.swiftCode,
      },
    });
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const ownerInfoAttachment = async (attachment, setLoading) => {
  setLoading(true);
  let formData = new FormData();
  attachment.forEach((file) => {
    formData.append("files", file?.file);
  });
  try {
    let { data } = await axios.post("/domain/OwnerInfo/UploadFile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Upload  successfully");
    setLoading(false);
    return data;
  } catch (error) {
    toast.error("Document not upload");
    setLoading(false);
  }
};

export const activeInactiveOwner = async (id, status, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `/domain/OwnerInfo/ActiveOrInActive?OwnerId=${id}&activeOrInActive=${status}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
