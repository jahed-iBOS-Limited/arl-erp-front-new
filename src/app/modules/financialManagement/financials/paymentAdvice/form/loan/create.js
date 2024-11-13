import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import { createLoanRegister, disbursementPurposeDDL, getBankAccountDDLByBankId, getBankDDL, getFacilityDLL } from "./helper";
import { toast } from "react-toastify";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import InputField from "../../../../../_helper/_inputField";

const initData = {
    bank: "",
    facility: "",
    account: "",
    openingDate: _todayDate(),
    loanAccNo: "",
    termDays: "",
    principle: "",
    interestRate: "",
    disbursementPurpose: "",
};

const loanRegister = Yup.object().shape({
    bank: Yup.object()
        .shape({
            label: Yup.string().required("Bank is required"),
            value: Yup.string().required("Bank is required"),
        })
        .nullable()
        .required("Bank is required"),
    facility: Yup.object()
        .shape({
            label: Yup.string().required("Facility is required"),
            value: Yup.string().required("Facility is required"),
        })
        .nullable()
        .required("Facility is required"),
    account: Yup.object()
        .shape({
            label: Yup.string().required("Account is required"),
            value: Yup.string().required("Account is required"),
        })
        .nullable()
        .required("Account is required"),
    openingDate: Yup.string().required("Opening Date is required"),
    principle: Yup.number()
        .min(1, "Principle is required")
        .required("Principle is required"),
    disbursementPurpose: Yup.object()
        .shape({
            label: Yup.string().required("Disbursement Purpose is required"),
            value: Yup.string().required("Disbursement Purpose is required"),
        })
        .nullable()
        .required("Disbursement Purpose is required"),
});

