import React from "react";
import { withRouter } from "react-router-dom";
import PaginationTable from "../../../../_helper/_tablePagination";
import InfoCircle from "./../../../../_helper/_helperIcons/_infoCircle";
import Loading from "./../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const GridData = ({
  history,
  rowDto,
  loading,
  setPositionHandler,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
}) => {
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };
  return (
    <>
      {console.log(rowDto, "rowDto")}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <PaginationSearch
            placeholder="Employee Name & Code Search"
            paginationSearchHandler={paginationSearchHandler}
          />
           <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
            <thead>
              <tr>
                <th style={{ width: "20px" }}>SL</th>
                <th className="text-center" style={{ width: "30px" }}>Employee Id</th>
                <th className="text-center" style={{ width: "30px" }}>ERP Emp. Id</th>
                <th style={{ width: "25px" }}>Employee Code</th>
                <th style={{ width: "35px" }}>Employee Name</th>
                <th style={{ width: "35px" }}>Department</th>
                <th style={{ width: "35px" }}>HR Position</th>
                <th style={{ width: "35px" }}>Designation</th>
                <th style={{ width: "20px" }}>Line Manager </th>
                <th style={{ width: "20px" }}>Supervisor</th>
                <th style={{ width: "40px" }}>Status </th>
                <th style={{ width: "15px" }}>Action </th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.data?.map((tableData, index) => (
                <tr key={index}>
                  <td> {tableData.sl} </td>
                  <td className="text-center" style={{ width: "30px" }}> {tableData?.employeeId} </td>
                  <td className="text-center" style={{ width: "30px" }}> {tableData?.erpemployeeId} </td>
                  <td style={{ width: "30px" }} className="text-center"> {tableData.employeeCode} </td>
                  <td> {tableData.employeeFullName} </td>
                  <td> {tableData.department} </td>
                  <td> {tableData.positionName} </td>
                  <td> {tableData.designationName} </td>
                  <td> {tableData.lineManagerName} </td>
                  <td> {tableData.supervisorName} </td>
                  <div className="d-flex align-content-sm-start flex-wrap ml-3">
                    <div class="order-md-1 p-1">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">
                            {"Basic Employee Information"}
                          </Tooltip>
                        }
                      >
                        <input
                          type="checkbox"
                          value={tableData?.employeeInformation}
                          checked={tableData?.employeeBasicInfoStatus}
                          name="employeeInformation"
                          onClick={() =>
                            history.push({
                              pathname: `/self-service/self-profile/official/edit/${tableData?.employeeId}`,
                              state: {
                                ...tableData,
                                checkbox: "employeeInformation",
                              },
                            })
                          }
                        />
                      </OverlayTrigger>
                    </div>
                    <div class="order-md-2 p-1">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">
                            {"Administrative Information"}
                          </Tooltip>
                        }
                      >
                        <input
                          type="checkbox"
                          value={tableData?.administrativeInformation}
                          checked={tableData?.employeeAdministrativeInfoStatus}
                          f
                          name="administrativeInformation"
                          onClick={() =>
                            history.push({
                              pathname: `/self-service/self-profile/official/edit/${tableData?.employeeId}`,
                              state: {
                                ...tableData,
                                checkbox: "administrativeInformation",
                              },
                            })
                          }
                        />
                      </OverlayTrigger>
                    </div>
                    <div class="order-md-4 p-1">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">{"Bank Information "}</Tooltip>
                        }
                      >
                        <input
                          type="checkbox"
                          value={tableData?.banklInformation}
                          checked={tableData?.employeBankInformationStatus}
                          name="banklInformation"
                          onClick={() =>
                            history.push({
                              pathname: `/self-service/self-profile/official/edit/${tableData?.employeeId}`,
                              state: {
                                ...tableData,
                                checkbox: "banklInformation",
                              },
                            })
                          }
                        />
                      </OverlayTrigger>
                    </div>

                    {/* )} */}
                  </div>
                  <td>
                    <div className="d-flex justify-content-around">
                      <InfoCircle
                        clickHandler={() => {
                          history.push({
                            pathname: `/self-service/self-profile/official/edit/${tableData?.employeeId}`,
                            state: tableData,
                          });
                        }}
                      />
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        <div>
          {rowDto?.data?.length > 0 && (
            <PaginationTable
              count={rowDto?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
