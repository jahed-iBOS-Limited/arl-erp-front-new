import React, { useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { SalaryGenarateLandingAction } from "./helper";
// import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import "./leaveMovementHistory.css";
import Loading from "../../../_helper/_loading";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  // businessUnit: "",
};

const RemunerationGenerateReport = () => {
  // const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);

  // const profileData = useSelector((state) => {
  //   return state.authData.profileData;
  // }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // useEffect(() => {
  //   if (selectedBusinessUnit?.value && profileData?.accountId) {
  //     getBusinessUnitDDL(setBusinessUnitDDL, profileData?.accountId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedBusinessUnit, profileData]);

  const saveHandler = () => {};

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Salary Generate">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={saveHandler} className="btn btn-primary mt-2">
            Generate
          </button>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
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
                        {/* <div className="col-lg-2">
                          <NewSelect
                            name="businessUnit"
                            options={businessUnitDDL || []}
                            value={values?.businessUnit}
                            label="Business Unit"
                            onChange={(valueOption) => {
                              setFieldValue("businessUnit", valueOption);
                            }}
                            placeholder="Select Business Unit"
                            isSearchable={true}
                            errors={errors}
                            touched={touched}
                          />
                        </div> */}
                        <div className="col-lg-2">
                          <div>From Date</div>
                          <input
                            className="trans-date cj-landing-date"
                            value={values?.fromDate}
                            name="fromDate"
                            onChange={(e) => {
                              setFieldValue("fromDate", e.target.value);
                            }}
                            type="date"
                          />
                        </div>
                        <div className="col-lg-2">
                          <div>To Date</div>
                          <input
                            className="trans-date cj-landing-date"
                            value={values?.toDate}
                            name="toDate"
                            onChange={(e) => {
                              setFieldValue("toDate", e.target.value);
                            }}
                            type="date"
                          />
                        </div>

                        <div className="col-lg-2 mt-4">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              SalaryGenarateLandingAction(
                                selectedBusinessUnit?.value,
                                values?.fromDate,
                                values?.toDate,
                                setRowDto,
                                setLoader
                              );
                            }}
                            disabled={!values?.fromDate || !values?.toDate}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Start */}
                {/* {rowDto.length > 0 && ( */}
                <div className="loan-scrollable-table">
                  <div className="scroll-table _table">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "30px" }}>SL</th>
                          <th style={{ minWidth: "30px" }}>Employee Id</th>
                          <th style={{ minWidth: "40px" }}>ERP Emp. Id</th>
                          <th>Employee Code</th>
                          <th>Employee Name</th>
                          <th>Position/Rank</th>
                          <th>Total Working Days</th>
                          <th>New Salary</th>
                          <th>Total Payable</th>
                          <th className="th-number">Present</th>
                          <th className="th-number">Leave</th>
                          <th className="th-number">Late</th>
                          <th className="th-number">Off</th>
                          <th className="th-number">Holiday</th>
                          <th className="th-number">LWP</th>
                          <th>Total Benefit</th>
                          <th>Total Deduction</th>
                          <th>Net Payable Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto.length >= 0 &&
                          rowDto.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data?.employeeName}</td>
                              <td> {data?.employeeId} </td>
                              <td>
                                <div className="text-left pl-2">
                                  {data?.empCode || "Emp Code"}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {data?.employeeCode || "Emp Name"}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {data?.employeeName || "Position"}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {data?.designationName ||
                                    "Total working Days"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.totalDays || "New Salary"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.workingDays || "New Salary"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.present || "Total Payable"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.late || "Present"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.movement || "Leave"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.leave || "Late"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.absent0 || "Off"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.offDay || "Holiday"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.offDay || "LWP"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.offDay || "Total Benefit"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.offDay || "Total Deduction"}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {data?.offDay || "Net Payable Amount"}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* )} */}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default RemunerationGenerateReport;
