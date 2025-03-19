import React from "react";
import ICustomTable from "../../_chartinghelper/_customTable";
import IDelete from "../../_chartinghelper/icons/_delete";

const headers = [
  { name: "SL" },
  { name: "Vessel Name" },
  { name: "Voyage No" },
  { name: "Reason" },
  { name: "Off Hire Duration" },
  { name: "Duration Percentage" },
  { name: "Final Duration" },
  { name: "Off Hire Cost" },
  { name: "Other Cost" },
  { name: "Total Cost" },
  { name: "Actions" },
];

export default function OffHireEntryFormTable({ obj }) {
  const { rows, remover } = obj;
  return (
    <>
      <ICustomTable ths={headers}>
        {rows?.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{index + 1}</td>
            <td>{item?.vesselName}</td>
            <td>{item?.voyageNumber}</td>
            <td>{item?.offHireReason}</td>
            <td>{item?.offHireDuration}</td>
            <td>{item?.durationPercentage}%</td>
            <td>{item?.offHireFinalDuration}</td>
            <td>{item?.offHireCostAmount}</td>
            <td>{item?.otherCost}</td>
            <td>{+item?.offHireCostAmount + +item?.otherCost}</td>
            <td className="text-center">
              <IDelete id={index} remover={remover} />
            </td>
          </tr>
        ))}
      </ICustomTable>
    </>
  );
}
