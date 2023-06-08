import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import IConfirmModal from "../../../../_helper/_confirmModal";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import ICheckout from "../../../../_helper/_helperIcons/_checkout";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

import {
  getLoanData,
  getEmployeeDDL,
  loanApproveAction,
  loanRejectedAction,
} from "./helper";
import "./loanApprove.css";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  employee: "",
  approveLoanAmount: "",
  approveNumberOfinstallment: "",
  dteEffectiveDate: _todayDate(),
};

// Validation schema
const LoanApproveSchema = Yup.object().shape({
  approveLoanAmount: Yup.number()
    .min(1, "Minimum 0 range")
    .required("Approve Loan Amount is required"),
  approveNumberOfinstallment: Yup.number()
    .min(1, "Minimum 0 range")
    .required("Approve Installment Amount is required"),
  dteEffectiveDate: Yup.date().required("Effective Date required"),
});

const LoanApprovalGrid = () => {
  const history = useHistory();
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch Get getEmpDDLAction
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeDDL,
        setLoader
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const singleLoanApproveHandler = (
    index,
    partId,
    applicationId,
    loanTypeId,
    userId,
    loanAmount,
    numberOfinstallment,
    approveLoanAmount,
    approveNumberOfinstallment,
    effectiveDate,
    remarks
  ) => {
    if (index && profileData?.accountId && selectedBusinessUnit?.value) {
      const loanApproveObj = rowDto.filter((itm) => itm?.intLoanID === index);
      let confirmObject = {
        title: "Are you sure?",
        yesAlertFunc: async () => {
          if (loanApproveObj) {
            loanApproveAction(
              partId,
              applicationId,
              loanTypeId,
              userId,
              loanAmount,
              numberOfinstallment,
              approveLoanAmount,
              approveNumberOfinstallment,
              effectiveDate,
              remarks
            );
          }
        },
        noAlertFunc: () => {
          history.push("/personal/approval/commonapproval");
        },
      };
      IConfirmModal(confirmObject);
    } else {
      // setDisabled(false);
    }
  };

  const singleLoanRejectedHandler = (index) => {
    // setDisabled(true);
    if (index && profileData?.accountId && selectedBusinessUnit?.value) {
      const loanRejectedObj = rowDto.filter((itm) => itm?.intLoanID === index);
      let confirmObject = {
        title: "Are you sure?",
        yesAlertFunc: async () => {
          if (loanRejectedObj) {
            const modifyFilterRowDto = rowDto.filter(
              (itm) => itm?.intLoanID !== index
            );
            loanRejectedAction(index, modifyFilterRowDto, setRowDto);
          }
        },
        noAlertFunc: () => {
          history.push("/personal/approval/commonapproval");
        },
      };
      IConfirmModal(confirmObject);
    } else {
      console.log(" ");
      // setDisabled(false);
    }
  };

  return (
    <>
      {loader && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          approveLoanAmount: 0,
          approveNumberOfinstallment: 0,
        }}
        validationSchema={LoanApproveSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-2">
                        <NewSelect
                          name="employee"
                          options={employeeDDL || []}
                          value={values?.employee}
                          label="Employee"
                          onChange={(valueOption) => {
                            setFieldValue("employee", valueOption);

                            getLoanData(
                              valueOption?.value,
                              setRowDto,
                              setLoader
                            );
                          }}
                          placeholder="Employee"
                          isSearchable={true}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {/* <div className="col-lg-4 mt-4">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            getLoanData(
                              values?.employee?.value,
                              setRowDto,
                              setLoader
                            );
                          }}
                        >
                          View
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* Table Start */}
              {rowDto.length > 0 && (
                <div className="loan-scrollable-table">
                  <div className="scroll-table _table">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Employee Name</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Unit</th>
                          <th>Application Date</th>
                          <th>Loan Type</th>
                          <th>Loan Amount</th>
                          <th>Installment</th>
                          <th>Approve Loan Amount</th>
                          <th>Approve Number of Installment</th>
                          <th>Effective Date</th>
                          <th>Approve Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto.length >= 0 &&
                          rowDto.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {values?.employee?.label}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {values?.employee?.employeeInfoDesignation}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {values?.employee?.employeeInfoDepartment}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {values?.employee?.employeeBusinessUnit}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {_dateFormatter(data?.DateApplicationDate)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{data?.strLoanType}</div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {data?.intLoanAmount}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {data?.intInstallment}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {data?.approveLoanAmount}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="text-right pr-2">
                                    {data?.approveNumberOfinstallment}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {data?.dteEffectiveDate}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{data?.strApprove}</div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center align-items-center">
                                  {data?.strApprove === "Pending" ? (
                                    <>
                                      <button
                                        className="btn p-0 mt-2"
                                        style={{
                                          background: "tranparent!important",
                                          border: "none!important",
                                        }}
                                        type="button"
                                      >
                                        <span
                                          className="view mr-2"
                                          style={{
                                            cursor: "pointer",
                                            width: "30px!important",
                                          }}
                                        >
                                          <ICheckout
                                            checkout={() => {
                                              singleLoanApproveHandler(
                                                data?.intLoanID,
                                                1,
                                                data?.intLoanID,
                                                data?.intloantypeid,
                                                profileData?.userId,
                                                data?.intLoanAmount,
                                                data?.intInstallment,
                                                data?.approveLoanAmount,
                                                data?.approveNumberOfinstallment,
                                                _dateFormatter(
                                                  data?.dteEffectiveDate
                                                ),
                                                "Approved"
                                              );
                                              getLoanData(
                                                values?.employee?.value,
                                                setRowDto
                                              );
                                            }}
                                            id={data?.intLoanID}
                                            title="Approve"
                                          />
                                        </span>
                                      </button>
                                      <button
                                        className="btn p-0"
                                        style={{
                                          background: "tranparent!important",
                                          border: "none!important",
                                        }}
                                        type="button"
                                      >
                                        <span className="mt-2">
                                          <IDelete
                                            remover={() => {
                                              singleLoanRejectedHandler(
                                                data?.intLoanID
                                              );
                                            }}
                                            id={data?.applicationId}
                                            title="Rejected"
                                          />
                                        </span>
                                      </button>
                                    </>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default LoanApprovalGrid;
