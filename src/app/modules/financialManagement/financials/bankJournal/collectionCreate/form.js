import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Input } from '../../../../../../_metronic/_partials/controls';
import customStyles from '../../../../selectCustomStyle';
import { attachmentUpload } from '../../../../_helper/attachmentUpload';
import placeholderImg from '../../../../_helper/images/placeholderImg.png';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import FormikError from '../../../../_helper/_formikError';
import { IInput } from '../../../../_helper/_input';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import { _todayDate } from '../../../../_helper/_todayDate';
import {
  generateAdviceNo,
  getBankAc,
  getCostCenterDDL,
  getCostElementByCostCenterDDL,
  getInstrumentType,
  getNextBankCheque,
  getPartnerTypeDDL,
  getProfitCenterDDL,
  getRevenueCenterListDDL,
  getRevenueElementListDDL,
  getSendToGLBank,
} from '../helper';
import DebitCredit from './DebitCredit';
import ReceiveAndPaymentsTable from './ReceiveAndPaymentsTable';
import TransferTable from './TransferTable';
import { setBankJournalCreateAction } from '../../../../_helper/reduxForLocalStorage/Actions';
import { confirmAlert } from 'react-confirm-alert';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';

// Validation schema for bank receive
const ReceivevalidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required('Bank Account is required'),
    value: Yup.string().required('Bank Account is required'),
  }),
  receiveFrom: Yup.string().required('Receive from is required'),
  instrumentType: Yup.object().shape({
    label: Yup.string().required('Instrument type is required'),
    value: Yup.string().required('Instrument type is required'),
  }),
  instrumentNo: Yup.string().required('Instrument no is required'),
  instrumentDate: Yup.string().required('Instrument date is required'),
  headerNarration: Yup.string().required('Narration is required'),
  placingDate: Yup.string().required('Placing date is required'),
});

// Validation schema for bank payment
const PaymentvalidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required('Bank Account is required'),
    value: Yup.string().required('Bank Account is required'),
  }),
  instrumentType: Yup.object().shape({
    label: Yup.string().required('Instrument type is required'),
    value: Yup.string().required('Instrument type is required'),
  }),
  paidTo: Yup.string().required('Paid to is required'),
  instrumentNo: Yup.string().required('Instrument no is required'),
  instrumentDate: Yup.string().required('Instrument date is required'),
  headerNarration: Yup.string().required('Header narration is required'),
});
// Validation schema for bank transfer
const TransfervalidationSchema = Yup.object().shape({
  bankAcc: Yup.object().shape({
    label: Yup.string().required('Bank Account is required'),
    value: Yup.string().required('Bank Account is required'),
  }),
  transferTo: Yup.object().shape({
    label: Yup.string().required('Transfer to is required'),
    value: Yup.string().required('Transfer to is required'),
  }),
  sendToGLBank: Yup.object().shape({
    label: Yup.string().required('GL/BL is required'),
    value: Yup.string().required('GL/BL is required'),
  }),
  instrumentType: Yup.object().shape({
    label: Yup.string().required('Instrument type is required'),
    value: Yup.string().required('Instrument type is required'),
  }),
  transferAmount: Yup.string().required('Amount is required'),
  instrumentNo: Yup.string().required('Instrument no is required'),
  instrumentDate: Yup.date().required('Instrument date is required'),
  headerNarration: Yup.string().required('Header narration is required'),
});

