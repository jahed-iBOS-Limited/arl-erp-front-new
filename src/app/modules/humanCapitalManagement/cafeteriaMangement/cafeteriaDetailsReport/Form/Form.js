/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  getBuDDLForEmpDirectoryAndSalaryDetails,
  getDailyDetailsReportData,
  getDetailsReportData,
  getMealConsumePlaceDDL,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { downloadFile } from "../../../../_helper/downloadFile";
import { toast } from "react-toastify";

export default function _Form({
  initData,
  saveHandler,
  profileData,
  selectedBusinessUnit,
}) {
  const [rowData, setRowData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [buUnitDDL, setBuUnitDDL] = useState([]);
  const [loader, setLoader] = useState(false);
  const [mealConsumePlaceDDL, setmealConsumePlaceDDL] = useState([])

  useEffect(() => {
    getMealConsumePlaceDDL(setmealConsumePlaceDDL);
  },[profileData, selectedBusinessUnit])


  const headers = [
    "SL",
    "Employee Id",
    "ERP Emp. Id",
    "Employee Code",
    "Name Of Employees",
    "Designation",
    "Department",
    "Unit Name",
    "Job Station",
    "Rate",
    "Own Meal",
    "Guest Meal",
    "Total Meal",
    "Own Tk",
    "Company Subsidy",
    "Guest Tk",
    "Total Tk",
  ];

  const dailyHeaders = (values) => {
    if (values?.businessUnit?.label === "All") {
      return [
        "SL",
        "Business Unit",
        "Employee Id",
        "ERP Emp. Id",
        "Employee Code",
        "Name Of Employees",
        "Designation",
        "Department",
        "Meal Count",
        "MealDate",
      ];
    } else {
      return [
        "SL",
        "Employee Id",
        "ERP Emp. Id",
        "Employee Code",
        "Name Of Employees",
        "Designation",
        "Department",
        "Meal Count",
        "MealDate",
      ];
    }
  };

  const showRowData = (values) => {
    if (!values?.businessUnit) return toast.warn("Business unit is required");
    if (values?.reportType?.value === 1 && !values?.consumePlace?.value) return toast.warn("Meal consume place is required");

    values?.reportType?.value === 1
      ? getDailyDetailsReportData(
          values?.businessUnit?.value,
          values?.fromDate,
          values?.consumePlace?.value,
          setDailyData,
          setLoader
        )
      : getDetailsReportData(
          profileData?.userId,
          values?.fromDate,
          values?.toDate,
          setRowData,
          setLoader,
          values?.businessUnit?.value
        );
  };

  useEffect(() => {
    getBuDDLForEmpDirectoryAndSalaryDetails(
      profileData?.accountId,
      setBuUnitDDL
    );
  }, []);

  return (
    <>
      {loader && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <NewSelect
                    label="Business Unit"
                    options={[{ value: 0, label: "All" }, ...buUnitDDL]}
                    value={values?.businessUnit}
                    placeholder="Business Unit"
                    name="businessUnit"
                    onChange={(valueOption) => {
                      setDailyData([]);
                      setRowData([]);
                      setFieldValue("businessUnit", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    label="Report Type"
                    options={[
                      { value: 1, label: "Daily" },
                      { value: 2, label: "Monthly" },
                    ]}
                    value={values?.reportType}
                    placeholder="Report Type"
                    name="reportType"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <label>
                    {values?.reportType?.value === 1 ? "Date" : "From Date"}
                  </label>
                  <InputField
                    value={values?.fromDate ? values?.fromDate : ""}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                  />
                </div>
                {values?.reportType?.value !== 1 && (
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate ? values?.toDate : ""}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                    />
                  </div>
                )}

                {values?.reportType?.label === "Daily" &&(<div className="col-lg-2">
                  <NewSelect
                    name="consumePlace"
                    options={mealConsumePlaceDDL || []}
                    value={values?.consumePlace}
                    label="Meal Consume Place"
                    onChange={(valueOption) => {
                      setFieldValue("consumePlace", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>)}

                <div className="col-lg-3" style={{ marginTop: "12px" }}>
                  <button
                    className={"btn btn-primary mr-5"}
                    type="button"
                    disabled={!values?.businessUnit}
                    onClick={(e) => showRowData(values)}
                  >
                    Show
                  </button>
                  {values?.reportType?.label === "Daily" && (
                    <button
                      className={"btn btn-primary ml-2"}
                      type="button"
                      onClick={() => {
                        if (values?.reportType?.value === 1 && !values?.consumePlace?.value) return toast.warn("Meal consume place is required");
                        let api = `/hcm/HCMCafeteriaReport/GetDailyCafeteriaReport?businessUnitId=${values?.businessUnit?.value}&mealDate=${values?.fromDate}&isDownload=true&PlaceId=${          values?.consumePlace?.value
                        }`;

                        values?.reportType?.value === 1 &&
                          downloadFile(
                            api,
                            "Daily Meal Report",
                            "xlsx",
                            setLoader
                          );
                      }}
                    >
                      Export Excel
                    </button>
                  )}
                </div>
              </div>

              <br></br>

              <h6 style={{ textAlign: "center" }}>
                {values?.businessUnit?.label === "All"
                  ? "All Business Unit"
                  : values?.businessUnit?.label}
              </h6>
              <h6 style={{ textAlign: "center" }}>Cafeteria Details Report</h6>

              {values?.reportType?.value === 1 ? (
                <div>
                  {dailyData?.length > 0 && (
                    <h6 style={{ textAlign: "center" }}>
                      For the Date of {values?.fromDate}
                    </h6>
                  )}

                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        {dailyHeaders(values).map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {dailyData?.length > 0 &&
                        dailyData.map((data, index) => (
                          <tr style={{ textAlign: "center" }} key={index}>
                            <td className="text-center">{index + 1}</td>
                            {values?.businessUnit?.label === "All" && (
                              <td className="text-left">
                                {data?.businessUnitName}
                              </td>
                            )}

                            <td className="text-center">{data?.employeeId}</td>
                            <td className="text-center">
                              {data?.erpemployeeId}
                            </td>
                            <td className="text-center">
                              {data?.employeeCode}
                            </td>
                            <td className="text-left">
                              {data?.employeeFullName}
                            </td>
                            <td className="text-left">
                              {data?.designationName}
                            </td>
                            <td className="text-left">
                              {data?.departmentName}
                            </td>
                            <td className="text-center">{data?.mealCount}</td>
                            <td className="text-center">{data?.mealDate}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  {rowData?.length > 0 && (
                    <h6 style={{ textAlign: "center" }}>
                      For the month of {values?.fromDate} To {values?.toDate}
                    </h6>
                  )}

                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        {headers.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData.map((data, index) => (
                          <tr style={{ textAlign: "center" }} key={index}>
                            <td>{index + 1}</td>
                            <td>{data?.Enrollment}</td>
                            <td>{data?.ErpEmployeeId}</td>
                            <td>{data?.EmployeeCode}</td>
                            <td className="text-left">{data?.NameOfEmployees}</td>
                            <td className="text-left">{data?.Designation}</td>
                            <td className="text-left">{data?.Dept}</td>
                            <td className="text-left">{data?.Unit}</td>
                            <td className="text-left">{data?.JobStation}</td>
                            <td>{data?.Rate}</td>
                            <td>{data?.Own}</td>
                            <td>{data?.Guest}</td>
                            <td>{data?.Total}</td>
                            <td>{data?.OwnTk}</td>
                            <td>{data?.CompanyPay}</td>
                            <td>{data?.GuestTk}</td>
                            <td>{data?.TotalTk}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
