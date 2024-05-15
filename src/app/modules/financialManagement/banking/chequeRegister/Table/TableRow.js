import { Formik, Form } from "formik";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "./../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "./../../../../../../_metronic/_partials/controls";
import {
  getBankJournal,
  getSbuDDL,
  getAccDDL,
  // setGenarateChequeNo,
  // checkTwoFactorApproval,
  chequeGeneretor,
} from "../helper";

import { _dateFormatter } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import IView from "../../../../_helper/_helperIcons/_view";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import { BankJournalViewTableRow } from "../report/tableRow";
import ChequePrintModal from "../chequePrintModal/chequePrintModal";
// import IConfirmModal from "./../../../../_helper/_confirmModal";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import { SetBankingChequeRegisterAction } from "../../../../_helper/reduxForLocalStorage/Actions";
// const html2pdf = require("html2pdf.js");

export function TableRow() {
  const [sbuDDL, setSbuDDL] = useState([]);
  const [accDDL, setAccDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  const [chequePrintModalShow, setChequePrintModalShow] = useState(false);
  const [chequePrintModalData, setChequePrintModalData] = useState({});
  // const [, setChequeModalData] = useState({});
  // const [, setCurrentChequeNo] = useState("");
  // const [, setChequeModal] = useState(false);
  const [disabledModalButton, setDisabledModalButton] = useState(false);
  const [changeModalShowState, setChangeModalShowState] = useState({
    isShow: false,
    data: null,
  });

  const dispatch = useDispatch();

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      localStorage: state?.localStorage,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit, localStorage } = storeData;

  const initData = {
    fromDate: localStorage?.bankingChequeRegister?.fromDate || _todayDate(),
    toDate: localStorage?.bankingChequeRegister?.toDate || _todayDate(),
    acc: localStorage?.bankingChequeRegister?.acc || "",
    sbu: localStorage?.bankingChequeRegister?.sbu || "",
    searchTerm: localStorage?.bankingChequeRegister?.searchTerm || "",
    isPrint: localStorage?.bankingChequeRegister?.isPrint || false,
  };

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      getSbuDDL(profileData.accountId, selectedBusinessUnit.value, setSbuDDL);
      getAccDDL(profileData.accountId, selectedBusinessUnit.value, setAccDDL);
    }
  }, [profileData, selectedBusinessUnit]);
  // const pdfExport = (fileName) => {
  //   var element = document.getElementById("pdf-section");
  //   var opt = {
  //     margin: 20,
  //     filename: `${fileName}.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 5,
  //       dpi: 300,
  //       letterRendering: true,
  //       padding: "50px",
  //       scrollX: -window.scrollX,
  //       scrollY: -window.scrollY,
  //       windowWidth: document.documentElement.offsetWidth,
  //       windowHeight: document.documentElement.offsetHeight,
  //     },
  //     jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "landscape" },
  //   };
  //   html2pdf()
  //     .set(opt)
  //     .from(element)
  //     .save();
  // };
  const printRef = useRef();

  const history = useHistory();

  const totalAmount = useCallback(
    rowDto.reduce((acc, item) => acc + +item.amount, 0),
    [rowDto]
  );

  console.log("rowdto", totalAmount);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Cheque Register"}>
                {/* <CardHeaderToolbar>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary m-0 mx-2 py-2 px-2"
                    table="table-to-xlsx"
                    filename="Income Statement Report"
                    sheet="Income Statement Report"
                    buttonText="Export Excel"
                  />
                  <button
                    className="btn btn-primary ml-2"
                    type="button"
                    onClick={(e) => pdfExport("Income Statement Report")}
                  >
                    Export PDF
                  </button>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary sales_invoice_btn ml-3"
                      >
                        <img
                          style={{ width: "20px", paddingRight: "5px" }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </CardHeaderToolbar> */}
              </CardHeader>
              <CardBody>
                <Form
                  className="form form-label-right"
                  // ref={printRef}
                >
                  <div className="row global-form align-items-end">
                    <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                          dispatch(
                            SetBankingChequeRegisterAction({
                              ...values,
                              sbu: valueOption,
                            })
                          );
                        }}
                        placeholder="Select SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="acc"
                        options={accDDL || []}
                        value={values?.acc}
                        label="Bank A/C"
                        onChange={(valueOption) => {
                          setFieldValue("acc", valueOption);
                          dispatch(
                            SetBankingChequeRegisterAction({
                              ...values,
                              acc: valueOption,
                            })
                          );
                          setRowDto([]);
                        }}
                        placeholder="Select A/C"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          dispatch(
                            SetBankingChequeRegisterAction({
                              ...values,
                              fromDate: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                          dispatch(
                            SetBankingChequeRegisterAction({
                              ...values,
                              toDate: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Search</label>
                      <InputField
                        value={values?.searchTerm}
                        name="searchTerm"
                        placeholder="Search"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("searchTerm", e.target.value);
                          dispatch(
                            SetBankingChequeRegisterAction({
                              ...values,
                              searchTerm: e.target.value,
                            })
                          );
                        }}
                      />
                    </div>
                    <div className="col-auto d-flex justify-content-center align-items-center">
                      <input
                        value={values?.isPrint}
                        checked={values?.isPrint}
                        name="isPrint"
                        type="checkbox"
                        onChange={(e) => {
                          setFieldValue("isPrint", e.target.checked);
                          dispatch(
                            SetBankingChequeRegisterAction({
                              ...values,
                              isPrint: e.target.checked,
                            })
                          );
                        }}
                      />
                      <label className="ml-2">Print</label>
                    </div>
                    {/* <div className="col-lg-3">
                      <label>To date</label>
                      <InputField
                        value={values?.todate}
                        name="todate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              todate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div> */}
                    {/* <div className="col-lg-3">
                      <label>Last Period From</label>
                      <InputField
                        value={values?.lastPeriodFrom}
                        name="lastPeriodFrom"
                        placeholder="Last Period From"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              lastPeriodFrom: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div> */}
                    {/* <div className="col-lg-3">
                      <label>Last Period To</label>
                      <InputField
                        value={values?.lastPeriodTo}
                        name="lastPeriodTo"
                        placeholder="Last Period To"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportIncomestatementAction({
                              ...values,
                              lastPeriodTo: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div> */}
                    <div className="col-lg-auto">
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getBankJournal(
                            values?.acc?.value,
                            values?.fromDate,
                            values?.toDate,
                            values?.sbu?.value,
                            values.isPrint,
                            values?.searchTerm,
                            setRowDto,
                            values?.sbu
                          );
                        }}
                        disabled={
                          !values?.acc ||
                          !values?.toDate ||
                          !values?.fromDate ||
                          !values?.sbu
                        }
                      >
                        Show
                      </button>
                    </div>
                  </div>

                  <div className="row" id="pdf-section" ref={printRef}>
                    <div className="col-lg-12">
                      {/* <div className="titleContent text-center">
                        <h5>Cheque Register</h5>
                      </div> */}
                      <div className="print_wrapper">
                      <div className="table-responsive">
               <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                          <thead>
                            <tr>
                              {/* <th style={{ width: "30px" }}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rowDto?.length > 0
                                      ? rowDto?.every((item) => item?.checked)
                                      : false
                                  }
                                  onChange={(e) => {
                                    setRowDto(
                                      rowDto?.map((item) => {
                                        return {
                                          ...item,
                                          checked: e?.target?.checked,
                                        };
                                      })
                                    );
                                  }}
                                />
                              </th> */}
                              <th style={{ width: "50px" }}>SL</th>
                              <th style={{ width: "150px" }}>Code</th>
                              <th style={{ width: "100px" }}>Voucher Date</th>
                              <th style={{ width: "100px" }}>Cheque Date</th>
                              <th style={{ width: "150px" }}>Cheque No</th>
                              <th>Party</th>
                              <th style={{ width: "100px" }}>Is Complete</th>
                              <th style={{ width: "100px" }}>Amount</th>
                              <th style={{ width: "150px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => (
                              <tr>
                                {/* <td className="text-center align-middle">
                                  <input
                                    type="checkbox"
                                    // value = {item?.checked ? true:false}
                                    checked={item?.checked}
                                    onChange={(e) => {
                                      item["checked"] = e.target.checked;
                                      setRowDto([...rowDto]);
                                    }}
                                  />
                                </td> */}
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item?.bankJournalCode}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.voucherDate)}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.instrumentDate)}
                                </td>
                                <td className="text-center">
                                  {item?.chequeNo}
                                </td>
                                <td className="text-center">{item?.paidTo}</td>
                                <td className="text-center">
                                  {item?.completeDateTime ? "Yes" : "No"}
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(item?.amount.toFixed(2))}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  <div className="text-center">
                                    {!item?.completeDateTime && (
                                      <span
                                        onClick={() => {
                                          history.push({
                                            pathname: `/financial-management/financials/bank/edit/${item?.bankJournalId}`,
                                            state: {
                                              selectedJournal: {
                                                value: item?.bankJournalTypeId,
                                                label: "",
                                              },
                                              selectedSbu: item?.sbu,
                                              transactionDate:
                                                item?.voucherDate,
                                            },
                                          });
                                        }}
                                      >
                                        <IEdit classes="text-primary mr-2" />
                                      </span>
                                    )}

                                    <span className="view">
                                      <IView
                                        classes={"text-primary"}
                                        clickHandler={() => {
                                          setCurrentRowData(item);
                                          setIsShowModal(true);
                                        }}
                                      />
                                    </span>
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          {"Change Cheque No"}
                                        </Tooltip>
                                      }
                                    >
                                      <span
                                        className={
                                          item?.instrumentId === 2 ||
                                          item?.instrumentId === 3
                                            ? `iconActive ml-3`
                                            : `iconInActive ml-3`
                                        }
                                        onClick={() => {
                                          if (
                                            item?.instrumentId === 2 ||
                                            item?.instrumentId === 3
                                          ) {
                                            // let confirmObject = {
                                            //   title: "Are you sure?",
                                            //   message: ``,
                                            //   yesAlertFunc: () => {
                                            //     if (item?.instrumentId) {
                                            //       setGenarateChequeNo(
                                            //         profileData?.accountId,
                                            //         selectedBusinessUnit?.value,
                                            //         item?.bankId,
                                            //         item?.bankBranchId,
                                            //         item?.bankAccountId,
                                            //         item?.bankAccountNo,
                                            //         item?.instrumentId,
                                            //         setCurrentChequeNo,
                                            //         setChequeModal
                                            //       );
                                            //       setChequeModalData(item);
                                            //     }
                                            //   },
                                            //   noAlertFunc: () => {},
                                            // };
                                            // IConfirmModal(confirmObject);
                                            setChangeModalShowState({
                                              isShow: true,
                                              data: item,
                                              index,
                                              otp: "",
                                            });
                                          }
                                        }}
                                      >
                                        <i
                                          className={`fa pointer fa-credit-card text-primary`}
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          {"Cheque Print"}
                                        </Tooltip>
                                      }
                                    >
                                      <span
                                        className={
                                          item?.instrumentId === 2 ||
                                          item?.instrumentId === 3
                                            ? `iconActive ml-3`
                                            : `iconInActive ml-3`
                                        }
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          if (
                                            item?.instrumentId === 2 ||
                                            item?.instrumentId === 3
                                          ) {
                                            setChequePrintModalShow(true);
                                            setChequePrintModalData(item);
                                          }
                                        }}
                                      >
                                        <i class="fas fa-print text-primary"></i>
                                      </span>
                                    </OverlayTrigger>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {rowDto?.length > 0 && (
                              <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                  <b>Total</b>
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(totalAmount.toFixed(2))}
                                </td>
                                <td></td>
                              </tr>
                            )}
                          </tbody>
                        </table>
            </div>
                     
                        <div></div>
                      </div>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
        <BankJournalViewTableRow currentRowData={currentRowData} />
      </IViewModal>
      <Modal
        show={changeModalShowState?.isShow}
        backdrop="static"
        onHide={(e) => {
          setChangeModalShowState({
            isShow: false,
            data: null,
          });
        }}
        centered
      >
        <Modal.Header closeButton>
          {/* {!changeModalShowState?.isOtpGenerate && ( */}
          <Modal.Title>Do you want to change the cheque?</Modal.Title>
          {/* )} */}
        </Modal.Header>
        <Modal.Body>
          {/* {!changeModalShowState?.isOtpGenerate && ( */}
          <>
            <div className="d-flex justify-content-center my-5">
              <p className="mr-5">
                <span className="font-weight-bold">Voucher :</span>
                {changeModalShowState?.data?.bankJournalCode}
              </p>
              <p className="mr-5">
                <span className="font-weight-bold">Amount :</span>
                {changeModalShowState?.data?.amount}
              </p>
            </div>
          </>
          {/* )} */}
          {/* {changeModalShowState?.isOtpGenerate && (
            <div className="text-center my-5">
              <span className="mr-3"> Please Enter OTP Number</span>
              <input
                value={changeModalShowState?.otp}
                onChange={(e) => {
                  setChangeModalShowState({
                    ...changeModalShowState,
                    otp: e.target.value,
                  });
                }}
              />
            </div>
          )} */}
          <div className="text-center my-5">
            <button
              className="btn btn-primary mr-5"
              onClick={(e) => {
                setDisabledModalButton(true);
                chequeGeneretor(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  changeModalShowState?.data?.bankId,
                  changeModalShowState?.data?.bankBranchId,
                  changeModalShowState?.data?.bankAccountId,
                  changeModalShowState?.data?.bankAccountNo,
                  changeModalShowState?.data?.instrumentId,
                  changeModalShowState?.data?.bankJournalId,
                  (obj) => {
                    rowDto[changeModalShowState?.index]["chequeNo"] =
                      obj?.currentChequeNo;
                    setRowDto([...rowDto]);
                    setChangeModalShowState({
                      isShow: false,
                      data: null,
                    });
                    setDisabledModalButton(false);
                  }
                );
                // if (changeModalShowState?.isOtpGenerate) {
                //   checkTwoFactorApproval(
                //     2,
                //     selectedBusinessUnit?.value,
                //     "ChangeCheque",
                //     changeModalShowState?.data?.bankJournalId,
                //     changeModalShowState?.data?.bankJournalCode,
                //     changeModalShowState?.data?.bankJournalTypeId,
                //     profileData?.userId,
                //     changeModalShowState?.otp,
                //     1,
                //     setDisabledModalButton,
                //     (status) => {
                //       if (status === 1) {
                //         chequeGeneretor(
                //           profileData?.accountId,
                //           selectedBusinessUnit?.value,
                //           changeModalShowState?.data?.bankId,
                //           changeModalShowState?.data?.bankBranchId,
                //           changeModalShowState?.data?.bankAccountId,
                //           changeModalShowState?.data?.bankAccountNo,
                //           changeModalShowState?.data?.instrumentId,
                //           changeModalShowState?.data?.bankJournalId,
                //           (obj) => {
                //             rowDto[changeModalShowState?.index]['chequeNo']=obj?.currentChequeNo;
                //             setRowDto([...rowDto]);
                //             setChangeModalShowState({
                //               isShow: false,
                //               data: null,
                //             });
                //           }
                //         );
                //         // setChequeModalData(changeModalShowState?.data);
                //       }
                //     }
                //   );
                // } else {
                //   checkTwoFactorApproval(
                //     1,
                //     selectedBusinessUnit?.value,
                //     "ChangeCheque",
                //     changeModalShowState?.data?.bankJournalId,
                //     changeModalShowState?.data?.bankJournalCode,
                //     changeModalShowState?.data?.bankJournalTypeId,
                //     profileData?.userId,
                //     "",
                //     1,
                //     setDisabledModalButton,
                //     () => {
                //       setChangeModalShowState({
                //         ...changeModalShowState,
                //         otp: "",
                //         isOtpGenerate: true,
                //       });
                //     }
                //   );
                //   // setReverseModalShowState({
                //   //   ...reverseModalShowState,
                //   //   otp:"",
                //   //   isOtpGenerate: true,
                //   // });
                // }
              }}
              disabled={disabledModalButton}
            >
              {/* {reverseModalShowState?.isOtpGenerate ? "Send" : "Yes"} */}
              {disabledModalButton ? "Processing" : "Yes"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                setChangeModalShowState({
                  isShow: false,
                  data: null,
                });
                setDisabledModalButton(false);
              }}
              // disabled={disabledModalButton}
            >
              Cancel
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <ChequePrintModal
        show={chequePrintModalShow}
        onHide={() => {
          setChequePrintModalShow(false);
          setChequePrintModalData({});
        }}
        item={chequePrintModalData}
      />
    </>
  );
}
