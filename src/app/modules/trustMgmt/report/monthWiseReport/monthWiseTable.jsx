import React from "react";
import { _formatMoney } from "../../../_helper/_formatMoney";

const MonthWiseTable = ({ rowDto }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <h6 style={{ marginBottom: 0, paddingTop: "30px" }}>
            Month Wise Donation Summery:
          </h6>
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th rowSpan={2}>Month & Year</th>
                  <th colSpan={2}>Zakat</th>
                  <th colSpan={2}>Donation</th>
                  <th rowSpan={2}>Total Amount</th>
                </tr>
                <tr>
                  <th>Cash Pay</th>
                  <th>Bank Pay</th>
                  <th>Cash Pay</th>
                  <th>Bank Pay</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.length > 0 &&
                  rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td
                        className={
                          index === rowDto.length - 1 ? "font-weight-bold" : ""
                        }
                      >
                        {item?.strMonthYear}
                      </td>
                      <td
                        className={`text-right ${
                          index === rowDto.length - 1 ? "font-weight-bold" : ""
                        }`}
                      >
                        {_formatMoney(item?.monJakatCash || 0)}
                      </td>
                      <td
                        className={`text-right ${
                          index === rowDto.length - 1 ? "font-weight-bold" : ""
                        }`}
                      >
                        {_formatMoney(item?.monJakatOnline || 0)}
                      </td>
                      <td
                        className={`text-right ${
                          index === rowDto.length - 1 ? "font-weight-bold" : ""
                        }`}
                      >
                        {_formatMoney(item?.monDonationCash || 0)}
                      </td>
                      <td
                        className={`text-right ${
                          index === rowDto.length - 1 ? "font-weight-bold" : ""
                        }`}
                      >
                        {_formatMoney(item?.monDonationOnline || 0)}
                      </td>
                      <td
                        className={`text-right ${
                          index === rowDto.length - 1 ? "font-weight-bold" : ""
                        }`}
                      >
                        {_formatMoney(item?.monTotal || 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonthWiseTable;
