import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet'
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';

const initData = {
};
const IndividualSubmissionModal = ({ currentUserMarks, assesment }) => {
    const [isDisabled] = useState(false);
    const [objProps, setObjprops] = useState({});
    const [questionsList, getQuestionsList, ] = useAxiosGet();

    useEffect(() => {
        getQuestionsList(
            `/hcm/Training/GetTrainingAssesmentQuestionAnswerById?intScheduleId=${currentUserMarks?.intScheduleId}&EmployeeId=${currentUserMarks?.intEmployeeId}&RequsitionId=${currentUserMarks?.intRequisitionId}&isPreAssessment=${assesment}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveHandler = (values) => {

    };

    return (
        <IForm
            customTitle={
                `Total Marks: 
                    ${questionsList?.reduce((a, b) => a + b?.numMarks, 0)}`
            }
            // customTitle={assesment ? "Pre-Assessment Submission Form" : "Post-Assessment Submission Form"}
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
                            // resetForm(initData);
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
                                        <div className="d-flex justify-content-between">
                                            <h3>Name: {currentUserMarks?.strEmployeeName}</h3>
                                            <h3>Enroll: {currentUserMarks?.intEmployeeId}</h3>
                                        </div>
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
                                                                    {optionItem?.strOption} ({optionItem?.marks})
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

export default IndividualSubmissionModal