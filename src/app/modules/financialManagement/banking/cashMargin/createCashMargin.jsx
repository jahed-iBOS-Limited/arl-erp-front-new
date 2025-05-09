import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';

const initData = {
  //  cashMarginCode: '',
  refType: '',
  refNo: '',
  bankName: '',
  principleAmount: '',
  marginPercent: '',
  marginAmount: '',
  //  balance: '',
  maturityDate: '',
  narration: '',
  cashMarginType: '',
  bankAccountNo: '',
};

const validationSchema = Yup.object().shape({
  //  cashMarginCode: Yup.object()
  //     .shape({
  //        label: Yup.string().required('Cash Margin Code is required'),
  //        value: Yup.string().required('Cash Margin Code is required'),
  //     })
  //     .typeError('Cash Margin Code is required'),
  refType: Yup.object()
    .shape({
      label: Yup.string().required('Ref Type is required'),
      value: Yup.string().required('Ref Type is required'),
    })
    .typeError('Ref Type is required'),
  cashMarginType: Yup.object().shape({
    label: Yup.string().required('Cash Margin Type is required'),
    value: Yup.string().required('Cash Margin Type is required'),
  }),
  bankAccountNo: Yup.object().shape({
    label: Yup.string().required('Bank Account No is required'),
    value: Yup.string().required('Bank Account No is required'),
  }),
  bankName: Yup.object()
    .shape({
      label: Yup.string().required('Bank Name is required'),
      value: Yup.string().required('Bank Name is required'),
    })
    .typeError('Bank Name is required'),

  principleAmount: Yup.number().required('Principal Amount is required'),
  marginPercent: Yup.number().required('Margin Percent is required'),
  marginAmount: Yup.number().required('Margin Amount is required'),
  narration: Yup.string().required('Narration is required'),
  //  balance: Yup.number().required('Balance is required'),
  maturityDate: Yup.date().required('Maturity Date is required'),
});

export default function CreateCashMargin() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [bankDDL, getBankDDL] = useAxiosGet();
  const [bankAccountDDL, getBankAccountDDL] = useAxiosGet([]);
  const [, createHandler, saveLoading] = useAxiosPost();

  useEffect(() => {
    getBankDDL(`/hcm/HCMDDL/GetBankDDL`);
    getBankAccountDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}`
    );
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    const payload = {
      sl: 0,
      intCashMarginId: 0,
      strCashMarginCode: values?.cashMarginCode,
      intBusinessUnitId: selectedBusinessUnit?.value,
      strReffType: values?.refType?.label,
      strReffNo: values?.refNo,
      intBankId: values?.bankName?.value,
      strBankName: values?.bankName?.label,
      strBankCode: values?.bankName?.code,
      numPrincipleAmount: +values?.principleAmount,
      numMarginPercent: +values?.marginPercent,
      numMarginAmount: +values?.marginAmount,
      numBalance: 0,
      dteMaturityDate: values?.maturityDate,
      strRemarks: values?.narration,
      intCreatedBy: profileData?.userId,
      strBankAccountName: values?.bankAccountNo?.label || '',
      intBankAccountId: values?.bankAccountNo?.value || 0,
      strCashMarginType: values?.cashMarginType?.label || '',
    };

    createHandler(
      '/fino/FundManagement/CreateFundCashMargin',
      payload,
      cb,
      true
    );
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
          {saveLoading && <Loading />}
          <IForm title={'Create Cash Margin'} getProps={setObjprops}>
            <div className="bank-guarantee-entry">
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="cashMarginType"
                    options={[
                      { value: 1, label: 'Cash Refund' },
                      { value: 2, label: 'Cash Payment' },
                    ]}
                    value={values?.cashMarginType || ''}
                    label="Cash Margin Type"
                    onChange={(valueOption) => {
                      setFieldValue('cashMarginType', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    isSearchable={true}
                    options={bankAccountDDL || []}
                    name="bankAccountNo"
                    placeholder="Bank Account No"
                    value={values?.bankAccountNo || ''}
                    onChange={(valueOption) => {
                      setFieldValue('bankAccountNo', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="refType"
                    options={[
                      { value: 'LC', label: 'LC' },
                      { value: 'Bank Guarantee', label: 'Bank Guarantee' },
                    ]}
                    value={values?.refType}
                    label="Ref Type"
                    onChange={(valueOption) => {
                      setFieldValue('refType', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.refNo}
                    label="Ref No"
                    name="refNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('refNo', e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="bankName"
                    options={bankDDL || []}
                    value={values?.bankName}
                    label="Bank"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue('bankName', valueOption);
                      } else {
                        setFieldValue('bank', '');
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.principleAmount}
                    label="Principal Amount"
                    name="principleAmount"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue('principleAmount', e.target.value);
                        setFieldValue(
                          'marginAmount',
                          (
                            ((+values?.marginPercent || 0) *
                              (+e.target.value || 0)) /
                            100
                          ).toFixed(2)
                        );
                      } else {
                        setFieldValue('principleAmount', '');
                        setFieldValue('marginAmount', '');
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.marginPercent}
                    label="Margin Percent"
                    name="marginPercent"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue('marginPercent', e.target.value);
                        setFieldValue(
                          'marginAmount',
                          (
                            ((+values?.principleAmount || 0) *
                              (+e.target.value || 0)) /
                            100
                          ).toFixed(2)
                        );
                      } else {
                        setFieldValue('marginPercent', '');
                        setFieldValue('marginAmount', '');
                      }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.marginAmount}
                    label="Margin Amount"
                    name="marginAmount"
                    type="number"
                    disabled
                    onChange={(e) => {
                      //  if(e.target.value < 0){
                      //     setFieldValue('marginAmount', "");
                      //   }else{
                      //     setFieldValue('marginAmount', e.target.value);
                      //   }
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.maturityDate}
                    label="Maturity Date"
                    name="maturityDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue('maturityDate', e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-6">
                  <InputField
                    value={values?.narration}
                    label="Narration"
                    name="narration"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('narration', e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <Form>
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
