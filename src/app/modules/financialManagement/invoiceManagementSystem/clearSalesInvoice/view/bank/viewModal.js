import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "./../../../../../_helper/_inputField";
import NewSelect from "./../../../../../_helper/_select";
import { ModalProgressBar } from "./../../../../../../../_metronic/_partials/controls";
import ISpinner from "./../../../../../_helper/_spinner";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  createBankInvoiceClear_api,
  getBankAccountDDL_api,
  getInstrumentType_Api,
} from "../../helper";

import { _todayDate } from "./../../../../../_helper/_todayDate";
import Loading from './../../../../../_helper/_loading';
const initData = {
  invoiceAmount: "",
  pendingAmount: "",
  bankAC: "",
  instrumentType: "",
  receiveFrom: "",
  receiveAmount: "",
  instrumentNo: "",
  instrumentDate: _todayDate(),
};

// Validation schema
const validationSchema = Yup.object().shape({
  invoiceAmount: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Invoice Amount is required"),
  pendingAmount: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Pending Amount is required"),
  receiveFrom: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Receive From is required"),
  receiveAmount: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Receive Amount is required"),
  instrumentType: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Instrument Type is required"),
  instrumentNo: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Instrument No is required"),
  instrumentDate: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Instrument Date is required"),
  bankAC: Yup.object().shape({
    label: Yup.string().required("Bank A/C is required"),
    value: Yup.string().required("Bank A/C is required"),
  }),
});

