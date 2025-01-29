import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IForm from './../../../_helper/_form';
import InputField from './../../../_helper/_inputField';
import Loading from './../../../_helper/_loading';
import NewSelect from './../../../_helper/_select';

const initData = {
  depositeType: {
    value: 1,
    label: 'Security Deposit',
    code: null,
  },
  partner: '',
  securityNumber: '',
  amount: '',
  issueDate: _todayDate(),
  endDate: '',
  tDays: '',
  purpose: '',
  bankAccountNo: '',
  transactionDate: '',
};

const validationSchema = Yup.object().shape({
  depositeType: Yup.object().shape({
    label: Yup.string().required('Deposite Type is required'),
    value: Yup.string().required('Deposite Type is required'),
  }),
  partner: Yup.object().shape({
    label: Yup.string().required('Partner is required'),
    value: Yup.string().required('Partner is required'),
  }),
  securityNumber: Yup.string().required('Security Number is required'),
  amount: Yup.number().required('Amount is required'),
  issueDate: Yup.string().required('Issue Date is required'),
  // endDate: Yup.string().required("End Date is required"),
  // tDays: Yup.string().required("T Days is required"),
  purpose: Yup.string().required('Purpose is required'),
  bankAccountNo: Yup.object().shape({
    label: Yup.string().required('Bank Account No is required'),
    value: Yup.string().required('Bank Account No is required'),
  }),
  transactionDate: Yup.string().required('Transaction Date is required'),
});

export default function NonBankingFundCreateEdit() {
  const [objProps, setObjprops] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual,
  );
  const [, saveData, saveDataLaoder] = useAxiosPost();
  const [
    depositeTypeDDL,
    getDepositeTypeDDL,
    depositeTypeDDLloader,
  ] = useAxiosGet();
  const [partnerDDL, getPartnerDDL, partnerDDLloader] = useAxiosGet();
  const [
    bankAccountDDL,
    getbankAccountDDL,
    bankAccountDDLloader,
  ] = useAxiosGet();
  const { id } = useParams();

  useEffect(() => {
    getbankAccountDDL(`/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}
    `);
    getDepositeTypeDDL(`/fino/FundManagement/GetDepositTypeDDL`);
    getPartnerDDL(`/fino/FundManagement/GetNonBankingPartnerDDL?businessUnitId=${selectedBusinessUnit?.value}
    `);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    const payload = {
      depositLoanId: 0,
      businessUnitId: selectedBusinessUnit?.value,
      depositTypeId: values?.depositeType?.value,
      depositTypeName: values?.depositeType?.label,
      nonBankingPartnerId: values?.partner?.value,
      nonBankingPartnerName: values?.partner?.label,
      securityNumber: values?.securityNumber,
      issueDate: values?.issueDate,
      endDate: values?.endDate || null,
      purpose: values?.purpose,
      createdBy: profileData?.userId,
      bankAccountId: values?.bankAccountNo?.value,
      transactionDate: values?.transactionDate,
      amount: +values?.amount,
    };
    saveData(`/fino/FundManagement/CreateNonBankingFund`, payload, cb, true);
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
          {(saveDataLaoder ||
            bankAccountDDLloader ||
            depositeTypeDDLloader ||
            partnerDDLloader) && <Loading />}
          <IForm
            title={id ? 'Edit Non Banking Fund' : 'Create Non Banking Fund'}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="depositeType"
                    options={depositeTypeDDL || []}
                    value={values?.depositeType}
                    label="Deposite Type"
                    onChange={(valueOption) => {
                      setFieldValue('depositeType', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="partner"
                    options={partnerDDL || []}
                    value={values?.partner}
                    label="Partner"
                    onChange={(valueOption) => {
                      setFieldValue('partner', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.securityNumber}
                    label="Security Number"
                    name="securityNumber"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('securityNumber', e.target.value);
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
                      setFieldValue('bankAccountNo', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    label="Amount"
                    name="amount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue('amount', e.target.value);
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
                      setFieldValue('purpose', e.target.value);
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
                      setFieldValue('issueDate', e.target.value);
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
                      setFieldValue('endDate', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.transactionDate}
                    label="Transaction Date"
                    name="transactionDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue('transactionDate', e.target.value);
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
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
