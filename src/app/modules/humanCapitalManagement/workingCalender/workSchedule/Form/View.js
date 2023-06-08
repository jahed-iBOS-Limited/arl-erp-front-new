/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { getWorkScheduleReport } from "../helper";

const ViewModal = ({ currentItem, values }) => {
  const { intEmployeeId } = currentItem;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    getWorkScheduleReport(
      values?.businessUnit?.value,
      values?.workPlace?.value,
      setLoading,
      setData,
      intEmployeeId
    );
  }, [currentItem]);

  return (
    <div>
      {data?.length > 0 && (
        <>
          <div className="mt-4 d-flex justify-content-end">
            <ReactHTMLTableToExcel
              id="test-table-xls-button-att-reports"
              className="btn btn-primary m-0 mx-2 py-2 px-2"
              table="table-to-xlsx"
              filename="Work Schedule Report"
              sheet="Work Schedule Report"
              buttonText="Export Excel"
            />
            <button type="button" className="btn btn-primary p-0 m-0 py-2 px-2">
              <ReactToPrint
                pageStyle={
                  "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                }
                trigger={() => (
                  <i style={{ fontSize: "18px" }} className="fas fa-print"></i>
                )}
                content={() => printRef.current}
              />
            </button>
          </div>
        </>
      )}
      {loading && <Loading />}
      <div style={{ margin: "0 150px" }} ref={printRef}>
        <h3 className="d-none-print text-center">Work Schedule Report</h3>
        <table
          id="table-to-xlsx"
          className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1"
        >
          <thead>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th className="text-center" style={{ width: "100px"}}>Date</th>
              <th>Calender</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td className="text-center">{_dateFormatter(item?.dteDate)}</td>
                <td>{item?.strCalenderName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewModal;
