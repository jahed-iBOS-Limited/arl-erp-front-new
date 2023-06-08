/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import { useSelector, shallowEqual } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getSurveyById, saveSurvey } from "../helper";

const initData = {
  surveyName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  isContinue: true,
};

const OutletSurveyForm = () => {
  const { viewId } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");

  /* State for Question Data */
  const [questionRowData, setQuestionRowData] = useState([
    {
      questionName: "",
      questionFieldType: "",
      multipleQuestionOptionList: [],
      questionList: [],
    },
  ]);

  // Hardcode!! But In Future It will be change i guess
  const MultipleQuestionFieldTypeDDL = [
    { value: 1, label: "Text" },
    { value: 2, label: "Number" },
    { value: 3, label: "Multiple Option" },
    { value: 4, label: "List" },
  ];

  useEffect(() => {
    if (MultipleQuestionFieldTypeDDL) {
      setQuestionRowData([
        {
          questionName: "",
          questionFieldType: MultipleQuestionFieldTypeDDL[0],
          questionFiledTypeId: MultipleQuestionFieldTypeDDL[0]?.value,
          questionFieldTypeName: MultipleQuestionFieldTypeDDL[0]?.label,
          multipleQuestionOptionList: [],
          questionList: [],
        },
      ]);
    }
  }, []);

  // Get By Id
  useEffect(() => {
    getSurveyById(viewId, setDisabled, setSingleData, setQuestionRowData);
  }, [viewId]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (
      questionRowData?.length > 0 &&
      values &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
    ) {
      // Map And bind All the Attribute If Exists
      const questionArray = questionRowData?.map((item) => {
        return {
          surveyLineName: item?.questionName,
          controlType: item?.questionFieldType?.label,
          objAttributes:
            (item?.multipleQuestionOptionList?.length > 0 &&
              item?.multipleQuestionOptionList?.map((item) => {
                return {
                  questionAttribute: item?.questionOptionName,
                };
              })) ||
            (item?.questionList?.length > 0 &&
              item?.questionList?.map((item) => {
                return {
                  questionAttribute: item?.questionOptionName,
                };
              })) ||
            [],
        };
      });
      const payload = {
        objheader: {
          surveyName: values?.surveyName,
          valiedFrom: values?.fromDate,
          valiedTo: values?.isContinue ? null : values?.toDate,
          isContinue: values?.isContinue,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
        },
        objRow: questionArray,
      };
      saveSurvey(payload, setDisabled, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={!viewId ? "Survey Create" : "Survey View"}
        getProps={setObjprops}
        isDisabled={isDisabled}
        isHiddenReset={viewId}
        isHiddenSave={viewId}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={viewId ? singleData : initData}
          saveHandler={saveHandler}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          setDisabled={setDisabled}
          isEdit={viewId}
          // Row Data State
          questionRowData={questionRowData}
          setQuestionRowData={setQuestionRowData}
          // DDL
          MultipleQuestionFieldTypeDDL={MultipleQuestionFieldTypeDDL}
        />
      </IForm>
    </>
  );
};

export default OutletSurveyForm;
