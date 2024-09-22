import axios from "axios";
import { Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import ICard from "../../../_helper/_card";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import InputField from "./../../../_helper/_inputField";
import { _todayDate } from "./../../../_helper/_todayDate";
import { YearDDL } from "./../../../_helper/_yearDDL";
import {
  exportExpenseReport,
  GetExpenseReport_api,
  usePrintHandler,
} from "./helper";
import PrintableTable from "./tables/printableTable";
import Table from "./tables/table";
import TableFour from "./tables/tableFour";
import TableThree from "./tables/tableThree";
import TableTwo from "./tables/tableTwo";

const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const reportTypes = [
  { value: 1, label: "All Unit" },
  { value: 2, label: "Single Unit" },
  { value: 3, label: "Specific Employee" },
  { value: 4, label: "Specific Employee Details" },
  { value: 5, label: "Bill Submit Pending" },
  { value: 6, label: "Supervisor Aprv Pending" },
  { value: 7, label: "Line Manager Aprv Pending" },
  { value: 8, label: "Bill Register  Pending" },
  { value: 9, label: "Bill Register  By Code" },
  { value: 10, label: "Status Check" },
  { value: 12, label: "Comparison Report" },
  { value: 14, label: "Expense Top Sheet (HR)" },
];

const startOfMonth = moment(_todayDate())
  .startOf("month")
  .format();
const ExpenceReport = () => {
  const initData = {
    status: { value: true, label: "Complete" },
    employeeName: "",
    reportType: "",
    fromDate: _dateFormatter(startOfMonth),
    toDate: _todayDate(),
    year: {
      value: new Date().getFullYear(),
      label: `${new Date().getFullYear()}`,
    },
    month: monthDDL[new Date().getMonth()],
    expenseCode: "",
    expenceGroup: { value: 1, label: "TaDa" },
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gridData, getGridData, isLoading, setGridData] = useAxiosGet();
  const [printableData, setPrintableData] = useState([]);

  const { handlePrint, printRef } = usePrintHandler();

  const girdDataFunc = (values) => {
    setGridData([]);
    if (values?.reportType?.value === 10) {
      getGridData(
        `/oms/SalesInformation/GetInternalExpenseApprovalDetails?ExpenseCode=${values?.expenseCode}&intUnitId=${selectedBusinessUnit?.value}&Enroll=${values?.employeeName?.value}&intTypeId=${values?.reportType?.value}`,
        (resData) => {
          // ci sl to response data
          const updatedData = resData?.map((item, index) => ({
            ...item,
            sl: index + 1,
            dteSupervisorAprvdate: moment(item?.dteSupervisorAprvdate).format(
              "YYYY-MM-DD, LT"
            ),
            dteLineManagerAprvdate: moment(item?.dteLineManagerAprvdate).format(
              "YYYY-MM-DD, LT"
            ),
            dteExpenseDate: moment(item?.dteExpenseDate).format("YYYY-MM-DD"),
          }));
          setGridData(updatedData);
        }
      );
    } else {
      GetExpenseReport_api(
        selectedBusinessUnit?.value,
        values?.reportType?.value,
        values?.employeeName?.value || 0,
        values?.fromDate,
        values?.toDate,
        values?.status?.value,
        profileData?.userId,
        values?.expenseCode,
        values?.expenceGroup?.label,
        setGridData,
        setLoading
      );
    }
  };

  const getPrintData = (values) => {
    GetExpenseReport_api(
      selectedBusinessUnit?.value,
      16,
      values?.employeeName?.value || 0,
      values?.fromDate,
      values?.toDate,
      values?.status?.value,
      profileData?.userId,
      values?.expenseCode,
      values?.expenceGroup?.label,
      setPrintableData,
      setLoading,
      () => {
        handlePrint();
      }
    );
  };

  const employeeList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/tms/TMSReport/GetEmployeeListUnitWise?businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
      )
      .then((res) => res?.data);
  };

  const dateSetFunction = (month, year) => {
    var newDate = moment();
    newDate.set("month", month - 1);
    newDate.set("year", year);
    const firstDate = _dateFormatter(
      moment(newDate)
        .startOf("month")
        .format()
    );
    const lestDate = _dateFormatter(
      moment(newDate)
        .endOf("month")
        .format()
    );
    return { lestDate, firstDate };
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <ICard
            // title="Expense Report"
            // isExcelBtn={true}
            // excelFileNameWillbe="expenseReport"
            exportExcel
            exportExcelClickHandler={() =>
              exportExpenseReport(values, gridData)
            }
            exportExcelDataLength={gridData?.length}
            clickHandler={() => {
              getPrintData(values);
            }}
            printTitle="Print"
            isShowPrintPreviewBtn={
              [14].includes(values?.reportType?.value) && gridData?.length
            }
          >
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={reportTypes}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        setFieldValue("employeeName", "");
                        setFieldValue("expenseCode", "");
                        setGridData([]);
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {[3, 4, 5, 6, 7, 8, 9, 10].includes(
                    values?.reportType?.value
                  ) && (
                    <div className="col-lg-3">
                      <label>Employee Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.employeeName}
                        handleChange={(valueOption) => {
                          setFieldValue("employeeName", valueOption);
                          setGridData([]);
                        }}
                        loadOptions={employeeList || []}
                      />
                    </div>
                  )}
                  {[1, 2, 3, 4, 12, 14].includes(values?.reportType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        options={[
                          { value: true, label: "Complete" },
                          { value: false, label: "InComplete" },
                        ]}
                        value={values?.status}
                        label="Status"
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                          setGridData([]);
                        }}
                        placeholder="Status"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {![10].includes(values?.reportType?.value) && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          isClearable={false}
                          label="Year "
                          placeholder="Year"
                          name="year"
                          options={YearDDL()}
                          value={values?.year}
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("year", valueOption);
                            var newDate = moment();
                            newDate.set("month", values?.month?.value - 1);
                            newDate.set("year", valueOption?.value);
                            setFieldValue("toDate", _dateFormatter(newDate));
                            setFieldValue(
                              "fromDate",
                              _dateFormatter(
                                moment(newDate)
                                  .startOf("month")
                                  .format()
                              )
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          isClearable={false}
                          label="Month"
                          placeholder="Month"
                          name="month"
                          options={monthDDL}
                          value={values?.month}
                          onChange={(valueOption) => {
                            setGridData([]);
                            setFieldValue("month", valueOption);
                            var newDate = moment();
                            newDate.set("month", valueOption?.value - 1);
                            newDate.set("year", values?.year?.value);
                            setFieldValue("toDate", _dateFormatter(newDate));
                            setFieldValue(
                              "fromDate",
                              _dateFormatter(newDate.startOf("month").format())
                            );
                            newDate.set("date", new Date(newDate).getDate());

                            // const modifyDate = new Date();
                            // modifyDate.setMonth(valueOption?.value - 1);
                            // modifyDate.setYear(values?.year?.value);
                            // modifyDate.setDate(new Date(modifyDate).getDate());

                            // setFieldValue("toDate", _dateFormatter(modifyDate));
                            // setFieldValue(
                            //   "fromDate",
                            //   _dateFormatter(
                            //     moment(modifyDate)
                            //       .startOf("month")
                            //       .format()
                            //   )
                            // );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}
                  {![10].includes(values?.reportType?.value) && (
                    <>
                      <div className="col-lg-3">
                        <label>From Date</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                          min={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.firstDate
                          }
                          max={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.lestDate
                          }
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                          }}
                          min={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.firstDate
                          }
                          max={
                            dateSetFunction(
                              values?.month?.value,
                              values?.year?.value
                            )?.lestDate
                          }
                        />
                      </div>
                    </>
                  )}
                  {[9, 10].includes(values?.reportType?.value) && (
                    <div className="col-lg-3">
                      <label>Expense Code</label>
                      <InputField
                        value={values?.expenseCode}
                        name="expenseCode"
                        placeholder="Expense Code"
                        type="text"
                        onChange={(e) => {
                          setGridData([]);
                          setFieldValue("expenseCode", e.target.value);
                        }}
                      />
                    </div>
                  )}

                  {/* Assign by Monir Bhai! */}
                  {![10].includes(values?.reportType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="expenceGroup"
                        options={[
                          { value: 1, label: "TaDa" },
                          { value: 2, label: "Other" },
                        ]}
                        value={values?.expenceGroup}
                        label="Expence Group"
                        onChange={(valueOption) => {
                          setFieldValue("expenceGroup", valueOption);
                        }}
                        placeholder="Expence Group"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}

                  <div className="col d-flex justify-content-end align-items-center ">
                    <button
                      type="button"
                      onClick={() => girdDataFunc(values)}
                      className="btn btn-primary mt-2"
                      disabled={!values?.reportType}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div>{(loading || isLoading) && <Loading />}</div>
            {[1, 2, 3, 4, 12].includes(values?.reportType?.value) && (
              <Table gridData={gridData} />
            )}
            {[5, 6, 7, 8, 9].includes(values?.reportType?.value) && (
              <TableTwo gridData={gridData} values={values} />
            )}
            {[10].includes(values?.reportType?.value) && (
              <TableThree gridData={gridData} />
            )}
            {[14].includes(values?.reportType?.value) && (
              <>
                <TableFour
                  gridData={gridData}
                  values={values}
                  userId={profileData?.userId}
                  girdDataFunc={girdDataFunc}
                />
              </>
            )}{" "}
            {printableData?.length > 0 && (
              <PrintableTable gridData={printableData} printRef={printRef} />
            )}
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default ExpenceReport;
