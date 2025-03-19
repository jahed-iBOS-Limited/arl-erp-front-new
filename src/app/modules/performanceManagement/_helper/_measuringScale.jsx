/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

export default function MeasuringScale({
  measureByEmployee,
  measureBySupervisor,
  measureScale,
}) {
  return (
    <div style={{width: "45%"}}>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {measureScale?.map((itm, index) => {
              return <th key={index}> {itm?.measuringScaleName} </th>;
            })}
          </tr>
        </thead>

        <tbody>
          <tr className="text-center">
            {measureScale?.map((itm, index) => {
              return <td key={index}> {itm?.measuringScaleValue} </td>;
            })}
          </tr>
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <p>
          Measure By Employee
          <b>{measureByEmployee}</b>
        </p>
        <p>
          Measure By Supervisor
          <b>{measureBySupervisor}</b>
        </p>
      </div>
    </div>
  );
}
