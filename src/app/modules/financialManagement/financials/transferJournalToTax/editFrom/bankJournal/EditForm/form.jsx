import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Input } from '../../../../../../../../_metronic/_partials/controls';
import {
  getBankAc,
  getInstrumentType,
  getSendToGLBank,
} from '../../../../../../_helper/_commonApi';
import FormikError from '../../../../../../_helper/_formikError';
import { IInput } from '../../../../../../_helper/_input';
import {
  PaymentValidationSchema,
  ReceiveValidationSchema,
  TransferValidationSchema,
} from '../../../../../../_helper/_validationSchema';
import SearchAsyncSelect from '../../../../../../_helper/SearchAsyncSelect';
import TextArea from '../../../../../../_helper/TextArea';
import customStyles from '../../../../../../selectCustomStyle';
import DebitCredit from '../Form/DebitCredit';
import ReceiveAndPaymentsTable from '../Form/ReceiveAndPaymentsTable';
import TransferTable from '../Form/TransferTable';
import {
  getCostCenterDDL,
  getCostElementDDL,
  getPartnerTypeDDL,
  getRevenueCenterListDDL,
  getRevenueElementListDDL,
} from '../helper';

// Validation schema for bank receive

// Validation schema for bank payment

// Validation schema for bank transfer

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  remover,
  setter,
  profileData,
  selectedBusinessUnit,
  jorunalType,
  isEdit,
  netAmount,
  rowDtoHandler,
}) {
  const [sendToGLBank, setSendToGLBank] = useState([]);
  const [bankAcc, setBankAcc] = useState([]);
  const [instrumentType, setInstrumentType] = useState([]);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [revenueCenterDDL, setRevenueCenterDDL] = useState([]);
  const [revenueElementDDL, setRevenueElementDDL] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBankAc(profileData.accountId, selectedBusinessUnit.value, setBankAcc);

      getInstrumentType(setInstrumentType);

      getSendToGLBank(
        profileData.accountId,
        selectedBusinessUnit.value,
        3,
        setSendToGLBank
      );
      getCostElementDDL(
        selectedBusinessUnit.value,
        profileData.accountId,
        setCostElementDDL
      );
      getCostCenterDDL(
        selectedBusinessUnit.value,
        profileData.accountId,
        setCostCenterDDL
      );
      getRevenueElementListDDL(
        selectedBusinessUnit.value,
        setRevenueElementDDL
      );
      getRevenueCenterListDDL(selectedBusinessUnit.value, setRevenueCenterDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getPartnerTypeDDL(setPartnerTypeDDL);
  }, []);

  const [partnerType, setPartnerType] = useState('');

  const loadTransactionList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/BusinessPartnerPurchaseInfo/GetTransactionByTypeSearchDDL?AccountId=${
          profileData?.accountId
        }&BusinessUnitId=${
          selectedBusinessUnit?.value
        }&Search=${v}&PartnerTypeName=${''}&RefferanceTypeId=${
          partnerType?.reffPrtTypeId
        }`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <Formik
        initialValues={initData}
        enableReinitialize={true}
        validationSchema={
          jorunalType === 4
            ? ReceiveValidationSchema
            : jorunalType === 5
              ? PaymentValidationSchema
              : TransferValidationSchema
        }
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-4">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <div>Journal Date</div>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.transactionDate}
                        name="transactionDate"
                        onChange={(e) =>
                          setFieldValue('transactionDate', e.target.value)
                        }
                        type="date"
                        // disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Select Bank AC</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue('bankAcc', valueOption);
                        }}
                        options={bankAcc || []}
                        value={values?.bankAcc}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Bank Ac"
                        // isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="bankAcc"
                        touched={touched}
                      />
                    </div>

                    {/* This dropdown field will be changed based on previous page */}
                    {jorunalType === 6 ? (
                      <div className="col-lg-6 pr pl-1 mb-2">
                        <label>Select Transfer To</label>
                        <Select
                          onChange={(valueOption) => {
                            setFieldValue('transferTo', valueOption);
                            setFieldValue('sendToGLBank', '');
                          }}
                          options={[
                            // { value: 1, label: "Cash" },
                            { value: 2, label: 'Bank' },
                          ]}
                          value={values?.transferTo}
                          isSearchable={true}
                          styles={customStyles}
                          placeholder="Transfer to"
                        />
                        <FormikError
                          errors={errors}
                          name="transferTo"
                          touched={touched}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="col-lg-12 pl pr-1">
                          <label>Partner Type</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('gl', '');
                              setFieldValue('partnerType', valueOption);
                              setPartnerType(valueOption);
                              setFieldValue('transaction', '');
                            }}
                            options={partnerTypeDDL}
                            value={values?.partnerType}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Partner Type"
                          />

                          <FormikError
                            errors={errors}
                            name="partnerType"
                            touched={touched}
                          />
                        </div>

                        <div
                          style={{ marginBottom: '12px' }}
                          className="col-lg-12 pl pr"
                        >
                          <label>
                            {(values?.partnerType?.label === 'Others'
                              ? 'Transaction'
                              : values?.partnerType?.label) || 'Transaction'}
                          </label>
                          <SearchAsyncSelect
                            selectedValue={values?.transaction}
                            isSearchIcon={true}
                            handleChange={(valueOption) => {
                              setFieldValue('gl', '');
                              if (valueOption?.glData?.length === 1) {
                                setFieldValue('gl', valueOption?.glData[0]);
                              }
                              if (jorunalType === 4) {
                                setFieldValue(
                                  'receiveFrom',
                                  valueOption?.label
                                );
                              } else if (jorunalType === 5) {
                                setFieldValue('paidTo', valueOption?.label);
                              }
                              setFieldValue('transaction', valueOption);
                            }}
                            loadOptions={loadTransactionList}
                            isDisabled={!values?.partnerType}
                          />
                          <FormikError
                            errors={errors}
                            name="transaction"
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-12 pl pr">
                          <label>General Ledger</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('gl', valueOption);
                            }}
                            isDisabled={!values?.transaction}
                            options={values?.transaction?.glData || []}
                            value={values?.gl}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="General Ledger"
                          />

                          <FormikError
                            errors={errors}
                            name="gl"
                            touched={touched}
                          />
                        </div>
                      </>
                    )}

                    {/* This input field will be changed based on previous page */}
                    {jorunalType === 4 ? (
                      <div className="col-lg-6 pl pr-1 mb-2 border-gray">
                        <IInput
                          value={values.receiveFrom}
                          label="Receive From"
                          name="receiveFrom"
                          // disabled={isEdit}
                        />
                      </div>
                    ) : jorunalType === 5 ? (
                      <div className="col-lg-6 pr-1 pl mb-2 border-gray">
                        <IInput
                          value={values.paidTo}
                          label="Paid to"
                          name="paidTo"
                          // disabled={isEdit}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="col-lg-6 pl pr-1 mb-2">
                          <label>Select Send to GL/Bank</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('paidTo', valueOption?.label);
                              setFieldValue('sendToGLBank', valueOption);
                            }}
                            isDisabled={!values?.transferTo}
                            value={values?.sendToGLBank}
                            options={
                              values?.transferTo?.value === 1
                                ? sendToGLBank
                                : bankAcc
                            }
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Send To GL/Bank"
                          />
                          <FormikError
                            errors={errors}
                            name="sendToGLBank"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6 pr-1 pl mb-2 border-gray">
                          <IInput
                            value={values?.paidTo}
                            label="Paid to"
                            name="paidTo"
                          />
                        </div>
                      </>
                    )}

                    {/* it will be changed if user select bank transfer from previous page */}
                    {jorunalType === 6 ? (
                      <>
                        <div className="col-lg-6 pl pr-1 mb-2 h-narration border-gray">
                          <Field
                            type="number"
                            component={Input}
                            value={values.transferAmount}
                            min="0"
                            step="any"
                            placeholder="Amount"
                            label="Amount"
                            name="transferAmount"
                          />
                        </div>
                        <div className="col-lg-6 pl-1 pr mb-2 h-narration border-gray">
                          <label>Narration</label>
                          <TextArea
                            value={values?.headerNarration}
                            name="headerNarration"
                            placeholder="Narration"
                            rows="3"
                            onChange={(e) => {
                              setFieldValue('headerNarration', e.target.value);
                            }}
                            max={1000}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg-6 pl pr mb-1 disable-border disabled-feedback border-gray">
                          <Field
                            type="number"
                            component={Input}
                            value={values.amount}
                            min="0"
                            step="any"
                            placeholder="Amount"
                            label="Amount"
                            name="amount"
                          />
                        </div>
                        <div className="col-lg-12 pl pr mb-2 h-narration border-gray">
                          <label>Narration</label>
                          <TextArea
                            value={values?.headerNarration}
                            name="headerNarration"
                            placeholder="Narration"
                            rows="3"
                            onChange={(e) => {
                              setFieldValue('narration', e.target.value);
                              setFieldValue('headerNarration', e.target.value);
                            }}
                            max={1000}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    )}
                    {/* it will be changed if user select bank receipt from previous page */}
                    {jorunalType === 4 ? (
                      <>
                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Revenue Center</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('revenueCenter', valueOption);
                            }}
                            value={values?.revenueCenter}
                            options={revenueCenterDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Revenue Center"
                          />
                          <FormikError
                            errors={errors}
                            name="revenueCenter"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6 pr  mb-2">
                          <label>Revenue Element</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('revenueElement', valueOption);
                            }}
                            value={values?.revenueElement}
                            options={revenueElementDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Revenue Element"
                          />
                          <FormikError
                            errors={errors}
                            name="revenueElement"
                            touched={touched}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Cost Center</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('costCenter', valueOption);
                            }}
                            value={values?.costCenter}
                            options={costCenterDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Cost Center"
                          />
                          <FormikError
                            errors={errors}
                            name="costCenter"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6 pr  mb-2">
                          <label>Cost Element</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('costElement', valueOption);
                            }}
                            value={values?.costElement}
                            options={costElementDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Cost Element"
                          />
                          <FormikError
                            errors={errors}
                            name="costElement"
                            touched={touched}
                          />
                        </div>
                      </>
                    )}
                    {/* it will be hidden if user select bank payment/bank transfer from previous page */}
                    <div
                      className={
                        jorunalType === 5 || jorunalType === 6
                          ? 'd-none'
                          : 'col-lg-6 pl pr-1 mb-2 align-items-center'
                      }
                      style={{ marginTop: '18px' }}
                    >
                      <div className="d-flex align-items-center">
                        <span className="mr-2">Placed in Bank</span>
                        <Field
                          type="checkbox"
                          name="placedInBank"
                          checked={values?.placedInBank}
                          onChange={(e) => {
                            setFieldValue('placedInBank', e.target.checked);
                          }}
                        />
                      </div>
                    </div>
                    {/* it will be hidden if user select bank payment/bank transfer from previous page */}
                    <div
                      className={
                        jorunalType === 5 || jorunalType === 6
                          ? 'd-none'
                          : 'col-lg-6 pl-date pr pl-1 mb-2 bank-journal-date border-gray'
                      }
                    >
                      <IInput
                        value={values.placingDate}
                        disabled={!values?.placedInBank}
                        label="Placing Date"
                        name="placingDate"
                        type="date"
                      />
                    </div>
                    {jorunalType !== 6 && (
                      <div className="col-lg-12 text-right pl-0 bank-journal">
                        <button
                          style={{
                            padding: '5px 20px',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                          type="button"
                          disabled={
                            !values?.transaction ||
                            !values?.amount ||
                            !values?.headerNarration
                          }
                          className="btn btn-primary"
                          onClick={() => {
                            if (!values?.transaction)
                              return toast.warn('Select transaction');
                            if (!values?.gl)
                              return toast.warn('Select General Ledger');
                            if (!values?.bankAcc)
                              return toast.warn('Select Bank Account');
                            setFieldValue('transaction', '');
                            setFieldValue('amount', '');
                            setFieldValue('narration', '');
                            setter(values);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-8 pr-0">
                  <div
                    style={{ paddingBottom: '6px', paddingTop: '1px' }}
                    className="row bank-journal bank-journal-custom bj-left"
                  >
                    <div className="col-lg-3 pl pr-1">
                      <label>Select Instrument Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue('instrumentType', valueOption);
                        }}
                        value={values?.instrumentType}
                        isSearchable={true}
                        options={instrumentType || []}
                        styles={customStyles}
                        placeholder="Instrument Type"
                        // isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="instrumentType"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3 pl-1 pr-1 disable-border disabled-feedback border-gray">
                      <IInput
                        value={values.instrumentNo}
                        label="Instrument No"
                        name="instrumentNo"
                        // disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pl-1 pr-1 pl-date bank-journal-date border-gray">
                      <IInput
                        value={values.instrumentDate}
                        label="Instrument Date"
                        name="instrumentDate"
                        type="date"
                        // disabled={isEdit}
                      />
                    </div>

                    <div style={{ paddingTop: '16px' }} className="col-lg-3">
                      <DebitCredit
                        type={jorunalType}
                        amount={values?.transferAmount}
                        netAmount={netAmount}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div
                      style={{ paddingLeft: '8px' }}
                      className="col-lg-12 p-0 pl-1 m-0"
                    >
                      <ReceiveAndPaymentsTable
                        jorunalType={jorunalType}
                        rowDto={rowDto}
                        values={values}
                        netAmount={netAmount}
                        remover={remover}
                        rowDtoHandler={rowDtoHandler}
                        isEdit={true}
                      />
                      <TransferTable
                        jorunalType={jorunalType}
                        values={values}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}
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
