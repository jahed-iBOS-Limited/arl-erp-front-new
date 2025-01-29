/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import {
  getSBUDDL,
  getPlantDDL,
  getWarehouseDDL,
  fetchLandingData,
} from "../helper/Actions";
import ServiceReceiveLandingTable from "./ServiceReceiveLandingTable";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { _todayDate } from "../../../../_helper/_todayDate";
import { setServiceReceiveAction } from "../../../../_helper/reduxForLocalStorage/Actions";

function LandingHeader() {
  const history = useHistory();
  const dispatch = useDispatch();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // Grid Data State
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  // All DDL State
  const [sbuDDL, setSBUDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [warehouseDDL, setWareHouseDDL] = useState([]);

  // Selected DDL State
  const [sbu, setSBU] = useState("");
  const [plant, setPlant] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [fromDate, setFromDate] = useState(_todayDate());
  const [toDate, setToDate] = useState(_todayDate());

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { serviceReceive } = useSelector((state) => {
    return state.localStorage;
  }, shallowEqual);

  useEffect(() => {
    if (serviceReceive?.plant?.value) {
      const serviceData = serviceReceive;
      setSBU(serviceData.sbu);
      setPlant(serviceData.plant);
      setWarehouse(serviceData.warehouse);
      setFromDate(serviceData.fromDate);
      setToDate(serviceData.toDate);
      onChangeForPlant(serviceData.plant);
      if (serviceData.sbu && serviceData.plant && serviceData.warehouse) {
        fetchLandingData(
          serviceData?.fromDate,
          serviceData?.toDate,
          profileData.accountId,
          selectedBusinessUnit.value,
          serviceData.plant.value,
          serviceData.warehouse.value,
          serviceData.sbu.value,
          setGridData,
          setLoading,
          pageNo,
          pageSize,
          setTotalCount
        );
      }
    }
  }, [profileData.accountId, selectedBusinessUnit.value]);

  // // Radio Button State
  // const [radioBtn, setRadioBtn] = useState("pending");

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getSBUDDL(profileData.accountId, selectedBusinessUnit.value, setSBUDDL);
      getPlantDDL(
        profileData.userId,
        profileData.accountId,
        selectedBusinessUnit.value,
        setPlantDDL
      );
    }
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const onChangeForPlant = (valueOption) => {
    getWarehouseDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      valueOption?.value,
      setWareHouseDDL
    );
  };

  const viewGridData = (searchValue = null) => {
    if (plant && warehouse && sbu) {
      fetchLandingData(
        fromDate,
        toDate,
        profileData.accountId,
        selectedBusinessUnit.value,
        plant.value,
        warehouse.value,
        sbu.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize,
        setTotalCount,
        searchValue
      );
      let serviceReceive = {
        sbu,
        plant,
        warehouse,
        fromDate,
        toDate,
      };
      dispatch(setServiceReceiveAction(serviceReceive));
    }
  };

  //setPositionHandler
  const setPositionHandler = (searchValue) => {
    viewGridData(searchValue);
  };
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(searchValue);
  };

  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Service Receive">
          <CardHeaderToolbar>
            <button
              disabled={!sbu || !plant || !warehouse}
              onClick={() => {
                history.push({
                  pathname:
                    "/inventory-management/warehouse-management/serviceReceive/create",
                  state: { sbu, plant, warehouse },
                });

                let serviceReceive = {
                  sbu,
                  plant,
                  warehouse,
                  fromDate,
                  toDate,
                };
                dispatch(setServiceReceiveAction(serviceReceive));
              }}
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="row my-2 global-form">
            <div className="col-md-3">
              <label>Select SBU </label>
              <Select
                onChange={(valueOption) => {
                  setSBU(valueOption);
                }}
                options={sbuDDL}
                value={sbu}
                name="sbu"
                styles={customStyles}
                placeholder="Select SBU"
              />
            </div>
            <div className="col-md-3">
              <label>Select Plant </label>
              <Select
                onChange={(valueOption) => {
                  setPlant(valueOption);
                  onChangeForPlant(valueOption);
                  setWarehouse("");
                }}
                options={plantDDL}
                value={plant}
                isSearchable={true}
                name="plant"
                styles={customStyles}
                placeholder="Select Plant"
              />
            </div>
            <div className="col-md-3">
              <label>Select Warehouse </label>
              <Select
                onChange={(valueOption) => {
                  setWarehouse(valueOption);
                }}
                options={warehouseDDL}
                value={warehouse}
                isSearchable={true}
                name="warehouse"
                styles={customStyles}
                placeholder="Select Warehouse"
              />
            </div>
            <div className="col-md-3">
              <label>From Date</label>
              <input
                className="form-control"
                type="date"
                onChange={(e) => {
                  setFromDate(e.target.value);
                }}
                value={fromDate}
              />
            </div>
            <div className="col-md-3">
              <label>To Date</label>
              <input
                className="form-control"
                type="date"
                onChange={(e) => {
                  setToDate(e.target.value);
                }}
                value={toDate}
              />
            </div>
            <div className="ml-3">
              <button
                className="btn btn-primary"
                onClick={(e) => viewGridData()}
                disabled={!sbu || !plant || !warehouse}
                type="button"
                style={{ marginTop: "15px" }}
              >
                View
              </button>
            </div>
          </div>

          {/* Second Row */}
          {/* <div className="d-flex align-items-center py-6">
            <div className="d-flex align-items-center">
              <input
                type="radio"
                name="radioBtn"
                checked={radioBtn === "pending" && true}
                aria-label="Radio button for following text input"
                onChange={(e) => setRadioBtn("pending")}
              />
              <label className="mx-2">Pending</label>
            </div>
            <div className="d-flex align-items-center">
              <input
                type="radio"
                name="radioBtn"
                aria-label="Radio button for following text input"
                checked={radioBtn === "complete" && true}
                onChange={(e) => setRadioBtn("complete")}
              />
              <label className="mx-2">Complete</label>
            </div>

            <div className="input-group col-lg-3 d-flex flex-column">
              <label htmlFor="searchInput" className="d-block">
                Enter PO Number
              </label>
              <div className=" d-flex flex-row">
                <input
                  id="searchInput"
                  type="text"
                  className="form-control d-block"
                  placeholder="Search..."
                />
                <div className="ml-3">
                  <button className="btn btn-primary" type="button">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div> */}
          {/* Grid Data Table */}
          {loading && <Loading />}
          <PaginationSearch
            placeholder="Code Search"
            paginationSearchHandler={paginationSearchHandler}
          />
          <ServiceReceiveLandingTable gridData={gridData}  viewGridData={viewGridData} setLoading={setLoading}/>
          {/* Pagination Code */}
          {gridData?.length > 0 && (
            <PaginationTable
              count={totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
            />
          )}
        </CardBody>
      </Card>
      {/* First Row */}
    </>
  );
}

export default LandingHeader;
