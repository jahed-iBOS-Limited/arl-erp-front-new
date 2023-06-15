import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
    fromDate: _monthFirstDate(),
    toDate: _todayDate(),
};
export default function InventoryValuationRDLC() {
    const [objProps, setObjprops] = useState({});
    const saveHandler = (values, cb) => { };
    const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";
    const reportId = "86d89cd1-cf1b-41cb-b797-bef10d560883";
    const [showRDLC, setShowRDLC] = useState(false);

    const parameterValues = (values) => {
        const parameters = [
            { name: "fromDate", value: `${values?.fromDate}` },
            { name: "toDate", value: `${values?.toDate}` },
        ];
        return parameters;
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
                    <IForm
                        title="Inventory Valuation RDLC Report"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        getProps={setObjprops}
                        renderProps={() => {
                            return (
                                <div>
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.fromDate}
                                        label="Date"
                                        name="fromDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("fromDate", e.target.value);
                                            setShowRDLC(false);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        value={values?.toDate}
                                        label="Date"
                                        name="toDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("toDate", e.target.value);
                                            setShowRDLC(false);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{
                                            marginTop: "18px",
                                        }}
                                        onClick={() => {
                                            setShowRDLC(true);
                                        }}
                                        disabled={
                                            !values?.fromDate ||
                                            !values?.toDate
                                        }
                                    >
                                        View
                                    </button>
                                </div>
                            </div>

                            {showRDLC ? <div className="">
                                <PowerBIReport
                                    reportId={reportId}
                                    groupId={groupId}
                                    parameterValues={parameterValues(values)}
                                    parameterPanel={false}
                                />
                            </div> : null}

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
                    </IForm>
                </>
            )}
        </Formik>
    );
}