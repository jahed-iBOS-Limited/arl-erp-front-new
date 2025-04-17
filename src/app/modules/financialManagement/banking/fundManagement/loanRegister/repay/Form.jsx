import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import InputField from '../../../../../_helper/_inputField';
import NewSelect from '../../../../../_helper/_select';
import { loanRegisterSchema } from '../../../../../_helper/_validationSchema';
import { getBankAccountDDLByBankId } from '../../helper';
export default function RepayForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
}) {
  const history = useHistory();
  const location = useLocation();
  const {
    bu,
    intNbfiId,
    bankId,
    strLoanAccountName,
    numPrinciple,
    numPaid,
    strNbfiName,
    principal,
  } = location.state || {};

  const [accountDDL, setAccountDDL] = useState([]);
  const [, setLoading] = useState(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankAccountDDLByBankId(
      profileData?.accountId,
      bu || selectedBusinessUnit?.value,
      intNbfiId ? 0 : bankId,
      setAccountDDL,
      setLoading
    );
  }, [profileData, selectedBusinessUnit, location]);

  const initialValues = {
    ...initData,
    instrumentNo: strLoanAccountName || initData?.instrumentNo,
  };

  const principalBalance = Math.max(0, (+numPrinciple || 0) - (+numPaid || 0));

  const setTotalRepayment = ({
    principalAmount,
    interestAmount,
    numExciseDuty,
    setFieldValue,
  }) => {
    const totalRepayment =
      (+principalAmount || 0) + (+interestAmount || 0) + (+numExciseDuty || 0);
    setFieldValue('totalRepayment', totalRepayment || '');
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initialValues, principalBalance: principalBalance }}
        validationSchema={loanRegisterSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            history.push('/financial-management/banking/loan-register');
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
                <div className="col-lg-4">
                  <NewSelect
                    name="account"
                    options={accountDDL}
                    value={values?.account}
                    onChange={(valueOption) => {
                      setFieldValue('account', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    // isDisabled={isEdit}
                    label="Bank Account"
                    placeholder="Bank Account"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>NBFI</label>
                  <InputField value={strNbfiName || ''} name="nbfi" disabled />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Instrument No</label>
                  <InputField
                    value={values?.instrumentNo}
                    name="instrumentNo"
                    placeholder="Instrument No"
                    onChange={(e) => {
                      setFieldValue('instrumentNo', e.target.value);
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
                      setTotalRepayment({
                        principalAmount: e.target.value,
                        interestAmount: values?.interestAmount,
                        numExciseDuty: values?.numExciseDuty,
                        setFieldValue,
                      });
                      if (e.target.value > 0) {
                        setFieldValue('principalAmount', e.target.value);
                        setFieldValue(
                          'principalBalance',
                          (+principalBalance || 0) - (+e.target.value || 0)
                        );
                      } else {
                        setFieldValue('principalAmount', '');
                        setFieldValue('principalBalance', principalBalance);
                      }
                    }}
                    type="number"
                    // min={1}
                    max={
                      principal?.toFixed(2) || '100000000000000000000000000000'
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
                      setTotalRepayment({
                        principalAmount: values?.principalAmount,
                        interestAmount: e.target.value,
                        numExciseDuty: values?.numExciseDuty,
                        setFieldValue,
                      });
                      if (e.target.value > 0) {
                        setFieldValue('interestAmount', e.target.value);
                      } else {
                        setFieldValue('interestAmount', '');
                      }
                    }}
                    type="number"
                    // min="0"
                    step="any"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label> Excise Duty</label>
                  <InputField
                    value={values?.numExciseDuty}
                    name="numExciseDuty"
                    placeholder="Excise Duty"
                    onChange={(e) => {
                      setTotalRepayment({
                        principalAmount: values?.principalAmount,
                        interestAmount: values?.interestAmount,
                        numExciseDuty: e.target.value,
                        setFieldValue,
                      });
                      if (e.target.value > 0) {
                        setFieldValue('numExciseDuty', e.target.value);
                      } else {
                        setFieldValue('numExciseDuty', '');
                      }
                    }}
                    type="number"
                    // min="0"
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
                <div className="col-lg-2">
                  <label>Principal Balance</label>
                  <InputField
                    value={values?.principalBalance}
                    name="principalBalance"
                    type="number"
                    disabled
                  />
                </div>
                <div className="col-lg-2">
                  <label>Total Repayment</label>
                  <InputField
                    value={values?.totalRepayment}
                    name="totalRepayment"
                    type="number"
                    disabled
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
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
