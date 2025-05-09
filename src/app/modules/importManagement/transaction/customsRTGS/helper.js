import axios from 'axios';
import { toast } from 'react-toastify';

// Get landing data for customs duty
export const getLandingData = async (
  buId,
  shipmentId,
  PoNo,
  pageSize,
  pageNo,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    let query = `/imp/CustomDuty/GetCustomRTGSPagination?businessUnitId=${buId}&PurchaseOrderId=${PoNo}&shipmentId=${shipmentId}&pageNo=${pageNo}&pageSize=${pageSize}`;
    let res = await axios.get(query);
    // console.log("res custom duty", res?.data);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};

// Get landing data for customs duty
export const getCustomDutyInfo = async (
  accId,
  buId,
  shipmentId,
  PoNo,
  pageSize,
  pageNo,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    let query = `imp/CustomDuty/GetCustomDutyLandingPasignation?accountId=${accId}&businessUnitId=${buId}`;
    if (PoNo) {
      query += `&search=${PoNo}`;
    }
    if (shipmentId) {
      query += `&shipmentId=${shipmentId}`;
    }
    query += `&PageSize=${pageSize}&PageNo=${pageNo}&viewOrder=desc`;
    let res = await axios.get(query);
    // console.log("res custom duty", res?.data);
    setLoading(false);
    setter(res?.data);
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setLoading(false);
  }
};

// Get Shipment DDL
export const getShipmentDDL = async (
  accountId,
  businessUnitId,
  searchValue,
  setter
) => {
  try {
    let res = await axios.get(
      `/imp/ImportCommonDDL/GetShipmentListForAllCharge?accountId=${accountId}&businessUnitId=${businessUnitId}&search=${searchValue}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

// Get BankAccountNumberDDL DDL
export const getBankAccountNumberDDL = async (
  accountId,
  businessUnitId,
  setter
) => {
  try {
    let res = await axios.get(
      `/fino/FinanceCommonDDL/GetBankAccountInfoDDL?accountId=${accountId}&businessUnitId=${businessUnitId}
      `
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
  }
};

//create data;
export const CreateCustomeRTGS = async (paylaod, setDisabled, cb) => {
  try {
    setDisabled(true);
    const res = await axios.post(`/imp/CustomDuty/CreateCustomeRTGS`, paylaod);
    setDisabled(false);
    toast.success(res?.data?.message || 'Create successfully');
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

//get single data;
export const getCustomRTGSById = async (id, setDisabled, setter) => {
  setDisabled(true);
  try {
    const res = await axios.get(
      `/imp/CustomDuty/GetCustomRTGSById?customRtgsId=${id}`
    );
    if (res.status === 200) {
      setter(res?.data);
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const EditCustomerRTGSApi = async (paylaod, setDisabled, cb) => {
  try {
    setDisabled(true);
    const res = await axios.post(`/imp/CustomDuty/EditCustomerRTGS`, paylaod);
    setDisabled(false);
    toast.success(res?.data?.message || 'Update successfully');
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};
