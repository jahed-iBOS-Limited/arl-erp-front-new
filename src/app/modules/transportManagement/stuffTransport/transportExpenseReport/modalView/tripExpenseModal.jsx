import React, { useEffect } from "react";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function TripExpenseModal({ item, values }) {
  const { vehicelUserEnroll } = item || {};
  const { fromDate, toDate } = values || {};
  const [tripExpense, getTripExpense, loadingTripExpeseData] = useAxiosGet();
  useEffect(() => {
    getTripExpense(
      `/mes/VehicleLog/GetVehicleUserWiseTripExpense?vehicleUserEnroll=${vehicelUserEnroll}&fromDate=${fromDate}&todate=${toDate}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicelUserEnroll, fromDate, toDate]);
  let grandTotal = 0;
  return (
    <>
      {loadingTripExpeseData && <Loading />}
      <h4 style={{ marginTop: "30px" }} className="text-center">
      Trip Expense Status
      </h4>
      <div className="d-flex justify-content-between mt-5">
        <div>
          <p>
            <strong>
              Vehicle User Name : {tripExpense[0]?.vehicleUserName}
            </strong>
          </p>
          <p>
            <strong>
              Vehicle User Enroll : {tripExpense[0]?.vehicleUserEnroll}
            </strong>
          </p>
          <p>
            <strong className="mr-5">From Date : {values?.fromDate}</strong>
            <strong>To Date : {values?.toDate}</strong>
          </p>
        </div>
        <div>
          
          <p>
            <strong>
              Designation : {tripExpense[0]?.vehicleUserDesignation}
            </strong>
          </p>
          <p>
            <strong>Vehicle No : {tripExpense[0]?.vehicleName}</strong>
          </p>
        </div>
      </div>

      <div className="table-responsive">
        <table id="" className={"table table-bordered mt-4"}>
          <thead>
            <tr>
              <th className="text-center">Sl No</th>
              <th className="text-center">Date</th>
              <th className="text-center">Trip No</th>
              <th className="text-center">Net Amount</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {tripExpense?.length > 0 &&
              tripExpense?.map((item, index) => {
                // totalAmount calculation
                grandTotal += item?.netAmount;
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">
                      {_dateFormatterTwo(item?.tripDate)}
                    </td>
                    <td className="text-center">{item?.tripCode}</td>
                    <td style={{ marginRight: "5px" }} className="text-right">
                      {_formatMoney(item?.netAmount)}
                    </td>
                    <td className="text-center">
                      <strong
                        style={{
                          color:
                            item?.approveStatus === "Approved"
                              ? "green"
                              : item?.approveStatus === "Reject"
                              ? "red"
                              : "black",
                        }}
                      >
                        {item?.approveStatus}
                      </strong>
                    </td>
                  </tr>
                );
              })}
            <tr>
              <td colSpan={3}>Total</td>
              <td style={{ marginRight: "5px" }} className="text-right">
                <strong>{_formatMoney(grandTotal)}</strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
