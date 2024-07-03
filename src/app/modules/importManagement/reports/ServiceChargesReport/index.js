import { Form, Formik } from "formik";
import React, { useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import IButton from "../../../_helper/iButton";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { getReportId, groupId, parameterValues, serviceChargeReportTypeOptions } from "./helper";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import FormikError from "../../../_helper/_formikError";
import axios from "axios";

const initData = {
    reportType: { value: 1, label: 'Service Charges Report' },
    poId: '',
    fromDate: _todayDate(),
    toDate: _todayDate()
};



export default function ServiceChargesReportPage() {
    const [show, setShow] = useState(false)
    const { profileData: { accountId: accId },
        selectedBusinessUnit: { value: buUnId }
    } = useSelector(state => state?.authData, shallowEqual)


    const loadPOID = (v) => {
        if (v?.length < 3) return []
        return axios.get(
            `/imp/ImportCommonDDL/GetPONoDDL?searchTerm=${v}&accountId=${accId}&businessUnitId=${buUnId}`
        ).then((res) => res.data
        );
    };


    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            // validationSchema={{}}
            onSubmit={() => { }}
        >
            {({
                values,
                setFieldValue,
                errors,
                touched,
            }) => (
                <>
                    {false && <Loading />}
                    <IForm
                        title="Service Charges Report"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave

                    >
                        <Form>
                            <div className="form-group row global-form">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name='reportType'
                                        options={serviceChargeReportTypeOptions}
                                        value={values?.reportType}
                                        label='Report Type'
                                        onChange={(valueOption) => {
                                            setFieldValue('reportType', valueOption)
                                            setShow(false)
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <label>PO ID</label>
                                    <SearchAsyncSelect
                                        selectedValue={values?.poId}
                                        handleChange={(valueOption) => {
                                            setFieldValue("poId", valueOption);
                                            setShow(false)
                                        }}
                                        loadOptions={loadPOID}
                                        disabled={true}
                                    />
                                    <FormikError
                                        errors={errors}
                                        name="poId"
                                        touched={touched}
                                    />

                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.fromDate}
                                        label="From Date"
                                        name="fromDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("fromDate", e.target.value);
                                            setShow(false)
                                        }}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.toDate}
                                        label="To Date"
                                        name="toDate"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("toDate", e.target.value);
                                            setShow(false)
                                        }}
                                    />
                                </div>
                                <IButton
                                    disabled={!values?.reportType || !values?.poId || !values?.fromDate || !values?.toDate}
                                    onClick={() => setShow(true)}
                                />
                            </div>



                        </Form>

                        {show && [1].includes(values?.reportType?.value) && (<PowerBIReport
                            reportId={getReportId(values)}
                            groupId={groupId}
                            parameterValues={parameterValues(
                                values
                            )}
                            parameterPanel={false}
                        />)
                        }
                    </IForm>
                </>
            )}
        </Formik>
    );
}
