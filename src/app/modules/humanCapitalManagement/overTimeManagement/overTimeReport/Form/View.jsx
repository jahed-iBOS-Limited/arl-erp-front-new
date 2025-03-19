/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import { getOverTimeDetailsById } from "../helper";

const ViewModal = ({ currentItem, values }) => {
  const { intEmployeeId } = currentItem;
  const { fromDate, toDate, workPlace } = values;

  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    getOverTimeDetailsById(
      intEmployeeId,
      selectedBusinessUnit?.value,
      workPlace?.value,
      fromDate,
      toDate,
      setData,
      setLoading,
      values?.applicationType?.value,
      values?.viewAs?.value
    );
  }, [currentItem]);

  const totalAmount = useCallback(
    data?.reduce((acc, item) => +acc + +item?.numTotalAmount, 0),
    [data]
  );

  const numHours = useCallback(
    data?.reduce((acc, item) => +acc + +item?.numHours, 0),
    [data]
  );

  return (
    <div>
      {data?.length > 0 && (
        <>
          <div className="mt-4 d-flex justify-content-end">
            <ReactHTMLTableToExcel
              id="test-table-xls-button-att-reports"
              className="btn btn-primary m-0 mx-2 py-2 px-2"
              table="table-to-xlsx"
              filename="Overtime Report"
              sheet="Overtime Report"
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
      <div style={{ marginTop: "10px" }} ref={printRef}>
        <h3 className="overTime-title text-center">Overtime Report</h3>
        <div className="d-flex justify-content-between">
          <div>
            <p className="p-0 m-0">
              <b>Enroll : {intEmployeeId}</b>
            </p>
            <p className="p-0 m-0">
              <b>Name : {data?.[0]?.strEmployeeFullName}</b>
            </p>
          </div>
          <div>
            <p className="p-0 m-0">
              <b>Designation : {data?.[0]?.strDesignationName}</b>
            </p>
            <p className="p-0 m-0">
              <b>Department : {data?.[0]?.strDepartmentName}</b>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className="d-flex justify-content-around">
              <b>From Date : {_dateFormatter(data?.[0]?.dteDate)}</b>
              <b>
                To Date : {_dateFormatter(data?.[data?.length - 1]?.dteDate)}
              </b>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>

        <table
          id="table-to-xlsx"
          className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1"
        >
          <thead>
            <tr>
              <th>SL</th>
              <th style={{ width: "75px" }}>Date</th>
              <th style={{ width: "75px" }}>Start Time</th>
              <th style={{ width: "75px" }}>End Time</th>
              <th style={{ width: "85px" }}>Gross Amount</th>
              <th style={{ width: "85px" }}>Basic Salary</th>
              <th style={{ width: "55px" }}>Hours</th>
              <th style={{ width: "55px" }}>Rate</th>
              <th style={{ width: "85px" }}>Amount</th>
              <th style={{ width: "145px" }}>Purpose</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td className="text-center">{_dateFormatter(item?.dteDate)}</td>
                <td className="text-center">
                  {_timeFormatter(item?.tmStartTime)}
                </td>
                <td className="text-center">
                  {_timeFormatter(item?.tmEndTime)}
                </td>
                <td className="text-center">{item?.numGrossAmount}</td>
                <td className="text-center">{item?.numBasicSalary}</td>
                <td className="text-center">{item?.numHours}</td>
                <td className="text-center">{item?.numPerHourRate}</td>
                <td className="text-center">{item?.numTotalAmount}</td>
                <td className="text-center">{item?.strPurpose}</td>
                <td className="text-center">{item?.strRemarks}</td>
              </tr>
            ))}
            <tr>
              <td colspan="6">
                <div style={{ textAlign: "left" }}>Total :</div>
              </td>
              <td className="text-center">{numHours}</td>
              <td></td>
              <td className="text-center">{(totalAmount || 0).toFixed(2)}</td>
              <td colspan="2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewModal;
