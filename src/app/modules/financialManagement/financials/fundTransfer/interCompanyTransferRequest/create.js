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
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";


const initData = {
    sendingPartner: "",
    requestToUnit: "",
    requestToPartner: "",
    receivingAccount: "",
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
        sendingPartner: Yup.object()
            .shape({
                label: Yup.string().required("Sending Partner is required"),
                value: Yup.string().required("Sending Partner is required"),
            })
            .typeError("Sending Partner is required"),

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
        requestToPartner: Yup.object()
            .shape({
                label: Yup.string().required("Request To Partner is required"),
                value: Yup.string().required("Request To Partner is required"),
            })
            .typeError("Request To Partner is required"),
    });

    return validationSchema;
}



export default function InterCompanyTransferRequestCreate() {
    const [objProps, setObjprops] = useState({});

    const location = useLocation();
    const { parentTransferType, viewType, rowItem } = location?.state || {};


    const { profileData, selectedBusinessUnit, businessUnitList } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    // const [partnerDDl, getPartnerDDl] = useAxiosGet();
    const [, getSendingPartnerByOwnUnit, sendingPartnerLoading,] = useAxiosGet();
    const [, getRequestPartnerByOwnUnit, requestPartnerLoading,] = useAxiosGet();
    // const [requestTopartnerDDl, getRequestToPartnerDDl, , setRequestToPartnerDDl] = useAxiosGet();
    const [bankList, getBankList] = useAxiosGet()
    const [, onCreateHandler, saveLoader] = useAxiosPost();
    const [modifiedInitData, setModifiedIntitData] = useState(initData)

    useEffect(() => {
        if (rowItem?.intFundTransferRequestId) {
            setModifiedIntitData({
                sendingPartner: {
                    value: rowItem?.intGivenPartnerId || "",
                    label: rowItem?.strGivenPartnerName || "",
                    strBusinessPartnerCode: rowItem?.strGivenstrPartnerCode || "",
                },
                requestToUnit: {
                    value: rowItem?.intRequestToUnitId || "",
                    label: rowItem?.strRequestToUnitName || "",
                },
                requestToPartner: {
                    value: rowItem?.strRequestPartnerId || "",
                    label: rowItem?.strRequestPartnerName || "",
                    strBusinessPartnerCode: rowItem?.strRequestPartnerCode || "",
                },
                receivingAccount: {
                    value: rowItem?.intRequestedBankAccountId || "",
                    label: rowItem?.strRequestedBankAccountName || "",
                    bankId: rowItem?.intRequestedBankId || "",
                    bankName: rowItem?.strRequestedBankName || "",
                    bankBranch_Id: rowItem?.intRequestedBankBranchId || "",
                    bankBranchName: rowItem?.strRequestedBankBranchName || "",
                    bankAccNo: rowItem?.strRequestedBankAccountNumber || "",
                    bankRouting: rowItem?.strRequestedBankRouting || "",
                    generalLedgerId: rowItem?.intRequestGlid || "",
                    generalLedgerName: rowItem?.strRequestGlName || "",
                    generalLedgerCode: rowItem?.strRequestGlCode || "",
                },
                expectedDate: _dateFormatter(rowItem?.dteExpectedDate) || "",
                requestAmount: rowItem?.numAmount || "",
                responsiblePerson: {
                    value: rowItem?.intResponsibleEmpId || "",
                    label: rowItem?.strResponsibleEmpName || "",
                },
                remarks: rowItem?.strRemarks || "",
            });
        }
    }, [rowItem]);


    useEffect(() => {
        getBankList(`/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`)
        // getPartnerDDl(
        //     `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=4`
        // );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBusinessUnit])

    const saveHandler = (values, cb) => {

        const payload = {
            intFundTransferRequestId: rowItem?.intFundTransferRequestId || 0,
            strRequestCode: "",
            intRequestTypeId: viewType?.actionId || 0,
            strRequestType: viewType?.actionName || "",
            strTransactionType: parentTransferType?.actionName || 0,
            intTransaferById: 1,
            strTransferBy: "Bank To Bank",
            isTransferCreated: 0,
            strRequestPartnerId: values?.requestToPartner?.value || 0,
            strRequestPartnerName: values?.requestToPartner?.label || "",
            strRequestPartnerCode: values?.requestToPartner?.strBusinessPartnerCode || "",
            intRequestByUnitId: selectedBusinessUnit?.value,
            strRequestByUnitName: selectedBusinessUnit?.label,
            intRequestToUnitId: values?.requestToUnit?.value,
            strRequestToUnitName: values?.requestToUnit?.label,
            intRequestGLId: values?.receivingAccount?.generalLedgerId || 0,
            strRequestGlName: values?.receivingAccount?.generalLedgerName || "",
            strRequestGlCode: values?.receivingAccount?.generalLedgerCode || "",
            dteRequestDate: new Date().toISOString(),
            numAmount: +values?.requestAmount || 0,
            intRequestedBankId: values?.receivingAccount?.bankId || 0,
            strRequestedBankName: values?.receivingAccount?.bankName || "",
            intRequestedBankBranchId: values?.receivingAccount?.bankBranch_Id || 0,
            strRequestedBankBranchName: values?.receivingAccount?.bankBranchName || "",
            strRequestedBankAccountNumber: values?.receivingAccount?.bankAccNo || "",
            strRequestedBankAccountName: values?.receivingAccount?.label || "",
            intRequestedBankAccountId: values?.receivingAccount?.value || 0,
            strRequestedBankRouting: values?.receivingAccount?.bankRouting || "",
            // "intGivenBankId": values?.fromBankName?.bankId || 0,
            // "strGivenBankName": values?.fromBankName?.bankName || "",
            // "intGivenBankBranchId": values?.fromBankName?.bankBranch_Id || 0,
            // "strGivenBankBranchName": values?.fromBankName?.bankBranchName || "",
            // "strGivenBankAccountNumber": values?.fromBankName?.bankAccNo || "",
            // "strGivenBankAccountName": values?.fromBankName?.label || "",
            // "strGivenBankAccountId": values?.fromBankName?.value || 0,
            // "intGivenGlid": values?.fromBankName?.generalLedgerId || 0,
            // "strGivenGlName": values?.fromBankName?.generalLedgerName || "",
            // "strGivenGlCode": values?.fromBankName?.generalLedgerCode || "",
            strRemarks: values?.remarks || "",
            dteExpectedDate: values?.expectedDate,
            intResponsibleEmpId: values?.responsiblePerson?.value || 0,
            strResponsibleEmpName: values?.responsiblePerson?.label || "",
            isActive: true,
            intActionBy: profileData?.userId,
            intUpdateBy: profileData?.userId,
            intGivenPartnerId: values?.sendingPartner?.value || 0,
            strGivenPartnerName: values?.sendingPartner?.label || "",
            strGivenstrPartnerCode: values?.sendingPartner?.strBusinessPartnerCode || "",
            isApproved: rowItem?.isApproved || 0,

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
            initialValues={rowItem?.intFundTransferRequestId ? modifiedInitData : initData}
            validationSchema={getSchema()}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    if (!rowItem?.intFundTransferRequestId) {
                        resetForm(initData);
                    }
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
                    {(saveLoader || sendingPartnerLoading || requestPartnerLoading) && <Loading />}
                    <IForm title={rowItem?.intFundTransferRequestId ? "Inter Company Transfer Request Edit" : "Inter Company Transfer Request Create"} getProps={setObjprops}>
                        <Form>
                            <div className="form-group global-form row">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="requestToUnit"
                                        options={businessUnitList?.filter((item) => item?.value !== selectedBusinessUnit?.value) || []}
                                        value={values?.requestToUnit}
                                        label="Request To Unit"
                                        onChange={(valueOption) => {
                                            setFieldValue("requestToUnit", valueOption || "")
                                            setFieldValue("requestToPartner", "")
                                            setFieldValue("sendingPartner", "")
                                            if (valueOption) {
                                                getSendingPartnerByOwnUnit(
                                                    `/partner/PManagementCommonDDL/GetBusinessPartnerByOwnUnit?businessUnitId=${selectedBusinessUnit?.value}&businessPartnerOwnUnitId=${valueOption?.value}`, (res) => {
                                                        if (res?.intBusinessPartnerId && res?.strBusinessPartnerName) {
                                                            setFieldValue("sendingPartner", { ...res, value: res?.intBusinessPartnerId, label: res?.strBusinessPartnerName });

                                                        } else {
                                                            toast.warn("Please Business Partner Configure Properly")
                                                        }
                                                    }
                                                );
                                                getRequestPartnerByOwnUnit(
                                                    `/partner/PManagementCommonDDL/GetBusinessPartnerByOwnUnit?businessUnitId=${valueOption?.value}&businessPartnerOwnUnitId=${selectedBusinessUnit?.value}`, (res) => {
                                                        if (res?.intBusinessPartnerId && res?.strBusinessPartnerName) {
                                                            setFieldValue("requestToPartner", { ...res, value: res?.intBusinessPartnerId, label: res?.strBusinessPartnerName });
                                                        } else {
                                                            toast.warn("Please Business Partner Configure Properly")
                                                        }
                                                    }
                                                );
                                            }
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="requestToPartner"
                                        // options={requestTopartnerDDl?.filter((item) => item?.value !== values?.requestToUnit?.value) || []}
                                        value={values?.requestToPartner}
                                        label="Request To Partner"
                                        onChange={(valueOption) => setFieldValue("requestToPartner", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
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
                                        // options={partnerDDl?.filter((item) => item?.value !== selectedBusinessUnit?.value) || []}
                                        value={values?.sendingPartner}
                                        label="Sending Partner"
                                        onChange={(valueOption) => setFieldValue("sendingPartner", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={true}
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
