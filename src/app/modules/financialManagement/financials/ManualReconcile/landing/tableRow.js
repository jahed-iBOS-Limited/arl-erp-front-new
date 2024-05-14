/* eslint-disable no-unused-vars */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody
} from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  checkTwoFactorApproval,
  getBankAccountNoDDL,
  getBankReconsileManualData,
  getBankStatementDataMatch,
  header,
  postForceReconsile
} from "../helpers";
import { Modal } from "react-bootstrap";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { downloadFile } from "../../../../_helper/downloadFile";
import { SetFinancialsManualReconcileAction } from "../../../../_helper/reduxForLocalStorage/Actions";

const TableRow = () => {
  const [isloading, setIsLoading] = useState(false);
  const [acDDL, setAcDDL] = useState([]);
  const [bankReconsileManualData, setBankReconsileManualData] = React.useState(
    []
  );
  const [bankStatementDataMatch, setBankStatementDataMatch] = React.useState(
    []
  );
  const [reconcileModal, setReconcileModal] = useState({
    isOpen: false,
    item: null,
  });

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getBankAccountNoDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setAcDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getItemCheckedTotal = (arr, key) => {
    return arr?.reduce((a, b) => a + Number(b?.checked ? b[key] : 0), 0);
  };

  const getBankStatementData = (values) => {
    getBankReconsileManualData(
      selectedBusinessUnit?.value,
      values?.acDDL?.value,
      values?.typeDDL?.value,
      values?.isManualReconsile,
      values?.transactionDate,
      values?.search,
      setBankReconsileManualData,
      setIsLoading,
      values?.fromDate
    );
    getBankStatementDataMatch(
      selectedBusinessUnit?.value,
      values?.acDDL?.value,
      values?.typeDDL?.value,
      values?.isManualReconsile,
      values?.transactionDate,
      values?.search,
      setBankStatementDataMatch,
      setIsLoading,
      values?.fromDate
    );
  };

  const { financialsManualReconcile } = useSelector(
    (state) => state?.localStorage
  );

  const initData = {
    backAccount: financialsManualReconcile?.bankAccount || "",
    sbu: financialsManualReconcile?.sbu || "",
    isManualReconsile: financialsManualReconcile?.isManualReconsile || false,
    transactionDate:
      financialsManualReconcile?.transactionDate || _dateFormatter(new Date()),
    fromDate: financialsManualReconcile?.fromDate || "",
    acDDL: financialsManualReconcile?.acDDL || "",
    typeDDL: financialsManualReconcile?.typeDDL || "",
    search: financialsManualReconcile?.search || "",
  };

  const dispatch = useDispatch();

  const forceReconcileSaved = (values) => {
    const data = bankReconsileManualData
      ?.filter((item) => item?.checked)
      ?.map((item) => {
        return {
          typeId: 1,
          transectionId: item?.intBankJournalId,
          unitId: selectedBusinessUnit?.value,
          dteDate: _dateFormatter(values?.transactionDate),
          isReconsile: values?.isManualReconsile,
          actionById: profileData?.userId,
          bankAccountId: values?.acDDL?.value,
        };
      });
    const data1 = bankStatementDataMatch
      ?.filter((item) => item?.checked)
      ?.map((item) => {
        return {
          typeId: 2,
          transectionId: item?.intBankStatementId,
          unitId: selectedBusinessUnit?.value,
          dteDate: _dateFormatter(values?.transactionDate),
          isReconsile: values?.isManualReconsile,
          actionById: profileData?.userId,
          bankAccountId: values?.acDDL?.value,
        };
      });
    postForceReconsile(data.concat(data1), () => {
      const filtered1 = bankReconsileManualData?.filter(
        (item) => item.checked === false
      );
      setBankReconsileManualData([...filtered1]);
      const filtered2 = bankStatementDataMatch?.filter(
        (item) => item.checked === false
      );
      // console.log(filtered2)
      setBankStatementDataMatch([...filtered2]);
    });
  };

  const forceReconcileManualData = (item, values) => {
    postForceReconsile(
      [
        {
          typeId: 1,
          transectionId: item?.intBankJournalId,
          unitId: selectedBusinessUnit?.value,
          dteDate: _dateFormatter(values?.transactionDate),
          isReconsile: values?.isManualReconsile,
          actionById: profileData?.userId,
          bankAccountId: values?.acDDL?.value,
        },
      ],
      () => {
        bankReconsileManualData.splice(reconcileModal?.index, 1);
        setBankReconsileManualData([...bankReconsileManualData]);
      }
    );
  };
  const forceReconcileBankStatement = (item, values) => {
    postForceReconsile(
      [
        {
          typeId: 2,
          transectionId: item?.intBankStatementId,
          unitId: selectedBusinessUnit?.value,
          dteDate: _dateFormatter(values?.transactionDate),
          isReconsile: values?.isManualReconsile,
          actionById: profileData?.userId,
          bankAccountId: values?.acDDL?.value,
        },
      ],
      () => {
        bankStatementDataMatch.splice(reconcileModal?.index, 1);
        setBankStatementDataMatch([...bankStatementDataMatch]);
      }
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <div
                className="global-form"
                style={header}
              >
                <h4>Reconcile</h4>
                <div style={{width: "80%"}} className="row">
                  <div className="col-md-4">
                    <NewSelect
                      name="acDDL"
                      placeholder="Select A/C No"
                      value={values?.acDDL}
                      onChange={(valueOption) => {
                        setFieldValue("acDDL", valueOption);
                        setBankReconsileManualData([]);
                        setBankStatementDataMatch([]);
                        dispatch(
                          SetFinancialsManualReconcileAction({
                            ...values,
                            acDDL: valueOption,
                          })
                        );
                      }}
                      options={acDDL}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        console.log("e", e.target.value)
                        setBankReconsileManualData([]);
                        setBankStatementDataMatch([]);
                        dispatch(
                          SetFinancialsManualReconcileAction({
                            ...values,
                            fromDate: e?.target?.value,
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="col-md">
                    <label>To Date</label>
                    <InputField
                      value={values?.transactionDate}
                      name="transactionDate"
                      placeholder="Transaction Date"
                      type="date"
                      onChange={(e) => {
                        setBankReconsileManualData([]);
                        setBankStatementDataMatch([]);
                        dispatch(
                          SetFinancialsManualReconcileAction({
                            ...values,
                            transactionDate: e?.target?.value,
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="col-md-2">
                    <NewSelect
                      name="typeDDL"
                      placeholder="Select Type "
                      value={values?.typeDDL}
                      onChange={(valueOption) => {
                        setFieldValue("typeDDL", valueOption);
                        setBankReconsileManualData([]);
                        setBankStatementDataMatch([]);
                        dispatch(
                          SetFinancialsManualReconcileAction({
                            ...values,
                            typeDDL: valueOption,
                          })
                        );
                      }}
                      options={[
                        {
                          label: "Cheque issued but not presented in bank",
                          value: 1,
                        },
                        {
                          label:
                            "Amount debited in bank book but not credited in bank statement",
                          value: 2,
                        },
                      ]}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md">
                    <label style={{ display: "inherit" }}>
                      <input
                        type="radio"
                        name="isManualReconsile"
                        checked={values.isManualReconsile === false}
                        className="mr-1 pointer"
                        onChange={(e) => {
                          setFieldValue("isManualReconsile", false);
                          setBankReconsileManualData([]);
                          setBankStatementDataMatch([]);
                          dispatch(
                            SetFinancialsManualReconcileAction({
                              ...values,
                              isManualReconsile: false,
                            })
                          );
                        }}
                      />
                      Not Completed
                    </label>
                    <label style={{ display: "inherit" }}>
                      <input
                        type="radio"
                        name="isManualReconsile"
                        checked={values.isManualReconsile === true}
                        className="mr-1 pointer"
                        onChange={(e) => {
                          setFieldValue("isManualReconsile", true);
                          setBankReconsileManualData([]);
                          setBankStatementDataMatch([]);
                          dispatch(
                            SetFinancialsManualReconcileAction({
                              ...values,
                              isManualReconsile: true,
                            })
                          );
                        }}
                      />
                      Completed
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={!(values?.acDDL?.value && values?.typeDDL)}
                    type="button"
                    onClick={() => {
                      getBankStatementData(values);
                    }}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-sm btn-primary ml-3"
                    disabled={
                      bankReconsileManualData.every((item) => !item.checked) &&
                      bankStatementDataMatch.every((item) => !item.checked)
                    }
                    type="button"
                    onClick={() => {
                      if (values.isManualReconsile === false) {
                        return forceReconcileSaved(values);
                      }
                      setReconcileModal({
                        isOpen: true,
                        type: 0,
                        values,
                      });
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>

              <CardBody className="d-flex flex-column">
                {isloading && <Loading />}

                <div
                  className="row global-form mb-0"
                  style={{ padding: "0", margin: "0" }}
                >
                  <div className="col-12">
                    <div className="row d-flex align-items-center p-1">
                      {/* <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL || []}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                          }}
                          placeholder="SBU"
                          errors={errors}
                          touched={touched}
                        />
                      </div> */}
                      {/* <div className="col-lg-3">
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
                          }}
                          // isSearchable={true}
                          options={backAccountDDL}
                          errors={errors}
                          touched={touched}
                        />
                      </div> */}

                      {values.isManualReconsile && (
                        <div style={{display : "flex"}} className="col-lg-3">
                          <label style={{width: "100px"}} className="mr-1">Reconcile Type</label>
                          <NewSelect
                            name="reconcileType"
                            placeholder="Select Reconcile Type"
                            isHiddenLabel
                            value={values?.reconcileType}
                            onChange={(valueOption) => {
                              setFieldValue("reconcileType", valueOption);
                            }}
                            options={[
                              {
                                label: "Auto",
                                value: 2,
                              },
                              {
                                label: "Manual",
                                value: 3,
                              },
                              {
                                label: "Force",
                                value: 4,
                              },
                            ]}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      <div style={{ width: "200px", display: "flex" }}>
                        <label className="mr-1">Search</label>
                        <InputField
                          value={values?.search}
                          name="search"
                          placeholder="Search"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("search", e?.target?.value);
                            dispatch(
                              SetFinancialsManualReconcileAction({
                                ...values,
                                search: e?.target?.value,
                              })
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row flex-fill">
                  <div className="col-6">
                    <div className="d-flex justify-content-center">
                      <p
                        className="text-center text-danger mb-0"
                        style={{ fontSize: "10px" }}
                      >
                        {values?.typeDDL?.value === 1
                          ? "Check Issued but not present in Bank"
                          : "Amount debited in bank book but not credited in bank statement"}
                      </p>

                      <p
                        className="text-center mb-0"
                        style={
                          Math.abs(
                            getItemCheckedTotal(
                              bankReconsileManualData,
                              "numAmount"
                            ) !==
                              Math.abs(
                                getItemCheckedTotal(
                                  bankStatementDataMatch,
                                  "monAmount"
                                )
                              ) ||
                              getItemCheckedTotal(
                                bankReconsileManualData,
                                "numAmount"
                              ) === 0 ||
                              getItemCheckedTotal(
                                bankStatementDataMatch,
                                "monAmount"
                              ) === 0
                          )
                            ? {
                                color: "red",
                                fontSize: "10px",
                                position: "absolute",
                                right: "10px",
                                fontWeight: "bold",
                              }
                            : {
                                color: "green",
                                fontSize: "10px",
                                position: "absolute",
                                right: "10px",
                                fontWeight: "bold",
                              }
                        }
                      >
                        Total:{" "}
                        <span>
                          {numberWithCommas(
                            Math.abs(
                              getItemCheckedTotal(
                                bankReconsileManualData,
                                "numAmount"
                              )
                            )
                          )}
                        </span>{" "}
                      </p>
                    </div>
                    <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table mt-0 forceReconcileTable">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "30px" }}>Sl </th>
                          <th style={{ minWidth: "70px" }}>Voucher</th>
                          <th style={{ minWidth: "50px" }}>Issue Date</th>
                          <th style={{ minWidth: "50px" }}>Cheque</th>
                          <th style={{ minWidth: "70px" }}>Party</th>
                          <th style={{ minWidth: "70px" }}>Amount</th>
                          <th style={{ minWidth: "30px", maxWidth: "30px" }}>
                            <input
                              type="checkbox"
                              checked={
                                bankReconsileManualData?.length > 0
                                  ? bankReconsileManualData?.every(
                                      (item) => item?.checked
                                    )
                                  : false
                              }
                              onChange={(e) => {
                                setBankReconsileManualData(
                                  bankReconsileManualData?.map((item) => {
                                    return {
                                      ...item,
                                      checked: e?.target?.checked,
                                    };
                                  })
                                );
                              }}
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankReconsileManualData?.length > 0 &&
                          bankReconsileManualData?.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                style={
                                  item?.checked
                                    ? { background: "#ccccff" }
                                    : null
                                }
                                onClick={(e) => {
                                  item["checked"] = !item["checked"];
                                  setBankReconsileManualData([
                                    ...bankReconsileManualData,
                                  ]);
                                }}
                              >
                                <td>{index + 1}</td>
                                <td> {item?.strBankJournalCode}</td>
                                <td>
                                  {" "}
                                  {_dateFormatter(item?.dteInstrumentDate)}{" "}
                                </td>
                                <td>{item?.strInstrumentNo}</td>
                                <td>{item?.strNarration}</td>
                                <td className="text-right">
                                  {item?.numAmount}
                                </td>
                                <td className="text-center">
                                  <button
                                    className="btn p-0"
                                    onClick={(e) => {
                                      if (values.isManualReconsile === false) {
                                        forceReconcileManualData(item, values);
                                        return;
                                      }
                                      setReconcileModal({
                                        isOpen: true,
                                        type: 1,
                                        item,
                                        index,
                                        values,
                                      });
                                    }}
                                  >
                                    {item?.isReconcile ? (
                                      <i className="fa fa-check-circle text-danger"></i>
                                    ) : (
                                      <i className="fa fa-check-circle text-success"></i>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        <tr>
                          <th
                            style={{
                              height: "25px",
                              position: "sticky",
                              bottom: "0",
                              padding: "2px",
                            }}
                            colSpan="5"
                          >
                            Total{" "}
                          </th>
                          <th
                            style={{
                              height: "25px",
                              position: "sticky",
                              bottom: "0",
                              padding: "2px",
                            }}
                          >
                            {numberWithCommas(
                              bankReconsileManualData
                                ?.reduce((a, b) => a + Number(b.numAmount), 0)
                                .toFixed(2)
                            )}
                          </th>
                          <th
                            style={{
                              height: "25px",
                              position: "sticky",
                              bottom: "0",
                              padding: "2px",
                            }}
                          ></th>
                        </tr>
                      </tbody>
                    </table>
     </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex justify-content-between">
                      <p
                        className="mb-0"
                        style={{
                          fontSize: "10px",
                          color: "blue",
                          cursor: "pointer",
                          textDecoration: "underLine",
                        }}
                        onClick={(e) =>
                          // values?.acDDL?.value,
                          // values?.typeDDL?.value,
                          // values?.isManualReconsile,
                          // values?.transactionDate,
                          {

                          
                          let api = `/fino/BankBranch/GetBankStatementDataDownload?intUnitId=${
                            selectedBusinessUnit?.value
                          }&intBankAccId=${values?.acDDL?.value}&intType=${
                            values?.typeDDL?.value
                          }&isManualReconsile=${
                            values?.isManualReconsile
                          }&dteDate=${_dateFormatter(
                            values?.transactionDate
                          )}`
                          if (values?.fromDate) {
                            api += `&dteFromDate=${values?.fromDate}`
                          }
                          downloadFile(
                            api,
                            "Force Reconcile",
                            "xlsx"
                          )
                        }
                        }
                      >
                        Download
                      </p>
                      <p
                        className="text-danger mb-0"
                        style={{ fontSize: "10px" }}
                      >
                        {values?.typeDDL?.value === 1
                          ? "Amount debited in bank book but not credited in bank statement"
                          : "Amount credited in bank book but not yet debited in bank book"}
                      </p>
                      <p
                        className="mb-0"
                        style={
                          Math.abs(
                            getItemCheckedTotal(
                              bankReconsileManualData,
                              "numAmount"
                            ) !==
                              Math.abs(
                                getItemCheckedTotal(
                                  bankStatementDataMatch,
                                  "monAmount"
                                )
                              ) ||
                              getItemCheckedTotal(
                                bankReconsileManualData,
                                "numAmount"
                              ) === 0 ||
                              getItemCheckedTotal(
                                bankStatementDataMatch,
                                "monAmount"
                              ) === 0
                          )
                            ? {
                                color: "red",
                                fontSize: "10px",
                                fontWeight: "bold",
                              }
                            : {
                                color: "green",
                                fontSize: "10px",
                                fontWeight: "bold",
                              }
                        }
                      >
                        Total:{" "}
                        <span>
                          {numberWithCommas(
                            Math.abs(
                              getItemCheckedTotal(
                                bankStatementDataMatch,
                                "monAmount"
                              )
                            )
                          )}
                        </span>{" "}
                      </p>
                    </div>
                    <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table mt-0 forceReconcileTable">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "30px" }}>Sl </th>
                          <th style={{ minWidth: "50px" }}>Issue Date</th>
                          <th style={{ minWidth: "50px" }}>Cheque</th>
                          <th style={{ minWidth: "70px" }}>Party</th>
                          <th style={{ minWidth: "70px" }}>Amount</th>
                          <th style={{ minWidth: "30px", maxWidth: "30px" }}>
                            <input
                              type="checkbox"
                              checked={
                                bankStatementDataMatch?.length > 0
                                  ? bankStatementDataMatch?.every(
                                      (item) => item?.checked
                                    )
                                  : false
                              }
                              onChange={(e) => {
                                setBankStatementDataMatch(
                                  bankStatementDataMatch?.map((item) => {
                                    return {
                                      ...item,
                                      checked: e?.target?.checked,
                                    };
                                  })
                                );
                              }}
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bankStatementDataMatch?.length > 0 &&
                          bankStatementDataMatch?.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                style={
                                  item?.checked
                                    ? { background: "#ccccff" }
                                    : null
                                }
                                onClick={(e) => {
                                  item["checked"] = !item["checked"];
                                  setBankStatementDataMatch([
                                    ...bankStatementDataMatch,
                                  ]);
                                }}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  {" "}
                                  {_dateFormatter(item?.dteBankTransectionDate)}
                                </td>
                                <td> {item?.strChequeNo} </td>
                                <td>{item?.strParticulars}</td>
                                <td className="text-right">
                                  {item?.monAmount}
                                </td>
                                <td className="text-center">
                                  <button
                                    className="btn p-0"
                                    onClick={(e) => {
                                      if (values.isManualReconsile === false) {
                                        forceReconcileBankStatement(
                                          item,
                                          values
                                        );
                                        return;
                                      }
                                      setReconcileModal({
                                        isOpen: true,
                                        type: 2,
                                        item,
                                        index,
                                        values,
                                      });
                                    }}
                                  >
                                    {item?.isReconcile ? (
                                      <i className="fa fa-check-circle text-danger"></i>
                                    ) : (
                                      <i className="fa fa-check-circle text-success"></i>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        <tr>
                          <th
                            style={{
                              height: "25px",
                              position: "sticky",
                              bottom: "0",
                              padding: "2px",
                            }}
                            colSpan="4"
                          >
                            Total{" "}
                          </th>
                          <th
                            style={{
                              height: "25px",
                              position: "sticky",
                              bottom: "0",
                              padding: "2px",
                            }}
                          >
                            {numberWithCommas(
                              bankStatementDataMatch
                                ?.reduce((a, b) => a + Number(b.monAmount), 0)
                                .toFixed(2)
                            )}
                          </th>
                          <th
                            style={{
                              height: "25px",
                              position: "sticky",
                              bottom: "0",
                              padding: "2px",
                            }}
                          ></th>
                        </tr>
                      </tbody>
                    </table>
     </div>
                  </div>
                </div>

                {/* Pagination Code
                {gridData?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )} */}

                {/* {gridData?.data?.length > 0 && (
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
                )} */}
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
                <Modal.Title>Do you want the Reconcilation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {console.log(reconcileModal?.item)}
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

                  {!reconcileModal?.isOtpGenerate &&
                    reconcileModal?.type !== 0 && (
                      <>
                        <div className="d-flex justify-content-center my-5">
                          <p className="mr-5">
                            <span className="font-weight-bold">Amount :</span>
                            {reconcileModal?.item?.numAmount ||
                              reconcileModal?.item?.monAmount}
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
                            reconcileModal?.type === 0
                              ? 0
                              : reconcileModal?.type === 1
                              ? reconcileModal?.item?.intBankJournalId
                              : reconcileModal?.item?.intBankStatementId,
                            reconcileModal?.type === 0
                              ? 0
                              : reconcileModal?.type === 1
                              ? `${reconcileModal?.item?.strChequeNo} ( ${reconcileModal?.item?.strBankJournalCode} )`
                              : `${reconcileModal?.item?.strChequeNo}`,
                            0,
                            profileData?.userId,
                            reconcileModal?.otp,
                            1,
                            setIsLoading,
                            (status) => {
                              if (status === 1) {
                                const item = { ...reconcileModal?.item };
                                if (reconcileModal?.type === 1) {
                                  forceReconcileManualData(
                                    reconcileModal?.item,
                                    reconcileModal?.values
                                  );
                                } else if (reconcileModal?.type === 2) {
                                  forceReconcileBankStatement(
                                    reconcileModal?.item,
                                    reconcileModal?.values
                                  );
                                } else {
                                  forceReconcileSaved(reconcileModal?.values);
                                }
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
                            reconcileModal?.type === 0
                              ? 0
                              : reconcileModal?.type === 1
                              ? reconcileModal?.item?.intBankJournalId
                              : reconcileModal?.item?.intBankStatementId,
                            reconcileModal?.type === 0
                              ? 0
                              : reconcileModal?.type === 1
                              ? `${reconcileModal?.item?.strChequeNo} ( ${reconcileModal?.item?.strBankJournalCode} )`
                              : `${reconcileModal?.item?.strChequeNo}`,
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
