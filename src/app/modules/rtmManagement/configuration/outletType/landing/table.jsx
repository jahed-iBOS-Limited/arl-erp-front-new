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

const OutletBusinessTypeLanding = () => {
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
      pageSize,
      null,
      null
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
      pageSize,
      null,
      null
    );
  };

  return (
    <>
      <Card>
        <CardHeader title="Outlet Type">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push("/rtm-management/configuration/outletType/create")
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
                <th>Outlet Type Name</th>
                <th style={{ width: "90px" }}>Tms Allowed</th>
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
                        <span className="pl-2">{item?.businessTypeName}</span>
                      </td>
                      <td>
                        <div className="text-center">
                          <input
                            style={{
                              width: "15px",
                              height: "15px",
                            }}
                            name="isOnlyTmsAllowed"
                            checked={item?.isOnlyTmsAllowed}
                            // className="form-control"
                            type="checkbox"
                            disabled
                          />
                        </div>
                      </td>
                      <td style={{ width: "100px" }} className="text-center">
                        <span
                          className="edit"
                          onClick={(e) =>
                            history.push(
                              `/rtm-management/configuration/outletType/edit/${item?.businessTypeId}`
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

export default OutletBusinessTypeLanding;