export default function LoanCreate({singleData}) {
    const [objProps, setObjprops] = useState({});

    const [bankDDL, setBankDDL] = useState([]);
    const [accountDDL, setAccountDDL] = useState([]);
    const [facilityDDL, setFacilityDDL] = useState([]);
    const [, setLoading] = useState(false);
    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state?.authData;
    }, shallowEqual);

    useEffect(() => {
        getBankDDL(setBankDDL, setLoading);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveHandler = (values, cb) => {
        if (!values?.bank) {
            return toast.warn("Please Select Bank");
        }
        if (!values?.account) {
            return toast.warn("Please Select Bank Account");
        }
        if (!values?.facility) {
            return toast.warn("Please Select Facility");
        }

        createLoanRegister({
            accId: profileData?.accountId,
            buId: selectedBusinessUnit?.value,
            loanAcc: values?.loanAccNo,
            bankId: values?.bank?.value,
            bankAccId: values?.account?.value,
            facilityId: values?.facility?.value,
            startDate: values?.openingDate,
            tenureDays: +values?.termDays,
            principle: +values?.principle,
            interest: +values?.interestRate,
            disbursementPurposeId: values?.disbursementPurpose?.value || 0,
            disbursementPurposeName: values?.disbursementPurpose?.label || "",
            actionId: profileData?.userId,
            cb: cb,
            isConfirm: false,
            loanAccountId: 0
        }
        );
    };
    return (
        <Formik
            enableReinitialize={true}
            initialValues={initData}
            validationSchema={loanRegister}
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
                    <IForm title="Create Loan Register" getProps={setObjprops}>
                        <Form>
                            <div className="form-group  global-form row">
                                <div className="col-lg-4">
                                    <NewSelect
                                        name="bank"
                                        options={bankDDL}
                                        value={values?.bank}
                                        onChange={(valueOption) => {
                                            setFieldValue("bank", valueOption);
                                            setFieldValue("account", "");
                                            setFieldValue("facility", "");
                                            setFieldValue("termDays", "");
                                            getBankAccountDDLByBankId(
                                                profileData?.accountId,
                                                selectedBusinessUnit?.value,
                                                valueOption?.value,
                                                setAccountDDL,
                                                setLoading
                                            );
                                            getFacilityDLL(
                                                selectedBusinessUnit?.value,
                                                valueOption?.value,
                                                (resData) => {
                                                    setFacilityDDL(resData);
                                                },
                                                setLoading
                                            );
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        label="Bank"
                                        placeholder="Bank"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <NewSelect
                                        name="account"
                                        options={accountDDL}
                                        value={values?.account}
                                        onChange={(valueOption) => {
                                            setFieldValue("account", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        label="Bank Account"
                                        placeholder="Bank Account"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <NewSelect
                                        name="facility"
                                        options={facilityDDL}
                                        value={values?.facility}
                                        onChange={(valueOption) => {
                                            setFieldValue("facility", valueOption);
                                            setFieldValue("remarks", valueOption?.remarks);
                                            setFieldValue("interestRate", valueOption?.iterestRate);
                                            setFieldValue("termDays", valueOption?.tenorDays || 0);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        label="Facility"
                                        placeholder="Facility"
                                    />
                                </div>
                                <div className="col-lg-3 pl pr-1 mb-1">
                                    <label>Loan Acc No</label>
                                    <InputField
                                        value={values?.loanAccNo}
                                        name="loanAccNo"
                                        placeholder="Loan Acc No"
                                        onChange={(e) => {
                                            setFieldValue("loanAccNo", e.target.value);
                                        }}
                                        type="string"
                                    />
                                </div>
                                <div className="col-lg-3">
                                    <label>Opening Date</label>
                                    <InputField                                        value={values?.openingDate}
                                        name="openingDate"
                                        placeholder="Date"
                                        type="date"
                                    />
                                </div>
                                <div className="col-lg-3 pl pr-1 mb-1">
                                    <label>Term (Days)</label>
                                    <InputField
                                        value={values?.termDays}
                                        name="termDays"
                                        placeholder="Term (Days)"
                                        onChange={(e) => {
                                            if (e.target.value > 0) {
                                                setFieldValue("termDays", e.target.value);
                                            } else {
                                                setFieldValue("termDays", "");
                                            }
                                        }}
                                        type="number"
                                        min="0"
                                        step="any"
                                    />
                                </div>
                                <div className="col-lg-3 pl pr-1 mb-1">
                                    <label>Principal</label>
                                    <InputField
                                        value={values?.principle}
                                        name="principle"
                                        placeholder="Principal"
                                        onChange={(e) => {
                                            if (e.target.value > 0) {
                                                setFieldValue("principle", e.target.value);
                                            } else {
                                                setFieldValue("principle", "");
                                            }
                                        }}
                                        type="number"
                                        min="0"
                                        step="any"
                                    />
                                </div>
                                <div className="col-lg-3 pl pr-1 mb-1">
                                    <label>Interest Rate</label>
                                    <InputField
                                        value={values?.interestRate}
                                        name="interestRate"
                                        placeholder="Interest Rate"
                                        onChange={(e) => {
                                            if (e.target.value > 0) {
                                                setFieldValue("interestRate", e.target.value);
                                            } else {
                                                setFieldValue("interestRate", "");
                                            }
                                        }}
                                        type="number"
                                        min="0"
                                        step="any"
                                    />
                                </div>

                                <div className="col-lg-3">
                                    <NewSelect
                                        name="disbursementPurpose"
                                        options={disbursementPurposeDDL}
                                        value={values?.disbursementPurpose}
                                        onChange={(valueOption) => {
                                            setFieldValue("disbursementPurpose", valueOption);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        label="Disbursement Purpose"
                                        placeholder="Disbursement Purpose"
                                    />
                                </div>
                                <div className="col-lg-3 ">
                                    <label>Remarks</label>
                                    <InputField
                                        value={values?.remarks}
                                        name="remarks"
                                        placeholder="Remarks"
                                        onChange={(e) => {
                                            setFieldValue("remarks", "");
                                        }}
                                        type="text"
                                        disabled={true}
                                    />
                                </div>
                            </div>

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