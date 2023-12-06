import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const initData = {
  rowId: null,
  depositLoanId: null,
  transactionDate: "",
  amount: "",
  bankAccountNo: "",
};

const validationSchema = Yup.object().shape({
  rowId: Yup.string().required("Row Id is required"),
  depositLoanId: Yup.string().required("Deposit Loan Id is required"),
  transactionDate: Yup.string().required("Transaction Date is required"),
  amount: Yup.number().required("Amount is required"),
  bankAccountNo: Yup.object().shape({
    label: Yup.string().required("Bank Account No is required"),
    value: Yup.string().required("Bank Account No is required"),
  }),
});

export default function RepayModal({
  clickedItem,
  getLandingData,
  setClickedItem,
  setShowRepayModal,
}) {
  const [objProps, setObjprops] = useState({});
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [
    bankAccountDDL,
    getbankAccountDDL,
    bankAccountDDLloader,
  ] = useAxiosGet();

  const [, getSingleData, singleDataLoader] = useAxiosGet();
  const [, saveData, saveDataLaoder] = useAxiosPost();

  const saveHandler = (values, cb) => {
    const payload = {
      rowId: values?.rowId,
      depositLoanId: values?.depositLoanId,
      transactionDate: values?.transactionDate,
      amount: +values?.amount,
      bankAccountId: values?.bankAccountNo?.value,
      bankAccountNo: values?.bankAccountNo?.label,
      createdBy: profileData?.userId,
    };
    saveData(
      `/fino/FundManagement/RepayNonBankingFund`,
      payload,
      () => {
        setClickedItem(null);
        setShowRepayModal(false);
        getLandingData();
      },
      true
    );
  };
  useEffect(() => {
    getbankAccountDDL(`/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}
    `);
  }, []);

  useEffect(() => {
    if (clickedItem && clickedItem?.depositLoanId) {
      getSingleData(
        `/fino/FundManagement/GetNonBankingFundById?businessUnitId=${selectedBusinessUnit?.value}&id=${clickedItem?.depositLoanId}`,
        (data) => {
          initData.rowId = data[0]?.rowId;
          initData.depositLoanId = data[0]?.depositLoanId;
          initData.bankAccountNo = "";
          initData.transactionDate = _dateFormatter(data[0]?.transactionDate);
          initData.amount = data[0]?.amount;
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedItem]);

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
          {(bankAccountDDLloader || singleDataLoader || saveDataLaoder) && (
            <Loading />
          )}
          <IForm title="REPAY NON BANK FUND" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.transactionDate}
                    label="Transaction Date"
                    name="transactionDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("transactionDate", e.target.value);
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
