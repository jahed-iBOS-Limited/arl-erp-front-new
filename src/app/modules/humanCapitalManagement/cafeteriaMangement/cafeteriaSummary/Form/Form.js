import React, { useState } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import { getSummaryReportData } from "../helper";
import { CSVLink } from "react-csv";
import Loading from "../../../../_helper/_loading";

export default function _Form({
  initData,

  saveHandler,

  profileData,

  selectedBusinessUnit,
}) {
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);
  const headers = [
    "SL",
    "Business Unit Name",
    "Own Meal",
    "Guest Meal",
    "Total Meal",
    "Own TK",
    "Company Subsidy",
    "Guest TK",
    "Total TK",
  ];
  const showRowData = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value)
      getSummaryReportData(
        profileData?.userId,
        values?.fromDate,
        values?.toDate,
        setRowData,
        setLoader
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

  const csvData = [
    ...rowData,
    {
      OwnTk: OwnTk,
      CompanyPay: CompanyPay,
      GuestTk: GuestTk,
      TotalTk: TotalTk,
    },
  ];

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
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate ? values?.fromDate : ""}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate ? values?.toDate : ""}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3" style={{ marginTop: "18px" }}>
                  <button
                    className={"btn btn-primary"}
                    type="button"
                    onClick={(e) => showRowData(values)}
                  >
                    Show
                  </button>
                </div>

                <div className="col-lg-4" style={{ marginTop: "28px" }}>
                  <button className={"btn btn-primary"} type="button">
                    <CSVLink
                      data={csvData}
                      filename={`cafeteriaSummaryReport-${values.fromDate} to ${values.toDate}.csv`}
                      style={{ color: "white" }}
                    >
                      Export To Excel
                    </CSVLink>
                  </button>
                </div>
              </div>

              <br></br>

              <h6 style={{ textAlign: "center" }}>iBOS</h6>
              <h6 style={{ textAlign: "center" }}>Cafeteria Summary Report</h6>

              {rowData.length > 0 && (
                <h6 style={{ textAlign: "center" }}>
                  For the month of {values.fromDate} To {values.toDate}
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
                  {rowData.length > 0 &&
                    rowData.map((data, index) => (
                      <tr style={{ textAlign: "center" }} key={index}>
                        {/* {console.log(data)} */}
                        <td>{index + 1}</td>
                        <td>{data.Unit}</td>
                        <td>{data.Own}</td>
                        <td>{data.Guest}</td>
                        <td>{data.Total}</td>
                        <td>{data.OwnTk}</td>
                        <td>{data.CompanyPay}</td>
                        <td>{data.GuestTk}</td>
                        <td>{data.TotalTk}</td>
                      </tr>
                    ))}
                  {OwnTk !== 0 && (
                    <tr style={{ textAlign: "center" }}>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>{OwnTk}</td>
                      <td>{CompanyPay}</td>
                      <td>{GuestTk}</td>
                      <td>{TotalTk}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
