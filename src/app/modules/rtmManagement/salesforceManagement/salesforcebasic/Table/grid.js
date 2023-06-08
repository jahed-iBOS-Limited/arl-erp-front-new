import React from "react";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";

const GridData = ({ history, gridData, loading }) => {
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
            <thead>
              <tr>
              <th>SL</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Employee level</th>
                <th>Joining Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {gridData?.data?.map((tableData, index) => (
                <tr key={index}>
                  <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>
                        <span className="pl-2">{tableData?.employeeFullName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{tableData?.departmentName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{tableData?.designationName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{tableData?.employeeLevelName}</span>
                      </td>
                      <td className="text-center">
                        {_dateFormatter(tableData?.joiningDate)}
                      </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex justify-content-center align-items-center baiscInfo_table">
                      <button
                        className="btn btn-outline-dark mr-1 pointer"
                        type="button"
                        style={{
                          padding: "1px 5px",
                          fontSize: "11px",
                          //width: "85px",
                        }}
                        onClick={() => {
                          history.push({
                            pathname: `/rtm-management/salesforceManagement/salesforceProfile/official/edit/${tableData?.employeeId}`,
                            state: tableData,
                          });
                        }}
                      >
                        Sales Force Info
                      </button>
                      {/* <button
                        className="btn btn-outline-dark mr-1 pointer"
                        type="button"
                        style={{
                          padding: "1px 5px",
                          fontSize: "11px",
                          width: "85px",
                        }}
                        onClick={() => {
                          history.push({
                            pathname: `/rtm-management/salesforceManagement/salesforceProfile/official/edit/${tableData?.employeeId}`,
                            state: tableData,
                          });
                        }}
                      >
                        Personal Info
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
