/* eslint-disable react-hooks/exhaustive-deps */

import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import TextArea from "../../../../_helper/TextArea";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import Loading from "../../../_chartinghelper/loading/_loading";
import { CreateJournalVoucher, getLineExpense } from "../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";

const headers = [
  { name: "SL" },
  { name: "Date" },
  { name: "Lighter Name" },
  { name: "JV Code" },
  { name: "Trip No" },
  { name: "Amount" },
  { name: "Signature" },
  { name: "Remarks" },
];

const validationSchema = Yup.object().shape({
  narration: Yup.string().required("Narration is required"),
});

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  date: _todayDate(),
  narration: "",
};

export default function LineExpenseReport() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalJVAmount, setTotalJVAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState();

  const printRef = useRef();

  const {
    profileData,
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getGridData = (values) => {
    getLineExpense(
      buId,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading,
      setTotalJVAmount,
      setGrandTotal
    );
  };

  useEffect(() => {
    getGridData(initData);
  }, [profileData, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          CreateJournalVoucher(
            "lineExp",
            profileData?.accountId,
            buId,
            new Date(values?.date).getMonth(),
            new Date(values?.date).getFullYear(),
            values?.narration,
            profileData?.userId,
            setLoading,
            () => resetForm(initData),
            values
          );
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: (allValues) => {
                        getGridData(allValues);
                      },
                    }}
                  />
                  <div className="col-lg-10">
                    <label>Narration</label>
                    <TextArea
                      value={values?.narration}
                      name="narration"
                      placeholder="Narration"
                      rows="3"
                      onChange={(e) =>
                        setFieldValue("narration", e.target.value)
                      }
                      max={1000}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mt-5">
                    <button
                      className="btn btn-primary px-3 py-2"
                      type="button"
                      onClick={handleSubmit}
                      disabled={totalJVAmount < 1 || !values?.fromDate || !values?.toDate}
                    >
                      JV Create
                    </button>
                    <p className="mt-3">
                      <b>Total JV Amount: {_formatMoney(totalJVAmount)} </b>
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <label>Journal Date</label>
                    <FormikInput
                      value={values?.date}
                      name="date"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
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
                      filename="Line Expense"
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
                </div>
              </div>
              <div ref={printRef}>
                <div className="text-center" style={{ margin: "15px 0" }}>
                  <h4>Akij Shipping Line Ltd</h4>
                  <p>198,Gulshan Link Road, Tejgaon-1208</p>
                </div>
                <div
                  className="d-flex justify-content-between"
                  style={{ margin: "10px 0" }}
                >
                  <p>Sub: Lighters Staffs Line Expense</p>
                  <p> Date: {_todayDate()} </p>
                </div>
                <ICustomTable id="table-to-xlsx" ths={headers}>
                  <div className="d-none">
                    <div style={{ textAlign: "center" }}>
                      <h4>Akij Shipping Line Ltd</h4>
                      <p>198,Gulshan Link Road, Tejgaon-1208</p>
                    </div>

                    <p>Sub: Lighters Staffs Line Expense</p>
                    <p> Date: {_todayDate()} </p>
                  </div>
                  {gridData?.map((element, i) => {
                    return element?.map((item, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td
                              className="text-center"
                              style={{ width: "40px" }}
                            >
                              {index + 1}
                            </td>
                            <td
                              style={{ width: "180px" }}
                              className="text-center"
                            >{`${moment(item?.startDate).format(
                              "YYYY-MM-DD "
                            )}To${moment(item?.endDate).format(
                              " YYYY-MM-DD"
                            )}`}</td>
                            <td>{item?.lighterVesselName}</td>
                            <td className="text-center">
                              {item?.lineExpJVCode}
                            </td>
                            <td className="text-center">{item?.tripNo}</td>
                            <td className="text-right">
                              {_formatMoney(item?.costAmount, 0)}
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                          {element?.length - 1 === index && (
                            <tr
                              style={{
                                fontWeight: "bold",
                                // background: "#eff6ff",
                              }}
                            >
                              <td colSpan={5} className="text-right">
                                Total
                              </td>
                              <td className="text-right">
                                {" "}
                                {_formatMoney(
                                  element?.reduce((a, b) => {
                                    return a + b.costAmount;
                                  }, 0),
                                  0
                                )}{" "}
                              </td>
                              <td colSpan={2}></td>
                            </tr>
                          )}
                        </>
                      );
                    });
                  })}

                  {gridData?.length > 0 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td className="text-right" colSpan="5">
                        Grand Total
                      </td>
                      <td className="text-right" colSpan="1">
                        {_formatMoney(grandTotal || 0, 0)}
                      </td>
                      <td colSpan="2"></td>
                    </tr>
                  )}
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
