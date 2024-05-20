/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { setEmpKpiReportInitData_Action } from "../../../../_helper/reduxForLocalStorage/Actions";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getMonthDDLAction } from "../../../individualKpi/PerformanceChart/_redux/Actions";
import {
  getDepartmentDDL,
  GetKpiLandingReportAction,
  getYearDDL,
} from "../helper";

const initData = {
  employee: "",
  department: { value: 0, label: "All" },
  year: "",
  fromMonth: "",
  toMonth: "",
};

export function TableRow({ btnRef, saveHandler, resetBtnRef, modalData }) {
  const [state, setState] = useState(useLocation().state);
  const [loading, setLoading] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);

  const history = useHistory();
  const dispatch = useDispatch();
  const printRef = useRef();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL]);

  const commonGridDataFunc = (
    ddlName,
    ddlValue,
    yearId,
    fromMonthId,
    toMonthId
  ) => {
    GetKpiLandingReportAction(
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
      const obj = empKpiReportInitData?.department ? {
        value: empKpiReportInitData?.department?.value,
        label: "Department",
      } : {value : 0, label: "Department"};

      let yearId = empKpiReportInitData?.year?.value
        ? empKpiReportInitData?.year?.value
        : yearDDL?.length > 0
        ? yearDDL[0]?.value
        : "";
      commonGridDataFunc(obj?.label, obj?.value, yearId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, yearDDL]);
  

  const backHandler = () => {
    history.goBack();
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initData}
        initialValues={{
          ...initData,
          ...empKpiReportInitData,
          department: { value: 0, label: "All" },
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
              printTitle="Print"
              title="Performance Improvement Plan (PIP) Report"
              isPrint={true}
              isShowPrintBtn={true}
              isBackBtn={state?.isDisabled}
              backHandler={backHandler}
              componentRef={printRef}
            >
              <Form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-md-3">
                      <NewSelect
                        name="department"
                        options={[{ value: 0, label: "All" }, ...departmentDDL]}
                        value={values?.department}
                        label="Department"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("department", valueOption);
                            let obj = {
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
                            setFieldValue("department", {
                              value: 0,
                              label: "All",
                            });
                            commonGridDataFunc(
                              "Department",
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
                          if (valueOption) {
                            setFieldValue("year", valueOption);
                            dispatch(getMonthDDLAction(valueOption?.value));
                            // for local storage,
                            let objOne = {
                              employee: values?.employee,
                              department: values?.department,
                              year: valueOption,
                            };
                            dispatch(setEmpKpiReportInitData_Action(objOne));

                            commonGridDataFunc(
                              "Department",
                              valueOption?.value,
                              values?.year?.value,
                              values?.fromMonth?.value,
                              values?.toMonth?.value
                            );
                          }
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
                                value: values?.employee?.value,
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
                                value: values?.employee?.value,
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

              <div className="mt-1" ref={printRef}>
                <div>
                  <h2 style={{ textAlign: "center" }}>
                    Akij Resource Limited
                  </h2>
                  <h6 style={{ textAlign: "center" }}>
                    198, Bir Uttam Mir Showkat Sarak, Tejgaon, I/A, Dhaka,
                    Bangladesh
                  </h6>
                </div>

                {/* Table Start */}
                {loading && <Loading />}
                <div className="row ">
                  <div className="col-lg-12 text-center">
                    <p>Performance Improvement Plan (PIP) Report</p>
                  </div>
                  <div className="col-lg-12">
                    {gridData?.length >= 0 && (
                      <table className="table table-striped table-bordered global-table table-font-size-sm">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "90px" }}>iBOS Enroll No.</th>
                            <th style={{ width: "90px" }}>Name of Employee</th>
                            <th style={{ width: "90px" }}>Designation</th>
                            <th style={{ width: "90px" }}>Department</th>
                            <th style={{ width: "90px" }}>Employee Category</th>
                            <th style={{ width: "90px" }}>
                              Work Place(Geographic Location)
                            </th>
                            <th style={{ width: "90px" }}>SBUs Name</th>
                            <th style={{ width: "90px" }}>
                              KPI Score Out of 70
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.intEmployeeId || "-"}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.strEmployeeFullName || "-"}
                                </div>
                              </td>
                              <td>{item?.strDesignationName || "-"}</td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.strDepartmentName || "-"}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.strDesignationName || "-"}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.strWorkplaceName || "-"}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.strSBUName || "-"}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.score || "-"}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                  {!loading && (
                    <span className="mx-auto">
                      N.B: This is an auto-generated report by ERP System.
                    </span>
                  )}
                </div>
              </div>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
