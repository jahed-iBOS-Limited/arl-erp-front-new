// For Communication with external API's , for example ... get data, post data etc
import axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";

export const getLandingData = async (
  accId,
  buId,
  isContinue,
  fromDate,
  setIsLoading,
  setter,
  pageNo,
  pageSize
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/RTMSurvey/GetRTMLandingPasignation?accountId=${accId}&BusinessUnitId=${buId}&validfrom=${fromDate}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res?.status === 200) {
      setter(res?.data);
      if (res?.data?.objdata?.length === 0) {
        toast.warn("No Data Found");
      }
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setIsLoading(false);
  }
};

export const saveSurvey = async (payload, setIsLoading, cb) => {
  setIsLoading(true);
  try {
    let res = await axios.post(`/rtm/RTMSurvey/CreateRTMSurvey`, payload);
    if (res?.status === 200) {
      cb();
      toast.success(res?.data?.message, { toastId: "saveSurvey" });
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message, {
      toastId: "saveSurveyErr",
    });
    setIsLoading(false);
  }
};

// Hardcode!! But In Future It will be change i guess
const fieldTypeMaker = (fieldType) => {
  if (fieldType === "List") {
    return { value: 4, label: "List" };
  } else if (fieldType === "Multiple Option") {
    return { value: 3, label: "Multiple Option" };
  } else if (fieldType === "Number") {
    return { value: 2, label: "Number" };
  } else if (fieldType === "Text") {
    return { value: 1, label: "Text" };
  }
};

export const getSurveyById = async (
  surveyId,
  setIsLoading,
  setSingleData,
  setQuestionRowData
) => {
  setIsLoading(true);
  try {
    let res = await axios.get(
      `/rtm/RTMSurvey/GetRTMSurveyById?surveyId=${surveyId}`
    );
    if (res?.status === 200) {
      const objheader = res?.data?.objheader;
      const objRow = res?.data?.objRow;
      const rowdata = objRow?.map((item) => {
        return {
          ...item,
          questionName: item?.surveyLineName,
          questionFieldType: fieldTypeMaker(item?.controlType),
          multipleQuestionOptionList:
            item?.controlType === "Multiple Option"
              ? item?.objAttributes?.map((opt) => {
                  return {
                    ...opt,
                    questionOptionName: opt?.questionAttribute,
                  };
                })
              : [],
          questionList:
            item?.controlType === "List"
              ? item?.objAttributes?.map((opt) => {
                  return {
                    ...opt,
                    questionOptionName: opt?.questionAttribute,
                  };
                })
              : [],
        };
      });
      setSingleData({
        surveyHeaderId: objheader?.surveyHeaderId,
        surveyName: objheader?.surveyName,
        fromDate: _dateFormatter(objheader?.valiedFrom),
        toDate: _dateFormatter(objheader?.valiedTo) || "",
        isContinue: objheader?.isContinue,
      });
      setQuestionRowData(rowdata);
      setIsLoading(false);
    }
  } catch (err) {
    toast.warning(err?.response?.data?.message);
    setIsLoading(false);
  }
};
