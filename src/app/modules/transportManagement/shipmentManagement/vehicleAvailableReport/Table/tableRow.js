/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Select from "react-select";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";
import customStyles from "../../../../selectCustomStyle";
import {
  getCheckpostListPermissionByUser,
  getItemRequestGridData,
  getVehicleStatusDDL,
} from "../helper";

export function TableRow(props) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);

  // vehicle status ddl
  const [vehicleStatusDDL, setVehicleStatusDDL] = useState([]);
  const [selectVehicleStatusDDL, setSelectVehicleStatusDDL] = useState("");

  // Checkpost ddl
  const [checkPostDDL, setCheckPostDDL] = useState([]);
  const [selectCheckPost, setSelectCheckPost] = useState("");
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [pageCount, setPageCount] = useState();

  //Get Api Data
  useEffect(() => {
    getVehicleStatusDDL(setVehicleStatusDDL);
    getCheckpostListPermissionByUser(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit.value,
      setCheckPostDDL
    );
  }, [
    profileData?.userId,
    profileData?.accountId,
    selectedBusinessUnit?.value,
  ]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getItemRequestGridData(
      selectCheckPost.value,
      profileData.accountId,
      selectVehicleStatusDDL.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      setPageCount,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <ICustomCard title="Available Vehicle">
        <div className="row my-3 global-form">
          <div className="col-lg-2">
            <div className="form-group">
              <label>Checkpost</label>
              <Select
                placeholder="Select Checkpost"
                value={selectCheckPost}
                onChange={(v) => setSelectCheckPost(v)}
                styles={customStyles}
                options={checkPostDDL || []}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-group">
              <label>Vehicle Status</label>
              <Select
                placeholder="Select Checkpost"
                value={selectVehicleStatusDDL}
                onChange={(v) => setSelectVehicleStatusDDL(v)}
                styles={customStyles}
                options={vehicleStatusDDL}
              />
            </div>
          </div>
          <div className="col-lg-2 mt-7">
            <button
              className="btn btn-primary"
              onClick={() =>
                getItemRequestGridData(
                  selectCheckPost.value,
                  profileData.accountId,
                  selectVehicleStatusDDL.value,
                  setGridData,
                  setLoading,
                  pageNo,
                  pageSize,
                  setPageCount,
                  null
                )
              }
            >
              View
            </button>
          </div>
        </div>
        {loading && <Loading />}
        <PaginationSearch
          placeholder="Item Name & Code Search"
          paginationSearchHandler={paginationSearchHandler}
        />
        {gridData?.length > 0 && (
         <div className="table-responsive">
           <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>Sl</th>
                <th>Vehicle No</th>
                <th>Driver Name</th>
                <th>Came From</th>
                <th>Entry Date</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((td, index) => (
                <tr key={index}>
                  <td className="text-center"> {index + 1} </td>
                  <td>
                    <div className="pl-2">{td?.vehicleNo}</div>
                  </td>
                  <td>
                    <div className="pl-2">{td?.driverName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{td?.cameFrom}</div>
                  </td>
                  <td className="text-center">
                    {_dateFormatter(td?.inDateTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
        )}
        {gridData?.length > 0 && (
          <PaginationTable
            count={pageCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </ICustomCard>
    </>
  );
}
