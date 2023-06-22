import { Form, Formik } from "formik";
import React from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
const initData = {};
export default function StatisticalDetails() {
    const saveHandler = (values, cb) => { };
    const [rowData, getRowData, rowDataLoader] = useAxiosGet()
    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    resetForm(initData);
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
                    {rowDataLoader && <Loading />}
                    <IForm
                        title="Statistical Details"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div></div>
                            );
                        }}
                    >
                        <Form>
                            <div>
                                {/* <table className="table table-striped table-bordered bj-table bj-table-landing">
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>SL</th>
                                            <th>SL</th>
                                            <th>SL</th>
                                            <th>SL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                    </tbody>
                                </table> */}
                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}