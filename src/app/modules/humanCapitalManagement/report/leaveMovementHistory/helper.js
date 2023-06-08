import Axios from "axios";
import { toast } from "react-toastify";

export const getBusUnitDDL = async (setter) => {
  try {
    const res = await Axios.get(`/hcm/HCMDDL/GetBusinessunitDDL`);
    const data = res?.data.map((itm) => {
      return {
        ...itm,
        value: itm?.value,
        label: itm?.label,
      };
    });
    setter(data);
  } catch (error) {
    setter([]);
  }
};

export const getLoanData = (enrolId, setter) => {
  Axios.get(`/hcm/HCMLoanReport/GetLoanReport?PartId=1&Enroll=${enrolId}`)
    .then((res) => {
      const { data } = res;

      setter(data);
    })
    .catch((err) => setter(""));
};

export const leaveMovementHistoryAction = async (
  typeId,
  busId,
  fromDate,
  toDate,
  setter,
  setLoader
) => {
  setLoader(true);
  try {
    const res = await Axios.get(
      `/hcm/HCMLeaveAndMovementReport/GetLeaveAndMovementHistory?Type=${typeId}&Unit=${busId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoader(false);
  } catch (error) {
    setter("");
    toast.error(error?.response?.data?.message);
    setLoader(false);
  }
};
