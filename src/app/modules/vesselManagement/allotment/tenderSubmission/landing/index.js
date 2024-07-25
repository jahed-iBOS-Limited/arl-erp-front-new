
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";



// const initData = {};


export default function TenderSubmissionLanding() {
    const saveHandler = (values, cb) => { };
    const history = useHistory();

    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
            // validationSchema={{}}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    resetForm();
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
                    {false && <Loading />}
                    <IForm
                        title="Tender Submission"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => {
                                            history.push("/vessel-management/allotment/tendersubmission/entry");
                                        }}
                                    >
                                        Create
                                    </button>
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <div>Landing here...</div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}