import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { shallowEqual, useSelector } from "react-redux";
import { getEmpDirectoryReport, getWorkplaceGroupDDL } from "../helper";
import Loading from "../../../../_helper/_loading";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { downloadFile } from "../../../../_helper/downloadFile";
import { toast } from "react-toastify";
import { getBuDDLForEmpDirectoryAndSalaryDetails } from "../../helper";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [workPlaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [reports, setReports] = useState([]);
  const [buDDL, setBuDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableSize, setTableSize] = useState("Small");

  useEffect(() => {
    getWorkplaceGroupDDL(profileData?.accountId, setWorkplaceGroupDDL);
    getBuDDLForEmpDirectoryAndSalaryDetails(
      profileData?.accountId,
      setBuDDL
    );
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
                <div className="col-lg-12">
                  <ISelect
                    options={[{ value: 0, label: "All" }, ...buDDL]}
                    label="Business Unit"
                    placeholder="Business Unit"
                    value={values?.bu}
                    isMulti={true}
                    onChange={(valueOption) => {
                      const isExistAll = valueOption?.filter(
                        (item) => item?.label === "All"
                      );
                      if (isExistAll?.length > 0) {
                        let filterArr = valueOption?.filter(
                          (item) => item?.label === "All"
                        );
                        setFieldValue("bu", filterArr);
                      } else {
                        setFieldValue("bu", valueOption);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={[{ value: 0, label: "All" }, ...workPlaceGroupDDL]}
                    label="Work Place Group"
                    placeholder="Work Place Group"
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                    }}
                  />
                </div>
                <div style={{ marginTop: "13px" }} className="col-lg-8">
                  <button
                    onClick={(e) =>
                      getEmpDirectoryReport(
                        values?.workplaceGroup?.value,
                        values?.bu,
                        setReports,
                        setLoading
                      )
                    }
                    disabled={!values?.bu || !values?.workplaceGroup}
                    type="button"
                    className="btn btn-primary mr-2"
                  >
                    View
                  </button>
                  {reports?.length > 0 && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          setTableSize(
                            tableSize === "Small" ? "Large" : "Small"
                          )
                        }
                      >
                        {tableSize === "Small" ? "Large" : "Small"} View
                      </button>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={(e) => {
                          if (!values?.bu || !values?.workplaceGroup)
                            return toast.warn("Please select all fields");
                          let str = "";
                          for (let i = 0; i < values?.bu?.length; i++) {
                            str = `${str}${str && ","}${values?.bu[i]?.value}`;
                          }
                          downloadFile(
                            `/hcm/HCMReport/GetEmployeeDirectory?BusinessUnitId=${str}&WorkPlaceGroupId=${
                              values?.workplaceGroup?.value
                            }&IsDownload=${true}`,
                            "Employee Directory",
                            "xlsx"
                          );
                        }}
                      >
                        Export Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Table */}

              {reports?.length > 0 && (
                <>
                  {/* <div className="my-1 d-flex justify-content-end">
                    
                  </div> */}
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
                            <th style={{ minWidth: "150px" }}>Designation</th>
                            <th style={{ minWidth: "150px" }}>Position</th>
                            <th style={{ minWidth: "150px" }}>
                              Position Group
                            </th>
                            <th style={{ minWidth: "150px" }}>
                            Section
                            </th>
                            <th style={{ minWidth: "90px" }}>
                              Employment Type
                            </th>
                            <th style={{ minWidth: "180px" }}>Unit</th>
                            <th style={{ minWidth: "180px" }}>
                              Workplace Group
                            </th>
                            <th style={{ minWidth: "140px" }}>Workplace</th>
                            <th style={{ minWidth: "80px" }}>DOJ</th>
                            <th style={{ minWidth: "80px" }}>
                              Confirmation Date
                            </th>
                            <th style={{ minWidth: "80px" }}>DOB</th>
                            <th style={{ minWidth: "140px" }}>Emp Email</th>
                            <th style={{ minWidth: "55px" }}>Religion</th>
                            <th style={{ minWidth: "55px" }}>Gender</th>

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
                              <td>{item?.strDesignationName}</td>
                              <td>{item?.strPositionName}</td>
                              <td>{item?.strPositionGroupName}</td>
                              <td>{item?.strSection}</td>
                              <td>{item?.strEmploymentType}</td>
                              <td>{item?.strBusinessUnitName}</td>
                              <td>{item?.strWorkplaceGroupName}</td>
                              <td>{item?.strJobStation}</td>
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
