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


const initData = {
    investmentPartner: "",
    fromBankName: "",
    toBankName: "",
    expectedDate: "",
    requestAmount: "",
    responsiblePerson: "",
    remarks: "",
    transferType: ""
};

const getSchema = (transferType) => {
    const validationSchema = Yup.object().shape({
        transferType: Yup.object()
            .shape({
                label: Yup.string().required("Transfer Type is required"),
                value: Yup.string().required("Transfer Type is required"),
            })
            .typeError("Transfer Type is required"),
        toBankName: transferType === "Bank"
            ? Yup.object()
                .shape({
                    label: Yup.string().required("Transfer To Bank is required"),
                    value: Yup.string().required("Transfer To Bank is required"),
                })
                .typeError("Transfer To Bank is required")
            : Yup.mixed().notRequired(),
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



export default function InterCompanyTransferRequestCreate() {
    const [objProps, setObjprops] = useState({});

    const location = useLocation();
    const { transferType } = location?.state || {};

    console.log("location", location)
    console.log("transferType", transferType)

    const { profileData, selectedBusinessUnit, businessUnitList } = useSelector((state) => {
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
            "intRequestTypeId": values?.transferType?.value,
            "strRequestType": values?.transferType?.label,
            "intRequestByUnitId": selectedBusinessUnit?.value,
            "strRequestByUnitName": selectedBusinessUnit?.label,
            "intRequestToUnitId": selectedBusinessUnit?.value,
            "strRequestToUnitName": selectedBusinessUnit?.label,
            "dteRequestDate": "2024-12-22T09:59:39.993Z",
            "numAmount": values?.requestAmount || 0,
            "intRequestedBankId": values?.fromBankName?.value || 0,
            "strRequestedBankName": values?.fromBankName?.label || "",
            "intRequestedBankBranchId": values?.fromBankName?.bankBranch_Id || 0,
            "strRequestedBankBranchName": values?.fromBankName?.bankBranchName || "",
            "strRequestedBankAccountNumber": values?.fromBankName?.bankAccNo || "",
            "strRequestedBankAccountName": values?.fromBankName?.accountName || "",
            "intGivenBankId": values?.toBankName?.value,
            "strGivenBankName": values?.toBankName?.label,
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
            validationSchema={getSchema(transferType)}
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
                                        name="transferType"
                                        options={[{ value: 1, label: "Bank" }, { value: 2, label: "Cash" }]}
                                        value={values?.transferType}
                                        label="Transfer Type"
                                        onChange={(valueOption) => {
                                            setFieldValue("transferType", valueOption)
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>

                                <div className="col-lg-3">
                                    <NewSelect
                                        name="investmentPartner"
                                        options={businessUnitList || []}
                                        value={values?.investmentPartner}
                                        label="Investment Partner"
                                        onChange={(valueOption) => setFieldValue("investmentPartner", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>

                                {/* Bank Name */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="fromBankName"
                                        options={bankList || []}
                                        value={values?.fromBankName}
                                        label="Slect Bank Account"
                                        onChange={(valueOption) => setFieldValue("fromBankName", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                {/* <div className="col-lg-3">
                                    <NewSelect
                                        name="toBankName"
                                        options={bankList || []}
                                        value={values?.toBankName}
                                        label="Select Partner Bank Account"
                                        onChange={(valueOption) => setFieldValue("toBankName", valueOption)}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div> */}


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
