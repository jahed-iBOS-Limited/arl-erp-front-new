/* eslint-disable no-useless-escape */
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from '../../../../App';

// Validation schema
export const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),
  // picname: Yup.string().required("PIC name is required"),
  stakeholderType: Yup.object().shape({
    label: Yup.string().required("Stakeholder type is required"),
    value: Yup.string().required("Stakeholder type is required"),
  }),
  mobileNo: Yup.string().required("Mobile number is required"),
  // .matches(/^(\+?\d{0,3}[- ]?)?\d{11}$/, "Mobile Number is not valid"),

  email: Yup.string()
    .required("Email is required")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid"
    ),
  // country: Yup.object().shape({
  //   label: Yup.string().required("Country type is required"),
  //   value: Yup.string().required("Country type is required"),
  // }),
  // address: Yup.string().required("Address is required"),
});

export const GetStakeholderLandingData = async (
  accId,
  buId,
  pageNo,
  pageSize,
  searchValue,
  typeId,
  setLoading,
  setter,
  portId
) => {
  setLoading(true);
  const search = searchValue ? `&search=${searchValue}` : "";
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetStakeholderLandingPagination?AccountId=${accId}&BusinessUnitId=${buId}&PortId=${portId || 0}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${search}&filterByStakeholderTypeId=${typeId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
    setter([]);
  }
};

export const getStakeholderType = async (setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetStakeholderTypeDDL`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const createStakeholder = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${imarineBaseUrl}/domain/Stakeholder/CreateStakeholder`,
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

export const updateStakeholder = async (data, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Stakeholder/EditStakeholder`,
      data
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetStakeholderById = async (id, setLoading, setter) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetStakeholderViewDetailsById?stakeholderId=${id}`
    );
    const modifyData = {
      ...res?.data,
      stakeholderType: {
        value: res?.data?.stakeholderTypeId,
        label: res?.data?.stakeholderTypeName,
      },
      businessPartner: {
        value: res?.data?.bisPartnerId,
        label: res?.data?.bisPartnerName,
      },
      country: {
        value: res?.data?.country,
        label: res?.data?.countryName,
      },
      port: {
        value: res?.data?.portId,
        label: res?.data?.portName,
      },
      companyName: res?.data?.compnayName,
    };
    setter(modifyData);
    setLoading(false);
  } catch (error) {
    setter({});
    setLoading(false);
  }
};

export const activeInactiveStakeholder = async (id, status, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(
      `${imarineBaseUrl}/domain/Stakeholder/ActiveOrInActive?stakeholderId=${id}&activeOrInActive=${status}`
    );
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getBusinessPartnerList = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/Stakeholder/GetBusinessPartnerDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
  } catch (error) {
    setter([]);
  }
};
