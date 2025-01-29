import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import ICustomTable from "../../../../chartering/_chartinghelper/_customTable";
import "./style.css";

const headers = [
  { name: "SL" },
  { name: "Unit Name" },
  { name: "Application Amount" },
  { name: "Approved by Supervisor" },
  { name: "Approved by Line Manager" },
  { name: "Approved by HR" },
];

function PrintableTable({ gridData, printRef }) {
  let totalApprovedBySupervisor = 0,
    totalApprovedByHR = 0,
    totalApprovedByLineManager = 0,
    totalApplicationAmount = 0;

  return (
    <>
      <div ref={printRef} className="print-content">
        <div className="text-center">
          <h3>Expense top sheet report (HR)</h3>
        </div>
        <ICustomTable ths={headers}>
          {gridData?.map((item, index) => {
            totalApplicationAmount += item?.numApplicantAmount || 0;
            totalApprovedByHR += item?.numApprvByHR || 0;
            totalApprovedByLineManager += item?.numLinemangerAprv || 0;
            totalApprovedBySupervisor += item?.numApprvBySuppervisor || 0;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.strUnit}</td>
                <td className="text-right">
                  {_fixedPoint(item?.numApplicantAmount, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numApprvBySuppervisor, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numLinemangerAprv, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numApprvByHR, true, 0)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={2} className="text-right">
              <b>Total</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(totalApplicationAmount, true, 0)}</b>
            </td>

            <td className="text-right">
              <b>{_fixedPoint(totalApprovedBySupervisor, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(totalApprovedByLineManager, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(totalApprovedByHR, true, 0)}</b>
            </td>
          </tr>
        </ICustomTable>
      </div>
    </>
  );
}

export default PrintableTable;
