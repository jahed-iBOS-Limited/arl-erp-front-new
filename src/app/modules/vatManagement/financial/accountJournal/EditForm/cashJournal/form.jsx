import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import customStyles from '../../../../../selectCustomStyle';
import SearchAsyncSelect from '../../../../../_helper/SearchAsyncSelect';
import FormikError from '../../../../../_helper/_formikError';
import { IInput } from '../../../../../_helper/_input';
import DebitCredit from '../../form/cashJournalCreate/DebitCredit';
import ReceiveAndPaymentsTable from '../../form/cashJournalCreate/ReceiveAndPaymentsTable';
import TransferTable from '../../form/cashJournalCreate/TransferTable';
import {
  getBankAccountDDL_api,
  getPartnerTypeDDLAction,
  getSendToGLBank,
} from '../../../../../_helper/_commonApi';
import TextArea from '../../../../../_helper/TextArea';
import {
  paymentsJournal,
  receiptsJournal,
  transferJournal,
} from '../../../../../_helper/_validationSchema';

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  rowDto,
  remover,
  headerData,
  setter,
  setRowDto,
  netAmount,
  journalCode,
  singleItem,
}) {
  const [generalLedgerDDL, setGeneralLedgerDDL] = useState([]);
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
  const [partnerType, setPartnerType] = useState('');

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      if (
        headerData?.accountingJournalTypeId === 1 ||
        headerData?.accountingJournalTypeId === 2
      ) {
        getSendToGLBank(
          profileData?.accountId,
          selectedBusinessUnit.value,
          2,
          setGeneralLedgerDDL
        );
      } else if (headerData?.accountingJournalTypeId === 3) {
        getSendToGLBank(
          profileData?.accountId,
          selectedBusinessUnit.value,
          3,
          setGeneralLedgerDDL
        );
      }
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    getPartnerTypeDDLAction(setPartnerTypeDDL);
  }, []);

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
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={
          headerData?.accountingJournalTypeId === 1
            ? receiptsJournal
            : headerData?.accountingJournalTypeId === 2
              ? paymentsJournal
              : transferJournal
        }
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
                {/* Start Left */}
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
                      />
                    </div>

                    {/* col-lg-6 */}
                    {(headerData?.accountingJournalTypeId === 1 ||
                      headerData?.accountingJournalTypeId === 2) && (
                      <div className="col-lg-6 pl pr-1 mb-2">
                        <label>Select Cash GL</label>
                        <Select
                          label="Select Cash GL"
                          options={generalLedgerDDL || []}
                          value={values?.cashGLPlus}
                          name="cashGLPlus"
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                          isSearchable={true}
                          styles={customStyles}
                          placeholder="Select Cash GL"
                          onChange={(valueOption) => {
                            setFieldValue('cashGLPlus', valueOption);
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="cashGLPlus"
                          touched={touched}
                        />
                      </div>
                    )}

                    {/* col-lg-6 */}
                    {headerData?.accountingJournalTypeId === 3 ? (
                      <>
                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Select Trasfer To</label>
                          <Select
                            label="Select Trasfer To"
                            options={
                              [
                                { value: 2, label: 'Cash' },
                                { value: 3, label: 'Bank' },
                              ] || []
                            }
                            value={values?.trasferTo}
                            name="trasferTo"
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Select Trasfer To"
                            onChange={(valueOption) => {
                              setFieldValue('trasferTo', valueOption);
                              getSendToGLBank(
                                profileData?.accountId,
                                selectedBusinessUnit.value,
                                2,
                                setGeneralLedgerDDL
                              );
                              if (valueOption?.value === 3) {
                                getBankAccountDDL_api(
                                  profileData?.accountId,
                                  selectedBusinessUnit.value,
                                  setBankAccountDDL
                                );
                              }

                              setFieldValue('cashGLPlus', '');
                              setFieldValue('gLBankAc', '');
                            }}
                          />
                          <FormikError
                            errors={errors}
                            name="trasferTo"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-6 pr pl-1 mb-2">
                          <label>Select Cash GL</label>
                          <Select
                            label="Select Cash GL"
                            options={generalLedgerDDL || []}
                            value={values?.cashGLPlus}
                            name="cashGLPlus"
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Select Cash GL"
                            onChange={(valueOption) => {
                              setFieldValue('cashGLPlus', valueOption);
                            }}
                          />
                          <FormikError
                            errors={errors}
                            name="cashGLPlus"
                            touched={touched}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg-12 pl pr-1 mb-2">
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
                              if (headerData?.accountingJournalTypeId === 1) {
                                setFieldValue(
                                  'receiveFrom',
                                  valueOption?.label
                                );
                              } else if (
                                headerData?.accountingJournalTypeId === 2
                              ) {
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

                        <div className="col-lg-12 pl pr mb-2">
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

                    {headerData?.accountingJournalTypeId === 1 && (
                      <div className="col-lg-6 pl pr-1 mb-2 border-gray">
                        <IInput
                          value={values?.receiveFrom}
                          label="Receive From"
                          name="receiveFrom"
                        />
                      </div>
                    )}
                    {headerData?.accountingJournalTypeId === 2 && (
                      <div className="col-lg-6 pr pl-1 mb-2">
                        <IInput
                          value={values?.paidTo}
                          label="Paid To"
                          name="paidTo"
                        />
                      </div>
                    )}
                    {headerData?.accountingJournalTypeId !== 3 && (
                      <div className="col-lg-6 pl pr mb-1 disable-border disabled-feedback border-gray">
                        <IInput
                          value={values?.amount}
                          label="Amount"
                          name="amount"
                          step="any"
                          type="number"
                          min="0"
                        />
                      </div>
                    )}
                    {/* col-lg-6 */}
                    {headerData?.accountingJournalTypeId === 3 && (
                      <div className="col-lg-6 pr pl-1 mb-2">
                        <label>Select GL/Bank Ac</label>
                        <Select
                          label="Select GL/Bank Ac"
                          options={
                            values?.trasferTo.value === 2
                              ? generalLedgerDDL
                              : bankAccountDDL || []
                          }
                          value={values?.gLBankAc}
                          name="gLBankAc"
                          isSearchable={true}
                          styles={customStyles}
                          placeholder="Select GL/Bank Ac"
                          onChange={(valueOption) => {
                            setFieldValue('gLBankAc', valueOption);
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="gLBankAc"
                          touched={touched}
                        />
                      </div>
                    )}
                    {/* col-lg-2 */}
                    {headerData?.accountingJournalTypeId === 3 && (
                      <div className="col-lg-12 pr-1 pl mb-2 disable-border disabled-feedback border-gray">
                        <IInput
                          value={values?.amount}
                          label="Amount"
                          name="amount"
                          step="any"
                          type="number"
                          min="0"
                        />
                      </div>
                    )}
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
                    {headerData?.accountingJournalTypeId !== 3 && (
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
                            !values?.narration
                          }
                          className="btn btn-primary"
                          onClick={() => {
                            if (!values?.transaction)
                              return toast.warn('Select transaction');
                            if (!values?.gl)
                              return toast.warn('Select General Ledger');
                            if (!values?.cashGLPlus)
                              return toast.warn('Please add cash GL');
                            if (!values?.headerNarration)
                              return toast.warn('Please add header narration');
                            setter(values);
                            // setFieldValue("transaction", "");
                            setFieldValue('amount', '');
                          }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* End Left */}

                {/* start right */}

                <div className="col-lg-8 pr-0">
                  <div
                    style={{ paddingBottom: '6px', paddingTop: '1px' }}
                    className="row bank-journal bank-journal-custom bj-left"
                  >
                    <div style={{ paddingTop: '4px' }} className="col-lg-12">
                      <DebitCredit
                        type={headerData?.accountingJournalTypeId}
                        amount={values?.amount}
                        netAmount={netAmount}
                        journalCode={journalCode}
                      />
                    </div>
                  </div>

                  {/* <div className="row">
                    <div
                      style={{ paddingLeft: "8px" }}
                      className="col-lg-12 p-0 pl-1 m-0"
                    >

                    </div>
                  </div> */}
                  <ReceiveAndPaymentsTable
                    jorunalType={headerData?.accountingJournalTypeId}
                    rowDto={rowDto}
                    values={values}
                    netAmount={netAmount}
                    remover={remover}
                    journalCode={journalCode}
                  />
                  <TransferTable
                    jorunalType={headerData?.accountingJournalTypeId}
                    values={values}
                    journalCode={journalCode}
                  />
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
