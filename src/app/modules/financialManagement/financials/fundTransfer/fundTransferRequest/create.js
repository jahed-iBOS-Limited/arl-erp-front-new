import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import axios from "axios";
import FormikError from "../../../../_helper/_formikError";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";

const initData = {
    requestDate: _todayDate(),
    requestTo: null,
    bankName: null,
    expectedDate: "",
    requestAmount: "",
    responsiblePerson: "",
    remarks: "",
};

const validationSchema = Yup.object().shape({
    requestDate: Yup.date().required("Request Date is required"),
    requestTo: Yup.object()
        .shape({
            label: Yup.string().required("Request To is required"),
            value: Yup.string().required("Request To is required"),
        })
        .typeError("Request To is required"),
    bankName: Yup.object()
        .shape({
            label: Yup.string().required("Bank Name is required"),
            value: Yup.string().required("Bank Name is required"),
        })
        .typeError("Bank Name is required"),
    expectedDate: Yup.date().required("Expected Date is required"),
    requestAmount: Yup.number().required("Request Amount is required").min(1, "Request Amount must be positive"),
    responsiblePerson: Yup.object()
        .shape({
            label: Yup.string().required("Responsible Person is required"),
            value: Yup.string().required("Responsible Person is required"),
        })
        .typeError("Responsible Person is required"),
});

export default function FundTransferRequestCreate() {
    const [objProps, setObjprops] = useState({});

    const { businessUnitList, profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const [bankList, getBankList] = useAxiosGet()
    const [, onCreateHandler, saveLoader] = useAxiosPost();

    useEffect(() => {
        getBankList(`/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBusinessUnit])

    const saveHandler = (values, cb) => {

        const payload = {
            "intFundTransferRequestId": 0,
            "strRequestCode": "",
            "intRequestTypeId": 0,
            "strRequestType": "",
            "intRequestByUnitId": selectedBusinessUnit?.value,
            "strRequestByUnitName": selectedBusinessUnit?.label,
            "intRequestToUnitId": values?.requestTo?.value,
            "strRequestToUnitName": values?.requestTo?.label,
            "dteRequestDate": "2024-12-22T09:59:39.993Z",
            "numAmount": values?.requestAmount || 0,
            "intRequestedBankId": values?.bankName?.value,
            "strRequestedBankName": values?.bankName?.label,
            "intRequestedBankBranchId": values?.bankName?.bankBranch_Id || 0,
            "strRequestedBankBranchName": values?.bankName?.bankBranchName || "",
            "strRequestedBankAccountNumber": values?.bankName?.bankAccNo || "",
            "strRequestedBankAccountName": values?.bankName?.accountName || "",
            "intGivenBankId": 0,
            "strGivenBankName": "",
            "intGivenBankBranchId": 0,
            "strGivenBankBranchName": "",
            "strGivenBankAccountNumber": 0,
            "strGivenBankAccountName": "",
            "strRemarks": values?.remarks || "",
            "dteExpectedDate": values?.expectedDate,
            "intResponsibleEmpId": values?.responsiblePerson?.value || 0,
            "strResponsibleEmpName": values?.responsiblePerson?.label || "",
            "isActive": true,
            "intActionBy": profileData?.userId,
            "intUpdateBy": profileData?.userId,

        }
        onCreateHandler(`/fino/FundManagement/CreateOrEditFundTransferRequest`, payload, cb, true,

        )
    };

    const loadEmployeeInfo = (v) => {
        if (v?.length < 2) return []
        return axios.get(
            `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
        ).then((res) => {
            return res?.data;
        });
    };


    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            validationSchema={validationSchema}
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
                    {saveLoader && <Loading />}
                    <IForm title="Fund Transfer Request Create" getProps={setObjprops}>
                        <Form>
                            <div className="form-group global-form row">
                                {/* Request Date */}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.requestDate}
                                        label="Request Date"
                                        name="requestDate"
                                        type="date"
                                        onChange={(e) => setFieldValue("requestDate", e.target.value)}
                                    />
                                </div>

                                {/* Request To */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="requestTo"
                                        options={businessUnitList}
                                        value={values?.requestTo}
                                        label="Request To Unit"
                                        onChange={(valueOption) => {
                                            setFieldValue("requestTo", valueOption)
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>

                                {/* Bank Name */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="bankName"
                                        options={bankList || []}
                                        value={values?.bankName}
                                        label="Bank Name & A/C"
                                        onChange={(valueOption) => setFieldValue("bankName", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>

                                {/* Expected Date */}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.expectedDate}
                                        label="Expected Date"
                                        name="expectedDate"
                                        type="date"
                                        onChange={(e) => setFieldValue("expectedDate", e.target.value)}
                                    />
                                </div>

                                {/* Request Amount */}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.requestAmount}
                                        label="Request Amount"
                                        name="requestAmount"
                                        type="number"
                                        onChange={(e) => setFieldValue("requestAmount", e.target.value)}
                                    />
                                </div>

                                {/* Responsible Person */}
                                <div className="col-lg-3">
                                    <label>Responsible Person</label>
                                    <SearchAsyncSelect
                                        selectedValue={values?.serviceName}
                                        handleChange={(valueOption) => {
                                            setFieldValue("responsiblePerson", valueOption || "");

                                        }}
                                        loadOptions={loadEmployeeInfo}
                                    />
                                    <FormikError
                                        errors={errors}
                                        name="responsiblePerson"
                                        touched={touched}
                                    />
                                </div>

                                {/* Remarks */}
                                <div className="col-lg-3">
                                    <InputField
                                        value={values?.remarks}
                                        label="Remarks"
                                        name="remarks"
                                        type="text"
                                        onChange={(e) => setFieldValue("remarks", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Submit and Reset buttons */}
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
            )
            }
        </Formik >
    );
}
