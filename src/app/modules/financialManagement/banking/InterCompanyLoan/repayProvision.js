import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";

const initData = {
  transactionDate: _todayDate(),
  amount: "",
  interestAmount: "",
};

export default function RepayProvisionActionModal({ singleData, actionType }) {
  const [objProps, setObjprops] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [, onSave, loader] = useAxiosPost();

  const saveHandler = (values, cb) => {
    const payload = {
      loanId: singleData?.loanId,
      type: actionType,
      transactionDate: values?.transactionDate,
      amount: +values?.amount || 0,
      interestAmount: +values?.interestAmount || 0,
      createdBy: profileData?.userId,
    };
    onSave(
      `/fino/CommonFino/InterCompanyLoanRepayProvision`,
      payload,
      cb,
      true
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          <IForm
            title=""
            getProps={setObjprops}
            isHiddenBack={true}
            isHiddenReset={true}
          >
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
                  <InputField
                    value={values?.interestAmount}
                    label="Interest Amount"
                    name="interestAmount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("interestAmount", e.target.value);
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
