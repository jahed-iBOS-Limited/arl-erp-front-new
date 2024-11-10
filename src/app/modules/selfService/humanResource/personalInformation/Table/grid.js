import React from "react";
import { withRouter } from "react-router-dom";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const GridData = ({
  history,
  rowDto,
  setPositionHandler,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  loader,
}) => {
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      {loader && <Loading />}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <PaginationSearch
            placeholder="Employee Name & Code Search"
            paginationSearchHandler={paginationSearchHandler}
          />
          {rowDto?.data?.length > 0 && (
             <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th className="text-center" style={{ width: "30px" }}>
                    Employee Id
                  </th>
                  <th className="text-center" style={{ width: "30px" }}>
                    ERP Emp. Id
                  </th>
                  <th style={{ width: "50px" }}>Employee Code</th>
                  <th style={{ width: "35px" }}>Employee Name</th>
                  <th style={{ width: "35px" }}>Department</th>
                  <th style={{ width: "35px" }}>HR Position</th>
                  <th style={{ width: "35px" }}>Designation</th>
                  <th style={{ width: "20px" }}>Line Manager </th>
                  <th style={{ width: "20px" }}>Supervisor</th>
                  <th style={{ width: "72px" }}>Status </th>
                  <th style={{ width: "20px" }}>Action </th>
                </tr>
              </thead>
              <tbody>
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
                    <td> {tableData.department} </td>
                    <td> {tableData.positionName} </td>
                    <td> {tableData.designationName} </td>
                    <td> {tableData.lineManagerName} </td>
                    <td> {tableData.supervisorName} </td>
                    <td>
                      <div className="d-flex align-content-sm-start flex-wrap ml-2 mr-n3">
                        <div class="order-md-1 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Personal Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.personalInformation}
                              checked={tableData?.employeePersonalInfoStatus}
                              name="personalInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "personalInformation",
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
                                {"Family Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.familyInformation}
                              checked={tableData?.employeeFamilyInfoStatus}
                              f
                              name="familyInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "familyInformation",
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
                                {"Personal Contact Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.personalContactInformation}
                              checked={
                                tableData?.employeePersonalContactInfoStatus
                              }
                              f
                              name="personalContactInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "personalContactInformation",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>
                        <div class="order-md-4 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Other Contact Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.otherContactInformation}
                              checked={
                                tableData?.employeeOthersContactInfoStatus
                              }
                              name="otherContactInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "otherContactInformation",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>
                        <div class="order-md-5 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Educational Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.educationalInformation}
                              checked={tableData?.employeeEducationInfoStatus}
                              name="educationalInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "educationalInformation",
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
                                {"Working Experience"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.workingExperience}
                              checked={
                                tableData?.employeeWorkExperienceInfoStatus
                              }
                              f
                              name="workingExperience"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "workingExperience",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>

                        <div class="order-md-7 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Training Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.employeeTrainigInfoStatus}
                              checked={tableData?.employeeTrainigInfoStatus}
                              name="employeeTrainigInfoStatus"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "employeeTrainigInfoStatus",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>

                        <div class="order-md-8 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Nominee Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.nomineeInformation}
                              checked={tableData?.employeeNomineeInfoStatus}
                              name="nomineeInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                                  state: {
                                    ...tableData,
                                    checkbox: "nomineeInformation",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>
                        {/* )} */}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <InfoCircle
                          clickHandler={() => {
                            history.push({
                              pathname: `/self-service/self-profile/personal/edit/${tableData?.employeeId}`,
                              state: { ...tableData },
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
          )}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default withRouter(GridData);
