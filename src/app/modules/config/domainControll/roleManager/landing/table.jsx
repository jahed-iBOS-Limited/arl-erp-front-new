/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData } from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

const RoleManagerLanding = () => {
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

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getLandingData(
      profileData?.accountId,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <Card>
        <CardHeader title="Role Manager">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push("/config/domain-controll/role-manager/create")
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isloading && <Loading />}
          <PaginationSearch
            placeholder="User Reference Search"
            paginationSearchHandler={paginationSearchHandler}
          />
       <div className="table-responsive">
       <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>User ID</th>
                <th><div className="text-left ml-2">User Name / Group</div></th>
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
                      <td className="text-center">{item?.userReferenceId || "N/A"}</td>
                      <td>
                        <span className="pl-2">{`${item?.userReferenceName}`}</span>
                      </td>
                      <td style={{ width: "100px" }} className="text-center">
                        <span
                          className="edit"
                          onClick={(e) =>
                            history.push(
                              `/config/domain-controll/role-manager/edit/${item?.userReferenceId}`
                            )
                          }
                        >
                          <IEdit />
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
       </div>

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

export default RoleManagerLanding;
