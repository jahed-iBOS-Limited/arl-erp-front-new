import axios from "axios";
import { toast } from "react-toastify";


// Get landing data for customs duty
export const getLandingData = async (
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