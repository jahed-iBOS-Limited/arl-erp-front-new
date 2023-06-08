/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { setEmpKpiReportInitData_Action } from "../../../../_helper/reduxForLocalStorage/Actions";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getMonthDDLAction } from "../../../individualKpi/PerformanceChart/_redux/Actions";
import {
  getDepartmentDDL,
  getEmployeeDDL,
  GetKpiLandingReportActions,
  getYearDDL,
} from "../helper";

const initData = {
  employee: "",
  department: "",
  year: "",
  fromMonth: "",
  toMonth: "",
};

export function TableRow({ btnRef, saveHandler, resetBtnRef }) {
  const [loading, setLoading] = useState(false);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);

  console.log(employeeDDL, "employeeDDL");

  const history = useHistory();
  const dispatch = useDispatch();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const { empKpiReportInitData } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  let { monthDDL } = useSelector(
    (state) => {
      return state?.performanceChartTwo;
    },
    { shallowEqual }
  );

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getEmployeeDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setEmployeeDDL
      );
      getYearDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setYearDDL
      );
      getDepartmentDDL(profileData?.accountId, setDepartmentDDL);
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (yearDDL?.length > 0) {
      dispatch(getMonthDDLAction(yearDDL?.[0]?.value));
    }
  }, [yearDDL]);

  const commonGridDataFunc = (
    ddlName,
    ddlValue,
    yearId,
    fromMonthId,
    toMonthId
  ) => {
    GetKpiLandingReportActions(
      ddlName,
      selectedBusinessUnit?.value,
      ddlValue,
      yearId,
      setGridData,
      setLoading,
      fromMonthId,
      toMonthId
    );
  };

  useEffect(() => {
    // must need yearId,
    if (yearDDL?.length > 0) {
      const obj = empKpiReportInitData?.department
        ? {
            value: empKpiReportInitData?.department?.value,
            label: "Department",
          }
        : empKpiReportInitData?.employee
        ? {
            value: empKpiReportInitData?.employee?.value,
            label: "Employee",
          }
        : { value: 0, label: "Employee" };
      let yearId = empKpiReportInitData?.year?.value
        ? empKpiReportInitData?.year?.value
        : yearDDL?.length > 0
        ? yearDDL[0]?.value
        : "";
      commonGridDataFunc(obj?.label, obj?.value, yearId);
    }
  }, [profileData, selectedBusinessUnit, yearDDL]);

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearch?AccountId=${profileData?.accountId}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          ...empKpiReportInitData,
          year: empKpiReportInitData?.year?.value
            ? empKpiReportInitData?.year
            : yearDDL?.length > 0
            ? yearDDL[0]
            : "",
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
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
            <ICard
              // printTitle="Print"
              title="Employee KPI Report"
              // isPrint={true}
              // isShowPrintBtn={true}
              // componentRef={printRef}
            >
              <div
                style={{
                  marginTop: "-42px",
                  // marginRight: "100px",
                  textAlign: "right",
                }}
              >
                <ReactHTMLTableToExcel
                  id="test-table-excel-button"
                  className="download-table-xls-button btn btn-primary text-right"
                  table="table-to-xlsx"
                  filename="Employee KPI Report"
                  sheet="tablexls"
                  buttonText="Export Excel"
                />
              </div>
              <Form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-md-3">
                      <label>Employee</label>
                      <SearchAsyncSelect
                        selectedValue={values?.employee}
                        isSearchIcon={true}
                        handleChange={(valueOption) => {
                          setFieldValue("department", "");
                          if (valueOption) {
                            setFieldValue("employee", valueOption);
                            let obj = {
                              employee: valueOption,
                              department: "",
                              year: values?.year,
                            };
                            dispatch(setEmpKpiReportInitData_Action(obj));

                            commonGridDataFunc(
                              "Employee",
                              valueOption?.value,
                              values?.year?.value,
                              values?.fromMonth?.value,
                              values?.toMonth?.value
                            );
                          } else {
                            setFieldValue("employee", "");
                            commonGridDataFunc(
                              "Employee",
                              0,
                              values?.year?.value,
                              values?.fromMonth?.value,
                              values?.toMonth?.value
                            );
                          }
                        }}
                        loadOptions={loadUserList}
                      />
                    </div>

                    <div className="col-md-3">
                      <NewSelect
                        name="department"
                        options={departmentDDL}
                        value={values?.department}
                        label="Department"
                        onChange={(valueOption) => {
                          setFieldValue("employee", "");
                          if (valueOption) {
                            setFieldValue("department", valueOption);
                            let obj = {
                              employee: "",
                              department: valueOption,
                              year: values?.year,
                            };
                            dispatch(setEmpKpiReportInitData_Action(obj));

                            commonGridDataFunc(
                              "Department",
                              valueOption?.value,
                              values?.year?.value,
                              values?.fromMonth?.value,
                              values?.toMonth?.value
                            );
                          } else {
                            setFieldValue("department", "");
                            commonGridDataFunc(
                              "Employee",
                              0,
                              values?.year?.value,
                              values?.fromMonth?.value,
                              values?.toMonth?.value
                            );
                          }
                        }}
                        placeholder="Select Department"
                        errors={errors}
                        touched={touched}
                        // isDisabled={!values?.businessUnit}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="year"
                        options={yearDDL}
                        value={values?.year}
                        label="Year"
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                          dispatch(getMonthDDLAction(valueOption?.value));
                          // for local storage,
                          let objOne = {
                            employee: values?.employee,
                            department: values?.department,
                            year: valueOption,
                          };
                          dispatch(setEmpKpiReportInitData_Action(objOne));

                          // for calling grid API
                          const obj = values?.department
                            ? {
                                value: values?.department?.value,
                                label: "Department",
                              }
                            : {
                                value: values?.employee?.value || 0,
                                label: "Employee",
                              };
                          commonGridDataFunc(
                            obj?.label,
                            obj?.value,
                            valueOption?.value,
                            values?.fromMonth?.value,
                            values?.toMonth?.value
                          );
                        }}
                        placeholder="Select Year"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-md-3">
                      <NewSelect
                        name="fromMonth"
                        options={monthDDL}
                        value={values?.fromMonth}
                        label="From Month"
                        onChange={(valueOption) => {
                          setFieldValue("fromMonth", valueOption);
                          const obj = values?.department
                            ? {
                                value: values?.department?.value,
                                label: "Department",
                              }
                            : {
                                value: values?.employee?.value || 0,
                                label: "Employee",
                              };
                          commonGridDataFunc(
                            obj?.label,
                            obj?.value,
                            values?.year?.value,
                            valueOption?.value,
                            values?.toMonth?.value
                          );
                        }}
                        placeholder="Select From Month"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-md-3">
                      <NewSelect
                        name="toMonth"
                        options={monthDDL}
                        value={values?.toMonth}
                        label="To Month"
                        onChange={(valueOption) => {
                          setFieldValue("toMonth", valueOption);
                          const obj = values?.department
                            ? {
                                value: values?.department?.value,
                                label: "Department",
                              }
                            : {
                                value: values?.employee?.value || 0,
                                label: "Employee",
                              };
                          commonGridDataFunc(
                            obj?.label,
                            obj?.value,
                            values?.year?.value,
                            values?.fromMonth?.value,
                            valueOption?.value
                          );
                        }}
                        placeholder="Select To Month"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                </div>
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
              <div className="row">
                {loading && <Loading />}
                {/* <PaginationSearch
                  placeholder="Search by Employee"
                  paginationSearchHandler={paginationSearchHandler}
                /> */}
              </div>
              {/* <div>
                <h2 style={{ textAlign: "center" }}>
                  {selectedBusinessUnit?.label}
                </h2>
              </div> */}

              {/* Table Start */}
              {loading && <Loading />}
              <div className="row cash_journal">
                <div className="col-lg-12 pr-0 pl-0">
                  {gridData?.length >= 0 && (
                    <table
                      id="table-to-xlsx"
                      className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table"
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th style={{ width: "90px" }}>Enroll</th>
                          <th style={{ width: "90px" }}>Name of Employee</th>
                          <th style={{ width: "90px" }}>Designation</th>
                          <th style={{ width: "90px" }}>Section</th>
                          <th style={{ width: "90px" }}>Department</th>
                          <th style={{ width: "90px" }}>Employment Type</th>
                          <th style={{ width: "90px" }}>
                            Work Place(Graphic Location)
                          </th>
                          <th style={{ width: "90px" }}>SBU Name</th>
                          <th style={{ width: "90px" }}>
                            Individual KPI Marks (out of 70)
                          </th>
                          <th style={{ width: "90px" }}>% of Acheivement</th>
                          <th style={{ width: "90px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.intEmployeeId || "-"}
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strEmployeeFullName || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strDesignationName || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strSectionName || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strDepartmentName || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strEmploymentType || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strWorkplaceName || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strSBUName || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {item?.score || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {item?.achievements || "-"}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                <IView
                                  clickHandler={() => {
                                    history.push({
                                      pathname: `/performance-management/report/performance-appraisal/view/${item?.intEmployeeId}`,
                                      state: {
                                        ...item,
                                        fromMonth: values?.fromMonth,
                                        toMonth: values?.toMonth,
                                        year: values?.year,
                                      },
                                    });
                                    dispatch(
                                      setEmpKpiReportInitData_Action(values)
                                    );
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
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
              </div>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
