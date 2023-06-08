import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";
import {
  getMonthDDL,
  getEmployee,
  getSalesForceMonthlyTaDaById,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
export default function _Form({
  initData,
  saveHandler,
  profileData,
  selectedBusinessUnit,
  disableHandler,
  btnRef,
  resetBtnRef,
}) {
  const [rowData, setRowData] = useState([]);
  const [loader] = useState(false);
  // const [emplopyeeInfo, setEmployeeInfo] = useState([]);
  const [employeeDDL, setEmployeeDDL] = useState([]);
  const [monthDDL, setMonthDDL] = useState([]);
  const yearDDL = [
    { value: 2020, label: "2020" },
    { value: 2021, label: "2021" },
    { value: 2022, label: "2022" },
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
    { value: 2025, label: "2025" },
  ];
  const headers = [
    "SL",
    "Date",
    "Day Name",
    "Working Day Status",
    "Present Status",
    "Daily DA Amount",
    "Aditional Amount",
    "Deduction Amount",
  ];
  const showRowData = (values, setValues) => {
    // console.log(value)
    getSalesForceMonthlyTaDaById(
      profileData?.accountId,
      selectedBusinessUnit.value,
      values.employeeDDL.value,
      values.monthDDL.value,
      values.yearDDL.value,
      values,
      setValues,
      setRowData
    );
  };

  let OwnTk = 0;
  let CompanyPay = 0;
  let GuestTk = 0;
  let TotalTk = 0;

  rowData.forEach((data, index) => {
    OwnTk = data.OwnTk + OwnTk;
    CompanyPay = data.CompanyPay + CompanyPay;
    GuestTk = data.GuestTk + GuestTk;
    TotalTk = data.TotalTk + TotalTk;
  });

  // const csvData = [
  //   ...rowData,
  //   {
  //     OwnTk: OwnTk,
  //     CompanyPay: CompanyPay,
  //     GuestTk: GuestTk,
  //     TotalTk: TotalTk,
  //   },
  // ];

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getMonthDDL(setMonthDDL);
      getEmployee(
        profileData?.accountId,
        selectedBusinessUnit.value,
        setEmployeeDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const inputHandler = (name, value, sl, rowDto, setRowDto) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = Number(value);
    setRowDto(data);
  };

  useEffect(() => {}, [rowData]);

  function getSum(arr, labelName) {
    return arr
      .map((item) => item[labelName])
      .reduce((a, b) => {
        return a + b;
      }, 0);
  }

  return (
    <>
      {loader && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ objHeader: values, objRowList: rowData }, () => {
            resetForm();
            setRowData([]);
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
          setValues,
        }) => (
          <>
            {console.log(errors)}
            <Form className="form form-label-right">
              <div className="form-group">
                <div className="row align-items-end">
                  <div className="col-lg-3">
                    <NewSelect
                      name="employeeDDL"
                      options={employeeDDL}
                      value={values?.employeeDDL}
                      label="Employee Name"
                      onChange={(valueOption) => {
                        setFieldValue("employeeDDL", valueOption);
                      }}
                      placeholder="Employee"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="monthDDL"
                      options={monthDDL}
                      value={values?.monthDDL}
                      label="Month"
                      onChange={(valueOption) => {
                        setFieldValue("monthDDL", valueOption);
                      }}
                      placeholder="month"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="yearDDL"
                      options={yearDDL}
                      value={values?.yearDDL}
                      label="Year"
                      onChange={(valueOption) => {
                        setFieldValue("yearDDL", valueOption);
                      }}
                      placeholder="Year"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      className={"btn btn-sm btn-primary"}
                      type="button"
                      onClick={(e) =>
                        showRowData(
                          values,
                          setValues,
                          setRowData,
                          setFieldValue
                        )
                      }
                      disabled={
                        !values.employeeDDL ||
                        !values.monthDDL ||
                        !values.yearDDL
                      }
                    >
                      view
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-3 ">
                    <label>Employee Name</label>
                    <InputField
                      value={values?.employeeName}
                      name="employeeName"
                      placeholder="Employee Name"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Designation</label>
                    <InputField
                      value={values?.designation}
                      name="designation"
                      placeholder="Designation"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Department</label>
                    <InputField
                      value={values?.department}
                      name="department"
                      placeholder="Department"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Monthly TA Amount</label>
                    <InputField
                      value={values?.monthlyTaamount}
                      name="monthlyTaamount"
                      placeholder="MonthlyTa Amount"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Average DA Amount</label>
                    <InputField
                      value={values?.averageDaamount}
                      name="monthlyDaamount"
                      placeholder="Monthly Da Amount"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 ">
                    <label>Total DA Amount</label>
                    <InputField
                      value={getSum(rowData, "dailyDaAmount")}
                      name="totalDaamount"
                      placeholder="Total Da Amount"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Addition Amount</label>
                    <InputField
                      value={getSum(rowData, "additionalAmount")}
                      name="additionalAmount"
                      placeholder="Additional Amount"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Deduction Amount</label>
                    <InputField
                      value={getSum(rowData, "deductionAmount")}
                      name="deductionAmount"
                      placeholder="Deduction Amount"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Meeting Expense</label>
                    <InputField
                      value={values?.monthlyMeetingExpAmount}
                      name="meetingExpense"
                      placeholder="Meeting Expense"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Others</label>
                    <InputField
                      value={values?.monthlyOthersAmount}
                      name="others"
                      placeholder="Others"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Total Working Day</label>
                    <InputField
                      value={values?.totalWorkingDay}
                      name="totalWorkingDay"
                      placeholder="Total Working Day"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3 ">
                    <label>Total Present Day</label>
                    <InputField
                      value={values?.totalPresentDay}
                      name="totalPresentDay"
                      placeholder="Total Present Day"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    {headers.map((th, index) => {
                      return <th key={index}> {th} </th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rowData.length > 0 &&
                    rowData.map((data, index) => (
                      <tr style={{ textAlign: "center" }} key={index}>
                        <td>{index + 1}</td>
                        <td>{_dateFormatter(data.date)}</td>
                        <td>{data.dayName}</td>
                        <td>{data.workingDayStatus}</td>
                        <td>{data.present ? "Present" : "Absent"}</td>
                        <td className="text-right">
                          <input
                            name="dailyDaAmount"
                            value={rowData[index].dailyDaAmount}
                            type="number"
                            className="w-100"
                            onChange={(e) => {
                              inputHandler(
                                "dailyDaAmount",
                                e.target.value,
                                index,
                                rowData,
                                setRowData
                              );
                            }}
                          />
                        </td>
                        <td className="text-right">
                          <input
                            name="additionalAmount"
                            value={rowData[index].additionalAmount}
                            type="number"
                            className="w-100"
                            onChange={(e) => {
                              inputHandler(
                                "additionalAmount",
                                e.target.value,
                                index,
                                rowData,
                                setRowData
                              );
                            }}
                          />
                        </td>
                        <td className="text-right">
                          <input
                            name="deductionAmount"
                            value={rowData[index].deductionAmount}
                            type="number"
                            className="w-100"
                            onChange={(e) => {
                              inputHandler(
                                "deductionAmount",
                                e.target.value,
                                index,
                                rowData,
                                setRowData
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  {rowData.length > 0 && (
                    <tr style={{ textAlign: "center" }}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{getSum(rowData, "dailyDaAmount")}</td>
                      <td>{getSum(rowData, "additionalAmount")}</td>
                      <td>{getSum(rowData, "deductionAmount")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              {console.log(rowData)}
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onClick={() => {
                  resetForm();
                  setRowData([]);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
