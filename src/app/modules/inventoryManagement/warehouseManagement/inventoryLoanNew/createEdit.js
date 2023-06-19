import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import { Tab, Tabs } from "react-bootstrap";
import InternalLoan from "./Components/InternalLoan";
import ExternalLoan from "./Components/ExternalLoan";
const initData = {};
export default function InventoryLoanCreateEditNew() {
    const saveHandler = (values, cb) => {
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
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
                    {false && <Loading />}
                    <IForm isHiddenReset isHiddenBack isHiddenSave title={"Inventory Loan"}>
                        <Form>
                            <Tabs
                                defaultActiveKey="internal-loan"
                                id="uncontrolled-tab-example"
                                className="mb-3"
                            >
                                <Tab unmountOnExit eventKey="internal-loan" title="Internal Loan">
                                    <InternalLoan loanType={1} />
                                </Tab>
                                <Tab unmountOnExit eventKey="external-loan" title="External Loan">
                                    <ExternalLoan loanType={2} />
                                </Tab>
                            </Tabs>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}