import React from "react";
import { getLastDateOfMonth } from "./helper";
import { getMonth } from "../../../salesManagement/report/customerSalesTarget/utils";

const PrintView = ({ reportData, values }) => {
  return (
    <>
      <div>
        <div className="table-responsive">
          <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th colspan="6">
                  <h3>
                    Schedule of Closing Stocks as of{" "}
                    {getMonth(values?.monthYear?.split("-")[1])}{" "}
                    {
                      getLastDateOfMonth(
                        values?.monthYear?.split("-")[1]
                      ).split("-")[2]
                    }
                    , {values?.monthYear?.split("-")[0]}
                  </h3>
                </th>
              </tr>
              <tr>
                <th rowspan="2">Where held: Location & Owner of shop/godown</th>
                <th rowspan="2">Description of Goods</th>
                <th colspan="3">Quantity</th>
                <th rowspan="2">Remarks</th>
              </tr>
              <tr>
                <th>(Ton)</th>
                <th>Rate per Ton</th>
                <th>Value (Tk.)</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.length > 0 &&
                reportData.map((item, i) => (
                  <tr>
                    {i === 0 && (
                      <td rowspan={reportData?.length}>ACCL Factory Yard</td>
                    )}
                    <td className="text-center">{item?.strItemName}</td>
                    <td className="text-right pr-2">{item?.numCloseQty}</td>
                    <td className="text-right pr-2">
                      {(item?.numClosingValue || 0) / (item?.numCloseQty || 0)}
                    </td>
                    <td className="text-right pr-2">{item?.numClosingValue}</td>
                    <td></td>
                  </tr>
                ))}
              <tr>
                <td colspan="4">
                  <strong>TOTAL</strong>
                </td>
                <td className="text-right pr-2">
                  <strong>
                    {reportData.reduce(
                      (total, item) => total + (item.numClosingValue || 0),
                      0
                    )}
                  </strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ margin: "10px 40px" }}>
          <h5>
            Accounts Receivable Balance Date{" "}
            {getLastDateOfMonth(values?.monthYear?.split("-")[1])}
          </h5>
          <h6>Amount of tk. 2,591,305,421.00</h6>
          <p>We hereby confirm that:</p>
          <ul style={{ listStyle: "none" }}>
            <li>
              a) All assets have been included in this statement and that the
              description and valuation thereof is correct. The Stock figures do
              not include damaged and/or unsaleable goods.
            </li>
            <li>
              b) All particulars herein included have been taken from my/our
              permanent books.
            </li>
            <li>
              c) The Book Debts mentioned in this statement are recoverable in
              full and any amounts that we consider doubtful have been excluded.
            </li>
            <li>
              d) Raw materials, Stores and finished goods have been valued at
              cost or market rate whichever is lower.
            </li>
            <li>
              e) No Stocks in my/our possession for which payment (either partly
              or wholly) have been received by me/us are included herein.
            </li>
            <li>
              f) All the above mentioned stock etc., are our absolute property
              and at our sole disposal, are free from any prior charge or
              encumbrance and no order of attachment or any notice or process
              from any court has been received by us in respect thereof.
            </li>
            <li>
              g) All Stocks and stores have been fully insured against the risks
              required by the Bank as per list of current insurance policies and
              amounts and risks covered mentioned hereunder.
            </li>
            <li>
              h) All premiums due on the aforementioned insurance have been
              fully and duly paid.
            </li>
            <li>
              i) You may rely on this statement as genuine, authentic and true.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default PrintView;
