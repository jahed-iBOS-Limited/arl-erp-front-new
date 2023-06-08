import React, { useMemo } from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const ReconcileTable = ({ reconcileDto }) => {
  const headers = ["Code", "GL Name", "Sub GL Name", "Amount"];

  const totalAmount = useMemo(() => reconcileDto.reduce((acc, item) => acc + (item?.numAmount || 0), 0), [reconcileDto]);

  return (
    <div>
      <ICustomTable ths={headers}>
        {reconcileDto?.length
          ? reconcileDto?.map((item, index) => (
              <tr key={index}>
                {/* <td className="text-center">{index + 1}</td> */}
                <td>{item?.strAccountingJournalCode}</td>
                <td>{item?.strGeneralLedgerName}</td>
                <td>{item?.strSubGLName}</td>
                <td className="text-right">{_formatMoney(item?.numAmount)}</td>
              </tr>
            ))
          : null}

        {reconcileDto?.length ? (
          <tr>
            <td></td>
            <td></td>
            <td style={{ textAlign: "right" }}>
              <strong>Total</strong>
            </td>
            <td className="text-right font-weight-bold">{_formatMoney(totalAmount)}</td>
          </tr>
        ) : null}
      </ICustomTable>
    </div>
  );
};

export default ReconcileTable;
