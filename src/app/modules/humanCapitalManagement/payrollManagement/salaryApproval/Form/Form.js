import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getPositionGroupDDL, getSalaryTopSheetReport } from "../helper";
import Loading from "../../../../_helper/_loading";
import { monthDDL } from "../utils";
import { YearDDL } from "../../../../_helper/_yearDDL";
import { setSalaryTopSheetDetailsDataAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { downloadFile } from "../../../../_helper/downloadFile";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import ITooltip from "../../../../_helper/_tooltip";
import ReactToPrint from "react-to-print";
import { getWorkplaceGroupDDL } from "../../../report/empOverallStatus/helper";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [workPlaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [reports, setReports] = useState([]);
  const [positionGroupDDL, setPositionGroupDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableSize, setTableSize] = useState("Small");
  const [allSelect, setAllSelect] = useState(false);

  const yearList = YearDDL();

  useEffect(() => {
    if (!allSelect) {
      const newReports = reports?.map((item) => {
        return {
          ...item,
          isSelect: false,
        };
      });
      setReports(newReports);
    } else {
      const newReports = reports?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setReports(newReports);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelect]);

  const singleCheckBoxHandler = (value, index) => {
    let newReports = [...reports];
    newReports[index].isSelect = value;
    setReports(newReports);
  };

  useEffect(() => {
    getWorkplaceGroupDDL(profileData?.accountId, setWorkplaceGroupDDL);
    getPositionGroupDDL(profileData?.accountId, setPositionGroupDDL);
  }, [profileData]);

  const dispatch = useDispatch();

  const openNewWindowForDetails = (reportType, item, values) => {
    // report Type = 1 means sub details
    // report Type = 2 means general
    // report Type = 3 means wages
    dispatch(
      setSalaryTopSheetDetailsDataAction({
        reportType: reportType,
        buId: item?.intUnitID,
        workPlaceGroupId: item?.intWorkplaceGroupId,
        positionGrpId: values?.positionGroup?.value,
        monthId: values?.month?.value,
        yearId: values?.year?.value,
      })
    );
    window.open(
      "/human-capital-management/payrollmanagement/salaryapproval/details",
      "_blank"
    );
  };

  const printRef = useRef();

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
              {loading && <Loading />}
              <div className="row global-form">
                <div className="col-lg-5">
                  <label className="mr-3">
                    <span style={{ position: "relative", top: "3px" }}>
                      <Field
                        onChange={(e) => {
                          setFieldValue("status", e.target.value);
                          // getLanding(e.target.value);
                        }}
                        type="radio"
                        name="status"
                        value="0"
                      />
                    </span>
                    <span className="ml-2">Pending</span>
                  </label>
                  <label className="mr-3">
                    <span style={{ position: "relative", top: "3px" }}>
                      <Field
                        onChange={(e) => {
                          setFieldValue("status", e.target.value);
                          // getLanding(e.target.value);
                        }}
                        type="radio"
                        name="status"
                        value="1"
                      />
                    </span>
                    <span className="ml-2">Approved</span>
                  </label>
                  <label>
                    <span style={{ position: "relative", top: "3px" }}>
                      <Field
                        onChange={(e) => {
                          setFieldValue("status", e.target.value);
                          // getLanding(e.target.value);
                        }}
                        type="radio"
                        name="status"
                        value="2"
                      />
                    </span>
                    <span className="ml-2">Rejected</span>
                  </label>
                </div>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <ISelect
                    options={monthDDL}
                    label="Month"
                    placeholder="Month"
                    value={values?.month}
                    onChange={(valueOption) => {
                      setFieldValue("month", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={yearList}
                    label="Year"
                    placeholder="Year"
                    value={values?.year}
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
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
                <div className="col-lg-3">
                  <ISelect
                    options={positionGroupDDL}
                    label="Position Group"
                    placeholder="Position Group"
                    value={values?.positionGroup}
                    onChange={(valueOption) => {
                      setFieldValue("positionGroup", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-2" style={{ marginTop: "14px" }}>
                  <button
                    onClick={(e) =>
                      getSalaryTopSheetReport(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.workplaceGroup?.value,
                        values?.positionGroup?.value,
                        values?.month?.value,
                        values?.year?.value,
                        setLoading,
                        setReports
                      )
                    }
                    disabled={
                      !values?.month ||
                      !values?.workplaceGroup ||
                      !values?.positionGroup ||
                      !values?.year
                    }
                    type="button"
                    className="btn btn-primary mr-2"
                  >
                    View
                  </button>
                </div>
                <div
                  style={{ marginTop: "17px" }}
                  className="col-lg-12 text-right"
                >
                  {reports?.length > 0 && (
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary mr-1"
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
                        onClick={(e) =>
                          downloadFile(
                            `/hcm/HCMReport/GetSalaryTopSheetReportDownload?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&workPlaceGroupId=${values?.workplaceGroup?.value}&positionGroupId=${values?.positionGroup?.value}&monthId=${values?.month?.value}&yearId=${values?.year?.value}`,
                            "Salary Top Sheet",
                            "xlsx"
                          )
                        }
                      >
                        Export Excel
                      </button>
                      <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact !important;} .salary-top-sheet-link{color: black !important; text-decoration: none !important} .salary-top-sheet-d-none-print{display: none !important}  @page {size: landscape} !important}}"
                        }
                        trigger={() => (
                          <button
                            type="button"
                            className="ml-1 btn btn-primary"
                          >
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Table */}

              {reports?.length > 0 && (
                <>
                  {/* <div className="my-1 d-flex justify-content-end">
                    
                  </div> */}
                  <div className="loan-scrollable-table employee-overall-status salaryTopSheet">
                    <div
                      style={
                        tableSize === "Small"
                          ? { maxHeight: "400px" }
                          : { maxHeight: "500px" }
                      }
                      className="scroll-table _table"
                    >
                      <div ref={printRef}>
                        <div
                          style={{ textAlign: "center", paddingTop: "20px" }}
                          className="salary-top-sheet-print"
                        >
                          <h4>Salary Approval Summary</h4>
                          <h4>{selectedBusinessUnit?.label}</h4>
                          <b>Month : {values?.month?.label} ,</b>
                          <b>Year : {values?.year?.label}</b>
                        </div>
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th
                                className="topSheetCustomTh"
                                style={{
                                  minWidth: "70px",
                                  border: "1px solid transparent",
                                }}
                              ></th>
                              <th
                                className="topSheetCustomTh"
                                style={{ minWidth: "100px" }}
                              ></th>
                              <th colspan="3" style={{ minWidth: "100px" }}>
                                Category/Group
                              </th>
                              <th
                                className="topSheetCustomTh"
                                style={{ minWidth: "70px" }}
                              ></th>
                              <th
                                className="topSheetCustomTh"
                                style={{ minWidth: "70px" }}
                              ></th>
                              <th
                                className="topSheetCustomTh"
                                style={{ minWidth: "70px" }}
                              ></th>
                              <th
                                className="topSheetCustomTh"
                                style={{ minWidth: "70px" }}
                              ></th>
                              <th
                                className="topSheetCustomTh"
                                style={{ minWidth: "70px" }}
                              ></th>
                              <th
                                className="topSheetCustomTh"
                                style={{ minWidth: "70px" }}
                              ></th>
                            </tr>
                            <tr>
                              <th 
                              className="printSectionNone"
                                 style={{
                                  minWidth: "70px",
                                  border: "1px solid transparent",
                                }}
                                >
                                <input
                                  type="checkbox"
                                  id="parent"
                                  onChange={(event) => {
                                    setAllSelect(event.target.checked);
                                  }}
                                />
                              </th>
                              <th style={{ minWidth: "70px", width: "70px" }}>
                                SL
                              </th>
                              <th style={{ minWidth: "100px" }}>Unit Name</th>
                              <th style={{ minWidth: "100px" }}>Sub Details</th>
                              <th style={{ minWidth: "100px" }}>General</th>
                              <th style={{ minWidth: "100px" }}>Wages</th>
                              <th style={{ minWidth: "70px" }}>Salary</th>
                              <th style={{ minWidth: "70px" }}>
                                Total Deduction
                              </th>
                              <th style={{ minWidth: "70px" }}>
                                Total Allowance
                              </th>
                              <th style={{ minWidth: "70px" }}>Loan</th>
                              <th style={{ minWidth: "70px" }}>Tax</th>
                              <th style={{ minWidth: "70px" }}>
                                Net Payable Salary
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports?.map((item, index) => (
                              <tr key={index}>
                                <td className="printSectionNone">
                                  <input
                                    id="isSelect"
                                    type="checkbox"
                                    value={item?.isSelect}
                                    checked={item?.isSelect}
                                    onChange={(e) => {
                                      singleCheckBoxHandler(
                                        e.target.checked,
                                        index
                                      );
                                    }}
                                  />
                                </td>
                                <td className="text-center">{index + 1}</td>
                                <td>{item?.strUnit}</td>
                                <td
                                  onClick={() => {
                                    openNewWindowForDetails(1, item, values);
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "blue",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                    }}
                                    className="salary-top-sheet-link"
                                  >
                                    {item?.strWorkplaceGroupName}
                                  </span>
                                  <span className="salary-top-sheet-d-none-print">
                                    <ITooltip
                                      content={() => <span>Show Details</span>}
                                    />
                                  </span>
                                </td>
                                <td
                                  onClick={() => {
                                    openNewWindowForDetails(2, item, values);
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "blue",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                    }}
                                    className="salary-top-sheet-link"
                                  >
                                    {item?.strWorkplaceGroupName}
                                  </span>
                                  <span className="salary-top-sheet-d-none-print">
                                    <ITooltip
                                      content={() => <span>Show Details</span>}
                                    />
                                  </span>
                                </td>
                                <td
                                  onClick={() => {
                                    openNewWindowForDetails(3, item, values);
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "blue",
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                    }}
                                    className="salary-top-sheet-link"
                                  >
                                    {item?.strWorkplaceGroupName}
                                  </span>
                                  <span className="salary-top-sheet-d-none-print">
                                    <ITooltip
                                      content={() => <span>Show Details</span>}
                                    />
                                  </span>
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.monSalary, 2)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.monTotalDeduction, 2)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.monTotalAllowance, 2)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.monLoan, 2)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.monTaxAmount, 2)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.monNetPayableSalary, 2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
