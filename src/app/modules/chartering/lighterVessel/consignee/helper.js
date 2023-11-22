import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { iMarineBaseURL } from "../../helper";

export const validationSchema = Yup.object().shape({
  consigneeName: Yup.string().required("Consignee Name is required"),
});

export const getConsigneeList = async (
  accId,
  buId,
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerLandingPagingSearch?accountId=${accId}&businessUnitId=${buId}&PartnertypeId=2&ChannleId=0&status=true&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}&approveType=1`
    );
    // const res = await axios.get(
    //   `${iMarineBaseURL}/domain/LighterConsignee/LighterConsigneePagination?AccountId=${accId}&BusinessUnitId=${buId}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    // );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const createConsignee = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${iMarineBaseURL}/domain/LighterConsignee/CreateLighterConsignee`,
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

export const saveEditedConsignee = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${iMarineBaseURL}/domain/LighterConsignee/EditLighterConsignee`,
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
