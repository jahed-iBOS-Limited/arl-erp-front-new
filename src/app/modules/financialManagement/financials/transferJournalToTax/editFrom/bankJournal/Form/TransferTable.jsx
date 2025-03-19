import React from "react";

const TransferTable = ({ jorunalType, values }) => {
  return (
    jorunalType === 6 && (
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
                {values?.bankAcc?.generalLedgerName &&
                  values?.bankAcc?.label && (
                    <div className="text-left pl-2">
                      {`${values?.bankAcc?.generalLedgerName} (${values?.bankAcc?.label})`}
                    </div>
                  )}
              </td>
              <td></td>
              <td>
                <div className="text-right pr-2">{values?.transferAmount}</div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <div className="pl-2">{values?.sendToGLBank?.label}</div>
              </td>
              <td>
                <div className="text-right pr-2">{values?.transferAmount}</div>
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
