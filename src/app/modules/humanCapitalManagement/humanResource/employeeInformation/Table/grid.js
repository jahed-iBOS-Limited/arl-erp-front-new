import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IViewModal from "./../../../../_helper/_viewModal";
import EmployeeInfoView from "./employeeInfoView";

const GridData = ({ history, rowDto, loading, setPositionHandler, pageNo,
  pageSize,
  searchValue
 }) => {
  const [mdalShow, setModalShow] = useState(false);
  const [id, setId] = useState("");
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
            <thead>
              <tr>
                <th style={{ width: "20px" }}>SL</th>
                <th style={{ width: "30px" }}>Employee Id</th>
                <th style={{ width: "40px", minWidth: "30px" }}>ERP Emp. Id</th>
                <th style={{ width: "40px" }}>Emp. Code</th>
                <th style={{ width: "150px" }}>Employee Name</th>
                <th style={{ width: "150px" }}>Department</th>
                <th style={{ width: "150px" }}>HR Position</th>
                <th style={{ width: "150px" }}>Designation</th>
                <th style={{ width: "150px" }}>Line Manager</th>
                <th style={{ width: "150px" }}>Supervisor</th>
                <th style={{ width: "20px" }}>Action </th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.data?.map((tableData, index) => (
                <tr key={index}>
                  <td> {tableData?.sl} </td>
                  <td> {tableData?.employeeId} </td>
                  <td> {tableData?.erpemployeeId} </td>
                  <td> {tableData?.employeeCode} </td>
                  <td> {tableData?.employeeFullName} </td>
                  <td> {tableData?.department} </td>
                  <td> {tableData?.positionName} </td>
                  <td> {tableData?.designationName} </td>
                  <td> {tableData?.lineManagerName} </td>
                  <td> {tableData?.supervisorName} </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex justify-content-center align-items-center baiscInfo_table">
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
                            pathname: `/human-capital-management/humanresource/official-info/edit/${tableData?.employeeId}`,
                            state: tableData,
                          });
                        }}
                      >
                        Official Info
                      </button> */}
                      <button
                        className="btn btn-outline-dark mr-1 pointer"
                        type="button"
                        style={{
                          padding: "1px 5px",
                          fontSize: "11px",
                          width: "85px",
                        }}
                        onClick={() => {
                          history.push({
                            pathname: `/human-capital-management/humanresource/personal-info/edit/${tableData?.employeeId}`,
                            state: tableData,
                          });
                        }}
                      >
                        Personal Info
                      </button>
                      <button
                        className="btn btn-outline-dark mr-1 pointer"
                        type="button"
                        style={{
                          padding: "1px 5px",
                          fontSize: "11px",
                          width: "85px",
                        }}
                        onClick={() => {
                          setId(tableData?.employeeId);
                          setModalShow(true);
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <IViewModal show={mdalShow} onHide={() => setModalShow(false)}>
          <EmployeeInfoView id={id} />
        </IViewModal>
      </div>
    </>
  );
};

export default withRouter(GridData);
