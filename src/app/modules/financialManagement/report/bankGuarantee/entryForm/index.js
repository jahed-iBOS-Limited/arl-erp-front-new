import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import * as Yup from "yup";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import BankGuarantee from "./bankGuarantee";
import DepositRegister from "./depositRegister";
import { initData, makePayload } from "../helper";
import "../style.css";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { dateFormatterForInput } from "../../../../productionManagement/msilProduction/meltingProduction/helper";

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required("Item is required"),
      value: Yup.string().required("Item is required"),
    })
    .typeError("Item is required"),

  remarks: Yup.string().required("Remarks is required"),
  amount: Yup.number().required("Amount is required"),
  date: Yup.date().required("Date is required"),
});

export default function BankGuaranteeEntry() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const { entryType, typeId } = useParams();
  const [attachmentFile, setAttachmentFile] = useState("");
  const [bankDDL, getBankDDL] = useAxiosGet();
  const [bankAccDDL, getBankAccDDL] = useAxiosGet();
  const [sbuDDL, getSbuDDL] = useAxiosGet();
  const [, createHandler, saveLoading] = useAxiosPost();
  const location = useLocation();
  const [modifyData, setModifyData] = useState({});

  console.log("location", location);

  useEffect(() => {
    if (location?.state?.intId && entryType !== "create") {
      setModifyData({
        sbu: {
          value: location?.state?.intSbuId,
          label: location?.state?.strSbu,
        },
        bank: {
          value: location?.state?.intBankId,
          label: location?.state?.strBankName,
        },
        bankGuaranteeNumber: location?.state?.strBankGuaranteeNumber,
        beneficiary: {
          value: location?.state?.intBankAccountId,
          label: location?.state?.strBeneficiaryLabel,
          accountName: location?.state?.strBeneficiaryName,
          bankAccNo: location?.state?.strBeneficiaryNumber,
        },
        issuingDate: dateFormatterForInput(location?.state?.dteIssueDate),
        endingDate: dateFormatterForInput(location?.state?.dteEndingDate),
        tDays: location?.state?.intTdays,
        currency: {
          value: location?.state?.intCurrencyId,
          label: location?.state?.strCurrency,
        },
        marginRef: location?.state?.strMarginRef,
        securityType: {
          value: location?.state?.strSecurityType,
          label: location?.state?.strSecurityType,
        },
        retirementDate: dateFormatterForInput(location?.state?.dteEndingDate),
        amount: location?.state?.numAmount,
        inFavOf: location?.state?.strInFavOf,
        purpose: location?.state?.strPurpose,
        responsiblePerson: {
          value: location?.state?.intResponsiblePersonId,
          label: location?.state?.strResponsiblePerson,
        },
        note: location?.state?.strRemarks,
      });

      setAttachmentFile(location?.state?.strAttachment || "");
    }
  }, [location]);

  useEffect(() => {
    getBankDDL(`/hcm/HCMDDL/GetBankDDL`);
    getBankAccDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`
    );
    getSbuDDL(
      `/fino/Disbursement/GetSbuDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    createHandler(
      `/fino/CommonFino/CreateBankGuaranteeSecurityRegister`,
      makePayload({
        values,
        entryType,
        attachmentFile,
        selectedBusinessUnit,
        typeId,
        userId: profileData?.userId,
        location
      }),
      entryType === "create"
        ? () => {
            cb();
            setAttachmentFile("");
          }
        : null,
      true
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={entryType === "create" ? initData : modifyData}
      // validationSchema={{}}
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
          {saveLoading && <Loading />}
          <IForm
            title={`${entryType?.toUpperCase()} ${
              +typeId === 1
                ? "BANK GUARANTEE"
                : +typeId === 2
                ? "DEPOSIT REGISTER"
                : ""
            }`}
            getProps={setObjprops}
          >
            <div className="bank-guarantee-entry">
              {[1].includes(+typeId) ? (
                <BankGuarantee
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  bankDDL={bankDDL}
                  bankAccDDL={bankAccDDL}
                  sbuDDL={sbuDDL}
                />
              ) : [2].includes(+typeId) ? (
                <DepositRegister
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  bankDDL={bankDDL}
                  bankAccDDL={bankAccDDL}
                  attachmentFile={attachmentFile}
                  setAttachmentFile={setAttachmentFile}
                  accId={profileData?.accountId}
                  sbuDDL={sbuDDL}
                />
              ) : null}
            </div>
            <Form>
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
