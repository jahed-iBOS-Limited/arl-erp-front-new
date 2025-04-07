import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { createInitData, disbursementTypeDDL } from './helper';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { useHistory } from 'react-router-dom';

export default function SCFLimitCreateEditPage() {
  // hooks
  const { state: landingState } = useLocation();
  const { id } = useParams();
  const history = useHistory();
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // state
  const [objProps, setObjprops] = useState({});
  const [editInitData, setEditInitData] = useState({});

  // api action
  const [bankAccountNoDDL, getBankAccountNoDDL, getBankAccountNoDDLLoading] =
    useAxiosGet();
  const [supplierDDL, getSupplierDDL, getSupplierDDLLoading] = useAxiosGet();
  const [, createSCFLimit, createSCFLimitLoading] = useAxiosPost();

  // initial use effect not in edit
  useEffect(() => {
    if (!id) {
      getBankAccountNoDDL(
        `/fino/PaymentRequest/GetBankAsPartnerDDL?businessUnitId=${selectedBusinessUnit?.value}`
      );
      getSupplierDDL(
        `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=0`
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (id) {
      setEditInitData({
        id: landingState?.id,
        supplier: {
          value: landingState?.businessPartnerId,
          label: landingState?.businessPartnerName,
        },
        bankAccountNo: {
          bankId: landingState?.bankId,
          bankName: landingState?.bankName,
          bankAccNo: landingState?.accountNumber,
        },
        disbursementType: {
          label: landingState?.disbursementType, // value label same in ddl
          value: landingState?.disbursementType, // value label same in ddl
        },
        limit: landingState?.limit || '',
        tenorDays: landingState?.tenorDays || '',
        transactionRef: landingState?.sanctionReference || '',
        limitExpiryDate: _dateFormatter(landingState?.limitExpiryDate) || '',
        interestRate: landingState?.interestRate || '',
        remarks: landingState?.remarks || '',
      });
    }
  }, []);

  // submit handler
  const saveHandler = (values, cb) => {
    // values destrcutre
    const {
      supplier,
      bankAccountNo,
      disbursementType,
      limit,
      tenorDays,
      transactionRef,
      limitExpiryDate,
      interestRate,
      remarks,
      id: editId,
    } = values;

    // create
    const payload = {
      id: editId ? editId : 0, // for create 0 otherwise id for edit
      businessUnitId: selectedBusinessUnit?.value,
      businessPartnerId: supplier?.value || 0,
      bankAsPartnerId: bankAccountNo?.bankAsPartnerId || 0,
      bankId: bankAccountNo?.bankId || 0,
      bankAccountId: bankAccountNo?.bankAccountId || 0,
      accountNumber: bankAccountNo?.bankAccountNo || 0,
      limit: limit || 0,
      utilizeAmount: 0,
      limitExpiryDate: limitExpiryDate || '',
      tenorDays: tenorDays || 0,
      sanctionReference: transactionRef || '',
      interestRate: interestRate || 0,
      disbursementType: disbursementType?.value || '',
      remarks: remarks || '',
      createdBy: profileData?.userId || 0,
    };

    // api actiom
    createSCFLimit(`/fino/PaymentRequest/ScfLimitCreate`, payload, cb, true);
  };

  // is loading
  const isLoading =
    getBankAccountNoDDLLoading ||
    createSCFLimitLoading ||
    getSupplierDDLLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? editInitData : createInitData}
      //   validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
          history.push('/financial-management/scf/scflimit');
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
          {isLoading && <Loading />}
          <IForm title={`Create SCF Limit`} getProps={setObjprops}>
            <Form>
              {/* Only In Edit Mode Show Info Section */}
              {id ? (
                <div className="form-group  global-form row">
                  <div className="col-lg-2">
                    <strong>Business Partner Name:</strong>{' '}
                    <strong>{landingState?.businessPartnerName}</strong>
                  </div>
                  <div className="col-lg-2">
                    <strong> Bank Name:</strong>{' '}
                    <strong>{landingState?.bankName}</strong>
                  </div>
                  <div className="col-lg-2">
                    <strong>Acc No:</strong>{' '}
                    <strong>{landingState?.accountNumber}</strong>
                  </div>
                  <div className="col-lg-2">
                    <strong>Disbursement Type:</strong>{' '}
                    <strong>{landingState?.disbursementType}</strong>
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="form-group  global-form row">
                {/* Only In Create Mode Show Busniess Partner, Bank Acc, Disbursement DDL */}
                {id ? (
                  <></>
                ) : (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="supplier"
                        options={supplierDDL || []}
                        value={values?.supplier}
                        label="Supplier"
                        onChange={(valueOption) => {
                          setFieldValue('supplier', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="bankAccountNo"
                        options={bankAccountNoDDL || []}
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
                      <NewSelect
                        name="disbursementType"
                        options={disbursementTypeDDL || []}
                        value={values?.disbursementType}
                        label="Disbursement Type"
                        onChange={(valueOption) => {
                          setFieldValue('disbursementType', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}

                <div className="col-lg-3">
                  <InputField
                    value={values?.limit}
                    label="Limit"
                    name="limit"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('limit', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.tenorDays}
                    label="Tenor Days"
                    name="tenorDays"
                    type="number"
                    onChange={(e) => {
                      setFieldValue('tenorDays', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.transactionRef}
                    label="Transaction Ref"
                    name="transactionRef"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('transactionRef', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.limitExpiryDate}
                    label="Limit Expiry Date"
                    name="limitExpiryDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue('limitExpiryDate', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.interestRate}
                    label="Interest Rate"
                    name="interestRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue('interestRate', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('remarks', e.target.value);
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
                onSubmit={() => {
                  resetForm();
                  history.push('/financial-management/scf/scflimit');
                }}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
