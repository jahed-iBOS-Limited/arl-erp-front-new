import axios from "axios";
import { toast } from "react-toastify";

//Save
export const createOutstandingAdjust = async (payload, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      "/hcm/OutstandingAdjust/CreateOutstandingAdjust?partName=CreateOutstandingAdjust",
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

//Landing
export const outstandingAdjustLanding = async (
  payload,
  setter,
  setLoading,
  cb
) => {
  setLoading(true);
  try {
    const res = await axios.post(
      "/hcm/OutstandingAdjust/OutstandingAdjustLanding?partName=OutstandingAdjustLanding",
      payload
    );
    cb && cb();
    setter(res?.data);
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message);
    setter([]);
    setLoading(false);
  }
};

export const getPayload = (item, values, profileData, selectedBusinessUnit) => {
  return {
    intOutstandingAdjustId: item?.intOutstandingAdjustId,
    intVesselId: values?.vesselName?.value,
    intVoyageId: values?.voyageNo?.value,
    numDisputeWithCharter: +item?.numDisputeWithCharter,
    numDisputeWithOwner: +item?.numDisputeWithOwner,
    numFreight: +item?.numFreight,
    numLpDpDespatch: +item?.numLpDpDespatch,
    numLpDpDemurrage: +item?.numLpDpDemurrage,
    strCharterOrShipper: item?.strCharterOrShipper,
    numBrokerageAmount: +item?.numBrokerageAmount,
    strBrokerageParty: item?.strBrokerageParty,
    numPDA_LP: +item?.numPDA_LP,
    numPDA_DP: +item?.numPDA_DP,
    strPDABunkerPort: item?.strPDABunkerPort,
    numPDA_OPA: +item?.numPDA_OPA,
    numPnlTcl: +item?.numPnlTcl,
    numWeatherRouting: +item?.numWeatherRouting,
    numSurvey: +item?.numSurvey,
    numApGuard: +item?.numApGuard,
    numOther: +item?.numOther,
    intAccountId: profileData?.accountId,
    intBusinessUnitId: selectedBusinessUnit?.value,
    intInsertBy: profileData?.userId,
  };
};
