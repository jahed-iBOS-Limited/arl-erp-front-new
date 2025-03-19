/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
};

export default function AssessmentSubmissionForm() {
  const location = useLocation();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const [isDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [questionsList, getQuestionsList, , setQuestionsList] = useAxiosGet();
  const { viewId } = useParams();
  const [, saveAnswer] = useAxiosPost();

  useEffect(() => {
    getQuestionsList(
      `/hcm/Training/GetTrainingAssesmentQuestionByScheduleId?intScheduleId=${viewId}&isPreAssessment=${location.state?.isPreAssesment}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const rowDtoHandler = (index, i) => {
    const data = [...questionsList];
    data[index]["answer"] = {
      selectedOptionId: data[index]["options"][i]["intOptionId"],
      selectedOptionName: data[index]["options"][i]["strOption"],
    };
    setQuestionsList(data);
  };

  const saveHandler = (values) => {
    if (!questionsList?.length) return toast.warn("Question doesn't exist");
    saveAnswer(
      `/hcm/Training/CreateTrainingAssesmentAnswer`,
      questionsList?.map((item) => ({
        intAnswerId: 0,
        intQuestionId: item?.intQuestionId,
        intOptionId: item?.answer?.selectedOptionId,
        strOption: item?.answer?.selectedOptionName,
        dteLastAction: _todayDate(),
        intActionBy: profileData?.userId,
        requisitionId: location.state?.requisitionId,
      })),
      "",
      true
    );
  };

  return (
    <IForm
      title={
        location.state?.isPreAssesment ? "Pre-Assessment Form" : "Post-Assessment Form"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="">
                  <div style={{ width: "800px", margin: "0 auto" }}>
                    <h1 className='text-center'>{location?.state?.name}</h1>
                    <h3 className='text-center'>From: {_dateFormatter(location?.state?.fromDate)} To: {_dateFormatter(location?.state?.toDate)}</h3>
                    {questionsList?.length > 0 &&
                      questionsList?.map((questionItem, index) => (
                        <div
                          className="form-group  global-form mb-1"
                          key={index}
                        >
                          <p>
                            {index + 1}: {questionItem?.strQuestion}
                            {
                              questionItem?.isRequired ? " *" : null
                            }
                          </p>
                          <div
                            role="group"
                            aria-labelledby="my-radio-group"
                            className="row"
                          >
                            {questionItem?.options?.map((optionItem, i) => (
                              <div key={i} className="col-lg-6">
                                <label>
                                  <input
                                    type="radio"
                                    required={questionItem?.isRequired}
                                    name={`name${questionItem?.intQuestionId}`}
                                    className="mr-1 pointer"
                                    disabled={true}
                                    onChange={(e) => {
                                    }}
                                  />
                                  {optionItem?.strOption} ({optionItem?.numPoints})
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
