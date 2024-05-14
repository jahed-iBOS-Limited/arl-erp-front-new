/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function IndustrialTestingCostLandingTable({ obj }) {
  const { gridData } = obj;

  const tHeads = [
    "SL",
    "Business Partner",
    "From Mother Vessel",
    "To Mother Vessel",
    "Item",
    "Reason",
    "Quantity",
  ];

  return (
    <>
     <div className="table-responsive">
       <table
        id="table-to-xlsx"
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
        }
      >
        <thead>
          <tr className="cursor-pointer">
            {tHeads?.map((th, index) => {
              return <th key={index}> {th} </th>;
            })}
          </tr>
        </thead>
        <tbody>
          {gridData?.data?.map((item, index) => {
            return (
              <tr key={index}>
                <td> {index + 1}</td>
                <td>{item?.businessPartnerName}</td>
                <td>{item?.fromMotherVesselName}</td>
                <td>{item?.toMotherVesselName}</td>
                <td>{item?.itemName}</td>
                <td>{item?.reasons}</td>
                <td className="text-right">
                  {_fixedPoint(item?.transferQuantity, true)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
     </div>
    </>
  );
}
