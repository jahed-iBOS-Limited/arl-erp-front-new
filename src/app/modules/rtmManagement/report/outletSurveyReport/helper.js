import Axios from "axios";
import { toast } from "react-toastify";

export const getSurveyDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/rtm/RTMDDL/GetSurveyDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res?.status === 200) {
      setter(res?.data);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "getSurveyDDLErr",
    });
  }
};

export const getOutletSurveyReportData = async (
  surveyId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/rtm/RTMSurvey/GetRTMSurveyPivotTable?SurveyId=${surveyId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.dataSet?.length > 0) {
        console.log("object", res?.data);
        setter(res?.data?.dataSet);
      } else {
        toast.warning("No Data Found");
      }
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};
