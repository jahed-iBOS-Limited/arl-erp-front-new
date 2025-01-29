import React from "react";
import { useParams } from "react-router-dom";
import ICalendar from "../../../_helper/_inputCalender";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

function KpiEntryGrid({
  strategicParticularsGrid,
  kpiTargetEntry,
  rowDtoHandler,
  pmsfrequencyId,
  frequencyName,
  allValue,
}) {
  const params = useParams();
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
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {strategicParticularsGrid &&
            strategicParticularsGrid?.map((itm, idx) => (
              <tr key={idx}>
                <td>{itm.yearName}</td>
                <td>{itm.name || itm.frequencyName}</td>
                <td className="disable-border disabled-feedback">
                  <ICalendar
                    type="date"
                    onChange={(e) => {
                      rowDtoHandler(e.target.name, e.target.value, idx);
                    }}
                    name="startDate"
                    value={_dateFormatter(
                      kpiTargetEntry[idx]?.startDate || itm?.startDate
                    )}
                  />
                </td>
                <td className="disable-border disabled-feedback">
                  <ICalendar
                    type="date"
                    name="endDate"
                    onChange={(e) => {
                      rowDtoHandler(e.target.name, e.target.value, idx);
                    }}
                    value={_dateFormatter(
                      kpiTargetEntry[idx]?.endDate || itm?.endDate
                    )}
                  />
                </td>
                <td className="text-center">
                  <input
                    value={
                      params?.strId
                        ? kpiTargetEntry?.[idx]?.target
                        : kpiTargetEntry?.[idx]?.target
                    }
                    onChange={(e) =>
                      rowDtoHandler("target", e.target.value, idx)
                    }
                    step="any"
                    key={itm.id}
                    type="number"
                    min="0"
                    placeholder={itm.code}
                    name={itm.id || itm.yearId.toString()}
                  />
                </td>
                <td className="text-center">
                  <input
                    style={{ border: "1px solid gray" }}
                    value={kpiTargetEntry?.[idx]?.remarks}
                    onChange={(e) =>
                      rowDtoHandler("remarks", e.target.value, idx)
                    }
                    type="text"
                    placeholder="remarks"
                    name="remarks"
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
