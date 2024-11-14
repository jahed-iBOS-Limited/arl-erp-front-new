/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import ICon from "../../../../../chartering/_chartinghelper/icons/_icon";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import PaginationTable from "../../../../../_helper/_tablePagination";
import IViewModal from "../../../../../_helper/_viewModal";
import AttachmentUploadForm from "../../attachmentAdd";
import {
  createLoanRegister,
  getAttachments,
  getBankDDLAll,
  getBusinessUnitDDL,
  getLoanRegisterLanding,
} from "../../helper";
import IClose from "../../../../../_helper/_helperIcons/_close";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import PdfRender from "../components/PdfRender";
import { useReactToPrint } from "react-to-print";
import IEdit from "../../../../../_helper/_helperIcons/_edit";
import IConfirmModal from "../../../../../_helper/_confirmModal";
import { toast } from "react-toastify";
import InfoCircle from "../../../../../_helper/_helperIcons/_infoCircle";
import "./style.css";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import moment from "moment";
import InputField from "../../../../../_helper/_inputField";

const LoanRegisterLanding = () => {
  const history = useHistory();
  const initData = {
    bank: { label: "ALL", value: 0 },
    status: { value: 2, label: "Incomplete" },
    loanType: "",
    loanClass: "",
    businessUnit: { value: 0, label: "All" },
    applicationType: { label: "ALL", value: 0 },
    fromDate: "",
    toDate: "",
  };
  const [
    historyData,
    getHistory,
    loadingHistory,
    setHistoryData,
  ] = useAxiosGet();
  // ref
  // eslint-disable-next-line no-unused-vars
  const printRef = useRef();

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [loanRegisterData, setLoanRegisterData] = useState([]);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);

  const [bankDDL, setBankDDL] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [open, setOpen] = useState(false);
  const [fdrNo, setFdrNo] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [show, setShow] = useState(false);
  const [, postCloseLoanRegister, closeLoanRegisterLoader] = useAxiosPost();
  const [singleItem, setSingleItem] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Sorting state for each column
  const [openDateOrder, setOpenDateOrder] = useState("asc"); // 'asc' or 'desc'
  const [maturityDateOrder, setMaturityDateOrder] = useState("asc"); // 'asc' or 'desc'

  // State to hold the sorted data
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (loanRegisterData?.data) {
      setSortedData(loanRegisterData?.data);
    }
  }, [loanRegisterData]);

  const handleSort = (column) => {
    const dataToSort = [...sortedData];
    let order, dateField;

    // Set sorting parameters based on the column
    if (column === "openDate") {
      order = openDateOrder;
      dateField = "dteStartDate";
      setOpenDateOrder(order === "asc" ? "desc" : "asc");
    } else if (column === "maturityDate") {
      order = maturityDateOrder;
      dateField = "dteMaturityDate";
      setMaturityDateOrder(order === "asc" ? "desc" : "asc");
    }

    // Sort the data
    dataToSort.sort((a, b) => {
      const dateA = new Date(a[dateField]);
      const dateB = new Date(b[dateField]);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    setSortedData(dataToSort);
  };

  useEffect(() => {
    if (singleItem?.intBankLetterTemplateId === 1) {
      setShowModal(true);
    } else if (singleItem?.intBankLetterTemplateId) {
      handleInvoicePrint();
      setShowModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleItem]);

  const {
    profileData,
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    setLoading(true);
  };

  useEffect(() => {
    getBankDDLAll(setBankDDL, setLoading);
    getBusinessUnitDDL(profileData?.accountId, setBusinessUnitDDL);
  }, []);

  useEffect(() => {
    getLoanRegisterLanding(
      profileData?.accountId,
      0,
      0,
      2,
      pageNo,
      pageSize,
      setLoanRegisterData,
      setLoading,
      0
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLoanRegisterLanding(
      profileData?.accountId,
      values?.businessUnit?.value >= 0 ? values?.businessUnit?.value : buId,
      values?.bank?.value,
      values?.status?.value,
      pageNo,
      pageSize,
      setLoanRegisterData,
      setLoading,
      values?.applicationType?.value || 0
    );
  };

  const totalPrincipleAmount = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.numPrinciple, 0),
    [loanRegisterData?.data]
  );
  const totalInterestAmount = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.numInterest, 0),
    [loanRegisterData?.data]
  );
  const totalPayable = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.numTotalPayable, 0),
    [loanRegisterData?.data]
  );
  const totalPaidPrincipal = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.numPaid, 0),
    [loanRegisterData?.data]
  );
  const totalPaidInterest = useMemo(
    () => loanRegisterData?.data?.reduce((a, c) => a + c?.interestAmount, 0),
    [loanRegisterData?.data]
  );
  const totalBalance = useMemo(
    () =>
      loanRegisterData?.data?.reduce(
        (a, c) => a + (c?.numPrinciple - c?.numPaid),
        0
      ),
    [loanRegisterData?.data]
  );
  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
    onAfterPrint: () => {
      setIsPrinting(false);
      setLoading(false);
    },
  });
  // useEffect(() => {
  //   if (isPrinting) {
  //     handleInvoicePrint();
  //   }
  // }, [isPrinting]);

  const handlePrintClick = ({ item }) => {
    // setLoading(true);
    setSingleItem(item);
    // setIsPrinting(true);
  };

  const confirm = (item, values) => {
    console.log({ item });
    let confirmObject = {
      title: "Are you sure?",
      message: "You want to confirm this loan?",
      yesAlertFunc: async () => {
        const cb = () => {
          getLoanRegisterLanding(
            profileData?.accountId,
            item?.intBusinessUnitId,
            values?.bank?.value,
            values?.status?.value,
            pageNo,
            pageSize,
            setLoanRegisterData,
            setLoading,
            values?.applicationType?.value || 0
          );
        };
        createLoanRegister(
          profileData?.accountId,
          item?.intBusinessUnitId,
          item?.strLoanAccountName,
          item?.intBankId,
          item?.intBankAccountId,
          item?.intLoanFacilityId,
          item?.dteStartDate || 0,
          item?.intTenureDays || 0,
          item?.numPrinciple || 0,
          item?.numInterestRate || 0,
          item?.disbursementPurposeId || 0,
          item?.disbursementPurposeId || "",
          profileData?.userId,
          setLoading,
          cb,
          true,
          item?.intLoanAccountId
        );
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };
  return (
    <>
      {(loading || closeLoanRegisterLoader || loadingHistory) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, (code) => {});
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Loan Register"}>
                <CardHeaderToolbar>
                  <button
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={false}
                    onClick={() => {
                      history.push({
                        pathname: `${window.location.pathname}/create`,
                        state: {
                          ...values,
                        },
                      });
                    }}
                  >
                    Create Loan Register
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form align-items-end">
                    {buId === 136 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessUnit"
                          options={
                            [{ value: 0, label: "All" }, ...businessUnitDDL] ||
                            []
                          }
                          value={values?.businessUnit}
                          label="BusinessUnit"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue("businessUnit", valueOption);
                              setLoanRegisterData([]);
                            } else {
                              setLoanRegisterData([]);
                              setFieldValue("businessUnit", "");
                            }
                          }}
                          placeholder="BusinessUnit"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}
                    <div className="col-lg-3">
                      <NewSelect
                        name="bank"
                        options={bankDDL}
                        value={values?.bank}
                        onChange={(valueOption) => {
                          setFieldValue("bank", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        label="Bank"
                        placeholder="Bank"
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="status"
                        options={[
                          { value: 0, label: "ALL" },
                          { value: 1, label: "Complete" },
                          { value: 2, label: "Incomplete" },
                        ]}
                        value={values?.status}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("status", valueOption);
                          } else {
                            setFieldValue("status", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        label="Status"
                        placeholder="Status"
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="applicationType"
                        options={[
                          { value: 0, label: "ALL" },
                          { value: 1, label: "Pending" },
                          { value: 2, label: "Approved" },
                        ]}
                        value={values?.applicationType}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("applicationType", valueOption);
                          } else {
                            setFieldValue("applicationType", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        label="Application Type"
                        placeholder="Application Type"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Opening Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="Opening date"
                          type="date"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <label>Maturity Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="Maturity date"
                          type="date"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-1">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={(e) => {
                          getLoanRegisterLanding(
                            profileData?.accountId,
                            values?.businessUnit?.value >= 0
                              ? values?.businessUnit?.value
                              : buId,
                            values?.bank?.value,
                            values?.status?.value,
                            pageNo,
                            pageSize,
                            setLoanRegisterData,
                            setLoading,
                            values?.applicationType?.value || 0,
                            values?.fromDate,
                            values?.toDate
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                    {buId === 136 && (
                      <div className="col-lg-1">
                        <button
                          className="btn btn-primary mr-2"
                          type="button"
                          onClick={(e) => {
                            history.push({
                              pathname: `/financial-management/banking/loan-register/auto-journal-log/`,
                              state: {},
                            });
                          }}
                        >
                          Log
                        </button>
                      </div>
                    )}
                  </div>
                  <div></div>
                  <div className="row">
                    <div className="col-12 common-scrollable-table four-column-sticky">
                      <div className="scroll-table _table overflow-auto">
                        {/* <div className="table-responsive"> */}
                        <table className="table table-striped table-bordered global-table">
                          <thead className="bg-secondary">
                            <tr>
                              <th>SL</th>
                              <th style={{ minWidth: "100px" }}>Status</th>
                              {[136].includes(buId) && <th>SBU</th>}
                              <th>Bank</th>
                              <th style={{ minWidth: "100px" }}>Facility</th>
                              <th style={{ minWidth: "120px" }}>
                                Loan A/c no.
                              </th>
                              <th style={{ minWidth: "50px" }}>Tenor</th>
                              <th
                                style={{ minWidth: "90px", cursor: "pointer" }}
                                onClick={() => handleSort("openDate")}
                              >
                                Open Date {openDateOrder === "asc" ? "▲" : "▼"}
                              </th>
                              <th
                                style={{ minWidth: "90px", cursor: "pointer" }}
                                onClick={() => handleSort("maturityDate")}
                              >
                                Maturity Date{" "}
                                {maturityDateOrder === "asc" ? "▲" : "▼"}
                              </th>
                              <th style={{ minWidth: "100px" }}>
                                Principal Balance
                              </th>
                              <th style={{ minWidth: "50px" }}>
                                Int.Rate (p.a.)
                              </th>
                              <th style={{ minWidth: "120px" }}>
                                Disbursement Purpose
                              </th>
                              <th style={{ minWidth: "120px" }}>Remarks</th>
                              <th style={{ minWidth: "50px" }}>
                                Profit Center
                              </th>
                              <th style={{ minWidth: "100px" }}>
                                Interest Amount
                              </th>
                              <th style={{ minWidth: "100px" }}>
                                Total Payable
                              </th>
                              <th style={{ minWidth: "100px" }}>
                                Paid Principal
                              </th>
                              <th style={{ minWidth: "100px" }}>
                                Paid Interest
                              </th>
                              <th style={{ minWidth: "50px" }}>
                                Paid Excise Duty
                              </th>
                              <th style={{ minWidth: "70px" }}>Loan Class</th>
                              <th style={{ minWidth: "70px" }}>Loan Type</th>
                              <th>BR Number</th>
                              {/* <th style={{ minWidth: "90px" }}>
                                Application Status
                              </th> */}
                              {/* <th style={{ minWidth: "50px" }}>
                                Outstanding Excise Duty
                              </th> */}
                              {/* <th style={{ minWidth: "100px" }}>
                                Principal Balance
                              </th> */}
                              <th style={{ minWidth: "200px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item?.isLoanApproved
                                    ? "Approved"
                                    : "Pending"}
                                </td>
                                {[136].includes(buId) && (
                                  <td className="text-">{item?.sbuName}</td>
                                )}
                                <td className="text-">{item?.strBankName}</td>
                                <td className="text-">
                                  {item?.facilityName}{" "}
                                  <span className="facility-icon">
                                    <InfoCircle
                                      clickHandler={() => {
                                        getHistory(
                                          `/fino/FundManagement/GetLoanRegisterHistory?loanAccountId=${item?.intLoanAccountId}&journalCode=${item?.brCode}`
                                        );
                                        setShow(true);
                                      }}
                                      classes="text-primary"
                                    />
                                  </span>
                                </td>
                                <td className="text-">
                                  {item?.strLoanAccountName}
                                </td>
                                <td className="text-">{item?.intTenureDays}</td>
                                <td className="text-">
                                  {_dateFormatter(item?.dteStartDate)}
                                </td>
                                <td className="text-">
                                  {_dateFormatter(item?.dteMaturityDate)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(
                                    item?.numPrinciple < 0
                                      ? 0
                                      : item?.numPrinciple
                                  )}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numInterestRate)}%
                                </td>
                                <td className="text-">
                                  {item?.disbursementPurposeName}
                                </td>
                                <td className="text-">{item?.loanRemarks}</td>
                                <td className="text-"></td>
                                <td className="text-right">
                                  {_formatMoney(item?.numInterest)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numTotalPayable)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numPaid)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.interestAmount)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numExciseDuty)}
                                </td>

                                <td className="text-">{item?.loanClassName}</td>
                                <td className="text-">{item?.loanTypeName}</td>
                                <td className="text-">{item?.brCode}</td>
                                {/* <td>
                                  {item?.isLoanApproved
                                    ? "Approved"
                                    : "Pending"}
                                </td> */}
                                {/* <td className="text-right">-</td> */}
                                {/* <td className="text-right">
                                  {item?.numPrinciple - item?.numPaid >= 1
                                    ? _formatMoney(
                                        item?.numPrinciple - item?.numPaid
                                      )
                                    : 0}
                                </td> */}
                                <td className="text-center">
                                  <div className="d-flex justify-content-around">
                                    {/* <span
                                    onClick={() =>
                                      history.push({
                                        pathname: `/financial-management/banking/loan-register/view/${item?.intLoanAccountId}`,
                                      })
                                    }
                                  >
                                    <IView />
                                  </span> */}
                                    <span>
                                      <ICon
                                        title="Attach or View your documents"
                                        onClick={() => {
                                          setFdrNo(item?.strLoanAccountName);
                                          getAttachments(
                                            item?.intBusinessUnitId,
                                            2,
                                            item?.strLoanAccountName,
                                            setAttachments,
                                            setLoading,
                                            () => {
                                              setOpen(true);
                                            }
                                          );
                                        }}
                                      >
                                        <i class="fas fa-paperclip"></i>
                                      </ICon>
                                    </span>
                                    <span
                                      className="text-primary "
                                      style={{
                                        marginLeft: "4px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        if (
                                          item?.numPrinciple - item?.numPaid <
                                          1
                                        ) {
                                          toast.warn("You have already repaid");
                                          return;
                                        } else {
                                          history.push({
                                            pathname: `/financial-management/banking/loan-register/repay/${item?.intLoanAccountId}`,
                                            state: {
                                              bankId: item?.intBankId,
                                              principal:
                                                item?.numPrinciple -
                                                item?.numPaid,
                                              bu: values?.businessUnit?.value,
                                              strLoanAccountName:
                                                item?.strLoanAccountName,
                                            },
                                          });
                                        }
                                      }}
                                    >
                                      Repay
                                    </span>
                                    <span
                                      className="text-primary "
                                      style={{
                                        marginLeft: "4px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        if (
                                          item?.numPrinciple - item?.numPaid <
                                          1
                                        ) {
                                          toast.warn(
                                            "You can't renew this loan"
                                          );
                                          return;
                                        } else {
                                          history.push({
                                            pathname: `/financial-management/banking/loan-register/re-new/${item?.intLoanAccountId}`,
                                            state: item,
                                          });
                                        }
                                      }}
                                    >
                                      Renew
                                    </span>
                                    {!item?.isLoanApproved ? (
                                      <span
                                        className="text-primary "
                                        style={{
                                          marginLeft: "4px",
                                          marginRight: "4px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => confirm(item, values)}
                                      >
                                        Confirm
                                      </span>
                                    ) : null}

                                    <span style={{ marginRight: "4px" }}>
                                      <ICon
                                        title={"Print"}
                                        onClick={() => {
                                          setShowModal(true);
                                          handlePrintClick({ item });
                                        }}
                                      >
                                        <i class="fas fa-print"></i>
                                      </ICon>
                                    </span>
                                    {!item?.isLoanApproved ? (
                                      <span
                                        onClick={() =>
                                          history.push({
                                            pathname: `/financial-management/banking/loan-register/edit/${item?.intLoanAccountId}`,
                                            state: item,
                                          })
                                        }
                                      >
                                        <IEdit />
                                      </span>
                                    ) : null}
                                    {/* for close */}
                                    {item?.numPaid === 0 ? (
                                      <span
                                        className="text-primary "
                                        style={{
                                          marginLeft: "4px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <IClose
                                          closer={() => {
                                            postCloseLoanRegister(
                                              `/fino/FundManagement/CancelLoanRegister?businessUnitId=${item?.intBusinessUnitId}&loanAccountId=${item?.intLoanAccountId}&actionBy=${profileData?.userId}`,
                                              null,
                                              () => {
                                                getLoanRegisterLanding(
                                                  profileData?.accountId,
                                                  values?.businessUnit?.value >=
                                                    0
                                                    ? values?.businessUnit
                                                        ?.value
                                                    : buId,
                                                  values?.bank?.value,
                                                  values?.status?.value,
                                                  pageNo,
                                                  pageSize,
                                                  setLoanRegisterData,
                                                  setLoading,
                                                  values?.applicationType
                                                    ?.value || 0
                                                );
                                              }
                                            );
                                          }}
                                          title="Cancel Loan Register"
                                        />
                                      </span>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            ))}

                            <tr>
                              <td></td>
                              <td className="text-center">Total</td>
                              <td className="text-right"></td>
                              <td className="text-right"></td>
                              <td colSpan={5}></td>
                              <td className="text-right">
                                <b> {_formatMoney(totalPrincipleAmount)}</b>
                              </td>
                              <td className="text-right"></td>
                              <td className="text-right"></td>
                              <td className="text-right"></td>
                              <td className="text-right"></td>
                              <td className="text-right">
                                <b> {_formatMoney(totalInterestAmount)}</b>
                              </td>
                              <td className="text-right">
                                <b> {_formatMoney(totalPayable)}</b>
                              </td>
                              <td className="text-right">
                                <b> {_formatMoney(totalPaidPrincipal)}</b>
                              </td>
                              <td className="text-right">
                                <b> {_formatMoney(totalPaidInterest)}</b>
                              </td>
                              <td className="text-right"></td>
                              <td colSpan={3}></td>
                              <td className="text-right">
                                <b> {_formatMoney(totalBalance)}</b>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </Form>
                {loanRegisterData?.data?.length > 0 && (
                  <PaginationTable
                    count={loanRegisterData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </CardBody>
            </Card>

            <IViewModal show={open} onHide={() => setOpen(false)}>
              <AttachmentUploadForm
                typeId={2}
                setShow={setOpen}
                fdrNo={fdrNo}
                attachments={attachments}
              />
            </IViewModal>
            {show && !loadingHistory && (
              <IViewModal show={show} onHide={() => setShow(false)}>
                <div
                  style={{
                    textAlign: "center",
                    margin: "20px 0",
                  }}
                >
                  <h3>Created By: {historyData?.createdBy}</h3>
                  <h4>
                    Confirmation Date:{" "}
                    {historyData?.confirmedAt
                      ? moment(historyData?.confirmedAt)?.format("ll")
                      : ""}
                  </h4>
                  {historyData?.history?.length > 0 && (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Loan Account ID</th>
                          <th>Transaction Date</th>
                          <th>Amount</th>
                          <th>Narration</th>
                          <th>Journal Code</th>
                          <th>Created By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData?.history?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.loanAccountId}</td>
                            <td>
                              {new Date(
                                item?.transactionDate
                              ).toLocaleDateString()}
                            </td>
                            <td>{item?.amount}</td>
                            <td>{item?.narration}</td>
                            <td>{item?.journalCode}</td>
                            <td>{item?.createdBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </IViewModal>
            )}
            {/* <IViewModal show={modalShow} onHide={() => setModalShow(false)}>
         </IViewModal> */}
          </div>
        )}
      </Formik>
      <IViewModal
        title={"Print Template"}
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "20px;",
            }}
          >
            <button
              style={{ cursor: "pointer" }}
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleInvoicePrint();
                setShowModal(false);
              }}
            >
              Print
            </button>
          </div>

          <div>
            <div style={{ margin: "-13px 0 51px 0" }}>
              {/* {singleItem && ( */}
              <PdfRender printRef={printRef} singleItem={singleItem} />
              {/* )} */}
            </div>
          </div>
        </>
      </IViewModal>
    </>
  );
};

export default LoanRegisterLanding;
