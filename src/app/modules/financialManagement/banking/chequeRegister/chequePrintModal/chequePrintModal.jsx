import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import ISpinner from "../../../../_helper/_spinner";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { dateToDigit } from "./digitToWord";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import { bankJournalPrintCount } from "../helper";

const initData = {
  invoiceAmount: "",
  pendingAmount: "",
  cash: false,
  bank: false,
  advanceReceive: "",
  advanceAmount: "",
  balanceAmount: "",

  currentLadger: "",
  adjustAmount: "",
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
      console.log("saveHandler");
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
                              {"Cheque Print Preview"}
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
                                          width: "25px",
                                          paddingRight: "5px",
                                        }}
                                        src={printIcon}
                                        alt="print-icon"
                                      />
                                      Print
                                    </button>
                                  )}
                                  content={() => printRef.current}
                                  onBeforePrint={() => {
                                    bankJournalPrintCount([
                                      {
                                        journalId: item?.bankJournalId,
                                        actionBy: profileData?.userId,
                                      },
                                    ]);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </Modal.Title>
                      </Modal.Header>

                      <Modal.Body id="example-modal-sizes-title-xl">
                        <>
                          <div
                            ref={printRef}
                            className="d-flex justify-content-end"
                          >
                            {/* Left Part Of Cheque */}
                            <div
                              style={{
                                position: "absolute",
                                top: "310px",
                                left: "88px",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "left",
                                fontSize: "11px",
                              }}
                            >
                              <div
                                style={{
                                  width: "140px",
                                  paddingLeft: "20px",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  style={{
                                    marginBottom: "20px",
                                  }}
                                >
                                  <strong>{item?.bankJournalCode}</strong>
                                </span>
                                <span>
                                  {_dateFormatterTwo(item?.instrumentDate)}
                                </span>
                                <span>{item?.paidTo}</span>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "12px",
                                  }}
                                >
                                  {"= "}{" "}
                                  {numberWithCommas(item?.amount?.toFixed(2))}
                                </span>
                              </div>
                            </div>

                            {/* Right Part of Cheque */}
                            <div className="chequePrint-wrapper">
                              <div className="chequePrint-wrapper-header">
                                <div className="chequePrint-top-right-date">
                                  {/* <span>{item?.checkNo}</span> */}
                                  <span className="chequePrint-date-span">
                                    {dateToDigit(item?.instrumentDate)}
                                  </span>
                                </div>
                              </div>

                              <div className="chequePrint-payTo">
                                {item?.paidTo}
                              </div>
                              {checkPayableShow ? (
                                <p className="ACPayeeOnly">A/C Payee Only</p>
                              ) : null}

                              <div className="chequePrint-amount-sum-wrapper">
                                <div className="chequePrint-sum-of-tk">
                                  &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                                  Taka {item?.amountInWords} Only.
                                </div>
                                <div className="chequePrint-amount">
                                  <span style={{ marginRight: "-60px" }}>
                                    =&nbsp;
                                    {numberWithCommas(item?.amount?.toFixed(2))}
                                  </span>
                                </div>
                              </div>

                              <div className="chequePrint-businessUnit">
                                <div
                                  style={{
                                    display: "inline-block",
                                    textAlign: "left",
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
