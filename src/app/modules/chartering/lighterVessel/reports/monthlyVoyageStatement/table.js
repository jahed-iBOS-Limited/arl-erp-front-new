/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_chartinghelper/loading/_loading";
import ICustomTable from "../../../_chartinghelper/_customTable";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { getMonthlyVoyageStatement, months } from "../helper";
import { Formik } from "formik";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const headers = [
  { name: "SL" },
  { name: "Lighter Vessel Name" },
  { name: "Voyage No (lighter vessel)" },
  { name: "Receive Date & Time" },
  { name: "Discharging Start" },
  { name: "Discharging Complete" },
  { name: "Duration (DAYS)" },
  { name: "Mother Vessel" },
  { name: "Voyage No (mother vessel)" },
  { name: "Cargo" },
  { name: "Quantity" },
  { name: "Rate" },
  { name: "Freight" },
  { name: "Unloading Jetty" },
];

const initData = {
  date: _todayDate(),
};

export default function MonthlyVoyageStatement() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getMonthlyVoyageStatement(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      _todayDate(),
      setGridData,
      setLoading
    );
  }, [profileData, selectedBusinessUnit]);

  const printRef = useRef();

  let totalQty = 0,
    totalFreight = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <label>Date</label>
                    <FormikInput
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        getMonthlyVoyageStatement(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          e?.target?.value,
                          setGridData,
                          setLoading
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-9 text-right mt-5">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary px-3 py-2 mr-2"
                      table="table-to-xlsx"
                      filename="Monthly Voyage Statement"
                      sheet="Sheet-1"
                      buttonText="Export Excel"
                    />
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2"
                        >
                          <i
                            className="mr-1 fa fa-print pointer"
                            aria-hidden="true"
                          ></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    />
                  </div>
                  {/* <div className="ml-2">
                    
                  </div> */}
                </div>
              </div>
              <div ref={printRef}>
                <div className="text-center" style={{ margin: "15px 0" }}>
                  <h3>Akij Shipping Lines Ltd</h3>
                  <h4>
                    Monthly Voyage Statement Of Big Lighter
                    <br />
                    For the month of{" "}
                    {months[new Date(values?.date).getMonth()] +
                      "-" +
                      new Date(values?.date)?.getFullYear()}
                  </h4>
                </div>
                <ICustomTable id="table-to-xlsx" ths={headers}>
                  <div className="d-none" style={{ textAlign: "center" }}>
                    <h3>Akij Shipping Lines Ltd</h3>
                    <h4>
                      Monthly Voyage Statement Of Big Lighter
                      <br />
                      For the month of{" "}
                      {months[new Date(values?.date).getMonth()] +
                        "-" +
                        new Date(values?.date)?.getFullYear()}
                    </h4>
                  </div>
                  {gridData?.map((item, index) => {
                    totalQty += item?.numActualCargoQnty;
                    totalFreight += item?.numTotalFreight;
                    return (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td>{item?.lighterVesselName}</td>
                        <td>{item?.tripNo}</td>
                        <td>{item?.receiveDate}</td>
                        <td>{item?.dischargeStartDate}</td>
                        <td>{item?.dischargeComplDate}</td>
                        <td className="text-right">
                          {item?.numTotalTripDuration} DAYS
                        </td>
                        <td>{item?.motherVesselName}</td>
                        <td>{item?.voyageNo}</td>
                        <td>{item?.cargoName}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.numActualCargoQnty, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.numFreight, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.numTotalFreight, true, 0)}
                        </td>
                        <td>{item?.dischargePortName}</td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="text-right" colSpan={10}>
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalQty, true, 0)}</b>
                    </td>
                    <td> </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalFreight, true, 0)}</b>
                    </td>
                    <td> </td>
                  </tr>
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
