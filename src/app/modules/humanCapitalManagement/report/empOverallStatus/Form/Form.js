import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { IInput } from "../../../../_helper/_input";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { shallowEqual, useSelector } from "react-redux";
import { getEmpOverallStatusReport, getWorkplaceGroupDDL } from "../helper";
import Loading from "../../../../_helper/_loading";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { downloadFile } from "../../../../_helper/downloadFile";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [workPlaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableSize, setTableSize] = useState("Small");

  useEffect(() => {
    getWorkplaceGroupDDL(profileData?.accountId, setWorkplaceGroupDDL);
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            <Form className="form form-label-right">
              {console.log("values", values)}
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <IInput
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    options={workPlaceGroupDDL}
                    label="Work Place Group"
                    placeholder="Work Place Group"
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                    }}
                  />
                </div>
                <div style={{ marginTop: "17px" }} className="col-lg-5">
                  <button
                    onClick={(e) =>
                      getEmpOverallStatusReport(
                        values?.date,
                        values?.workplaceGroup?.value,
                        selectedBusinessUnit?.value,
                        setReports,
                        setLoading
                      )
                    }
                    disabled={!values?.date || !values?.workplaceGroup}
                    type="button"
                    className="btn btn-primary mr-2"
                  >
                    View
                  </button>
                  {reports?.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        setTableSize(tableSize === "Small" ? "Large" : "Small")
                      }
                    >
                      {tableSize === "Small" ? "Large" : "Small"} View
                    </button>
                  )}
                </div>
              </div>

              {/* Table */}

              {reports?.length > 0 && (
                <>
                  <div className="my-1 d-flex justify-content-end">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) =>
                        downloadFile(
                          `/hcm/HCMReport/GetEmployeeOverallStatusDownload?ReportDate=${values?.date}&BusinessUnitId=${selectedBusinessUnit?.value}&WorkPlaceGroupId=${values?.workplaceGroup?.value}`,
                          "Employee Overall Status",
                          "xlsx"
                        )
                      }
                    >
                      Export Excel
                    </button>
                  </div>
                  <div className="loan-scrollable-table employee-overall-status">
                    <div
                      style={
                        tableSize === "Small"
                          ? { maxHeight: "400px" }
                          : { maxHeight: "500px" }
                      }
                      className="scroll-table _table"
                    >
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ minWidth: "70px" }}>Employee Id</th>
                            {/* <th style={{ minWidth: "70px" }}>ERP Emp. Id</th> */}
                            <th style={{ minWidth: "100px" }}>Emp Code</th>
                            <th>Name</th>
                            <th style={{ minWidth: "130px" }}>Department</th>
                            <th style={{ minWidth: "130px" }}>Section</th>
                            <th style={{ minWidth: "150px" }}>Designation</th>
                            <th style={{ minWidth: "90px" }}>Job Type</th>
                            <th style={{ minWidth: "80px" }}>DOJ</th>
                            <th style={{ minWidth: "80px" }}>
                              Confirmation Date
                            </th>
                            <th style={{ minWidth: "80px" }}>DOB</th>
                            <th style={{ minWidth: "140px" }}>Emp Email</th>
                            <th style={{ minWidth: "55px" }}>Religion</th>
                            <th style={{ minWidth: "55px" }}>Gender</th>
                            <th style={{ minWidth: "140px" }}>Job Station</th>
                            <th style={{ minWidth: "120px" }}>Area</th>
                            <th style={{ minWidth: "100px" }}>Point Type</th>
                            <th style={{ minWidth: "180px" }}>Unit</th>
                            <th style={{ minWidth: "90px" }}>Personal No</th>
                            <th style={{ minWidth: "90px" }}>Office Contact</th>
                            <th style={{ minWidth: "90px" }}>Tin No</th>
                            <th style={{ minWidth: "250px" }}>
                              Permanent Address
                            </th>
                            <th style={{ minWidth: "50px" }}>Blood Group</th>
                            <th style={{ minWidth: "70px" }}>Offday</th>
                            <th style={{ minWidth: "70px" }}>
                              Supervisor Enroll
                            </th>
                            <th>Supervisor Name</th>
                            <th style={{ minWidth: "60px" }}>Gross</th>
                            <th style={{ minWidth: "60px" }}>Basics</th>
                            <th style={{ minWidth: "25px" }}>WD</th>
                            <th style={{ minWidth: "50px" }}>Present</th>
                            <th style={{ minWidth: "45px" }}>Absent</th>
                            <th style={{ minWidth: "35px" }}>CL Leave</th>
                            <th style={{ minWidth: "50px" }}>Medical Leave</th>
                            <th style={{ minWidth: "35px" }}>EL Leave</th>
                            <th style={{ minWidth: "30px" }}>LWP</th>
                            <th style={{ minWidth: "50px" }}>Movement</th>
                            <th style={{ minWidth: "45px" }}>Holiday</th>
                            <th style={{ minWidth: "30px" }}>Day Off</th>
                            <th style={{ minWidth: "30px" }}>Late day</th>
                            <th style={{ minWidth: "30px" }}>Not found</th>
                            <th style={{ minWidth: "30px" }}>EWD</th>
                            <th style={{ minWidth: "140px" }}>Bank</th>
                            <th style={{ minWidth: "120px" }}>Branch</th>
                            <th style={{ minWidth: "100px" }}>Account No</th>
                            <th style={{ minWidth: "75px" }}>Routing</th>
                            <th style={{ minWidth: "140px" }}>GL Code</th>
                            <th style={{ minWidth: "50px" }}>Tax Amount</th>
                            <th style={{ minWidth: "65px" }}>
                              Mobile Allowance
                            </th>
                            <th style={{ minWidth: "80px" }}>
                              Special Salary Allowance
                            </th>
                            <th style={{ minWidth: "60px" }}>
                              Driver Allowance
                            </th>
                            <th style={{ minWidth: "75px" }}>
                              Accomodation Charges
                            </th>
                            <th style={{ minWidth: "75px" }}>Salary Hold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.intEmployeeId}</td>
                              {/* <td className="text-center">
                                {item?.intERPEmployeeId}
                              </td> */}
                              <td className="text-center">
                                <span>{item?.strEmployeeCode}</span>
                              </td>
                              <td>{item?.strEmployeeFullName}</td>
                              <td>{item?.strDepartmentName}</td>
                              <td>{item?.strSection}</td>
                              <td>{item?.strDesignationName}</td>
                              <td>{item?.strEmploymentType}</td>
                              <td className="text-center">
                                {_dateFormatterTwo(item?.dteJoiningDate)}
                              </td>
                              <td className="text-center">
                                {_dateFormatterTwo(item?.dteConfirmationDate)}
                              </td>
                              <td className="text-center">
                                {_dateFormatterTwo(item?.dteDateOfBirth)}
                              </td>
                              <td>{item?.strEmail}</td>
                              <td>{item?.strReligion}</td>
                              <td>{item?.strGender}</td>
                              <td>{item?.strJobStation}</td>
                              <td>{item?.strArea}</td>
                              <td>{item?.strPointType}</td>
                              <td>{item?.strBusinessUnitName}</td>
                              <td className="text-center">
                                {item?.strPersonalContact}
                              </td>
                              <td className="text-center">
                                {item?.strOfficialContact}
                              </td>
                              <td className="text-center">
                                {item?.strEmployeeTINNo}
                              </td>
                              <td>{item?.strPermanentAddress}</td>
                              <td>{item?.strBloodGroupName}</td>
                              <td>{item?.strOffdayName}</td>
                              <td className="text-center">
                                {item?.intSupervisorId}
                              </td>
                              <td>{item?.strSupervisorName}</td>
                              <td className="text-right">
                                {_formatMoney(item?.numGrossSalary, 0)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numBasicSalary, 0)}
                              </td>
                              <td className="text-center">{item?.intWD}</td>
                              <td className="text-center">
                                {item?.intPresent}
                              </td>
                              <td className="text-center">{item?.intAbsent}</td>
                              <td className="text-center">
                                {item?.intCLLeave}
                              </td>
                              <td className="text-center">
                                {item?.intMedicalLeave}
                              </td>
                              <td className="text-center">
                                {item?.intELLeave}
                              </td>
                              <td className="text-center">{item?.intLWP}</td>
                              <td className="text-center">
                                {item?.intMovement}
                              </td>
                              <td className="text-center">
                                {item?.intHoliday}
                              </td>
                              <td className="text-center">{item?.intDayOff}</td>
                              <td className="text-center">
                                {item?.intLateday}
                              </td>
                              <td className="text-center">
                                {item?.intNotFound}
                              </td>
                              <td className="text-center">{item?.intEWD}</td>
                              <td>{item?.strBank}</td>
                              <td>{item?.strBranch}</td>
                              <td className="text-center">
                                {item?.strAccountNo}
                              </td>
                              <td className="text-center">
                                {item?.strRouting}
                              </td>
                              <td className="text-center">{item?.strGLCode}</td>
                              <td className="text-right">
                                {_formatMoney(item?.numTaxAmount, 0)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numMobileAllowance, 0)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  item?.numSpecialSalaryAllowance,
                                  0
                                )}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numDriverAllowance, 0)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numAccomodationCharges, 0)}
                              </td>
                              <td>
                                <span
                                  className={
                                    item?.strSalaryHold === "Hold" &&
                                    "text-danger"
                                  }
                                >
                                  {item?.strSalaryHold}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
