import axios from "axios";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../_helper/_customCard";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import { getLoanData, getLoanDetails } from "./helper";
import LoanRescheduleReportViewModal from "./View/ViewModal";

const initData = {
  employee: "",
};

const LoanRescheduleReportLanding = () => {
  const [rowDto, setRowDto] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [loanDetails, setLoanDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [empInfo, getEmpInfo] = useAxiosGet("");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const printRef = useRef();

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Loan Schedule">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            approveLoanAmount: 0,
            approveNumberOfinstallment: 0,
          }}
          //   validationSchema={LoanApproveSchema}
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
                        <div className="col-lg-3">
                          <>
                            <label>Employee</label>
                            <SearchAsyncSelect
                              isSearchIcon={true}
                              selectedValue={values?.employee}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                                getEmpInfo(
                                  `/hcm/EmployeeBasicInformation/GetEmployeeBasicInfoById?EmployeeId=${valueOption?.value}`
                                );
                              }}
                              loadOptions={loadEmp}
                            />
                          </>
                        </div>
                        <div style={{ marginTop: "15px" }} className="col-lg-4">
                          <div className="d-flex">
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary"
                                disabled={!values?.employee}
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
                            </div>
                            <div className="ml-2">
                              <ReactToPrint
                                trigger={() => (
                                  <button
                                    type="button"
                                    className="btn btn-primary ml-3"
                                    disabled={!empInfo.length || !rowDto.length}
                                  >
                                    <i
                                      class="fa fa-print pointer"
                                      aria-hidden="true"
                                    ></i>
                                    Print
                                  </button>
                                )}
                                content={() => printRef.current}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  componentRef={printRef}
                  ref={printRef}
                  className="print-section"
                >
                  {empInfo.length > 0 && (
                    <div
                      style={{ maxWidth: "600px", margin: "0px auto" }}
                      className="global-form mb-3"
                    >
                      <div className="d-flex justify-content-between">
                        {/* 1st half */}
                        <div className="d-flex justify-content-between flex-column">
                          <div className="d-flex">
                            <div style={{ width: "76px" }}>
                              <b>Name : </b>
                            </div>
                            <div>{empInfo[0]?.employeeFullName}</div>
                          </div>

                          <div className="d-flex">
                            <div style={{ width: "76px" }}>
                              <b>Designation : </b>
                            </div>
                            <div>{empInfo[0]?.designationName}</div>
                          </div>

                          <div className="d-flex">
                            <div style={{ width: "76px" }}>
                              <b>Department : </b>
                            </div>
                            <div>{empInfo[0]?.departmentName}</div>
                          </div>
                        </div>

                        {/* 2nd half */}
                        <div className="d-flex justify-content-between flex-column">
                          <div className="d-flex">
                            <div style={{ width: "76px" }}>
                              <b>Unit : </b>
                            </div>
                            <div>{empInfo[0]?.businessUnitName}</div>
                          </div>

                          <div className="d-flex">
                            <div style={{ width: "76px" }}>
                              <b>Job Station : </b>
                            </div>
                            <div>{empInfo[0]?.workplaceName}</div>
                          </div>

                          <div className="d-flex">
                            <div style={{ width: "76px" }}>
                              <b>Job Status : </b>
                            </div>
                            <div>{empInfo[0]?.employmentTypeName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Table Start */}
                  {rowDto.length > 0 && (
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Application Date</th>
                          <th>Loan Type</th>
                          <th>Total Loan Amount</th>
                          <th>Remaining Loan Amount</th>
                          <th>Total Installment</th>
                          <th>Remaining Installment</th>
                          <th>Approve Status</th>
                          <th>Loan Installment Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto.length >= 0 &&
                          rowDto.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {_dateFormatter(data?.DateApplicationDate)}
                              </td>
                              <td>{data?.strLoanType}</td>
                              <td>{data?.intLoanAmount}</td>
                              <td>{data?.intRemainingLoan}</td>
                              <td>{data?.intInstallment}</td>
                              <td>{data?.intRemainingInstallment}</td>
                              <td>{data?.strApprove}</td>
                              <td>{data?.strInstallment}</td>
                              <td className="text-center">
                                <IView
                                  clickHandler={() => {
                                    setModalShow(true);
                                    getLoanDetails(
                                      data?.intLoanID,
                                      setLoanDetails
                                    );
                                  }}
                                  classes="text-primary"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
        <LoanRescheduleReportViewModal
          data={loanDetails}
          show={modalShow}
          onHide={() => setModalShow(false)}
          empInfo={empInfo}
        />
      </ICustomCard>
    </>
  );
};

export default LoanRescheduleReportLanding;
