/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData } from "../helper";
import Loading from "../../../../_helper/_loading";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IView from "./../../../../_helper/_helperIcons/_view";

const SalesForceInfoLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <Card>
        <CardHeader title="Salesforce Basic Information">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push(
                  "/rtm-management/salesforceManagement/salesforceProfile/create"
                )
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isloading && <Loading />}
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
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
              {gridData?.data?.length > 0 &&
                gridData?.data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>
                        <span className="pl-2">{item?.employeeFullName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.departmentName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.designationName}</span>
                      </td>
                      <td className="text-right">
                        <span className="pr-2">{item?.employeeLevel}</span>
                      </td>
                      <td className="text-center">
                        {_dateFormatter(item?.joiningDate)}
                      </td>
                      <td style={{ width: "100px" }} className="text-center">
                        <span
                          className="edit"
                          onClick={(e) =>
                            history.push(
                              `/rtm-management/salesforceManagement/salesforceProfile/edit/${item?.employeeId}`
                            )
                          }
                        >
                          <IEdit />
                        </span>
                        <span className="pl-2">
                          <IView
                            title="view"
                            clickHandler={(e) =>
                              history.push(
                                `/rtm-management/salesforceManagement/salesforceProfile/view/${item?.employeeId}`
                              )
                            }
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination Code */}
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default SalesForceInfoLanding;
