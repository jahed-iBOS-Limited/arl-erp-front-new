import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import InputField from '../../../../../_helper/_inputField';
import NewSelect from '../../../../../_helper/_select';
import {
  getBankAccountDDLByBankId,
  getBankDDL,
  getFacilityDLL,
  getNBFIBankDDL,
} from '../../helper';
const disbursementPurposeDDL = [
  { value: 1, label: 'Duty' },
  { value: 2, label: 'Bill Payment' },
  { value: 3, label: 'Utility Payment' },
  { value: 4, label: 'Working Capital' },
  { value: 5, label: 'Sanctioned Working Capital' },
];
const loanRegister = Yup.object().shape({
  bank: Yup.object()
    .shape({
      label: Yup.string().required('Bank is required'),
      value: Yup.string().required('Bank is required'),
    })
    .nullable()
    .required('Bank is required'),
  facility: Yup.object()
    .shape({
      label: Yup.string().required('Facility is required'),
      value: Yup.string().required('Facility is required'),
    })
    .nullable()
    .required('Facility is required'),
  account: Yup.object()
    .shape({
      label: Yup.string().required('Account is required'),
      value: Yup.string().required('Account is required'),
    })
    .nullable()
    .required('Account is required'),
  openingDate: Yup.string().required('Opening Date is required'),
  principle: Yup.number()
    .min(1, 'Principle is required')
    .required('Principle is required'),
  disbursementPurpose: Yup.object()
    .shape({
      label: Yup.string().required('Disbursement Purpose is required'),
      value: Yup.string().required('Disbursement Purpose is required'),
    })
    .nullable()
    .required('Disbursement Purpose is required'),
});

