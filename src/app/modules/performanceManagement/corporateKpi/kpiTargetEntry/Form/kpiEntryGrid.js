/* eslint-disable no-unused-vars */
import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { IInput } from "../../../../_helper/_input";
import ICalendar from "../../../../_helper/_inputCalender";
function KpiEntryGrid({
  strategicParticularsGrid,
  objRowTargetAchivment,
  rowDtoHandler,
  pmsfrequencyId,
}) {
  const key = pmsfrequencyId === 2 ? "monthId" : "quarterId";
  return (
    <div className="row">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Year Name</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          {strategicParticularsGrid &&
            strategicParticularsGrid?.map((itm, idx) => (
              <tr key={idx}>
                <td>{itm.yearName}</td>
                <td>{itm.name}</td>
                <td className="disable-border disabled-feedback">
                  <ICalendar
                    type="date"
                    onChange={(e) => {
                      rowDtoHandler(e.target.name, e.target.value, idx);
                    }}
                    required
                    name="startDate"
                    value={_dateFormatter(
                      objRowTargetAchivment?.[idx]?.startDate
                    )}
                  />
                </td>
                <td className="disable-border disabled-feedback">
                  <ICalendar
                    type="date"
                    name="endDate"
                    required
                    onChange={(e) => {
                      rowDtoHandler(e.target.name, e.target.value, idx);
                    }}
                    value={_dateFormatter(
                      objRowTargetAchivment?.[idx]?.endDate
                    )}
                  />
                </td>
                <td className="text-center">
                  <IInput
                    key={itm.id}
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder={itm.code}
                    name={itm.id || itm.yearId.toString()}
                    onChange={(e) =>
                      rowDtoHandler("target", e.target.value, idx)
                    }
                    value={objRowTargetAchivment?.[idx]?.target}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(KpiEntryGrid);
