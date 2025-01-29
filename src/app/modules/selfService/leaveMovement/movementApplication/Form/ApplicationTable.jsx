import React, { useEffect, useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import {
  leaveAppLandingPagintaion_api,
  OfficialMoveLandingPagination_api,
} from "../helper";

const ApplicationTable = ({ empId }) => {
  const [loading, setLoading] = useState(false);
  const [, setRowDto] = useState([]);
  const [rowDtoTwo, setRowDtoTwo] = useState([]);

  useEffect(() => {
    if (empId) {
      leaveAppLandingPagintaion_api(empId, setRowDto, setLoading);
      OfficialMoveLandingPagination_api(empId, setRowDtoTwo, setLoading);
    }
  }, [empId]);

  return (
    <>
      {loading && <Loading />}
      <h6 className="my-2">Movement Application Table</h6>
      <div className="table-responsive">
      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
        <thead>
          <tr>
            <th style={{ width: "35px" }}>SL</th>
            <th style={{ width: "95px" }}>Application Type</th>
            <th style={{ width: "90px" }}>Submitted Date</th>
            <th style={{ width: "90px" }}>From Date</th>
            <th style={{ width: "90px" }}>To Date</th>
            <th style={{ width: "70px" }}>From Time</th>
            <th style={{ width: "70px" }}>To Time</th>
            <th>Reason</th>
            <th style={{ width: "60px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rowDtoTwo?.map((td, index) => (
            <tr key={index}>
              <td> {td?.sl} </td>
              <td>
                <div className="pl-2">{td?.moveType}</div>
              </td>
              <td>
                <div className="text-center">
                  {_dateFormatter(td?.insertDate)}
                </div>
              </td>
              <td>
                <div className="text-center">
                  {_dateFormatter(td?.startDate)}
                </div>
              </td>
              <td>
                <div className="text-center">{_dateFormatter(td?.endDate)}</div>
              </td>
              <td>
                <div className="text-center">
                  {td?.start ? _timeFormatter(td?.start) : ""}
                </div>
              </td>
              <td>
                <div className="text-center">
                  {td?.end ? _timeFormatter(td?.end) : ""}
                </div>
              </td>
              <td>
                <div className="text-left pl-2">{td?.reason}</div>
              </td>
              <td>
                <div className="pl-2">{td?.status}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default ApplicationTable;
