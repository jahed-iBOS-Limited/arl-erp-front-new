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

const SecondaryDeliveryLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

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
    // getLandingData(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   setIsLoading,
    //   setGridData,
    //   pageNo,
    //   pageSize
    // );
    setGridData([]);
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

  // View Button Handler
  const viewHandler = () => {
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
        <CardHeader title="Secondary Delivery">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push("/rtm-management/configuration/beat/create")
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="row my-2">
            <span className="d-flex align-items-center">
              <input
                className="ml-5"
                type="radio"
                value="due"
                name="status"
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="ml-2">Due</span>
            </span>
            <span className="d-flex align-items-center">
              <input
                className="ml-5"
                type="radio"
                value="complete"
                name="status"
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="ml-2">Complete</span>
            </span>
            <span className="d-flex align-items-center">
              <input
                className="ml-5"
                type="radio"
                value="all"
                name="status"
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="ml-2">All</span>
            </span>
            <span>
              <button
                disabled={!status}
                onClick={() => viewHandler()}
                className="btn btn-primary ml-6"
              >
                View
              </button>
            </span>
          </div>

          {isloading && <Loading />}
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Item Name</th>
                <th>UoM</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Delivery</th>
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
                        <span className="pl-2">{item?.beatName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.territoryName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.territoryName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.territoryName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.territoryName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.routeName}</span>
                      </td>
                      <td style={{ width: "100px" }} className="text-center">
                        <span
                          className="edit"
                          onClick={(e) =>
                            history.push(
                              `/rtm-management/configuration/beat/edit/${item?.beatId}`
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

export default SecondaryDeliveryLanding;
