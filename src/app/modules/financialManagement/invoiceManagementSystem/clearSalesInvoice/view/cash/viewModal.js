import React, { useState } from "react";
import { Formik, Form } from "formik";
import InputField from "./../../../../../_helper/_inputField";
import NewSelect from "./../../../../../_helper/_select";
import ISpinner from "./../../../../../_helper/_spinner";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { createCashInvoiceClear_api } from "./../../helper";
import Loading from "./../../../../../_helper/_loading";
const initData = {
  invoiceAmount: "",
  pendingAmount: "",
  cashGLHead: "",
  receiveFrom: "",
  receiveAmount: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  invoiceAmount: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100000000000000, "Maximum 100000000000000 symbols")
    .required("Invoice Amount is required"),
  pendingAmount: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100000000000000, "Maximum 100000000000000 symbols")
    .required("Pending Amount is required"),
  receiveFrom: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100000000000000, "Maximum 100000000000000 symbols")
    .required("Receive From is required"),
  receiveAmount: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100000000000000, "Maximum 100000000000000 symbols")
    .required("Receive Amount is required"),
  cashGLHead: Yup.object().shape({
    label: Yup.string().required("Cash GL is required"),
    value: Yup.string().required("Cash GL is required"),
  }),
});

export default function CashViewForm({
  id,
  show,
  onHide,
  isShow,
  item,
  generalLedgerDDL,
  gridDataFunc,
  parentFormValues
}) {
  const [isDisabled, setDisabled] = useState(false);
 
  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          sbuId: item?.sbuId,
          businessPartnerId: item?.businessPartnerId,
          businessPartnerCode: item?.businessPartnerCode,
          businessPartnerName: item?.businessPartnerName,
          receiveFrom: values?.receiveFrom,
          generalLedgerId: values?.cashGLHead?.value,
          generalLedgerCode: values?.cashGLHead?.generalLedgerCode,
          generalLedgerName: values?.cashGLHead?.label,
          amount: +values?.receiveAmount,
          actionBy: profileData?.userId,
        },
        objRow: {
          generalLedgerId: values?.cashGLHead?.value,
          generalLedgerCode: values?.cashGLHead?.generalLedgerCode,
          generalLedgerName: values?.cashGLHead?.label,
        },
        objAcRcPayClear: {
          accountReceivablePayableId: item?.accountReceivablePayableId,
          invoiceCode: item?.invoiceCode,
          clearedAmount: +values?.receiveAmount,
        },
      };

      createCashInvoiceClear_api(payload, cb, setDisabled);
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
               
                {isShow ? (
                  <ISpinner isShow={isShow} />
                ) : (
                  <>
                  {isDisabled && <Loading />}
                    <Form className='form form-label-right'>
                      <Modal.Header className='bg-custom'>
                        <Modal.Title className='w-100'>
                          <div className='d-flex justify-content-between px-4 py-2'>
                            <div className='title'>{"Cash View Form"}</div>
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
                              <NewSelect
                                name='cashGLHead'
                                options={generalLedgerDDL || []}
                                value={values?.cashGLHead}
                                label='Cash GL Head'
                                onChange={(valueOption) => {
                                  setFieldValue("cashGLHead", valueOption);
                                }}
                                placeholder='Cash GL Head'
                                errors={errors}
                                touched={touched}
                              />
                            </div>

                            <div className='col-lg-4'>
                              <label>Receive Amount</label>
                              <InputField
                                value={values?.receiveAmount}
                                name='receiveAmount'
                                placeholder='Receive Amount'
                                type='number'
                                max={values?.pendingAmount}
                                min={0}
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
