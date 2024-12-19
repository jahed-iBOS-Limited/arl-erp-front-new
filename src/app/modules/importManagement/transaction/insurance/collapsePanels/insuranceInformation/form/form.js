/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import NewSelect from '../../../../../../_helper/_select';
import InputField from '../../../../../../_helper/_inputField';
import {
  GetCurrencyByPO,
  // ValidatePoNo,
  validationSchema,
  getCalculationFormLandingForm,
  empAttachment_action,
  // getDataByPoNo,
} from '../helper';
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../../../_metronic/_partials/controls';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import ButtonStyleOne from '../../../../../../_helper/button/ButtonStyleOne';
import { useDispatch } from 'react-redux';
import { getDownlloadFileView_Action } from '../../../../../../_helper/_redux/Actions';
import CalculationForm from './calculationForm';
import IViewModal from '../../../../../../_helper/_viewModal';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import removeComma from '../../../../../../_helper/_removeComma';
import { _formatMoney } from '../../../../../../_helper/_formatMoney';
import { toast } from 'react-toastify';

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  saveHandler,
  providerDDL,
  shipmentTypeDDL,
  insuranceCoverageDDL,
  paymentTypeDDL,
  open,
  setOpen,
  setFileObjects,
  fileObjects,
  setUploadImage,
  coverNotePreFix,
  accountId,
  buId,
  viewType,
  setDataByPO,
  setInitFOrmData,
  initialValue,
  setViewType,
  setCalculationFormData,
  calculationFormData,
  singleData,
}) {
  const dispatch = useDispatch();
  const [validate, setValidate] = useState('');
  const [isShowModal, setIsShowModal] = useState(false);

  // const CheckPoNo = (poNumber, setFieldValue) => {
  //   if (poNumber) {
  //     // getDataByPoNo(accountId, buId, poNumber, setInitFOrmData, initialValue, poNumber)
  //     ValidatePoNo(accountId, buId, poNumber, setValidate, () => {
  //       GetCurrencyByPO(accountId, buId, poNumber, setFieldValue, setDataByPO);
  //       getDataByPoNo(
  //         accountId,
  //         buId,
  //         poNumber,
  //         setInitFOrmData,
  //         initialValue,
  //         poNumber,
  //         setValidate,
  //         setViewType
  //       );
  //     });
  //   }
  // };

  const { state } = useLocation();
  useEffect(() => {
    if (state?.po)
      GetCurrencyByPO(
        accountId,
        buId,
        state?.po?.label,
        setInitFOrmData,
        initialValue,
        setDataByPO,
      );
  }, [state]);
  // console.log("viewType", viewType);
  return (
    <>
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {console.log('values', values)}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={
                  viewType === 'edit'
                    ? 'Edit Insurance Cover Note'
                    : viewType === 'view'
                    ? 'View Insurance Cover Note'
                    : 'Insurance Cover Note'
                }
              >
                <CardHeaderToolbar>
                  <>
                    <button
                      type="reset"
                      onClick={resetForm}
                      ref={resetBtnRef}
                      className="btn btn-light ml-2"
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                    <button
                      onClick={() => {
                        handleSubmit();
                        setValidate('');
                      }}
                      className="btn btn-primary ml-2"
                      type="submit"
                      disabled={
                        viewType === 'view' ||
                        validate === 'Cover Note is created using this po' ||
                        validate === 'PO No is Invalid'
                      }
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              {/* Starting The Form */}
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row global-form">
                      <>
                        <div className="col-lg-3">
                          <label>
                            {validate ? (
                              <div>
                                PO No
                                {/* <span
                                  className="pl-2"
                                  style={
                                    [
                                      "PO No is Invalid",
                                      "Cover Note is created using this po",
                                    ].includes(validate)
                                      ? { color: "red" }
                                      : { color: "green" }
                                  }
                                >
                                  {validate}
                                </span> */}
                              </div>
                            ) : (
                              'PO No'
                            )}
                          </label>
                          <InputField
                            value={values?.poNo}
                            placeholder="PO No"
                            name="poNo"
                            // onChange={(e) => {
                            //   setFieldValue("poNo", e.target.value);
                            //   setFieldValue("PIAmountFC", "");
                            //   setFieldValue(
                            //     "currency",
                            //     currency ? currency : ""
                            //   );
                            //   CheckPoNo(e?.target?.value, setFieldValue);
                            // }}
                            // onBlur={(e) => {
                            //   CheckPoNo(e?.target?.value, setFieldValue);
                            // }}
                            error={errors}
                            touched={touched}
                            disabled={
                              true
                              // (viewType === "view" && id) || viewType === "edit"
                              //   ? true
                              //   : false
                            }
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="coverage"
                            label="Coverage"
                            placeholder="Coverage"
                            options={insuranceCoverageDDL || []}
                            value={values?.coverage}
                            onChange={(valueOption) => {
                              setFieldValue('coverage', valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={viewType === 'view' ? true : false}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipmentType"
                            placeholder="Shipment Type"
                            label="Shipment Type"
                            options={shipmentTypeDDL || []}
                            value={values?.shipmentType}
                            onChange={(valueOption) => {
                              setFieldValue('shipmentType', valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                            isDisabled={viewType === 'view' ? true : false}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="provider"
                            options={providerDDL || []}
                            value={values?.provider}
                            onChange={(valueOption) => {
                              setFieldValue('provider', valueOption);
                              setFieldValue(
                                'coverNoteNumber',
                                valueOption.cnPrefix || '',
                              );
                              setFieldValue(
                                'coverNoteNumberActual',
                                valueOption.cnPrefix || '',
                              );
                            }}
                            placeholder="Provider"
                            label="Provider"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              viewType === 'view' || viewType === 'edit'
                            }
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="paymentBy"
                            options={paymentTypeDDL || []}
                            value={values?.paymentBy}
                            onChange={(valueOption) => {
                              setFieldValue('paymentBy', valueOption);
                            }}
                            placeholder="Payment By"
                            label="Payment By"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              viewType === 'view' || viewType === 'edit'
                                ? true
                                : false
                            }
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Insurance Date</label>
                          <InputField
                            value={values?.insuranceDate}
                            placeholder="Insurance Date"
                            name="insuranceDate"
                            type="date"
                            errors={errors}
                            touched={touched}
                            disabled={viewType === 'view' ? true : false}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Cover Note Number</label>
                          <InputField
                            value={values?.coverNoteNumber}
                            placeholder="Cover Note Number"
                            name="coverNoteNumber"
                            error={errors}
                            touched={touched}
                            onChange={(valueOption) => {
                              setFieldValue(
                                'coverNoteNumber',
                                valueOption?.target?.value.startsWith(
                                  values?.coverNoteNumberActual ||
                                    coverNotePreFix,
                                )
                                  ? valueOption?.target?.value
                                  : values?.coverNoteNumberActual ||
                                      coverNotePreFix ||
                                      valueOption?.target?.value,
                              );
                            }}
                            disabled={viewType === 'view' ? true : false}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>
                            {values?.currency?.label
                              ? `PI Amount (${values?.currency?.label})`
                              : `PI Amount`}
                          </label>
                          <InputField
                            value={values?.PIAmountFC}
                            placeholder="PI Amount (FC)"
                            name="PIAmountFC"
                            disabled={true}
                          />
                        </div>

                        <div className="col-lg-3">
                          {/* <label>Currency</label> */}
                          <NewSelect
                            value={values?.currency}
                            placeholder="Currency"
                            name="currency"
                            isDisabled={true}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Exchange Rate</label>
                          <InputField
                            value={values?.exchangeRate}
                            placeholder="Exchange Rate"
                            name="exchangeRate"
                            type="number"
                            min="0"
                            disabled={
                              !values?.poNo ||
                              viewType === 'view' ||
                              viewType === 'edit' ||
                              initData?.currency?.label === 'Taka'
                            }
                            onChange={(e) => {
                              setFieldValue(
                                'exchangeRate',
                                e?.target.value ? Number(e.target.value) : '',
                              );
                              setFieldValue(
                                'PIAmountBDT',
                                _formatMoney(
                                  e?.target?.value
                                    ? removeComma(values?.PIAmountFC) *
                                        +e?.target.value
                                    : '',
                                ),
                              );
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>PI Amount (BDT)</label>
                          <InputField
                            value={values?.PIAmountBDT}
                            placeholder="PI Amount (BDT)"
                            name="PIAmountBDT"
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Total Amount (Including VAT)</label>
                          <InputField
                            value={values?.total}
                            placeholder="Total Amount (Including VAT)"
                            name="total"
                            // disabled={true}
                            error={errors}
                            touched={touched}
                            type="number"
                            max={values?.PIAmountBDT}
                            disabled={
                              viewType === 'view' || viewType === 'edit'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setFieldValue('total', e?.target?.value);
                            }}
                            onBlur={(e) => {
                              if (
                                Number(e?.target?.value) < Number(values?.vat)
                              ) {
                                toast.warning(
                                  "Total Amount can't be less than VAT Amount",
                                );
                              }
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>VAT</label>
                          <InputField
                            value={values?.vat}
                            placeholder="VAT"
                            name="vat"
                            type="number"
                            error={errors}
                            touched={touched}
                            min={0}
                            disabled={
                              viewType === 'view' || viewType === 'edit'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              setFieldValue('vat', e?.target?.value);
                            }}
                            onBlur={(e) => {
                              if (
                                Number(e?.target?.value) > Number(values?.total)
                              ) {
                                toast.warning(
                                  "VAT can't be greater than Total Amount",
                                );
                              }
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>Due Date</label>
                          <InputField
                            value={values?.dueDate}
                            placeholder="Due Date"
                            name="dueDate"
                            type="date"
                            // error={errors}
                            // touched={touched}
                            disabled={viewType === 'view' ? true : false}
                          />
                        </div>

                        <div className="col-auto d-flex align-items-end">
                          {['view', 'edit'].includes(viewType) &&
                            singleData?.coverNoteDocumentId && (
                              <button
                                className="btn btn-primary d-flex"
                                type="button"
                                onClick={() => {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      values?.attachment,
                                    ),
                                  );
                                }}
                              >
                                <i className="fas fa-eye mr-1"></i>
                                View
                              </button>
                            )}
                          {viewType !== 'view' && (
                            <div style={{ marginTop: '14px' }} className="ml-2">
                              <ButtonStyleOne
                                className="btn btn-primary mr-2"
                                type="button"
                                onClick={() => setOpen(true)}
                                label="Attachment"
                              />
                            </div>
                          )}

                          <div
                            className="col-auto"
                            style={{ marginTop: '14px' }}
                            // marginLeft: "20px"
                          >
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={() => {
                                setIsShowModal(true);
                                getCalculationFormLandingForm(
                                  accountId,
                                  values,
                                  setCalculationFormData,
                                );
                              }}
                              disabled={
                                !values?.poNo ||
                                !values?.shipmentType ||
                                !values?.provider ||
                                !values?.exchangeRate ||
                                !values?.PIAmountBDT
                              }
                            >
                              Calculation
                            </button>
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <DropzoneDialogBase
                            filesLimit={1}
                            acceptedFiles={['image/*', 'application/pdf']}
                            fileObjects={fileObjects}
                            cancelButtonText={'cancel'}
                            submitButtonText={'submit'}
                            maxFileSize={1000000}
                            open={open}
                            onAdd={(newFileObjs) => {
                              setFileObjects([].concat(newFileObjs));
                            }}
                            onDelete={(deleteFileObj) => {
                              const newData = fileObjects.filter(
                                (item) =>
                                  item.file.name !== deleteFileObj.file.name,
                              );
                              setFileObjects(newData);
                            }}
                            onClose={() => setOpen(false)}
                            onSave={() => {
                              setOpen(false);
                              empAttachment_action(fileObjects).then((data) => {
                                setUploadImage(data);
                              });
                            }}
                            showPreviews={true}
                            showFileNamesInPreview={true}
                          />
                        </div>
                        {/* )} */}
                      </>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: 'none' }}
                  ref={btnRef}
                  onSubmit={() => handleSubmit}
                ></button>
                <button
                  type="reset"
                  style={{ display: 'none' }}
                  ref={resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>

                {/* modal  */}
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                  modelSize="md"
                  isModalFooterActive={false}
                >
                  <CalculationForm
                    setIsShowModal={setIsShowModal}
                    initData={calculationFormData}
                  />
                </IViewModal>
                {/* modal  */}
              </Form>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
