/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useRef, useState } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getCostSheetRevisedLanding } from "../helper";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function CostSheetRevisedLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [obj, setObj] = useState({});
  const printRef = useRef();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  //get number in date
  const getDateNumber = (date) => {
    const d = new Date(date);
    const dateNumber = d.getDate();
    if (dateNumber < 9) {
      return ` 0${dateNumber}`;
    } else {
      return ` ${dateNumber}`;
    }
  };

  //get month short name
  const getMonthShortName = (date) => {
    const d = new Date(date);
    return ` ${monthNames[d.getMonth()]} `;
  };

  //print function
  const printDocument = () => {
    const input = printRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [600, 400],
      });
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save("Up4-receipt.pdf");
    });
  };

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  console.log("dkkd", obj);
  return (
    <>
      {loading && <Loading />}
      <ICustomCard title="Statement Of Cost Sheet">
        {gridData?.length > 0 && <div className="d-flex justify-content-end mt-1 mb-1">
          <button type="button" className="btn btn-primary">
            <ReactToPrint
              trigger={() => (
                <i style={{ fontSize: "18px" }} className="fas fa-print"></i>
              )}
              content={() => printRef.current}
            />
          </button>
          <div className="mx-2">
            <ReactHtmlTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button btn btn-primary"
              table="table-to-xlsx"
              filename="statementOfCostSheet"
              sheet="statementOfCostSheet"
              buttonText="Export Excel"
            />
          </div>
        </div>}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
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
                    />
                  </div>

                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getCostSheetRevisedLanding(
                          selectedBusinessUnit.value,
                          values?.fromDate,
                          values?.toDate,
                          setGridData,
                          setLoading
                        );
                        setObj({
                          fromDate: values?.fromDate,
                          toDate: values?.toDate,
                        });
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>

                {gridData?.length > 0 && (
                  <div ref={printRef} >
                    <div className="text-center">
                      <h2>{selectedBusinessUnit.label}</h2>
                      <h5>Statement Of Cost Sheet</h5>
                      <h5>
                        For The Period Of
                        {getMonthShortName(obj.fromDate)}
                        {getDateNumber(obj?.fromDate)} to
                        {getMonthShortName(obj.toDate)}
                        {getDateNumber(obj?.toDate)}
                      </h5>
                    </div>
                    <div className="table-responsive">
<table className="table table-striped table-bordered bj-table bj-table-landing"  id="table-to-xlsx">
                      <thead>
                        <tr>
                          <th>Particulars</th>
                          <th>UOM</th>
                          <th>Quantity</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr
                            key={index}
                            style={
                              item?.isBold
                                ? {
                                    background: "#D6DADD",
                                    fontWeight: "bolder",
                                  }
                                : { background: "white" }
                            }
                          >
                            <td>
                              <div className="text-left">
                                {item?.strParticulars}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.strUoM}
                              </div>
                            </td>
                            <td>
                              <div className="text-right">
                                {item?.numQty}
                              </div>
                            </td>
                            <td>
                              <div className="text-right">
                              {_formatMoney(item?.numAmount,0)}     
                              </div>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td>Total</td>
                          <td></td>
                          <td>
                          <div className="text-right">
                              {gridData?.reduce((acc, curr) => acc + curr?.numQty, 0)}     
                            </div>
                          </td>
                          <td>
                            <div className="text-right">
                              {_formatMoney(gridData?.reduce((acc, curr) => acc + curr?.numAmount, 0),2)}     
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
          </div>
                    
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default CostSheetRevisedLanding;
