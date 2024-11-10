/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { GetEmployeeList } from "../helper";
import { _dateFormatter } from './../../../../../_helper/_dateFormate';
import Loading from './../../../../../_helper/_loading';

const EmployeeTable = ({ accId, buId, selectedData }) => {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState("");
  const key = selectedData?.editableKey?.split("n")[1];
  useEffect(() => {
    GetEmployeeList(
      accId,
      buId,
      selectedData?.row[key],
      setGridData,
      setLoading
    );
  }, [accId, buId]);
  return (
    <>
      <div className="table-card">
        {loading && <Loading />}
        <div className="table-card-heading">
          <p>Employee Information</p>
        </div>
        <div className="table-responsive">
          <table className="table global-table">
            <thead>
              <tr>
                <th>Channel Name</th>
                <th>Territory Name</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Functional Dept</th>
                <th>Personal Contact</th>
                <th>Joining Date</th>
              </tr>
            </thead>
            <tbody>
              {gridData && (
                <tr>
                  <td>{gridData?.channelName}</td>
                  <td>{gridData?.territoryName}</td>
                  <td>{gridData?.employeeName}</td>
                  <td>{gridData?.designation}</td>
                  <td>{gridData?.functionalDept}</td>
                  <td>{gridData?.personalContact}</td>
                  <td>{_dateFormatter(gridData?.joiningDate)}</td>
                </tr>
              )}
              {!gridData && !loading && (
                <tr>
                  <td className="text-center" colSpan={20}>
                    <h6 className="py-3 no-data-found-text text-secondary">
                      {" "}
                      No Data Found
                    </h6>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EmployeeTable;