export default function _Form({
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
  netAmount,
  instrumentNoByResponse,
  setInstrumentNoByResponse,
  rowDtoHandler,
  attachmentFile,
  setAttachmentFile,
  isEdit,
}) {
  const [sendToGLBank, setSendToGLBank] = useState([]);
  const [bankAcc, setBankAcc] = useState([]);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
  const [instrumentType, setInstrumentType] = useState([]);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [revenueCenterDDL, setRevenueCenterDDL] = useState([]);
  const [revenueElementDDL, setRevenueElementDDL] = useState([]);
  const [profitCenterDDL, setProfitCenterDDL] = useState([]);
  const inputAttachFile = useRef(null);
  const dispatch = useDispatch();

  const [partnerBank, getPartnerBank, , setPartnerBank] = useAxiosGet();

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBankAc(profileData.accountId, selectedBusinessUnit.value, setBankAcc);
      getInstrumentType(setInstrumentType);
      getSendToGLBank(
        profileData.accountId,
        selectedBusinessUnit.value,
        3,
        setSendToGLBank,
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getProfitCenterDDL(selectedBusinessUnit.value, setProfitCenterDDL);
  }, [selectedBusinessUnit]);

  useEffect(() => {
    getCostCenterDDL(
      selectedBusinessUnit.value,
      profileData.accountId,
      setCostCenterDDL,
    );
    getPartnerTypeDDL(setPartnerTypeDDL);
    getRevenueElementListDDL(selectedBusinessUnit.value, setRevenueElementDDL);
    getRevenueCenterListDDL(selectedBusinessUnit.value, setRevenueCenterDDL);
  }, [profileData, selectedBusinessUnit]);

  const [partnerType, setPartnerType] = useState(initData?.partnerType || '');

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
        }`,
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

  useEffect(() => {
    if (initData?.transaction?.value) {
      getPartnerBank(
        `/partner/BusinessPartnerBankInfo/GetBusinessPartnerBankInfoByAccountIdBusinessUnitId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&BusinessPartnerId=${initData?.transaction?.value}&Status=true`,
        (data) => {
          let newBankAcc =
            data?.length > 0
              ? data.map((item) => ({
                  ...item,
                  value: item?.bankId,
                  label: `${item?.bankShortName}: ${item?.bankAccountNo}`,
                }))
              : [];
          setPartnerBank(newBankAcc);
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);

  return (
    <>
      <Formik
        initialValues={{
          ...initData,
          partnerType: {
            value: 2,
            label: 'Customer',
            reffPrtTypeId: 2,
          },
          customerSupplierStatus: 'customer',
          narration: initData?.headerNarration || '',
          instrumentDate: _todayDate(),
          placingDate: _todayDate(),
          transactionDate: _todayDate(),
          instrumentNo: '',
          profitCenter: '',
          partnerBankAccount: '',
          gl:
            initData?.transaction?.glData?.length === 1
              ? initData?.transaction?.glData[0]
              : '',
          receiveFrom: jorunalType === 4 ? initData?.transaction?.label : '',
          paidTo: jorunalType === 5 ? initData?.transaction?.label : '',
          transaction: initData?.transaction,
        }}
        validationSchema={
          jorunalType === 4
            ? ReceivevalidationSchema
            : jorunalType === 5
            ? PaymentvalidationSchema
            : TransfervalidationSchema
        }
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          return confirmAlert({
            title: 'Are you sure?',
            message: '',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                  saveHandler(values, () => {
                    // wont be reset as per requirement
                    // resetForm(initData);
                    if (jorunalType === 6) {
                      setFieldValue('transferAmount', '');
                      dispatch(
                        setBankJournalCreateAction({
                          ...values,
                          transferAmount: '',
                        }),
                      );
                    }
                  });
                },
              },
              {
                label: 'No',
                onClick: () => '',
              },
            ],
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
              <div className="row bank-journal-wrapper">
                <div className="col-lg-4">
                  <div
                    style={{ paddingTop: '1px' }}
                    className="row bank-journal bank-journal-custom bj-left"
                  >
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
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Select Bank AC</label>
                      <Select
                        onChange={(valueOption) => {
                          if (jorunalType === 5 || jorunalType === 6) {
                            if (values?.instrumentType?.value === 2) {
                              getNextBankCheque(
                                profileData?.accountId,
                                selectedBusinessUnit.value,
                                valueOption?.bankId,
                                valueOption?.bankBranch_Id,
                                valueOption?.value,
                                setFieldValue,
                                'instrumentNo',
                              );
                            }
                          }
                          setFieldValue('instrumentNo', '');
                          setFieldValue('instrumentType', '');
                          setFieldValue('bankAcc', valueOption);
                        }}
                        options={bankAcc || []}
                        value={values?.bankAcc}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Bank Ac"
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
                              setFieldValue('receiveFrom', '');
                              setFieldValue('partnerBankAccount', '');
                            }}
                            options={partnerTypeDDL}
                            value={values?.partnerType}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Partner Type"
                            isDisabled
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
                                  valueOption?.label,
                                );
                              } else if (jorunalType === 5) {
                                setFieldValue('paidTo', valueOption?.label);
                              }

                              setFieldValue('transaction', valueOption);
                              setFieldValue('partnerBankAccount', '');

                              getPartnerBank(
                                `/partner/BusinessPartnerBankInfo/GetBusinessPartnerBankInfoByAccountIdBusinessUnitId?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&BusinessPartnerId=${valueOption?.value}&Status=true`,
                                (data) => {
                                  let newBankAcc =
                                    data?.length > 0
                                      ? data.map((item) => ({
                                          ...item,
                                          value: item?.bankId,
                                          label: `${item?.bankShortName}: ${item?.bankAccountNo}`,
                                        }))
                                      : [];
                                  setPartnerBank(newBankAcc);
                                },
                              );
                            }}
                            loadOptions={loadTransactionList}
                            isDisabled={true}
                          />
                          <FormikError
                            errors={errors}
                            name="transaction"
                            touched={touched}
                          />
                        </div>
                        {/* ["Supplier", "Customer", "Investment Partner"] */}
                        {jorunalType === 5 &&
                          ['Investment Partner']?.includes(
                            values?.partnerType?.label,
                          ) && (
                            <div
                              style={{ marginBottom: '12px' }}
                              className="col-lg-12 pl pr"
                            >
                              <label>Partner Bank Account</label>
                              <Select
                                onChange={(valueOption) => {
                                  setFieldValue(
                                    'partnerBankAccount',
                                    valueOption,
                                  );
                                }}
                                // isDisabled={!values?.transaction}
                                options={partnerBank}
                                value={values?.partnerBankAccount}
                                isSearchable={true}
                                styles={customStyles}
                                placeholder="Partner Bank Account"
                              />
                            </div>
                          )}

                        <div className="col-lg-12 pl pr">
                          <label>General Ledger</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue('gl', valueOption);
                            }}
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
                          disabled
                        />
                      </div>
                    ) : jorunalType === 5 ? (
                      <div className="col-lg-6 pr-1 pl mb-2 border-gray">
                        <IInput
                          value={values.paidTo}
                          label="Paid to"
                          name="paidTo"
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
                        <div className="col-lg-12 pl-1 pr mb-2 h-narration border-gray">
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
                            disabled={true}
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
                    <div className="col-lg-12 pl pr-1 mb-2">
                      <label>Profit Center</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue('profitCenter', valueOption);
                        }}
                        isClearable={true}
                        options={profitCenterDDL}
                        value={values?.profitCenter}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Profit Center"
                      />
                      <FormikError
                        errors={errors}
                        name="profitCenter"
                        touched={touched}
                      />
                    </div>
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
                            isDisabled={!values?.profitCenter}
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
                            isDisabled={!values?.profitCenter}
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
                              if (valueOption) {
                                setFieldValue('costCenter', valueOption);
                                getCostElementByCostCenterDDL(
                                  selectedBusinessUnit.value,
                                  profileData.accountId,
                                  valueOption?.value,
                                  setCostElementDDL,
                                );
                                setFieldValue('costElement', '');
                              } else {
                                setCostElementDDL([]);
                                setFieldValue('costCenter', '');
                                setFieldValue('costElement', '');
                              }
                            }}
                            value={values?.costCenter}
                            options={costCenterDDL || []}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Cost Center"
                            isDisabled={!values?.profitCenter}
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
                            isDisabled={!values?.profitCenter}
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
                          checked={values.placedInBank}
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
                    {jorunalType === 5 && !isEdit ? (
                      <div className="col-lg-12">
                        <label>Attachment </label>
                        <div
                          className={
                            attachmentFile
                              ? 'image-upload-box with-img'
                              : 'image-upload-box'
                          }
                          onClick={onButtonAttachmentClick}
                          style={{
                            cursor: 'pointer',
                            position: 'relative',
                            height: '35px',
                          }}
                        >
                          <input
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                attachmentUpload(e.target.files)
                                  .then((data) => {
                                    setAttachmentFile(data?.[0]?.id);
                                  })
                                  .catch((error) => {
                                    setAttachmentFile('');
                                  });
                              }
                            }}
                            type="file"
                            ref={inputAttachFile}
                            id="file"
                            style={{ display: 'none' }}
                          />
                          <div>
                            {!attachmentFile && (
                              <img
                                style={{ maxWidth: '50px' }}
                                src={placeholderImg}
                                className="img-fluid"
                                alt="Upload or drag documents"
                              />
                            )}
                          </div>
                          {attachmentFile && (
                            <div className="d-flex align-items-center">
                              <p
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  color: '#0072E5',
                                  cursor: 'pointer',
                                  margin: '0px',
                                }}
                              >
                                {attachmentFile}
                              </p>
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    View Attachment
                                  </Tooltip>
                                }
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        attachmentFile,
                                      ),
                                    );
                                  }}
                                  className="ml-2"
                                >
                                  <i
                                    style={{ fontSize: '16px' }}
                                    className={`fa pointer fa-eye`}
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
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
                            !values?.narration
                          }
                          className="btn btn-primary"
                          onClick={() => {
                            if (!values?.transaction)
                              return toast.warn('Select transaction');
                            if (!values?.gl)
                              return toast.warn('Select General Ledger');
                            if (!values?.bankAcc)
                              return toast.warn('Select Bank Account');
                            if (!values?.headerNarration)
                              return toast.warn('Please add header narration');
                            // if values?.gl?.accountGroupId === 3 or 4 then profit center is required
                            if (
                              values?.gl?.accountGroupId === 3 ||
                              values?.gl?.accountGroupId === 4
                            ) {
                              if (!values?.profitCenter)
                                return toast.warn('Select profit center');
                            }
                            // setFieldValue("transaction", "");
                            // setFieldValue("amount", "");
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
                      <label>Instrument Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue('instrumentType', valueOption);
                          if ([5, 6].includes(jorunalType)) {
                            if (valueOption?.value === 2) {
                              if (values?.bankAcc) {
                                getNextBankCheque(
                                  profileData?.accountId,
                                  selectedBusinessUnit.value,
                                  values?.bankAcc?.bankId,
                                  values?.bankAcc?.bankBranch_Id,
                                  values?.bankAcc?.value,
                                  setFieldValue,
                                  'instrumentNo',
                                );
                              }
                            } else {
                              generateAdviceNo(
                                selectedBusinessUnit?.value,
                                setFieldValue,
                              );
                            }
                          }
                        }}
                        value={values?.instrumentType}
                        isSearchable={true}
                        options={instrumentType || []}
                        styles={customStyles}
                        placeholder="Instrument Type"
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
                      />
                    </div>
                    <div className="col-lg-3 pl-1 pr-1 pl-date bank-journal-date border-gray">
                      <IInput
                        value={values.instrumentDate}
                        label="Instrument Date"
                        name="instrumentDate"
                        type="date"
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
