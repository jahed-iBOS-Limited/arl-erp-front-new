import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import { useParams, useLocation } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { shallowEqual, useSelector } from "react-redux";
import { formatDateForMonthPicker } from "./helper";

const initData = {
  toinvestmentPartner: "",
  fromBankAccount: "",
  toBankAccount: "",
  fromMonth: new Date().toISOString().slice(0, 7),
  toMonth: new Date().toISOString().slice(0, 7),
  principleAmount: "",
  inRate: "",
};

// const validationSchema = Yup.object().shape({
//   item: Yup.object()
//     .shape({
//       label: Yup.string().required("Item is required"),
//       value: Yup.string().required("Item is required"),
//     })
//     .typeError("Item is required"),

//   remarks: Yup.string().required("Remarks is required"),
//   amount: Yup.number().required("Amount is required"),
//   date: Yup.date().required("Date is required"),
// });

export default function InterCompanyLoanCreate() {
  const [objProps, setObjprops] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [modifyIntData, setModifyInitData] = useState(initData);
  const [fromBankAccountDDL, getFromBankAccountDDL] = useAxiosGet();
  const [
    toBankAccountDDL,
    getToBankAccountDDL,
    ,
    setToBankAccountDDL,
  ] = useAxiosGet();
  const [businessPartnerDDL, getBusinessPartnerDDL] = useAxiosGet();
  const [, onSave, loader] = useAxiosPost();
  const location = useLocation();

  useEffect(() => {
    if (id) {
      setModifyInitData({
        toinvestmentPartner: {
          value: location?.state?.businessPartnerId,
          label: location?.state?.businessPartnerName,
        },
        fromBankAccount: {
          value: location?.state?.fromBankAccountId,
          label: location?.state?.fromBankAccountNumber,
        },
        toBankAccount: {
          value: location?.state?.toBankAccountId,
          label: location?.state?.toBankAccountNumber,
        },
        fromMonth: formatDateForMonthPicker(location?.state?.fromDate),
        toMonth: formatDateForMonthPicker(location?.state?.toDate),
        principleAmount: location?.state?.principleAmount,
        inRate: location?.state?.interestRate,
      });
    }
  }, []);

  useEffect(() => {
    getBusinessPartnerDDL(
      `/fino/FinanceCommonDDL/InterCompanyInvestmentPartnerDDL?BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getFromBankAccountDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);

  const { id } = useParams();

  const saveHandler = (values, cb) => {
    const payload = {
      loanId: 0,
      businessUnitIdIssued: selectedBusinessUnit?.value,
      businessUnitIdReceived: values?.toinvestmentPartner?.intId,
      businessPartnerId: values?.toinvestmentPartner?.value,
      fromBankAccountId: values?.fromBankAccount?.value,
      toBankAccountId: values?.toBankAccount?.value,
      fromDate: `${values?.fromMonth}-01`,
      toDate: `${values?.toMonth}-01`,
      principleAmount: +values?.principleAmount,
      interestRate: +values?.inRate,
      isCompleted: true,
      createdBy: profileData?.userId,
    };
    onSave(`/fino/CommonFino/InterCompanyLoanCreate`, payload, cb, true);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifyIntData : initData}
      //   validationSchema={validationSchema}
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
          {loader && <Loading />}
          <IForm title="Create Inter Company Loan" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="toinvestmentPartner"
                    options={businessPartnerDDL}
                    value={values?.toinvestmentPartner}
                    label="To Unit Investment Partner"
                    onChange={(valueOption) => {
                      setFieldValue("toinvestmentPartner", valueOption);
                      setFieldValue("toBankAccount", "");
                      setToBankAccountDDL([]);
                      if (valueOption) {
                        getToBankAccountDDL(
                          `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${valueOption?.intId}`
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="fromBankAccount"
                    options={fromBankAccountDDL}
                    value={values?.fromBankAccount}
                    label="From Bank Account"
                    onChange={(valueOption) => {
                      setFieldValue("fromBankAccount", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="toBankAccount"
                    options={toBankAccountDDL}
                    value={values?.toBankAccount}
                    label="To Bank Account"
                    onChange={(valueOption) => {
                      setFieldValue("toBankAccount", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromMonth}
                    label="From Month"
                    name="fromMonth"
                    type="month"
                    onChange={(e) => {
                      setFieldValue("fromMonth", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toMonth}
                    label="To Month"
                    name="toMonth"
                    type="month"
                    onChange={(e) => {
                      setFieldValue("toMonth", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.principleAmount}
                    label="Principle Amount"
                    name="principleAmount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("principleAmount", e.target.value);
                    }}
                  />
                </div>
                {console.log("values", values)}
                <div className="col-lg-3">
                  <InputField
                    value={values?.inRate}
                    label="Interest Rate"
                    name="inRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("inRate", e.target.value);
                    }}
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
