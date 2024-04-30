/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import IEdit from "../../../../_helper/_helperIcons/_edit";
// import PaginationTable from "../../../../_helper/_tablePagination";
// import ICustomTable from "../../../../_helper/_customTable";
import { Formik } from "formik";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IClose from "../../../../_helper/_helperIcons/_close";
import IUpdate from "../../../../_helper/_helperIcons/_update";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import { _todayDate } from "../../../../_helper/_todayDate";
import { SetBankStatementCorrectionAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import {
  bankAccountDDL,
  checkTwoFactorApproval,
  getBankAccountByBranchDDL,
  getBankStatementLanding,
  reconcileCancelAction,
  updateBankStatement,
} from "../helpers";

const TableRow = () => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [backAccountDDL, setBankAccountDDL] = useState([]);
  const [acDDL, setAcDDL] = useState([]);

  const dispatch = useDispatch();
  const { bankStatementCorrection: localStorageData } = useSelector(
    (state) => state.localStorage
  );
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [reconcileModal, setReconcileModal] = useState({
    isOpen: false,
    item: null,
  });

  useEffect(() => {
    bankAccountDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBankAccountDDL
    );
  }, []);

  const initData = {
    bankAccount: localStorageData?.bankAccount || "",
    acDDL: localStorageData?.acDDL || "",
    toDate: localStorageData?.toDate || _todayDate(),
    fromDate: localStorageData?.fromDate || _todayDate(),
  };

  const setDataToGrid = (value, key, index, grid, setter) => {
    let data = [...grid?.data];
    data[index][key] = value;
    setter({ ...grid, data });
  };

  const updateRowData = (item, index) => {
    // if (item?.drAmount > 0 && item?.crAmount > 0)
    //   return toast.warn("One field must be zero among Dr amount and cr amount");

    // if (item?.drAmount <= 0 && item?.crAmount <= 0)
    //   return toast.warn("One field must be greater than zero");

    if (item?.drAmount < 0 || item?.crAmount < 0)
      return toast.warn("Negative value not allowed");
    updateBankStatement(
      {
        bankStatementId: item?.bankStatementId,
        debitAmount: +item?.drAmount || 0,
        creditAmount: +item?.crAmount || 0,
        runningBalance: +item?.monRunningBalance || 0,
        trDate: _dateFormatter(item?.bankTransectionDate),
      },
      () => {
        setDataToGrid(false, "editable", index, gridData, setGridData);
      }
    );
  };

  const getBankStatementData = (pageNo, pageSize, values) => {
    getBankStatementLanding(
      values?.acDDL?.value,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      pageSize,
      pageNo,
      setIsLoading
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    
    getBankStatementData(pageNo, pageSize, values);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            {/* {console.log(values)} */}
            <Card>
              <CardHeader title="Bank Statement Correction">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isloading && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="bankAccount"
                      placeholder="Select Bank Account"
                      value={values?.bankAccount}
                      onChange={(valueOption) => {
                        setFieldValue("bankAccount", valueOption);
                        getBankAccountByBranchDDL(
                          valueOption?.value,
                          profileData?.accountId,
                          selectedBusinessUnit.value,
                          setAcDDL
                        );
                        setFieldValue("acDDL", "");
                        dispatch(
                          SetBankStatementCorrectionAction({
                            ...values,
                            bankAccount: valueOption,
                            acDDL: "",
                          })
                        );
                      }}
                      // isSearchable={true}
                      options={backAccountDDL}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="bankBranchAccount"
                      placeholder="Select Branch"
                      value={values?.bankBranchAccount}
                      onChange={(valueOption) => {
                        setFieldValue("bankBranchAccount", valueOption);
                        getBankAccountByBranchDDL(
                          values?.bankAccount.value,
                          valueOption.value,
                          selectedBusinessUnit.value,
                          setAcDDL)
                      }}
                      // isSearchable={true}
                      isDisabled={!values?.bankAccount}
                      options={bankBranchAccount}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="acDDL"
                      placeholder="Select A/C No"
                      value={values?.acDDL}
                      onChange={(valueOption) => {
                        setFieldValue("acDDL", valueOption);
                        dispatch(
                          SetBankStatementCorrectionAction({
                            ...values,
                            acDDL: valueOption,
                          })
                        );
                      }}
                      // isSearchable={true}
                      options={acDDL}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From  Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        dispatch(
                          SetBankStatementCorrectionAction({
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
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        dispatch(
                          SetBankStatementCorrectionAction({
                            ...values,
                            toDate: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="col-lg-1">
                    <button
                      style={{ marginTop: "19px" }}
                      className="btn btn-primary"
                      disabled={
                        !(
                          values?.bankAccount?.value &&
                          values?.acDDL?.value &&
                          values?.fromDate &&
                          values?.toDate
                        )
                      }
                      type="button"
                      onClick={() => {
                        getBankStatementData(pageNo,pageSize,values);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="react-bootstrap-table table-responsive">
                  <div className="loan-scrollable-table scroll-table-auto">
                    <div
                      style={{ maxHeight: "519px" }}
                      className="scroll-table _table scroll-table-auto"
                    >
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "30px" }}>Sl</th>
                            <th style={{ minWidth: "70px" }}>Tr Date</th>
                            <th style={{ minWidth: "200px" }}>Particulars</th>
                            <th style={{ minWidth: "70px" }}>Instrument No</th>
                            <th style={{ minWidth: "70px" }}>Dr Amount</th>
                            <th style={{ minWidth: "70px" }}>Cr Amount</th>
                            <th style={{ minWidth: "70px" }}>Balance</th>
                            <th style={{ minWidth: "50px" }}>Reconciled</th>
                            <th style={{ minWidth: "70px" }}>
                              Reconciled Date
                            </th>
                            {/* <th style={{ minWidth: "70px" }}>Journal Code</th> */}
                            <th style={{ minWidth: "70px" }}>Action</th>
                            <th style={{ minWidth: "70px" }}>Action</th>
                            <th style={{ minWidth: "70px" }}>Insertion Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.length > 0 &&
                            gridData?.data?.map((item, index) => {
                              return (
                                <tr>
                                  <td style={{ fontSize: "8px" }}>
                                    {" "}
                                    {index + 1}{" "}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {item?.editable && (
                                      <InputField
                                        name="bankTransectionDate"
                                        placeholder="Tr date"
                                        type="date"
                                        value={_dateFormatter(
                                          item?.bankTransectionDate
                                        )}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "bankTransectionDate",
                                            e.target.value
                                          );
                                          setDataToGrid(
                                            e.target.value,
                                            "bankTransectionDate",
                                            index,
                                            gridData,
                                            setGridData
                                          );
                                        }}
                                      />
                                    )}
                                    {!item?.editable &&
                                      _dateFormatter(item?.bankTransectionDate)}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {" "}
                                    {item?.particulars}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {item.chequeNo}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {item?.editable && (
                                      <InputField
                                        name="drAmount"
                                        placeholder="Dr Amount"
                                        type="number"
                                        value={item?.drAmount}
                                        min="0"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "drAmount",
                                            e.target.value
                                          );
                                          setDataToGrid(
                                            e.target.value,
                                            "drAmount",
                                            index,
                                            gridData,
                                            setGridData
                                          );
                                        }}
                                      />
                                    )}
                                    {!item?.editable && item?.drAmount}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {item?.editable && (
                                      <InputField
                                        name="crAmount"
                                        placeholder="Cr amount"
                                        type="number"
                                        min="0"
                                        value={item?.crAmount}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "crAmount",
                                            e.target.value
                                          );
                                          setDataToGrid(
                                            e.target.value,
                                            "crAmount",
                                            index,
                                            gridData,
                                            setGridData
                                          );
                                        }}
                                      />
                                    )}
                                    {!item?.editable && item?.crAmount}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {item?.editable &&
                                    gridData?.data?.length - 1 === index ? (
                                      <InputField
                                        name="monRunningBalance"
                                        placeholder="Balance"
                                        type="number"
                                        min="0"
                                        value={item?.monRunningBalance}
                                        onChange={(e) => {
                                          setDataToGrid(
                                            e.target.value,
                                            "monRunningBalance",
                                            index,
                                            gridData,
                                            setGridData
                                          );
                                        }}
                                      />
                                    ) : (
                                      item?.monRunningBalance
                                    )}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {item?.reconcileStatus}
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {_dateFormatter(item?.reconcileDate)}
                                  </td>
                                  {/* <td style={{fontSize:"10px"}}>{item?.journalCode}</td> */}
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      {item?.editable && (
                                        <span
                                          className="ml-3 edit"
                                          onClick={() => {
                                            updateRowData(item, index);
                                          }}
                                        >
                                          <IUpdate />
                                        </span>
                                      )}

                                      {item?.editable && (
                                        <span
                                          className="ml-3"
                                          onClick={() => {
                                            setDataToGrid(
                                              false,
                                              "editable",
                                              index,
                                              gridData,
                                              setGridData
                                            );
                                            // setDataToGrid(item?.drAmountInit, "drAmount", index, gridData, setGridData)
                                            // setDataToGrid(item?.crAmountInit, "crAmount", index, gridData, setGridData)
                                            // if()
                                          }}
                                        >
                                          <IClose />
                                        </span>
                                      )}
                                      {!item?.editable && (
                                        <div>
                                          {item?.isReconcile ? (
                                            "N/A"
                                          ) : (
                                            <span
                                              className="ml-3"
                                              onClick={() => {
                                                setDataToGrid(
                                                  true,
                                                  "editable",
                                                  index,
                                                  gridData,
                                                  setGridData
                                                );
                                              }}
                                            >
                                              <IEdit />
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td style={{ fontSize: "8px" }}>
                                    {item?.bankTransectionDate && (
                                      <span className="ml-3">
                                        {item?.isReconcile ? (
                                          <button
                                            className="btn btn-outline-dark mr-1 pointer"
                                            type="button"
                                            onClick={() => {
                                              setReconcileModal({
                                                isOpen: true,
                                                item,
                                              });
                                              // reconcileCancelAction(
                                              //   profileData?.accountId,
                                              //   selectedBusinessUnit?.value,
                                              //   item?.bankAccountId,
                                              //   item?.bankStatementId,
                                              //   item?.transectionId || 0,
                                              //   getBankStatementData,
                                              //   values
                                              // );
                                            }}
                                            style={{
                                              padding: "1px 5px",
                                              fontSize: "8px",
                                              width: "100px",
                                            }}
                                          >
                                            Cancel Reconcile
                                          </button>
                                        ) : (
                                          "N/A"
                                        )}
                                      </span>
                                    )}
                                  </td>
                                  <td
                                    className="text-center"
                                    style={{ fontSize: "8px" }}
                                  >
                                    {" "}
                                    {_dateFormatter(item?.insertionTime)} (
                                    {_timeFormatter(
                                      item?.insertionTime?.substring(11, 19)
                                    )}
                                    ){" "}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination Code */}
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    values={values}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
              </CardBody>
            </Card>
            <Modal
              show={reconcileModal?.isOpen}
              backdrop="static"
              onHide={() => {
                setReconcileModal({
                  isOpen: false,
                });
              }}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Do you want to Cancle the Reconcilation
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="position-relative">
                  {reconcileModal?.state === 1 && (
                    <div
                      className="position-absolute"
                      style={{
                        background: "skyblue",
                        opacity: ".3",
                        top: "0",
                        bottom: "0",
                        left: "0",
                        right: "0",
                      }}
                    ></div>
                  )}

                  {!reconcileModal?.isOtpGenerate && (
                    <>
                      <div className="d-flex justify-content-center my-5">
                        <p className="mr-5">
                          <span className="font-weight-bold">Amount :</span>
                          {reconcileModal?.item?.creditAmount ||
                            reconcileModal?.item?.creditAmount}
                        </p>
                      </div>
                    </>
                  )}
                  {reconcileModal?.isOtpGenerate && (
                    <div className="text-center my-5">
                      <span className="mr-3"> Please Enter OTP Number</span>
                      <input
                        value={reconcileModal?.otp}
                        onChange={(e) => {
                          setReconcileModal({
                            ...reconcileModal,
                            otp: e.target.value,
                          });
                        }}
                      />
                    </div>
                  )}
                  <div className="text-center my-5">
                    <button
                      className="btn btn-primary mr-5"
                      onClick={(e) => {
                        setReconcileModal({
                          ...reconcileModal,
                          state: 1,
                        });
                        if (reconcileModal?.isOtpGenerate) {
                          checkTwoFactorApproval(
                            2,
                            selectedBusinessUnit?.value,
                            "Reconcile",
                            reconcileModal?.item?.bankStatementId,
                            `${reconcileModal?.item?.chequeNo} ( ${reconcileModal?.item?.journalCode} )`,
                            0,
                            profileData?.userId,
                            reconcileModal?.otp,
                            1,
                            setIsLoading,
                            (status) => {
                              if (status === 1) {
                                const item = { ...reconcileModal?.item };
                                reconcileCancelAction(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  item?.bankAccountId,
                                  item?.bankStatementId,
                                  item?.transectionId || 0,
                                  getBankStatementData,
                                  values
                                );
                                setReconcileModal({
                                  isOpen: false,
                                });
                              } else {
                                setReconcileModal({
                                  ...reconcileModal,
                                  state: 0,
                                });
                              }
                            }
                          );
                        } else {
                          setReconcileModal({
                            ...reconcileModal,
                            state: 1,
                          });
                          checkTwoFactorApproval(
                            1,
                            selectedBusinessUnit?.value,
                            "Reconcile",
                            reconcileModal?.item?.bankStatementId,
                            `${reconcileModal?.item?.chequeNo} ( ${reconcileModal?.item?.journalCode} )`,
                            0,
                            profileData?.userId,
                            "",
                            1,
                            setIsLoading,
                            () => {
                              setReconcileModal({
                                ...reconcileModal,
                                otp: "",
                                isOtpGenerate: true,
                              });
                            }
                          );
                        }
                      }}
                      disabled={reconcileModal?.state === 1}
                    >
                      {reconcileModal?.state === 1
                        ? "Processing"
                        : reconcileModal?.isOtpGenerate
                        ? "Send"
                        : "Yes"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        setReconcileModal({
                          isOpen: false,
                        })
                      }
                      disabled={reconcileModal?.state === 1}
                    >
                      {reconcileModal?.isOtpGenerate ? "Cancel" : "No"}
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
      </Formik>
    </>
  );
};

export default TableRow;
