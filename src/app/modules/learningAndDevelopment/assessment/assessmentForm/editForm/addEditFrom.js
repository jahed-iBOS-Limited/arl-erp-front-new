import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import AssessmentForm from "./form";

const initData = {};
export default function AssessmentEdit() {
  const [questionsList, getQuestionsList, , setQuestionsList] = useAxiosGet();
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [, createQuestionsList] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();

  const [modifiedData, setModifiedData] = useState([]);

  useEffect(() => {
    getQuestionsList(
      `/hcm/Training/GetTrainingAssesmentQuestionByScheduleId?intScheduleId=${id}`
    );
    if (id) {
      setModifiedData(
        questionsList?.map((item) => ({
          intQuestionId: item?.intQuestionId,
          question: item?.strQuestion,
          intScheduleId: item?.intScheduleId,
          isPreAssesment: item?.isPreAssesment,
          isActive: item?.isActive,
          dteLastActionDate: item?.dteLastActionDate,
          intActionBy: item?.intActionBy,
          options: item?.options?.map((option) => ({
            intOptionId: option?.intOptionId,
            name: option?.strOption,
            intQuestionId: option?.intQuestionId,
            isActive: option?.isActive,
            dteLastActionDate: option?.dteLastActionDate,
            intActionBy: option?.intActionBy,
            marks: option?.numPoints,
          })),
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = async (values, cb) => {
    console.log("save handler", questionsList);
    if (!questionsList?.length)
      return toast.warn("Please add a question first");
    createQuestionsList(
      `/hcm/Training/EditTrainingAssesmentQuestion`,
      questionsList?.map((item, index) => {
        if (!item?.question && !item?.strQuestion) {
          return toast.warn(
            `Please fill out the ${index + 1} number question box `
          );
        }
        if (!item?.options?.length) {
          return toast.warn(
            `Please add options for ${index + 1} number question box `
          );
        }
        return {
          intQuestionId: item?.intQuestionId || 0,
          strQuestion: item?.question || item?.strQuestion,
          intScheduleId: id,
          isPreAssesment: location?.state?.isPreAssesment,
          isActive: true,
          dteLastActionDate: _todayDate(),
          intActionBy: profileData?.userId,
          isRequired: item?.isRequired,
          strInputType: "radio",
          intOrder: 1,
          options: item?.options?.map((option, i) => {
            return {
              intOptionId: 0,
              strOption: option?.name || option?.strOption,
              intQuestionId: 0,
              numPoints: option?.marks || option?.numPoints,
              dteLastAction: _todayDate(),
              intActionBy: profileData?.userId,
              intOrder: 1,
            };
          }),
        };
      }),
      "",
      true
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title="Edit Assessment Form"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <AssessmentForm
        {...objProps}
        id={id}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        profileData={profileData}
        questionsList={questionsList}
        setQuestionsList={setQuestionsList}
      />
    </IForm>
  );
}
