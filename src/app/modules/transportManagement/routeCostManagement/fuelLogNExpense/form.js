import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../_helper/_card";
import NewSelect from "../../../_helper/_select";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { YearDDL } from "../../../_helper/_yearDDL";
import Loading from "../../../_helper/_loading";
import { getFuelLogNExpense } from "./helper";
import Table from "./table";

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

const FuelLogNExpense = () => {
  const initData = {
    reportType: "",
    employeeName: "",
    year: {
      value: new Date().getFullYear(),
      label: `${new Date().getFullYear()}`,
    },
    month: monthDDL[new Date().getMonth()],
  };

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const girdDataFunc = (values) => {
    setGridData([]);
    getFuelLogNExpense(
      values?.reportType?.value,
      values?.year?.value,
      values?.month?.value,
      values?.employeeName?.value,
      profileData?.employeeId,
      setGridData,
      setLoading
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {}}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <ICard
            title="Fuel Log N Expense"
            isExcelBtn={true}
            excelFileNameWillbe="Fuel Log N Expense"
            isPrint={true}
          >
            {loading && <Loading />}
            <form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "Details" },
                        { value: 2, label: "Date Base" },
                        { value: 3, label: "Employee Base" },
                        { value: 4, label: "Cash vs Fuel Expense (All)" },
                        { value: 5, label: "Cash vs Fuel Expense (Employee)" },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        setFieldValue("employeeName", "");

                        setGridData([]);
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {[3].includes(values?.reportType?.value) && (
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
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

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

            {gridData?.length > 0 && <Table gridData={gridData} />}
          </ICard>
        )}
      </Formik>
    </>
  );
};

export default FuelLogNExpense;
