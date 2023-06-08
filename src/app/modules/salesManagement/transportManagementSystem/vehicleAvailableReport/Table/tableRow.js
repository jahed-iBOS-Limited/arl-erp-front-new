/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual } from "react-redux";
import { useUIContext } from "../../../../_helper/uiContextHelper";
import {
  getCheckpostListPermissionByUser,
  getItemRequestGridData,
  getVehicleStatusDDL,
} from "../helper";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

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
  const [loading, setLoading] = useState(true);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [pageCount, setPageCount] = useState();

  //Get Api Data
  useEffect(() => {
    getVehicleStatusDDL(setVehicleStatusDDL);
    getCheckpostListPermissionByUser(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setCheckPostDDL
    );
    getItemRequestGridData(
      selectCheckPost.value,
      profileData.accountId,
      selectVehicleStatusDDL.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      setPageCount
    );
  }, [profileData.userId, profileData.accountId, selectedBusinessUnit.value]);

  // UI Context
  const uIContext = useUIContext();
  const uIProps = useMemo(() => {
    return {
      ids: uIContext?.ids,
      setIds: uIContext?.setIds,
      queryParams: uIContext?.queryParams,
      setQueryParams: uIContext?.setQueryParams,
      openEditPage: uIContext?.openEditPage,
      openViewDialog: uIContext?.openViewDialog,
    };
  }, [uIContext]);

  // Table columns
  const columns = [
    {
      dataField: "vehicleId",
      text: "SL",
    },
    {
      dataField: "vehicleNo",
      text: "Vehicle No.",
    },
    {
      dataField: "driverName",
      text: "Driver Name",
    },
    {
      dataField: "dueDate",
      text: "Driver Contact",
    },
    {
      dataField: "cameFrom",
      text: "Came From",
    },
    {
      dataField: "inDateTime",
      text: "In Time",
    },
  ];

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getItemRequestGridData(
      selectCheckPost.value,
      profileData.accountId,
      selectVehicleStatusDDL.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      setPageCount
    );
  };
  return (
    <>
      <ICustomCard title="Available Vehicle">
        <div className="row my-3">
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
          <div className="col-lg-2 mt-9">
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
                  setPageCount
                )
              }
            >
              View
            </button>
          </div>
        </div>
        {loading && <Loading />}
        <BootstrapTable
          wrapperClasses="table-responsive"
          classes="table table-head-custom table-vertical-center invoiceTable"
          bootstrap4
          bordered={false}
          remote
          keyField="controllingUnitId"
          data={gridData || []}
          columns={columns}
        ></BootstrapTable>
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
