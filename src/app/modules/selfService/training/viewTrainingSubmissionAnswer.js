import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../_helper/_dateFormate';
import IForm from '../../_helper/_form';
import Loading from '../../_helper/_loading';
const initData = {
};
const ViewTrainingSubmission = ({ currentUserMarks, assesment }) => {

  console.log(currentUserMarks, assesment);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const [isDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [questionsList, getQuestionsList,] = useAxiosGet();

  useEffect(() => {
    getQuestionsList(
      `/hcm/Training/GetTrainingAssesmentQuestionAnswerById?intScheduleId=${currentUserMarks?.value}&EmployeeId=${profileData?.employeeId}&RequsitionId=${currentUserMarks?.requisitionId}&isPreAssessment=${assesment}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values) => {

  };

  return (
    <IForm
      customTitle={
        questionsList?.length > 0 && (
          `Total Marks: ${questionsList.reduce((a, b) => a + b.numMarks, 0)}`
        )
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenSave={true}
      isHiddenBack={true}
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
                    <h1 className='text-center'>{currentUserMarks?.name}</h1>
                    <h3 className='text-center'>From: {_dateFormatter(currentUserMarks?.fromDate)} To: {_dateFormatter(currentUserMarks?.toDate)}</h3>
                    {questionsList?.length > 0 &&
                      questionsList?.map((questionItem, index) => (
                        <div
                          className="form-group  global-form mb-1"
                          key={index}
                        >
                          <p>
                            {index + 1}: {questionItem?.strQuestion}
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
                                    checked={questionItem?.strAnswer === optionItem?.strOption}
                                    className="mr-1 pointer"
                                    disabled={true}
                                    onChange={(e) => {
                                    }}
                                  />
                                  {optionItem?.strOption}
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
  )
}

export default ViewTrainingSubmission