/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import {
  CardBody,
  CardHeaderToolbar,
  Card,
  CardHeader,
} from "../../../../../_metronic/_partials/controls";
import CreateProjectAccounting from "./CreateProjectAccounting";
import Team from "./ProjectTeamCreate";
import ProjectInventoryCost from "./ProjectInventoryCost";
import ProjectExpense from "./ProjectCostExpense";
import { Collapse } from "antd";
import "antd/dist/antd.css";
import { useHistory, useLocation } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";
// const { Panel } = Collapse;

export default function ProjectAccounting() {
  const [project, setProject] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [responsible, setResponsible] = useState([]);
  const location = useLocation();
  const [res, getData, loading] = useAxiosGet();
// get account data
const { profileData, selectedBusinessUnit } = useSelector(
  (state) => state.authData,
  shallowEqual
);
  useEffect(() => {
    if (project?.id || project?.intProjectId) {
      getData(
        `/fino/ProjectAccounting/GetProjectById?accId=${
          profileData?.accountId
        }&buId=${selectedBusinessUnit?.value}&id=${project?.id ||
          project?.intProjectId}`
      );
    }

    // eslint-disable-next-line
  }, [
    project,
    profileData,
    selectedBusinessUnit,
  ]);

  useEffect(() => {
    if (location?.state?.project) {
      setIsEdit(true);
      setProject(location.state.project);
    }
    // eslint-disable-next-line
  }, []);

  const history = useHistory();
  return (
    <>
      {loading && <Loading/>}
      <Card>
        <CardHeader title={"Project Accounting"}>
          <CardHeaderToolbar>
            <button
              type="button"
              className={"btn btn-light"}
              onClick={() => {
                history.push({
                  pathname: `/financial-management/projectAccounting/projectAccounting`,
                });
              }}
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <Collapse defaultActiveKey="1" accordion>
              <CreateProjectAccounting
                project={project}
                setProject={setProject}
                isEdit={isEdit}
                projectDescription={res?.projectDescription}
              />
          
              <Team
                project={project}
                setProject={setProject}
                isEdit={isEdit}
                projectTeam={res?.projectTeam}
                setResponsible={setResponsible}
              />
              {/* <ProjectExpense
                project={project}
                setProject={setProject}
                isEdit={isEdit}
                projectCostingExpense={res?.projectCostingExpense}
                responsible={responsible}
                
              /> */}
              <ProjectInventoryCost
                project={project}
                setProject={setProject}
                isEdit={isEdit}
                inventoryItemList={res?.projectCostingInventory}
              />
          </Collapse>
        </CardBody>
      </Card>
    </>
  );
}