export default function LoanRegisterViewForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  renewId,
  location,
}) {
  const formikRef = React.useRef(null);

  const history = useHistory();
  const [bankDDL, setBankDDL] = useState([]);
  const [accountDDL, setAccountDDL] = useState([]);
  const [facilityDDL, setFacilityDDL] = useState([]);
  const [, setLoading] = useState(false);
  const [nbfiList, setNBFIList] = useState([]);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [maturityDate, setMaturityDate] = useState('');

  useEffect(() => {
    getBankDDL(setBankDDL, setLoading);
    getNBFIBankDDL(setNBFIList, setLoading, false, true);
  }, []);

  useEffect(() => {
    if (initData?.bank?.value) {
      const fetchBankAccountDDL = () => {
        getBankAccountDDLByBankId(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          initData?.bank?.value,
          setAccountDDL,
          setLoading
        );
      };

      const fetchFacilityDDL = () => {
        getFacilityDLL(
          selectedBusinessUnit?.value,
          location?.state?.intNbfiId || initData?.bank?.value,
          (resData) => {
            setFacilityDDL(resData);
            if (!renewId && !isEdit && formikRef.current) {
              const facilityFind = resData?.find((item) => item?.value === 2);
              formikRef.current.setFieldValue('facility', facilityFind || '');
              formikRef.current.setFieldValue(
                'termDays',
                facilityFind?.tenorDays || 0
              );
              onSetMaturityDate(
                initData?.openingDate,
                facilityFind?.tenorDays || 0
              );
            }
          },
          setLoading
        );
      };

      fetchBankAccountDDL();
      fetchFacilityDDL();
    }
  }, [initData]);

  useEffect(() => {
    if (initData?.openingDate && initData?.termDays) {
      const { openingDate, termDays } = initData;
      onSetMaturityDate(openingDate, termDays);
    }
  }, [initData]);

  const onSetMaturityDate = (openingDate, termDays) => {
    setMaturityDate('');
    if (openingDate && termDays > 0) {
      const openingDateObj = new Date(openingDate);
      const calculatedDate = new Date(openingDateObj);
      calculatedDate.setDate(calculatedDate.getDate() + Number(termDays));
      setMaturityDate(calculatedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <>
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={loanRegister}
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
                    name="bank"
                    options={bankDDL}
                    value={values?.bank}
                    onChange={(valueOption) => {
                      setFacilityDDL([]);
                      setFieldValue('bank', valueOption);
                      setFieldValue('account', '');
                      setFieldValue('facility', '');
                      setFieldValue('termDays', '');
                      getBankAccountDDLByBankId(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setAccountDDL,
                        setLoading
                      );
                      if (!values?.IsNBFI) {
                        getFacilityDLL(
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          (resData) => {
                            setFacilityDDL(resData);
                            if (!renewId && !isEdit) {
                              if (formikRef.current) {
                                const facilityFind = resData?.find(
                                  (item) => item?.value === 2
                                );
                                setFieldValue('facility', facilityFind || '');
                                setFieldValue(
                                  'termDays',
                                  facilityFind?.tenorDays || 0
                                );
                                onSetMaturityDate(
                                  values?.openingDate,
                                  facilityFind?.tenorDays || 0
                                );
                              }
                            }
                          },
                          setLoading
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit || renewId}
                    label="Disbursed Bank"
                    placeholder="Disbursed Bank"
                  />
                </div>
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
                    // isDisabled={isEdit || renewId}
                    label="Disbursed Account"
                    placeholder="Disbursed Account"
                  />
                </div>
                <div className="col-lg-1 mt-5">
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={values?.IsNBFI}
                      disabled={renewId || location?.state?.isLoanApproved}
                      onChange={(e) => {
                        setFieldValue('IsNBFI', e.target.checked);
                        setFieldValue('NBFI', '');
                        setFieldValue('facility', '');
                        setFacilityDDL([]);
                        if (!e.target.checked) {
                          getFacilityDLL(
                            selectedBusinessUnit?.value,
                            values?.bank?.value,
                            (resData) => {
                              setFacilityDDL(resData);
                              if (!renewId && !isEdit) {
                                if (formikRef.current) {
                                  const facilityFind = resData?.find(
                                    (item) => item?.value === 2
                                  );
                                  setFieldValue('facility', facilityFind || '');
                                  setFieldValue(
                                    'termDays',
                                    facilityFind?.tenorDays || 0
                                  );
                                  onSetMaturityDate(
                                    values?.openingDate,
                                    facilityFind?.tenorDays || 0
                                  );
                                }
                              }
                            },
                            setLoading
                          );
                        }
                      }}
                    />
                    <label className="pl-2">Is NBFI</label>
                  </div>
                </div>
                {values?.IsNBFI && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="NBFI"
                      options={nbfiList}
                      value={values?.NBFI}
                      onChange={(valueOption) => {
                        setFieldValue('NBFI', valueOption);
                        setFieldValue('facility', '');
                        setFacilityDDL([]);
                        if (valueOption) {
                          getFacilityDLL(
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            (resData) => {
                              setFacilityDDL(resData);
                              if (!renewId && !isEdit) {
                                if (formikRef.current) {
                                  const facilityFind = resData?.find(
                                    (item) => item?.value === 2
                                  );
                                  setFieldValue('facility', facilityFind || '');
                                  setFieldValue(
                                    'termDays',
                                    facilityFind?.tenorDays || 0
                                  );
                                  onSetMaturityDate(
                                    values?.openingDate,
                                    facilityFind?.tenorDays || 0
                                  );
                                }
                              }
                            },
                            setLoading
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={renewId || location?.state?.isLoanApproved}
                      label="NBFI"
                      placeholder="NBFI"
                    />
                  </div>
                )}

                <div className="col-lg-4">
                  <NewSelect
                    name="facility"
                    options={facilityDDL}
                    value={values?.facility}
                    onChange={(valueOption) => {
                      setFieldValue('facility', valueOption);
                      setFieldValue('facilityRemarks', valueOption?.remarks);
                      setFieldValue('interestRate', valueOption?.iterestRate);
                      setFieldValue('termDays', valueOption?.tenorDays || 0);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={renewId || location?.state?.isLoanApproved}
                    label="Facility"
                    placeholder="Facility"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Loan Acc No</label>
                  <InputField
                    value={values?.loanAccNo}
                    name="loanAccNo"
                    placeholder="Loan Acc No"
                    onChange={(e) => {
                      setFieldValue('loanAccNo', e.target.value);
                    }}
                    type="string"
                    disabled={renewId || location?.state?.isLoanApproved}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Opening Date</label>
                  <InputField
                    value={values?.openingDate}
                    onChange={(e) => {
                      setFieldValue('openingDate', e.target.value);
                      let openingDate = e.target.value;
                      let termDays = values?.termDays;
                      onSetMaturityDate(openingDate, termDays);
                    }}
                    name="openingDate"
                    placeholder="Date"
                    type="date"
                    disabled={renewId || location?.state?.isLoanApproved}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Tenor (Days)</label>
                  <InputField
                    value={values?.termDays}
                    name="termDays"
                    placeholder="Tenor (Days)"
                    onChange={(e) => {
                      let openingDate = values?.openingDate;
                      let termDays = e.target.value;
                      onSetMaturityDate(openingDate, termDays);
                      if (e.target.value > 0) {
                        setFieldValue('termDays', e.target.value);
                      } else {
                        setFieldValue('termDays', '');
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Maturity Date</label>
                  <InputField value={maturityDate || ''} disabled type="date" />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Principal</label>
                  <InputField
                    value={values?.principle}
                    name="principle"
                    placeholder="Principal"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        if (renewId) {
                          const maxPrinciple =
                            (+location?.state?.numPrinciple || 0) -
                            (+location?.state?.numPaid || 0);
                          if (e.target.value > maxPrinciple) {
                            return;
                          }
                        }
                        setFieldValue('principle', e.target.value);
                      } else {
                        setFieldValue('principle', '');
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    // disabled={isEdit}
                    disabled={renewId || location?.state?.isLoanApproved}
                  />
                </div>
                <div className="col-lg-2 pl pr-1 mb-1">
                  <label>Interest Rate</label>
                  <InputField
                    value={values?.interestRate}
                    name="interestRate"
                    placeholder="Interest Rate"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setFieldValue('interestRate', e.target.value);
                      } else {
                        setFieldValue('interestRate', '');
                      }
                    }}
                    type="number"
                    min="0"
                    step="any"
                    // disabled={isEdit}
                  />
                </div>

                {!renewId && (
                  <div className="col-lg-2">
                    <NewSelect
                      name="disbursementPurpose"
                      options={disbursementPurposeDDL}
                      value={values?.disbursementPurpose}
                      onChange={(valueOption) => {
                        setFieldValue('disbursementPurpose', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      label="Disbursement Purpose"
                      placeholder="Disbursement Purpose"
                      // isDisabled={location?.state?.isLoanApproved}
                    />
                  </div>
                )}
                {!renewId && (
                  <>
                    <div className="col-lg-2 ">
                      <label>Loan Remarks</label>
                      <InputField
                        value={values?.remarks}
                        name="remarks"
                        placeholder="Remarks"
                        onChange={(e) => {
                          setFieldValue('remarks', e.target.value);
                        }}
                        type="text"
                      />
                    </div>
                    <div className="col-lg-2 ">
                      <label>Facility Info</label>
                      <InputField
                        value={values?.facilityRemarks}
                        name="facilityRemarks"
                        placeholder="Facility Info"
                        onChange={(e) => {
                          setFieldValue('facilityRemarks', e.target.value);
                        }}
                        disabled
                        type="text"
                      />
                    </div>
                  </>
                )}
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
