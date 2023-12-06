import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import { useParams } from "react-router-dom";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

const initData = {
  depositeType: "",
  partnerName: "",
  securityNumber: "",
  amount: "",
  issueDate: "",
  endDate: "",
  tDays: "",
  purpose: "",
  bankAccountNo: "",
};

const validationSchema = Yup.object().shape({
  depositeType: Yup.object().shape({
    label: Yup.string().required("Deposite Type is required"),
    value: Yup.string().required("Deposite Type is required"),
  }),
  partnerName: Yup.string().required("Partner Name is required"),
  securityNumber: Yup.string().required("Security Number is required"),
  amount: Yup.number().required("Amount is required"),
  issueDate: Yup.string().required("Issue Date is required"),
  endDate: Yup.string().required("End Date is required"),
  tDays: Yup.number().required("T Days is required"),
  purpose: Yup.string().required("Purpose is required"),
  bankAccountNo: Yup.object().shape({
    label: Yup.string().required("Bank Account No is required"),
    value: Yup.string().required("Bank Account No is required"),
  }),
});

export default function NonBankingFundCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const [, saveData, saveDataLaoder] = useAxiosPost();
  const [, getSingleData, getSingleDataLoader] = useAxiosGet();
  const [
    bankAccountDDL,
    getbankAccountDDL,
    bankAccountDDLloader,
  ] = useAxiosGet();
  const [modifiedData, setModifiedData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    getbankAccountDDL(`https://erp.ibos.io/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}
    `);
  }, []);
  useEffect(() => {
    // getSingleData()
  }, [id]);

  const saveHandler = (values, cb) => {
    // const payload = {};
    // saveData("", payload, cb, true)
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
          {(saveDataLaoder || getSingleDataLoader || bankAccountDDLloader) && (
            <Loading />
          )}
          <IForm
            title={id ? "Edit Non Banking Fund" : "Create Non Banking Fund"}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="depositeType"
                    options={[
                      { value: 1, label: "depositeType-1" },
                      { value: 2, label: "depositeType-2" },
                    ]}
                    value={values?.depositeType}
                    label="Deposite Type"
                    onChange={(valueOption) => {
                      setFieldValue("depositeType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.partnerName}
                    label="Partner Name"
                    name="partnerName"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("partnerName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.securityNumber}
                    label="Security Number"
                    name="securityNumber"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("securityNumber", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    label="Amount"
                    name="amount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("amount", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.purpose}
                    label="Purpose"
                    name="purpose"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("purpose", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.issueDate}
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("issueDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.endDate}
                    label="End Date"
                    name="endDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("endDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.tDays}
                    label="T Days"
                    name="tDays"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("tDays", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bankAccountNo"
                    options={bankAccountDDL || []}
                    value={values?.bankAccountNo}
                    label="Bank Account No"
                    onChange={(valueOption) => {
                      setFieldValue("bankAccountNo", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
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
