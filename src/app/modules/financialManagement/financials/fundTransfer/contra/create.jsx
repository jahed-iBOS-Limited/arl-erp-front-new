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
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";


const initData = {
    fromBankName: "",
    toBankName: "",
    expectedDate: "",
    requestAmount: "",
    responsiblePerson: "",
    remarks: "",
    transferType: "",
    gl: "",
};

const getSchema = () => {
    const validationSchema = Yup.object().shape({
        transferType: Yup.object()
            .shape({
                label: Yup.string().required("Transfer Type is required"),
                value: Yup.string().required("Transfer Type is required"),
            })
            .typeError("Transfer Type is required"),
        fromBankName: Yup.object()
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
    });

    return validationSchema;
}



export default function ContraCreate() {
    const [objProps, setObjprops] = useState({});

    const location = useLocation();
    const { parentTransferType, viewType } = location?.state || {};

    const transferTypeList = parentTransferType?.actionName === "Bank Transfer" ? [{ value: 1, label: "Bank To Bank" }, { value: 2, label: "Bank To Cash" }] : [{ value: 3, label: "Cash To Bank" }]


    const { profileData, selectedBusinessUnit } = useSelector((state) => {
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
            "intRequestTypeId": viewType?.actionId,
            "strRequestType": viewType?.actionName,
            strTransactionType: parentTransferType?.actionName,
            intTransaferById: values?.transferType?.value,
            strTransferBy: values?.transferType?.label,
            "intRequestByUnitId": selectedBusinessUnit?.value,
            "strRequestByUnitName": selectedBusinessUnit?.label,
            "intRequestToUnitId": selectedBusinessUnit?.value,
            "strRequestToUnitName": selectedBusinessUnit?.label,
            "dteRequestDate": new Date().toISOString(),
            "numAmount": values?.requestAmount || 0,
            "intRequestedBankId": values?.toBankName?.bankId || 0,
            "strRequestedBankName": values?.toBankName?.bankName || "",
            "intRequestedBankBranchId": values?.toBankName?.bankBranch_Id || 0,
            "strRequestedBankBranchName": values?.toBankName?.bankBranchName || "",
            "strRequestedBankAccountNumber": values?.toBankName?.bankAccNo || "",
            "strRequestedBankAccountName": values?.toBankName?.label || "",
            "intRequestedBankAccountId": values?.toBankName?.value || 0,
            "intGivenBankId": values?.fromBankName?.bankId || 0,
            "strGivenBankName": values?.fromBankName?.bankName || "",
            "intGivenBankBranchId": values?.fromBankName?.bankBranch_Id || 0,
            "strGivenBankBranchName": values?.fromBankName?.bankBranchName || "",
            "strGivenBankAccountNumber": values?.fromBankName?.bankAccNo || "",
            "strGivenBankAccountName": values?.fromBankName?.label || "",
            "strGivenBankAccountId": values?.fromBankName?.value || 0,
            "intGivenGlid": values?.fromBankName?.generalLedgerId || 0,
            "strGivenGlName": values?.fromBankName?.generalLedgerName || "",
            "strGivenGlCode": values?.fromBankName?.generalLedgerCode || "",
            "strRemarks": values?.remarks || "",
            "dteExpectedDate": values?.expectedDate,
            "intResponsibleEmpId": values?.responsiblePerson?.value || 0,
            "strResponsibleEmpName": values?.responsiblePerson?.label || "",
            "isActive": true,
            "intActionBy": profileData?.userId,
            "intUpdateBy": profileData?.userId,
            intRequestGLId: values?.gl?.value || 0,
            strRequestGlName: values?.gl?.label || "",
            strRequestGlCode: values?.transferType?.value === 1 ? values?.toBankName?.generalLedgerCode : values?.gl?.strGeneralLedgerCode || ""

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
                if (parentTransferType?.actionName === "Bank Transfer" && values?.transferType?.value === 1 && !values?.toBankName) {
                    return toast.warn("Transfer To Bank is Required")
                }
                if ([2, 3, 4].includes(values?.transferType?.value) && !values?.gl) {
                    return toast.warn("GL is Required")
                }
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
                    <IForm title="Contra Create" getProps={setObjprops}>
                        <Form>
                            <div className="form-group global-form row">
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="transferType"
                                        options={transferTypeList}
                                        value={values?.transferType}
                                        label="Transfer Type"
                                        onChange={(valueOption) => {
                                            setFieldValue("transferType", valueOption)
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>

                                {[3, 4].includes(values?.transferType?.value) && <div className="col-lg-3">

                                    <NewSelect
                                        name="gl"
                                        options={[{ value: 157, label: "Cash in Hand", strGeneralLedgerCode: "1130001" }]}
                                        value={values?.gl}
                                        label={"Select GL"}
                                        onChange={(valueOption) => setFieldValue("gl", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>}

                                {/* Bank Name */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="fromBankName"
                                        options={bankList || []}
                                        value={values?.fromBankName}
                                        label={"Transfer From Bank"}
                                        onChange={(valueOption) => setFieldValue("fromBankName", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                {[2].includes(values?.transferType?.value) && <div className="col-lg-3">

                                    <NewSelect
                                        name="gl"
                                        options={[{ value: 157, label: "Cash in Hand", strGeneralLedgerCode: "1130001" }]}
                                        value={values?.gl}
                                        label={"Select GL"}
                                        onChange={(valueOption) => setFieldValue("gl", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>}
                                {(parentTransferType?.actionName === "Bank Transfer" && values?.transferType?.value === 1) && (<div className="col-lg-3">
                                    <NewSelect
                                        name="toBankName"
                                        options={bankList || []}
                                        value={values?.toBankName}
                                        label={"Transfer TO Bank"}
                                        onChange={(valueOption) => setFieldValue("toBankName", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>)}




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