export default function BankViewForm({
  id,
  show,
  onHide,
  isShow,
  item,
  parentFormValues,
  gridDataFunc
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [isLoading, ] = useState(true);
  const [bankAccountDDL, setBankAccountDDL] = useState([]);
  const [instrumentType, setInstrumentType] = useState([]);


  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          sbuid: item?.sbuId,
          bankId: +values?.bankAC?.bankId,
          bankName: values?.bankAC?.bankName,
          bankBranchId: +values?.bankAC?.bankBranch_Id,
          bankBranchName: values?.bankAC?.bankBranchName,
          bankAccountId: +values?.bankAC?.value,
          bankAccountNumber: values?.bankAC?.label,
          receiveFrom: values?.receiveFrom,
          generalLedgerId: +values?.bankAC?.generalLedgerId,
          generalLedgerCode: values?.bankAC?.generalLedgerCode,
          generalLedgerName: values?.bankAC?.generalLedgerName,
          amount: +values?.receiveAmount,
          businessPartnerId: item?.businessPartnerId,
          businessPartnerCode: item?.businessPartnerCode,
          businessPartnerName: item?.businessPartnerName,
          instrumentId: +values?.instrumentType.value,
          instrumentName: values?.instrumentType.label,
          instrumentNo: values?.instrumentNo,
          instrumentDate: values?.instrumentDate,
          actionBy: +profileData?.userId,
        },
        objRow: {
          generalLedgerId: +values?.bankAC?.generalLedgerId,
          generalLedgerCode: values?.bankAC?.generalLedgerCode,
          generalLedgerName: values?.bankAC?.generalLedgerName,
        },
        objAcRcPayClear: {
          accountReceivablePayableId: item?.accountReceivablePayableId,
          invoiceCode: item?.invoiceCode,
          clearedAmount: +values?.receiveAmount,
        },
      };

      createBankInvoiceClear_api(payload, cb, setDisabled);
    } else {
      setDisabled(false);
    }
  };

  let clearSalesInvoice = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit } = clearSalesInvoice;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getBankAccountDDL_api(
        profileData?.accountId,
        selectedBusinessUnit.value,
        setBankAccountDDL
      );
      getInstrumentType_Api(setInstrumentType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  return (
    <div className='clear_sales_invoice_View_Form'>
      <div className='viewModal'>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            invoiceAmount: item?.amount,
            pendingAmount: item?.adjustmentPendingAmount,
            receiveFrom: item?.businessPartnerName,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              gridDataFunc(parentFormValues)
              onHide();
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
              <Modal
                show={show}
                onHide={onHide}
                size='xl'
                aria-labelledby='example-modal-sizes-title-xl'
                className='clear_sales_invoice_View_Form'
              >
                {isLoading && <ModalProgressBar variant='query' />}
                {isShow ? (
                  <ISpinner isShow={isShow} />
                ) : (
                  <>
                  {isDisabled && <Loading />}
                    <Form className='form form-label-right'>
                      <Modal.Header className='bg-custom'>
                        <Modal.Title className='w-100'>
                          <div className='d-flex justify-content-between px-4 py-2'>
                            <div className='title'>{"Bank View Form"}</div>
                            <div className=''>
                              <button
                                type='reset'
                                className={"btn btn-light ml-2"}
                                onClick={() => {
                                  resetForm(initData);
                                }}
                              >
                                <i className='fa fa-redo'></i>
                                Reset
                              </button>
                              <button
                                type='submit'
                                className={"btn btn-primary ml-2"}
                                // onClick={() => {
                                //   saveHandler(values);
                                // }}
                                disabled={isDisabled}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </Modal.Title>
                      </Modal.Header>

                      <Modal.Body id='example-modal-sizes-title-xl'>
                        <>
                          <div className='form-group row'>
                            <div className='col-lg-4'>
                              <label>Invoice Amount</label>
                              <InputField
                                value={values?.invoiceAmount}
                                name='invoiceAmount'
                                placeholder='Invoice Amount'
                                type='text'
                                disabled={true}
                              />
                            </div>
                            <div className='col-lg-4'>
                              <label>Pending Amount</label>
                              <InputField
                                value={values?.pendingAmount}
                                name='pendingAmount'
                                placeholder='Pending Amount'
                                type='text'
                                disabled={true}
                              />
                            </div>
                            <div className='col-lg-4'>
                              <NewSelect
                                name='bankAC'
                                options={bankAccountDDL || []}
                                value={values?.bankAC}
                                label='Bank A/C '
                                onChange={(valueOption) => {
                                  setFieldValue("bankAC", valueOption);
                                }}
                                placeholder='Bank A/C '
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className='col-lg-4'>
                              <NewSelect
                                name='instrumentType'
                                options={instrumentType || []}
                                value={values?.instrumentType}
                                label='Instrument Type'
                                onChange={(valueOption) => {
                                  setFieldValue("instrumentType", valueOption);
                                }}
                                placeholder='Instrument Type'
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className='col-lg-4'>
                              <label>Instrument No</label>
                              <InputField
                                value={values?.instrumentNo}
                                name='instrumentNo'
                                placeholder='Instrument No'
                                type='text'
                              />
                            </div>
                            <div className='col-lg-4'>
                              <label>Instrument Date</label>
                              <InputField
                                value={values?.instrumentDate}
                                name='instrumentDate'
                                placeholder='Instrument Date'
                                type='date'
                              />
                            </div>
                            <div className='col-lg-4'>
                              <label>Receive From</label>
                              <InputField
                                value={values?.receiveFrom}
                                name='receiveFrom'
                                placeholder='Receive From'
                                type='text'
                                disabled={true}
                              />
                            </div>
                            <div className='col-lg-4'>
                              <label>Receive Amount</label>
                              <InputField
                                value={values?.receiveAmount}
                                name='receiveAmount'
                                placeholder='Receive Amount'
                                type='number'
                                min='0'
                                max={item?.adjustmentPendingAmount}
                              />
                            </div>
                          </div>
                        </>
                      </Modal.Body>
                      <Modal.Footer>
                        <div>
                          <button
                            type='button'
                            onClick={() => onHide()}
                            className='btn btn-light btn-elevate'
                          >
                            Cancel
                          </button>
                          <> </>
                        </div>
                      </Modal.Footer>
                    </Form>
                  </>
                )}
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}
