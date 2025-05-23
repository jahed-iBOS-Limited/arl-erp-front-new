import React, { useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import { Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'react-redux';
import { ModalProgressBar } from '../../../../../../_metronic/_partials/controls';
import ISpinner from '../../../../_helper/_spinner';
import ReactToPrint from 'react-to-print';
import printIcon from '../../../../_helper/images/print-icon.png';
import { dateToDigit } from './digitToWord';
import numberWithCommas from '../../../../_helper/_numberWithCommas';

const initData = {
  invoiceAmount: '',
  pendingAmount: '',
  cash: false,
  bank: false,
  advanceReceive: '',
  advanceAmount: '',
  balanceAmount: '',

  currentLadger: '',
  adjustAmount: '',
};

// Validation schema
const validationSchema = Yup.object().shape({});

export default function ChequePrintModal({ show, onHide, isShow, item }) {
  const [checkPayableShow, setCheckPayableShow] = useState(true);
  let { profileData, selectedBusinessUnit } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
    }
  };

  const printRef = useRef();

  return (
    <div className="clear_sales_invoice_View_Form">
      <div className="viewModal">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
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
                size="xl"
                aria-labelledby="example-modal-sizes-title-xl"
                className="clear_sales_invoice_View_Form"
              >
                {true && <ModalProgressBar variant="query" />}
                {isShow ? (
                  <ISpinner isShow={isShow} />
                ) : (
                  <>
                    <Form className="form form-label-right">
                      <Modal.Header className="bg-custom">
                        <Modal.Title className="w-100">
                          <div className="d-flex justify-content-between px-4 py-2">
                            <div className="title">
                              {'Cheque Print Preview'}
                            </div>
                            <div className="d-flex">
                              <div className="mr-4">
                                <input
                                  checked={checkPayableShow}
                                  type="checkbox"
                                  onChange={() =>
                                    setCheckPayableShow(!checkPayableShow)
                                  }
                                  name="cheque"
                                />
                                <span className="ml-2">A/C Payee Only</span>
                              </div>

                              <div>
                                <ReactToPrint
                                  trigger={() => (
                                    <button
                                      type="button"
                                      className="btn btn-primary px-4 py-1"
                                    >
                                      <img
                                        style={{
                                          width: '25px',
                                          paddingRight: '5px',
                                        }}
                                        src={printIcon}
                                        alt="print-icon"
                                      />
                                      Print
                                    </button>
                                  )}
                                  content={() => printRef.current}
                                />
                              </div>
                            </div>
                          </div>
                        </Modal.Title>
                      </Modal.Header>

                      <Modal.Body id="example-modal-sizes-title-xl">
                        <>
                          {/* <div>
                            <div>
                              <strong>Pay to: </strong>
                              <span>{item?.nameFor}</span>
                            </div>
                            <div>
                              <strong>Amount: </strong>
                              <span>{Math.abs(+item?.numAmount)}</span>
                            </div>
                            <div>
                              <strong>Date: </strong>
                              <span>{dateToDigit(item?.journalDate)}</span>
                            </div>
                            <div>
                              <strong>Business Unit Name: </strong>
                              <span>{selectedBusinessUnit?.label}</span>
                            </div>
                            <div>
                              <strong>The Sum of taka: </strong>
                              <span>
                                {digitToWord(+item?.numAmount)} TK Only
                              </span>
                            </div>
                            <div>
                              <strong>NO. IDA: </strong>
                              <span>{item?.checkNo}</span>
                            </div>
                          </div> */}
                          <div
                            ref={printRef}
                            className="d-flex justify-content-end"
                          >
                            <div className="chequePrint-wrapper">
                              <div className="chequePrint-wrapper-header">
                                <div className="chequePrint-top-right-date">
                                  {/* <span>{item?.checkNo}</span> */}
                                  <span className="chequePrint-date-span">
                                    {dateToDigit(item?.journalDate)}
                                  </span>
                                </div>
                              </div>

                              <div className="chequePrint-payTo">
                                {item?.nameFor}
                                {checkPayableShow ? (
                                  <p className="ACPayeeOnly">A/C Payee Only</p>
                                ) : null}
                              </div>

                              <div className="chequePrint-amount-sum-wrapper">
                                <div className="chequePrint-sum-of-tk">
                                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                  Taka {item?.amountInWords} Only.
                                </div>
                                <div className="chequePrint-amount">
                                  <span style={{ marginRight: '-60px' }}>
                                    =&nbsp;
                                    {numberWithCommas(
                                      item?.numAmount?.toFixed(2)
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="chequePrint-businessUnit">
                                <div
                                  style={{
                                    display: 'inline-block',
                                    textAlign: 'left',
                                  }}
                                >
                                  For {selectedBusinessUnit?.label}
                                  <span className="SignatureInfo">
                                    <span className="pr-12">
                                      Authorized Signature
                                    </span>
                                    <span>Authorized Signature</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      </Modal.Body>
                      <Modal.Footer>
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              onHide();
                            }}
                            className="btn btn-light btn-elevate"
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
