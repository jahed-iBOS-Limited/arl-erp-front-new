import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../App";

export const getIncomeStatement = async (
  vesselId,
  voyageId,
  hireType,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/HireStatement/GetHireStatementInfo?VeseelId=${vesselId}&VoyageId=${voyageId}&HireType=${hireType}`
    );
    hireType === 1 && cb();
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter({});
    toast.error(error.response?.data?.message);
    setLoading(false);
  }
};

export const getAdditionalCostById = async (
  vesselId,
  voyageId,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/AdditionalCost/GetAdditonalCostById?VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data);
    cb && cb(res?.data[0]);
    setLoading(false);
  } catch (err) {
    setter([]);
    setLoading(false);
  }
};

// new api for income statement
export const getIncomeStatementNew = async (
  vesselId,
  voyageId,
  hireType,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/HireStatement/GetHireStatementInfoNew?VeseelId=${vesselId}&VoyageId=${voyageId}&HireType=${hireType}`
    );
    hireType === 1 && cb();
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter({});
    toast.error(error.response?.data?.message);
    setLoading(false);
  }
};

export const getIncomeStatementForVoyageCharter = async (
  vesselId,
  voyageId,
  hireType,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/HireStatement/GetHireStatementInfoVoyagge?VeseelId=${vesselId}&VoyageId=${voyageId}&HireType=${hireType}`
    );
    setter(res?.data);
    cb();
    setLoading(false);
  } catch (error) {
    setter({ objheader: [] });
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const GetTransactionDetailsForStatement = async (
  accId,
  buId,
  vesselId,
  voyageId,
  setter
  // setLoading
) => {
  // setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/TimeCharterTransaction/GetTransactionDetails?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}&HireTrasaction=16`
    );
    setter(res?.data?.previousTransaciton);
    // setLoading(false);
  } catch (error) {
    setter([]);
    // setLoading(false);
  }
};

export const GetVesselBunkerInvInfo = async (
  vesselId,
  voyageId,
  setter
  // setLoading
) => {
  // setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/BunkerCost/GetVesselBunkerInvInfo?VesselId=${vesselId}&VoyageId=${voyageId}&TransTypeId=2`
    );
    setter(res?.data);
    // setLoading(false);
  } catch (error) {
    setter([]);
    // setLoading(false);
  }
};
