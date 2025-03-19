/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import Select from "react-select";
import customStyles from "./../../../../selectCustomStyle";
import {
  getDistributionChannelDDL,
  getRetailPriceLandingData,
} from "./../helper";

const RetailPriceLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [distributionChannel, setDistributionChannel] = useState("");

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
    getDistributionChannelDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributionChannelDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getRetailPriceLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      distributionChannel?.value,
      pageNo,
      pageSize,
      setGridData,
      setIsLoading
    );
  };
  return (
    <>
      <Card>
        <CardHeader title="Create Retail Price Set Up">
          <CardHeaderToolbar>
            <button
              disabled={!distributionChannel?.value}
              onClick={() =>
                history.push(
                  `/rtm-management/configuration/itemRate/edit/${distributionChannel?.value}`
                )
              }
              className="mr-2 btn btn-info"
            >
              Edit
            </button>
            <button
              onClick={() =>
                history.push("/rtm-management/configuration/itemRate/create")
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="row global-form">
            <div className="col-lg-3">
              <label>Distribution Channel</label>
              <Select
                onChange={(valueOption) => {
                  setDistributionChannel(valueOption);
                  getRetailPriceLandingData(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    valueOption?.value,
                    pageNo,
                    pageSize,
                    setGridData,
                    setIsLoading
                  );
                }}
                value={distributionChannel}
                isSearchable={true}
                options={distributionChannelDDL}
                styles={customStyles}
                name="transactionType"
                placeholder="Distribution Channel"
              />
            </div>
          </div>

          {isloading && <Loading />}
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Item Name</th>
                <th>Item Code</th>
                <th>UoM</th>
                <th>Rate</th>
                <th>Product Type</th>
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
                        <span className="pl-2">{item?.itemName}</span>
                      </td>
                      <td>
                        <span className="pl-2">
                          {item?.itemCode ? item?.itemCode : "-"}
                        </span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.uomName}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.itemRate}</span>
                      </td>
                      <td>
                        <span className="pl-2">{item?.productTypeName}</span>
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

export default RetailPriceLanding;
