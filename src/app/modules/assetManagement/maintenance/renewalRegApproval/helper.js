import axios from "axios";
import { toast } from "react-toastify";

// export const getRenewalRegistrationSummary = async (
//   {
//     assetId,
//     fromDate,
//     toDate,
//     accountId,
//     setter,
//     setLoading,
//   }
// ) => {
//   setLoading(true);
//   try {
//     const res = await axios.get(
//       `/asset/LandingView/RenewalRegistrationSummary?AssetId=${assetId}&dteFrom=${fromDate}&dteTo=${toDate}&actioinById=${accountId}`
//     );
//     let newData = res?.data?.map((item)=>{
//     const rowTotal = Number(item?.registration + item?.taxToken + item?.fitness + item?.routePermit + item?.insurance + item?.namePlate + item?.drc)
//     return {...item, rowTotal}
//     })
//     setter(newData);
//     setLoading(false);
//   } catch (error) {
//     setter([]);
//     toast.warn(error?.response?.data?.message);
//     setLoading(false);
//   }
// };

export const renewalRegistrationApproval = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `/asset/LandingView/RenewalRegistrationApproval`,
      payload
    );
    cb && cb();
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setLoading(false);
  }
};


export const getRenewalRegistrationApprovalDetails = async (
  {
    serviceId,
    assetId,
    fromDate,
    toDate,
    setter,
    setLoading,
  }
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/asset/DetalisView/RenewalRegistrationApprovalDetails?ServiceId=${serviceId}&VehicleId=${assetId}&FromDate=${fromDate}&ToDate=${toDate}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter(null);
    toast.warn(error?.response?.data?.message);
    setLoading(false);
  }
};