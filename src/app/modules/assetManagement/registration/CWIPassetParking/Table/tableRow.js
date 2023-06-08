/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { getAssetPlantDDL, getassetWarehouseData, getAssetListByUnit } from "../helper";
import IViewModal from "../../../../_helper/_viewModal";
import Loading from "../../../../_helper/_loading";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import AssetListForm from "../Form/addEditForm";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAssetPlantDDL(profileData?.userId, profileData?.accountId, selectedBusinessUnit?.value, setPlant);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const onChangeforPlant = (value) => {
    getassetWarehouseData(profileData?.userId, profileData?.accountId, selectedBusinessUnit?.value, value?.value, setWarehouse);
  };

  const viewGridData = () => {
    getAssetListByUnit({
      buId: selectedBusinessUnit?.value,
      whId: warehouseName?.value,
      setter: setGridData,
      setLoading,
    });
  };

  console.log("currentRowData", currentRowData);

  return (
    <>
      <ICustomCard
        title="CWIP Asset Parking"
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
            <button className="btn btn-primary" disabled={!plantName || !warehouseName} onClick={viewGridData}>
              View
            </button>
          </div>

          {/* global-form */}
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Asset Name</th>
                <th>Asset Code</th>
                <th>Type</th>
                <th>Category</th>
                <th>Invoice Value</th>
                <th>Location </th>
                <th className="text-right pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.map((item, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{item.strAssetName}</td>
                  <td>{item.strAssetCode}</td>
                  <td>{item.strAssetTypeName}</td>
                  <td>{item.strAssetCategory}</td>
                  <td>{_formatMoney(item.numInvoiceValue)}</td>
                  <td>{item.strLocation}</td>
                  <td className="text-center">
                    <span
                      onClick={(e) => {
                        setIsShowModal(true);
                        setCurrentRowData(item);
                      }}
                    >
                      <IEdit />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <IViewModal
          show={isShowModal}
          onHide={() => {
            setIsShowModal(false);
            setCurrentRowData(null);
          }}
        >
          <AssetListForm currentRowData={currentRowData} setIsShowModal={setIsShowModal} />
        </IViewModal>

        {/* <IViewModal show={isShowModalforCreate} onHide={() => setisShowModalforCreate(false)}>
          <AssetParkingCreateForm sbuName={sbuName} plantName={plantName} warehouseName={warehouseName} setIsShowModal={setisShowModalforCreate} />
        </IViewModal> */}
      </ICustomCard>
    </>
  );
}
