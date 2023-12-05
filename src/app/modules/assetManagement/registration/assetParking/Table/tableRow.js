/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import {
  getAssetPlantDDL,
  getassetWarehouseData,
  getGridData,
  getAssetSBUDDL,
} from "../helper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import AssetParkingForm from "../Form/addEditForm";
import AssetParkingCreateForm from "../newForm/addEditForm";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function TableRow(props) {
  //const dispatch = useDispatch();
  let history = useHistory();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [plant, setPlant] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  const [isShowModalforCreate, setisShowModalforCreate] = useState(false);
  const [sbuName, setSbuName] = useState("");
  const [sbu, setSbu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plantName?.value,
      warehouseName?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading,
      searchValue
    );
  };

  useEffect(() => {
    getAssetPlantDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlant
    );
    getAssetSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbu);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const onChangeforPlant = (value) => {
    getassetWarehouseData(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      value?.value,
      setWarehouse
    );
  };

  const viewGridData = () => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plantName?.value,
      warehouseName?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <ICustomCard
        title="Asset Parking"
        // renderProps={() => (
        //   <button
        //     className="btn btn-primary"
        //     disabled={!sbuName || !plantName || !warehouseName}
        //     onClick={(e) => setisShowModalforCreate(true)}
        //   >
        //     Create new
        //   </button>
        // )}
      >
        {loading && <Loading />}
        <div className="row global-form my-3">
          <div className="col-lg-2">
            <div className="form-group">
              <label>Select SBU</label>
              <Select
                placeholder="Select SBU"
                value={sbuName}
                onChange={(value) => {
                  setSbuName(value);
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
          <div className="col-lg-2 mt-7">
            <button
              className="btn btn-primary"
              disabled={!plantName || !warehouseName}
              onClick={viewGridData}
            >
              View
            </button>
          </div>

          {/* global-form */}
        </div>
        <PaginationSearch
          placeholder="Asset Code &  PO Code Search"
          paginationSearchHandler={paginationSearchHandler}
        />
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Receive Code</th>
                <th>Code</th>
                <th>Item Name</th>
                <th>UOM name</th>
                <th>Transaction Quantity</th>
                <th>Transaction Value</th>
                <th className="text-right pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item.assetReceiveCode}</td>
                  <td>{item.referenceCode}</td>
                  <td>{item.itemName}</td>
                  <td>{item.uoMname}</td>
                  <td>{item.numTransactionQuantity}</td>
                  <td>{item.monTransactionValue}</td>
                  <td className="text-center">
                    <span
                      onClick={(e) => {
                        setIsShowModal(true);
                        setCurrentRowData(item);
                      }}
                    >
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">{"Create"}</Tooltip>}
                      >
                        <span>
                          <i className="fas fa-plus-square"></i>
                        </span>
                      </OverlayTrigger>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
          <AssetParkingForm
            currentRowData={currentRowData}
            setIsShowModal={setIsShowModal}
          />
        </IViewModal>

        <IViewModal
          show={isShowModalforCreate}
          onHide={() => setisShowModalforCreate(false)}
        >
          <AssetParkingCreateForm
            sbuName={sbuName}
            plantName={plantName}
            warehouseName={warehouseName}
            setIsShowModal={setisShowModalforCreate}
          />
        </IViewModal>
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
