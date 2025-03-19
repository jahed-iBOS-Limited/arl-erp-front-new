import React from "react";

export function LayTimeTableHeader({ hideDeleteBtn }) {
  return (
    <thead>
      <tr style={{ borderTop: "1px solid #d6d6d6" }}>
        <th rowSpan={2} className="text-middle">
          Date
        </th>
        <th rowSpan={2} className="text-middle">
          Day
        </th>
        <th rowSpan={1} colSpan={2}>
          Working Time
        </th>
        <th rowSpan={2} colSpan={1} className="text-middle">
          Ratio
        </th>
        <th rowSpan={1} colSpan={1}>
          Time Used
        </th>
        <th colSpan={1} rowSpan={1}>
          Total Time
        </th>
        <th colSpan={1} rowSpan={1}>
          Remaining Time
        </th>
        <th colSpan={1} rowSpan={2} className="text-middle">
          Remarks
        </th>
        {!hideDeleteBtn && (
          <th rowSpan={2} colSpan={1} className="text-middle">
            Action
          </th>
        )}
      </tr>
      <tr>
        <th rowSpan={1} colSpan={1}>
          From
        </th>
        <th rowSpan={1} colSpan={1}>
          To
        </th>

        <th rowSpan={1} colSpan={1}>
          DD:HH:MM
        </th>
        <th rowSpan={1} colSpan={1}>
          DD:HH:MM
        </th>
        <th rowSpan={1} colSpan={1}>
          DD:HH:MM
        </th>
      </tr>
    </thead>
  );
}
