import React, { useEffect, useRef } from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import ReactToPrint from "react-to-print";
import { getFormattedMonthYear } from "../helper";

export default function FuelLogPringModal({ vehicelUserEnroll, values }) {
  const [printData, getPrintData, loading] = useAxiosGet();
  const printRef = useRef();

  useEffect(() => {
    getPrintData(
      `/mes/VehicleLog/GetFuelCostMonthRangeByEmployee?vehicelUserEnroll=${vehicelUserEnroll}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicelUserEnroll, values]);
  return (
    <>
      {loading && <Loading />}
      <div className="text-right">
        {" "}
        <ReactToPrint
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
          }
          trigger={() => (
            <button type="button" className="btn btn-primary px-3 py-2">
              <i className="mr-1 fa fa-print pointer" aria-hidden="true"></i>
              Print
            </button>
          )}
          content={() => printRef.current}
        />
      </div>
      <div ref={printRef}>
        <div className="text-center">
          <h2>iBOS Software Ltd.</h2>
          <h6>6/2 Kazi Nazrul Islam Road, Dhaka- 1207</h6>
          <h4>Fuel Log</h4>
        </div>
        <div className="d-flex justify-content-between mt-5">
          <div>
            <p>
              <strong>Enroll : {printData[0]?.vehicelUserEnroll}</strong>
            </p>
            <p>
              <strong>Employee Name : {printData[0]?.strEmployeeName}</strong>
            </p>
            <p>
              <strong>Designation : {printData[0]?.strDesignation}</strong>
            </p>
            <p>
              <strong className="mr-5">From Date : {values?.fromDate}</strong>
              <strong>To Date : {values?.toDate}</strong>
            </p>
          </div>
          <div>
            <p>
              <strong>SBU Name :</strong>
            </p>
            <p>
              <strong>Vehicle Reg. No :</strong>
            </p>
          </div>
        </div>
        <div>
          <table
            id=""
            className={
              "table table-striped table-bordered global-table table-font-size-sm"
            }
          >
            <thead>
              <tr className="cursor-pointer">
                <th>SL</th>
                <th> Month </th>
                <th> Total KM </th>
                <th> Fuel Cash (Tk) </th>
                <th> Fuel Credit (Tk)</th>
                <th> Toll Cost (Tk) </th>
                <th>DA Amount (Tk)</th>
                <th> Others Amount (Tk) </th>
                <th> Total Amount (Tk) </th>
                <th> KMPL </th>
              </tr>
            </thead>
            <tbody>
              {[printData]?.map((item, index) => {
                //row calculation

                return (
                  <tr key={index}>
                    <td style={{ width: "20px" }} className="text-center">
                      {index + 1}
                    </td>
                    <td style={{ width: "180px" }}>
                      {getFormattedMonthYear(item?.monthId, item?.yearId)}
                    </td>
                    <td> {item?.totalKM} </td>
                    <td className="text-center"> {item?.fuelCash} </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(item?.fuelCredit)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(item?.numTollAmount)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(item?.daAmount)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(item?.otherExpanse)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(item?.totalKM)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(item?.totalKM)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          style={{ marginTop: "100px" }}
          className="d-flex justify-content-between"
        >
          <p>
            <strong className="border-top border-dark">Create By</strong>
          </p>
          <p>
            <strong className="border-top border-dark">Check By</strong>
          </p>
          <p>
            <strong className="border-top border-dark">Approve By</strong>
          </p>
        </div>
      </div>
    </>
  );
}
