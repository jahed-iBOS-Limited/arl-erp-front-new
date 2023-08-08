import React from "react";
import ICustomTable from "../../../chartering/_chartinghelper/_customTable";
import { _fixedPoint } from "../../../_helper/_fixedPoint";

const headers = [
  { name: "SL", style: { minWidth: "30px" } },
  { name: "Mother Vessel" },
  { name: "Open Qty" },
  { name: "In Qty" },
  { name: "Out Qty" },
  { name: "Closing Qty" },
];

export default function MotherVesselInventoryReportTable({ obj }) {
  const { rowData } = obj;

  let totalOpenQty = 0,
    totalInQty = 0,
    totalOutQty = 0,
    totalCloseQty = 0;

  return (
    <div>
      {rowData?.length > 0 && (
        <ICustomTable ths={headers}>
          {rowData?.map((item, i) => {
            totalOpenQty += item?.numOpenQty;
            totalInQty += item?.numInQty;
            totalOutQty += item?.numOutQty;
            totalCloseQty += item?.numCloseQty;
            return (
              <tr key={item?.deliveryCode + i}>
                <td className="text-center">{i + 1}</td>
                <td>{item?.strMVesselName}</td>
                <td className="text-right">
                  {_fixedPoint(item?.numOpenQty, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numInQty, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numOutQty, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(item?.numCloseQty, true)}
                </td>
              </tr>
            );
          })}
          <tr style={{ textAlign: "right", fontWeight: "bold" }}>
            <td colSpan={2} className="text-right">
              <b>Total</b>
            </td>
            <td>{_fixedPoint(totalOpenQty, true)}</td>
            <td>{_fixedPoint(totalInQty, true)}</td>
            <td>{_fixedPoint(totalOutQty, true)}</td>
            <td>{_fixedPoint(totalCloseQty, true)}</td>
          </tr>
        </ICustomTable>
      )}
    </div>
  );
}
