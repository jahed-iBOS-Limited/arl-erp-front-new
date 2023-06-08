/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import { getGridData } from "../landingHelper";
import IViewModal from "../../../../_helper/_viewModal";
import AssetOrderForm from "../newForm/addEditForm";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

export default function TableRow() {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { workOrder } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [plantName, setPlantName] = useState({ value: 79, label: "ACCL Narayanganj" });
  const [warehouseName, setWarehouseName] = useState({ label: "ACCL PDD", value: 178 });
  const [sbuName, setSbuName] = useState({ value: 58, label: "Akij Cement Company Ltd." });
  const [currentRowData, setCurrentRowData] = useState("");
  const [isShowModalforCreate, setisShowModalforCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getGridData(profileData?.accountId, selectedBusinessUnit?.value, plantName?.value, setGridData, setLoading, pageNo, pageSize);
  };

  const viewGridData = () => {
    getGridData(profileData?.accountId, selectedBusinessUnit?.value, plantName?.value, setGridData, setLoading, pageNo, pageSize);
  };

  useEffect(() => {
    getGridData(profileData?.accountId, selectedBusinessUnit?.value, plantName?.value, setGridData, setLoading, pageNo, pageSize);
  }, []);

  console.log("workOrder", workOrder);
  return (
    <>
      <ICustomCard
        title="Maintenance Vehicle Service Request"
        renderProps={() => (
          <button className="btn btn-primary" disabled={!sbuName || !plantName || !warehouseName} onClick={(e) => setisShowModalforCreate(true)}>
            Create new
          </button>
        )}
      >
        {loading && <Loading />}
        <div className="row global-form my-3">
          {/* global-form */}
          <div className="col-lg-2">
            <div className="form-group">
              <label>Select SBU</label>
              <Select
                placeholder="Select SBU"
                value={sbuName}
                isDisabled
                onChange={(value) => {
                  setSbuName(value);
                }}
                styles={customStyles}
                isSearchable={true}
                options={[{ value: 58, label: "Akij Cement Company Ltd." }]}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-group">
              <label>Select Plant</label>
              <Select
                placeholder="Select Plant"
                value={plantName}
                onChange={(value) => {
                  setPlantName(value);
                }}
                isDisabled
                styles={customStyles}
                isSearchable={true}
                options={[{ value: 79, label: "ACCL Narayanganj" }]}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-group">
              <label>Select Warehouse</label>
              <Select
                placeholder="Select Warehouse"
                value={warehouseName}
                onChange={(value) => {
                  setWarehouseName(value);
                }}
                isDisabled
                styles={customStyles}
                isSearchable={true}
                options={[{ label: "ACCL PDD", value: 178 }]}
              />
            </div>
          </div>
          <div className="col-lg-2 d-flex align-items-end">
            <button className="btn btn-primary" disabled={!plantName || !warehouseName} onClick={viewGridData}>
              View
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Job Card</th>
                <th>Date</th>
                <th>Asset Code</th>
                <th>Asset Name</th>
                <th>SBU Name</th>
                <th>Problems</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item.assetMaintenanceCode}</td>
                  <td>{_dateFormatter(item.dueMaintenanceDate)}</td>
                  <td>{item.assetCode}</td>
                  <td>{item.assetDescription}</td>
                  <td>{item.sbuName}</td>
                  <td>{item?.problems} </td>
                  <td>{item.priorityName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <IViewModal show={isShowModalforCreate} onHide={() => setisShowModalforCreate(false)}>
          <AssetOrderForm
            currentRowData={currentRowData}
            sbuName={sbuName}
            plantName={plantName}
            warehouseName={warehouseName}
            setGridData={setGridData}
            setisShowModalforCreate={setisShowModalforCreate}
          />
        </IViewModal>

        {/* Pagination Code */}
        {gridData?.data?.length > 0 && (
          <PaginationTable count={gridData?.totalCount} setPositionHandler={setPositionHandler} paginationState={{ pageNo, setPageNo, pageSize, setPageSize }} />
        )}
      </ICustomCard>
    </>
  );
}
