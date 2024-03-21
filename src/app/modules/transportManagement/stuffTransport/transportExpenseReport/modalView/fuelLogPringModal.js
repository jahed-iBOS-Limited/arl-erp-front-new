import React, { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getFormattedMonthYear } from "../helper";

export default function FuelLogPringModal({ item, values }) {
  const [printData, getPrintData, loading] = useAxiosGet();
  const printRef = useRef();

  useEffect(() => {
    getPrintData(
      `/mes/VehicleLog/GetFuelCostMonthRangeByEmployee?vehicelUserEnroll=${item?.vehicelUserEnroll}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, values]);


  let grandTotalKM = 0;
  let grandFuelCash = 0;
  let grandDaAmount = 0;
  let grandFuelCredit = 0;
  let grandOtherExpanse = 0;
  let grandTollAmount = 0;
  let grandKMPL = 0;
  let grandTotalPersonalCostDeduction = 0;
  let grandTotalNetPayable = 0
  return (
    <>
      {loading && <Loading />}
      <div className="text-right mt-5 mb-5">
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
          <h2>{item?.strBusinessUnit}</h2>
          {/* <h6>6/2 Kazi Nazrul Islam Road, Dhaka- 1207</h6> */}
          <h4>Fuel Log</h4>
        </div>
        <div style={{marginRight:"15px"}} className="d-flex justify-content-between mt-5">
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
              <strong>SBU Name : {item?.strBusinessUnit}</strong>
            </p>
            <p>
              <strong>Vehicle Reg. No : {item?.strVehicleNo}</strong>
            </p>
          </div>
        </div>
        <div>
          <table id="" className={"table table-striped table-bordered global-table"}>
            <thead>
              <tr style={{height:"50px"}} className="cursor-pointer">
                <th style={{fontSize:"12px"}}>SL</th>
                <th style={{minWidth:"120px",fontSize:"12px"}}> Month </th>
                <th style={{fontSize:"12px"}}> Total KM </th>
                <th style={{fontSize:"12px"}}> Fuel Cash (Tk) </th>
                <th style={{fontSize:"12px"}}> Fuel Credit (Tk)</th>
                <th style={{fontSize:"12px"}}> Toll Cost (Tk) </th>
                <th style={{fontSize:"12px"}}>DA Amount (Tk)</th>
                <th style={{fontSize:"12px"}}> Others Amount (Tk) </th>
                <th style={{fontSize:"12px"}}> Personal Cost Deduct (Tk) </th>
                <th style={{fontSize:"12px"}}> Total Payable Amount (Tk) </th>
                <th style={{fontSize:"12px"}}> KMPL </th>
              </tr>
            </thead>
            <tbody>
              {printData?.map((item, index) => {
                //row calculation
                const totalPersonalKM =
                  item?.personalKM
                const totalFuelCost = item?.fuelCash + item?.fuelCredit;
                const totalRouteCost = totalFuelCost + item?.numTollAmount;
                const totalCost = totalRouteCost + item?.otherExpanse + item?.daAmount;
                const perKMCost = totalRouteCost / (item?.totalKM || 1);
                const personalCostDeduction =  ( (totalPersonalKM - item?.numCeilingKM>0 && totalPersonalKM - item?.numCeilingKM) || 0) * (perKMCost || 0);
                const netPayable =
                  totalCost - item?.fuelCredit - personalCostDeduction;

                //total calculation
                grandTotalKM += item?.totalKM || 0;
                grandFuelCash += item?.fuelCash || 0;
                grandDaAmount += item?.daAmount || 0;
                grandFuelCredit += item?.fuelCredit || 0;
                grandOtherExpanse += item?.otherExpanse || 0;
                grandTollAmount += item?.numTollAmount || 0;
                grandKMPL +=
                (item?.fuelCash + item?.fuelCredit + item?.numTollAmount) / item?.totalKM;
                grandTotalPersonalCostDeduction += personalCostDeduction
                grandTotalNetPayable += netPayable;

                return (
                  <>
                    <tr style={{height:"30px"}} key={index}>
                      <td style={{ width: "20px",fontSize:"14px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td style={{fontSize:"14px"}} className="text-center">
                        {getFormattedMonthYear(item?.monthId, item?.yearId)}
                      </td>
                      <td style={{fontSize:"14px"}} className="text-right fs-14"> {item?.totalKM} </td>
                      <td style={{fontSize:"14px"}} className="text-right"> {item?.fuelCash} </td>
                      <td style={{ textAlign: "right",fontSize:"14px"}}>
                        {_formatMoney(item?.fuelCredit)}
                      </td>
                      <td style={{ textAlign: "right",fontSize:"14px" }}>
                        {" "}
                        {_formatMoney(item?.numTollAmount)}
                      </td>
                      <td style={{ textAlign: "right",fontSize:"14px" }}>
                        {" "}
                        {_formatMoney(item?.daAmount)}
                      </td>
                      <td style={{ textAlign: "right",fontSize:"14px" }}>
                        {" "}
                        {_formatMoney(item?.otherExpanse)}
                      </td>
                      <td style={{ textAlign: "right",fontSize:"14px" }}>
                        {" "}
                        {_formatMoney(personalCostDeduction)}
                      </td>
                      <td style={{ textAlign: "right",fontSize:"14px" }}>
                        {" "}
                        {_formatMoney(
                          netPayable
                        )}
                      </td>
                      <td style={{ textAlign: "right",fontSize:"14px" }}>
                        {" "}
                        {_formatMoney(
                          (item?.fuelCash + item?.fuelCredit + item?.numTollAmount) / item?.totalKM
                        )}
                      </td>
                    </tr>
                  </>
                );
              })}
              <tr style={{height:"30px"}}>
                <td style={{fontSize:"14px"}} colSpan={2} className="text-center">
                  <strong> Total</strong>
                </td>
                <td style={{ textAlign: "right",  fontWeight: "bold",fontSize:"14px" }}> {grandTotalKM} </td>
                <td style={{ textAlign: "right",  fontWeight: "bold" ,fontSize:"14px"}}> {grandFuelCash} </td>
                <td style={{ textAlign: "right",  fontWeight: "bold",fontSize:"14px" }}>
                  {_formatMoney(grandFuelCredit)}
                </td>
                <td style={{ textAlign: "right",  fontWeight: "bold" ,fontSize:"14px"}}>
                  {" "}
                  {_formatMoney(grandTollAmount)}
                </td>
                <td style={{ textAlign: "right",  fontWeight: "bold" ,fontSize:"14px"}}>
                  {" "}
                  {_formatMoney(grandDaAmount)}
                </td>
                <td style={{ textAlign: "right",  fontWeight: "bold",fontSize:"14px" }}>
                  {" "}
                  {_formatMoney(grandOtherExpanse)}
                </td>
                <td style={{ textAlign: "right",  fontWeight: "bold",fontSize:"14px" }}>
                  {" "}
                  {_formatMoney(grandTotalPersonalCostDeduction)}
                </td>
                <td style={{ textAlign: "right",  fontWeight: "bold" ,fontSize:"14px"}}>
                  {" "}
                  {_formatMoney(grandTotalNetPayable)}
                </td>
                <td style={{ textAlign: "right",  fontWeight: "bold" ,fontSize:"14px"}}>
                  {" "}
                  {_formatMoney(grandKMPL /printData?.length)}
                </td>
              </tr>
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
