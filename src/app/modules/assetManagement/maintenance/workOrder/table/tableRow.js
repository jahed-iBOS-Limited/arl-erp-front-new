/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import {
  getAssetPlantDDL,
  getassetWarehouseData,
  getGridData,
  getAssetSBUDDL,
} from "../landingHelper";
import IViewModal from "../../../../_helper/_viewModal";
import AssetOrderForm from "../newForm/addEditForm";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import {
  setWorkOrderAction,
  setworkOrderTableLastAction,
} from "../../../../_helper/reduxForLocalStorage/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export function TableRow(props) {
  //const dispatch = useDispatch();
  let history = useHistory();
  const dispatch = useDispatch();
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
  const [sbu, setSbu] = useState([]);
  const [sbuName, setSbuName] = useState("");
  const [plant, setPlant] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [warehouse, setWarehouse] = useState([]);
  const [warehouseName, setWarehouseName] = useState("");
  const [status, setStatus] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [costCenterDDL, getCostCenterDDL, costCenterDDLLoader] = useAxiosGet();
  // const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  const [isShowModalforCreate, setisShowModalforCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plantName?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      warehouseName?.value,
      status?.value,
      costCenter?.value
    );
    let data = {
      plantName,
      sbuName,
      warehouseName,
      status,
      costCenter,
    };
    dispatch(setWorkOrderAction(data));
  };

  useEffect(() => {
    getAssetPlantDDL(
      profileData.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlant
    );
    getAssetSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbu);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (workOrder?.plantName?.value) {
      const wordOrder = workOrder;
      setSbuName(wordOrder?.sbuName);
      setPlantName(wordOrder?.plantName);
      setWarehouseName(wordOrder?.warehouseName);
      setStatus(wordOrder?.status);
      setCostCenter(wordOrder?.costCenter);
      onChangeforPlant(workOrder?.plantName);
      getCostCenterDDLHandler(workOrder?.sbuName?.value);
      if (
        wordOrder?.sbuName &&
        wordOrder?.plantName &&
        wordOrder?.warehouseName &&
        wordOrder?.status &&
        wordOrder?.costCenter
      ) {
        getGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          wordOrder?.plantName?.value,
          setGridData,
          setLoading,
          pageNo,
          pageSize,
          wordOrder?.warehouseName?.value,
          wordOrder?.status?.value,
          wordOrder?.costCenter?.value,
        );
      }
    }
  }, []);

  const onChangeforPlant = (value) => {
    getassetWarehouseData(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      value?.value,
      setWarehouse
    );
  };

  // get cost center ddl handler
  const getCostCenterDDLHandler = (sbuId) => {
    getCostCenterDDL(`/asset/DropDown/GetCostCenterList?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SbuId=${sbuId}`)
  }

  const viewGridData = () => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plantName?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      warehouseName?.value,
      status?.value,
      costCenter?.value
    );
    let data = {
      plantName,
      sbuName,
      warehouseName,
      status,
      costCenter,
    };
    dispatch(setWorkOrderAction(data));
  };

  const tableworkOrderId = useSelector((state) => {
    return state?.localStorage?.tableworkOrderId;
  });

  return (
    <>
      {(loading || costCenterDDLLoader) && <Loading />}
      <ICustomCard
        title="Maintenance Work Order"
        renderProps={() => (
          <button
            className="btn btn-primary"
            disabled={!sbuName || !plantName || !warehouseName}
            onClick={(e) => setisShowModalforCreate(true)}
          >
            Create new
          </button>
        )}
      >
        <div className="row global-form my-3">
          {/* global-form */}
          <div className="col-lg-2">
            <div className="form-group">
              <label>Select SBU</label>
              <Select
                placeholder="Select SBU"
                value={sbuName}
                onChange={(value) => {
                  setSbuName(value);
                  getCostCenterDDLHandler(value?.value);
                }}
                styles={customStyles}
                isSearchable={true}
                options={sbu}
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
                  onChangeforPlant(value);
                }}
                styles={customStyles}
                isSearchable={true}
                options={plant}
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
                isDisabled={!plantName}
                styles={customStyles}
                isSearchable={true}
                options={warehouse}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-group">
              <label>Select Status</label>
              <Select
                placeholder="Select Status"
                options={[
                  {value: "All", label: "All"},
                  {value: "Pending", label: "Pending" },
                  {value: "Open", label: "Open" },
                  {value: "Close", label: "Close" }
                ]}
                value={status}
                onChange={(value) => {
                  setStatus(value);
                }}
                isDisabled={!warehouseName}
                styles={customStyles}
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-lg-2">
            <div className="form-group">
              <label>Select Cost Center</label>
              <Select
                placeholder="Select Cost Center"
                options={[{ value: 0, label: "All" }, ...costCenterDDL]}
                value={costCenter}
                onChange={(value) => {
                  setCostCenter(value);
                }}
                isDisabled={!sbuName}
                styles={customStyles}
                isSearchable={true}
              />
            </div>
          </div>
          <div className="col-lg-2 d-flex align-items-end">
            <button
              className="btn btn-primary"
              disabled={!plantName || !warehouseName || !status || !costCenter}
              onClick={viewGridData}
            >
              View
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Asset Code</th>
                <th>Asset Name</th>
                <th>SBU Name</th>
                <th>Maintenance Code</th>
                <th>Problems</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Request By</th>
                <th>Date</th>
                <th className="text-right pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item.assetCode}</td>
                  <td>{item.assetDescription}</td>
                  <td>{item.sbuName}</td>
                  <td>{item.assetMaintenanceCode}</td>
                  <td>{item?.problems} </td>
                  <td>{item.priorityName}</td>
                  <td>{item?.status}</td>
                  <td>{item?.actionByName} [{item?.actionBy}]</td>
                  <td>{_dateFormatter(item.dueMaintenanceDate)}</td>
                  <td className="text-center">
                    <span
                      onClick={(e) => {
                        // setIsShowModal(true)
                        history.push(
                          `/mngAsset/maintenance/workorder/edit/${item.assetMaintenanceId}`
                        );
                        dispatch(
                          setworkOrderTableLastAction(item.assetMaintenanceId)
                        );
                      }}
                    >
                      <IEdit
                        classes={
                          tableworkOrderId === item?.assetMaintenanceId
                            ? "text-primary"
                            : ""
                        }
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <IViewModal
            show={isShowModal}
            onHide={() => setIsShowModal(false)}
          >
            <AssetListForm
              currentRowData={currentRowData}
              setIsShowModal={setIsShowModal}
            />
          </IViewModal> */}

        <IViewModal
          show={isShowModalforCreate}
          onHide={() => setisShowModalforCreate(false)}
        >
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
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </ICustomCard>
    </>
  );
}
