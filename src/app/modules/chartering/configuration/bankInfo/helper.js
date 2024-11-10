import axios from "axios";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Validation schema
export const validationSchema = Yup.object().shape({
  country: Yup.object().shape({
    label: Yup.string().required("Country is required"),
    value: Yup.string().required("Country is required"),
  }),
  bankName: Yup.string().required("Bank Name is required"),
  swiftCode: Yup.string().required("Swift Code is required"),
  bankAddress: Yup.string().required("Bank Address is required"),
});

export const GetBankInfoLandingData = async (
  pageNo,
  pageSize,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/domain/BankInformation/BankInfoPaginationLanding?viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    setter(res.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const createBankInformation = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      "/domain/BankInformation/CreateBankInformation",
      data
    );
    cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const editBankInformation = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      "/domain/BankInformation/EditBankInformation",
      data
    );

    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
