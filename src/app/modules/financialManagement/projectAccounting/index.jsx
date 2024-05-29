import { CheckCircleOutline } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  CardBody,
  CardHeaderToolbar,
  Card,
  CardHeader,
} from "../../../../_metronic/_partials/controls";
import { OverlayTrigger, Tooltip as ReactToolTip } from "react-bootstrap";
import IEdit from "../../_helper/_helperIcons/_edit";
import IView from "../../_helper/_helperIcons/_view";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import Loading from "../../_helper/_loading";
import { TablePagination } from "@material-ui/core";
import { useSelector, shallowEqual } from "react-redux";
import moment from "moment";
import ProjectAccountingView from "./ProjectAccountingView";
const ProjectAccountingLanding = () => {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const [
    projectAccountingLanding,
    getProjectAccountingLanding,
    loadingOnGetProjectAccountingLanding,
  ] = useAxiosGet();
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [singleProjectId, setSingleProjectId] = useState(null);
  useEffect(() => {
    getProjectAccountingLanding(
      `/fino/ProjectAccounting/ProjectDescriptionLanding?accountId=${
        profileData?.accountId
      }&BuId=${selectedBusinessUnit?.value}&PageNo=${pageNo +
        1}&PageSize=${pageSize}`
    );
    // eslint-disable-next-line
  }, [profileData?.accountId, selectedBusinessUnit?.value, pageNo, pageSize]);
  return (
    <>
      {loadingOnGetProjectAccountingLanding && <Loading />}
      <Card>
        <CardHeader title={"Project Accounting"}>
          <CardHeaderToolbar>
            <button
              className="btn btn-primary ml-2"
              type="button"
              onClick={() => {
                history.push({
                  pathname: `/financial-management/projectAccounting/projectAccounting/create`,
                });
              }}
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {projectAccountingLanding?.data?.length > 0 && (
            <div className="row" id="pdf-section">
              <div className="col-lg-12">
                <div className="print_wrapper">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>
                            <div className="text-left ml-1">Project Name</div>
                          </th>
                          <th>
                            <div className="text-left ml-1">Owner</div>
                          </th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>
                            <div className="text-left ml-1">Location</div>
                          </th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectAccountingLanding?.data?.map((item) => (
                          <tr key={item?.sl}>
                            <td className="text-center">{item?.sl}</td>
                            <td className="text-left">
                              {item?.strProjectName || "N/A"}
                            </td>
                            <td className="text-left">
                              {item?.strOwner || "N/A"}
                            </td>
                            <td className="text-center">
                              {item?.dteStartDate
                                ? moment(item?.dteStartDate).format(
                                    "DD-MM-YYYY"
                                  )
                                : "N/A"}
                            </td>
                            <td className="text-center">
                              {item?.dteEndDate
                                ? moment(item?.dteEndDate).format("DD-MM-YYYY")
                                : "N/A"}
                            </td>
                            <td className="text-left">
                              {item?.strLocation || "N/A"}
                            </td>
                            <td className="text-center">
                              {item?.intStatusId === 1
                                ? "in progress"
                                : item?.intStatusId === 2
                                ? "complete"
                                : "N/A"}
                            </td>
                            <td className="d-flex align-items-center justify-content-around">
                              <IView
                                title="View Project"
                                clickHandler={() => {
                                  setShowProjectDetails(true);
                                  setSingleProjectId(item?.intProjectId);
                                }}
                              />

                              {item?.intStatusId !== 2 && (
                                <>
                                  <IEdit
                                    title="Edit"
                                    onClick={() => {
                                      history.push({
                                        pathname:
                                          "/financial-management/projectAccounting/projectAccounting/edit",
                                        state: {
                                          project: item,
                                        },
                                      });
                                    }}
                                  />

                                  <OverlayTrigger
                                    overlay={
                                      <ReactToolTip id="cs-icon">
                                        Complete Project
                                      </ReactToolTip>
                                    }
                                  >
                                    <CheckCircleOutline
                                      className="fas fa-pen-square pointer"
                                      onClick={() => {
                                        history.push({
                                          pathname:
                                            "/financial-management/projectAccounting/projectAccounting/complete",
                                          state: {
                                            projectId: item?.intProjectId,
                                          },
                                        });
                                      }}
                                      style={{
                                        color: "#B5B5C3",
                                        fontSize: "16px",
                                        fontWeight: 900,
                                      }}
                                    />
                                  </OverlayTrigger>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <TablePagination
                  count={projectAccountingLanding?.totalCount}
                  onPageChange={(_, page) => {
                    setPageNo(page);
                  }}
                  onChangeRowsPerPage={(event) => {
                    setPageSize(event.target.value);
                  }}
                  page={pageNo}
                  rowsPerPage={pageSize}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <ProjectAccountingView
        show={showProjectDetails}
        id={singleProjectId}
        onHide={() => {
          setShowProjectDetails(false);
          setSingleProjectId(null);
        }}
      />
    </>
  );
};

export default ProjectAccountingLanding;
