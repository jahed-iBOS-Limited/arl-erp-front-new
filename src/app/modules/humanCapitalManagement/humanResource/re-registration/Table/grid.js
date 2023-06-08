import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";
import IViewModal from "./../../../../_helper/_viewModal";
import EmployeeInfoView from "./employeeInfoView";
// import PaginationSearch from "../../../../_helper/_search";

const GridData = ({
  history,
  rowDto,
  loading,
  setPositionHandler,
  pageNo,
  pageSize,
  searchValue,
}) => {
  // const paginationSearchHandler = (searchValue) => {
  //   setPositionHandler(pageNo, pageSize, searchValue);
  // };
  const [mdalShow, setModalShow] = useState(false);
  const [id] = useState("");
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          {/* <PaginationSearch
            placeholder="Employee Name & Code Search"
            paginationSearchHandler={paginationSearchHandler}
          /> */}
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
            <thead>
              <tr>
                <th style={{ width: "20px" }}>SL</th>
                <th className="text-center" style={{ width: "30px" }}>
                  Employee Id
                </th>
                <th className="text-center" style={{ width: "30px" }}>
                  ERP Emp. Id
                </th>
                <th>Employee Code</th>
                <th style={{ width: "150px" }}>Employee Name</th>
                <th style={{ width: "150px" }}>Business Unit</th>
                <th style={{ width: "150px" }}>Department</th>
                <th style={{ width: "150px" }}>HR Position</th>
                <th style={{ width: "150px" }}>Designation</th>
                <th style={{ width: "150px" }}>Line Manager</th>
                <th style={{ width: "150px" }}>Supervisor</th>
                <th style={{ width: "150px" }}>Separation Date</th>
                <th style={{ width: "20px" }}>Action </th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.data?.map((tableData, index) => (
                <tr key={index}>
                  <td> {tableData.sl} </td>
                  <td className="text-center" style={{ width: "30px" }}>
                    {tableData?.employeeId}{" "}
                  </td>
                  <td className="text-center" style={{ width: "30px" }}>
                    {tableData?.erpemployeeId}{" "}
                  </td>
                  <td className="text-center"> {tableData.employeeCode} </td>
                  <td> {tableData.employeeFullName} </td>
                  <td> {tableData.businessunitName} </td>
                  <td> {tableData.department} </td>
                  <td> {tableData.positionName} </td>
                  <td> {tableData.designationName} </td>
                  <td> {tableData.lineManagerName} </td>
                  <td> {tableData.supervisorName} </td>
                  <td>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>{_dateFormatter(tableData.separationDate || "")}</div>
                      {tableData?.separationReason && (
                        <div>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="quick-user-tooltip">
                                {tableData?.separationReason}
                              </Tooltip>
                            }
                          >
                            <i class="fas fa-info mr-2 pointer"></i>
                          </OverlayTrigger>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <div className="d-flex justify-content-center align-items-center baiscInfo_table">
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
                            pathname: `/human-capital-management/humanresource/official-info/edit/${tableData?.employeeId}`,
                            state: { ...tableData, fromReRegistration: true },
                          });
                        }}
                      >
                        Re-registration
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
