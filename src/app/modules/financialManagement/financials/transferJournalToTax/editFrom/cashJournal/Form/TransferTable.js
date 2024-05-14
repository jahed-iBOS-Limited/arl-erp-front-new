import React from "react";

const TransferTable = ({ jorunalType, values }) => {
  console.log("jorunalType" , jorunalType)
  return (
    jorunalType === 3 && (
      <>
        <div className="table-responsive">
        <table className={"table mt-1 bj-table"}>
          <thead>
            <tr>
              <th style={{ width: "20px" }}>SL</th>
              <th style={{ width: "260px" }}>Transaction</th>
              <th style={{ width: "100px" }}>Debit</th>
              <th style={{ width: "100px" }}>Credit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <div className="pl-2">
                  {values?.cashGLPlus?.label}
                </div>
              </td>
              <td></td>
              <td>
                <div className="text-right pr-2">{values?.amount}</div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <div className="pl-2">
                  {values?.gLBankAc?.label}
                </div>
              </td>
              <td>
                <div className="text-right pr-2">{values?.amount}</div>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      </>
    )
  );
};

export default TransferTable;
