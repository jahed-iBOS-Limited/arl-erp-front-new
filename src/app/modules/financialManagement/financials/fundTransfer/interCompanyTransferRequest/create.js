import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import IForm from "../../../../_helper/_form";
import FormikError from "../../../../_helper/_formikError";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { useLocation } from "react-router";
import { _todayDate } from "../../../../_helper/_todayDate";


const initData = {
    sendingPartner: "",
    requestToUnit: "",
    receivingAccount: "",
    toBankName: "",
    expectedDate: "",
    requestAmount: "",
    responsiblePerson: "",
    remarks: "",
};

const getSchema = () => {
    const validationSchema = Yup.object().shape({
        receivingAccount: Yup.object()
            .shape({
                label: Yup.string().required("Transfer From Bank is required"),
                value: Yup.string().required("Transfer From Bank is required"),
            })
            .typeError("Transfer From Bank is required"),
        expectedDate: Yup.date().required("Expected Date is required"),
        requestAmount: Yup.number().required("Request Amount is required").min(1, "Request Amount must be positive"),
        responsiblePerson: Yup.object()
            .shape({
                label: Yup.string().required("Responsible Person is required"),
                value: Yup.string().required("Responsible Person is required"),
            })
            .typeError("Responsible Person is required"),
        requestToUnit: Yup.object()
            .shape({
                label: Yup.string().required("Request To Unit is required"),
                value: Yup.string().required("Request To Unit is required"),
            })
            .typeError("Request To Unit is required"),
    });

    return validationSchema;
}



export default function InterCompanyTransferRequestCreate() {
    const [objProps, setObjprops] = useState({});

    const location = useLocation();
    const { parentTransferType, viewType } = location?.state || {};


    const { profileData, selectedBusinessUnit, businessUnitList } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const [partnerDDl, getPartnerDDl] = useAxiosGet();
    const [bankList, getBankList] = useAxiosGet()
    const [, onCreateHandler, saveLoader] = useAxiosPost();

    useEffect(() => {
        getBankList(`/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`)
        getPartnerDDl(
            `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=4`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBusinessUnit])

    const saveHandler = (values, cb) => {

        const payload = {
            "intFundTransferRequestId": 0,
            "strRequestCode": "",
            "intRequestTypeId": viewType?.actionId || 0,
            "strRequestType": viewType?.actionName || "",
            strTransactionType: parentTransferType?.actionName || 0,
            intTransaferById: 1,
            strTransferBy: "Bank To Bank",
            strRequestPartnerId: values?.sendingPartner?.value || 0,
            strRequestPartnerName: values?.sendingPartner?.label || "",
            // IsTransferCreated
            "intRequestByUnitId": selectedBusinessUnit?.value,
            "strRequestByUnitName": selectedBusinessUnit?.label,
            "intRequestToUnitId": values?.requestToUnit?.value,
            "strRequestToUnitName": values?.requestToUnit?.label,
            "dteRequestDate": "2024-12-22T09:59:39.993Z",
            "numAmount": +values?.requestAmount || 0,
            "intRequestedBankId": values?.receivingAccount?.value || 0,
            "strRequestedBankName": values?.receivingAccount?.label || "",
            "intRequestedBankBranchId": values?.receivingAccount?.bankBranch_Id || 0,
            "strRequestedBankBranchName": values?.receivingAccount?.bankBranchName || "",
            "strRequestedBankAccountNumber": values?.receivingAccount?.bankAccNo || "",
            "strRequestedBankAccountName": values?.receivingAccount?.accountName || "",
            "intGivenBankId": values?.toBankName?.value || 0,
            "strGivenBankName": values?.toBankName?.label || "",
            "intGivenBankBranchId": values?.toBankName?.bankBranch_Id || 0,
            "strGivenBankBranchName": values?.toBankName?.bankBranchName || "",
            "strGivenBankAccountNumber": values?.toBankName?.bankAccNo || "",
            "strGivenBankAccountName": values?.toBankName?.accountName || "",
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
            validationSchema={getSchema()}
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
                    {console.log("errors", errors)}
                    {console.log("touched", touched)}
                    {saveLoader && <Loading />}
                    <IForm title="Inter Company Transfer Request Create" getProps={setObjprops}>
                        <Form>
                            <div className="form-group global-form row">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="requestToUnit"
                                        options={businessUnitList?.filter((item) => item?.value !== selectedBusinessUnit?.value) || []}
                                        value={values?.requestToUnit}
                                        label="Request To Unit"
                                        onChange={(valueOption) => setFieldValue("requestToUnit", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="receivingAccount"
                                        options={bankList || []}
                                        value={values?.receivingAccount}
                                        label="Receiving Account"
                                        onChange={(valueOption) => setFieldValue("receivingAccount", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>

                                <div className="col-lg-3">
                                    <NewSelect
                                        name="sendingPartner"
                                        options={partnerDDl?.filter((item) => item?.value !== selectedBusinessUnit?.value) || []}
                                        value={values?.sendingPartner}
                                        label="Sending Partner"
                                        onChange={(valueOption) => setFieldValue("sendingPartner", valueOption)}
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
                                        min={_todayDate()}
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
                                        selectedValue={values?.responsiblePerson}
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
