import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";
import { getBankAccountDDLByBankId } from "../../helper";
import { toast } from "react-toastify";

const loanRegister = Yup.object().shape({
  account: Yup.object().shape({
    label: Yup.string().required("Bank is required"),
    value: Yup.string().required("Bank is required"),
  }),
  instrumentNo: Yup.string().required("Instrument No is required"),
  // principalAmount: Yup.number().required("Principal Amount is required"),
});

export default function RepayForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
}) {
  const history = useHistory();
  const location = useLocation();
  const [accountDDL, setAccountDDL] = useState([]);
  const [, setLoading] = useState(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankAccountDDLByBankId(
      profileData?.accountId,
      location?.state?.bu || selectedBusinessUnit?.value,
      location?.state?.bankId,
      setAccountDDL,
      setLoading
    );
  }, [profileData, selectedBusinessUnit, location]);

  const initialValues = {
    ...initData,
    instrumentNo: location?.state?.strLoanAccountName || initData?.instrumentNo,
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={loanRegister}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (values?.principalAmount <= 0) {
            return toast.error("Principal Amount must be greater than 0");
          }
          saveHandler(values, () => {
            resetForm(initData);
            history.push("/financial-management/banking/loan-register");
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form h-100">
                {/* <div className="col-lg-4">
                  <NewSelect
                    name="bank"
                    options={bankDDL}
                    value={values?.bank}
                    onChange={(valueOption) => {
                      setFieldValue("bank", valueOption);
                      getBankAccountDDLByBankId(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setAccountDDL,
                        setLoading
                      );
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                    label="Bank"
                    placeholder="Bank"
                  />
                </div> */}
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
                    // isDisabled={isEdit}
                    label="Bank Account"
                    placeholder="Bank Account"
                  />
                </div>

                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Instrument No</label>
                  <InputField
                    value={values?.instrumentNo}
                    name="instrumentNo"
                    placeholder="Instrument No"
                    onChange={(e) => {
                      setFieldValue("instrumentNo", e.target.value);
                    }}
                    type="string"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Instrument Date</label>
                  <InputField
                    value={values?.instrumentDate}
                    name="instrumentDate"
                    placeholder="Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Principal Amount</label>
                  <InputField
                    value={values?.principalAmount}
                    name="principalAmount"
                    placeholder="Principal Amount"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("principalAmount", e.target.value);
                      } else {
                        setFieldValue("principalAmount", "");
                      }
                    }}
                    type="number"
                    min={1}
                    max={
                      location?.state?.principal ||
                      "100000000000000000000000000000"
                    }
                    step="any"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Interest Amount</label>
                  <InputField
                    value={values?.interestAmount}
                    name="interestAmount"
                    placeholder="Interest Amount"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue("interestAmount", e.target.value);
                      } else {
                        setFieldValue("interestAmount", "");
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Trans Date</label>
                  <InputField
                    value={values?.transDate}
                    name="transDate"
                    placeholder="Date"
                    type="date"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
