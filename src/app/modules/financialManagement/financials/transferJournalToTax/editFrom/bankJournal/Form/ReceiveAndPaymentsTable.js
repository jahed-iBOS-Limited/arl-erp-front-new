import React from "react";
import IDelete from "../../../../../../_helper/_helperIcons/_delete";

const ReceiveAndPaymentsTable = ({
  jorunalType,
  rowDto,
  values,
  netAmount,
  remover,
  rowDtoHandler,
  isEdit
}) => {
  return (
    <div className="table-responsive">
      <table className={jorunalType === 6 ? "d-none" : "table mt-1 bj-table"}>
      <thead className={rowDto?.length < 1 && "d-none"}>
        <tr>
          <th style={{ width: "20px" }}>SL</th>
          <th style={{ width: "160px" }}>General Ledger</th>
          <th style={{ width: "160px" }}>Transaction</th>
          <th style={{ width: "100px" }}>Debit</th>
          <th style={{ width: "100px" }}>Credit</th>
          {/* <th>Narration</th> */}
          <th style={{ width: "50px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.length > 0 && (
          <tr>
            <td>#</td>
            <td>
              <div className="text-left pl-2">
                {values?.bankAcc?.generalLedgerName}
              </div>
            </td>
            <td>
              <div className="text-left pl-2">{values?.bankAcc?.label}</div>
            </td>
            <td>
              {jorunalType === 4 && (
                <div className="text-right pr-2">{netAmount}</div>
              )}
            </td>
            <td>
              {jorunalType !== 4 && (
                <div className="text-right pr-2">{netAmount}</div>
              )}
            </td>
            {/* <td>
              <div className="pl-2">
                {values?.headerNarration || rowDto?.[0]?.narration || "N/A"}
              </div>
            </td> */}
            <td className="text-center">N/A</td>
          </tr>
        )}
        {rowDto?.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <div className="text-left pl-2">{item?.gl?.label}</div>
            </td>
            <td>
              <div className="text-left pl-2">{item?.subGLName || item?.transaction?.label}</div>
            </td>
            <td>
              {jorunalType !== 4 && (
                <div className="text-right px-2">
                  <input
                    value={item.amount}
                    onChange={(e) =>
                      rowDtoHandler(index, "amount", e.target.value)
                    }
                  />
                </div>
              )}
            </td>
            <td>
              {jorunalType === 4 && (
                <div className="text-right px-2">
                  <input
                    value={item.amount}
                    onChange={(e) =>
                      rowDtoHandler(index, "amount", e.target.value)
                    }
                  />
                </div>
              )}
            </td>
            {/* <td>
              <div className="text-left pl-2">{item?.narration}</div>
            </td> */}
            <td className="text-center">
              <IDelete remover={remover} id={index} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default ReceiveAndPaymentsTable;
