import React, { useEffect, useState } from "react";
// import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual } from "react-redux";
// import { useUIContext } from "../../../../_helper/uiContextHelper";
// import { TableAction } from "../../../../_helper/columnFormatter";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import {
  getSbuDDL,
  getPlantDDL,
  getWareHouseDDL,
  getGridData,
} from "../helper";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
// import { getControllingUnitGridData } from "../_redux/Actions";

export function TableRow() {
  const history = useHistory();

  const [gridData, setGridData] = useState([]);

  // DDL State
  const [sbuDDL, setSbuDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [wareHouseDDL, setWareHouseDDL] = useState([]);

  // Selected DDl stated

  const [selectedSbu, setSelectedSbu] = useState("");
  const [SelectedPlant, setSelectedPlant] = useState("");
  const [SelectedWareHouse, setSelectedWareHouse] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit list  from store
  // const gridData = useSelector((state) => {
  //   return state.costControllingUnit?.gridData;
  // }, shallowEqual);

  useEffect(() => {
    const preSrcData = JSON.parse(localStorage.getItem("invSrcFrm"));
    setSelectedSbu(preSrcData?.selectedSbu);
    setSelectedPlant(preSrcData?.SelectedPlant);
    setSelectedWareHouse(preSrcData?.SelectedWareHouse);

    if (preSrcData && selectedBusinessUnit && profileData) {
      getGridData(
        profileData?.accountId,
        selectedBusinessUnit.value,
        preSrcData?.selectedSbu.value,
        preSrcData?.SelectedPlant.value,
        preSrcData?.SelectedWareHouse.value,
        setGridData
      );

      if (preSrcData?.SelectedPlant) {
        getWareHouseDDL(
          profileData?.accountId,
          selectedBusinessUnit.value,
          preSrcData?.SelectedPlant.value,
          setWareHouseDDL
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getSbuDDL(profileData?.accountId, selectedBusinessUnit.value, setSbuDDL);

      getPlantDDL(
        profileData?.accountId,
        selectedBusinessUnit.value,
        setPlantDDL
      );

      // dispatch(
      //   getControllingUnitGridData(
      //     profileData.accountId,
      //     selectedBusinessUnit.value
      //   )
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // UI Context
  // const uIContext = useUIContext();
  // const uIProps = useMemo(() => {
  //   return {
  //     ids: uIContext.ids,
  //     setIds: uIContext.setIds,
  //     queryParams: uIContext.queryParams,
  //     setQueryParams: uIContext.setQueryParams,
  //     openEditPage: uIContext.openEditPage,
  //     openViewDialog: uIContext.openViewDialog,
  //   };
  // }, [uIContext]);

  // Table columns
  // const columns = [
  //   {
  //     dataField: "sl",
  //     text: "SL",
  //   },
  //   {
  //     dataField: "inventoryTransactionCode",
  //     text: "Transaction Code",
  //   },
  //   {
  //     dataField: "inventoryTransectionGroupName",
  //     text: "Transaction Group",
  //   },
  //   {
  //     dataField: "referenceTypeName",
  //     text: "Reference Type",
  //   },
  //   {
  //     dataField: "referenceCode",
  //     text: "Reference No",
  //   },
  //   {
  //     dataField: "transactionTypeName",
  //     text: "Transaction Type",
  //   },
  //   {
  //     dataField: "inventoryTransactionId",
  //     text: "Actions",
  //     formatter: TableAction,
  //     formatExtraData: {
  //       openEditPage: uIProps.openEditPage,
  //       openViewDialog: uIProps.openViewDialog,
  //       key: "inventoryTransactionId",
  //       isView: 0,
  //       isEdit: true,
  //     },
  //     classes: "text-right pr-0",
  //     headerClasses: "text-right pr-3",
  //     style: {
  //       minWidth: "100px",
  //     },
  //   },
  // ];

  const saveFormData = () => {
    const data = {
      selectedSbu,
      SelectedPlant,
      SelectedWareHouse,
    };
    localStorage.setItem("invSrcFrm", JSON.stringify(data));
  };

  return (
    <>
      <ICustomCard
        title="GRN for PO"
        renderProps={(e) => (
          <button
            onClick={(e) => {
              history.push({
                pathname:
                  "/inventory-management/warehouse-management/grnForPO/add",
                state: { selectedSbu, SelectedPlant, SelectedWareHouse },
              });
              saveFormData();
            }}
            type="button"
            class="btn btn-primary"
            disabled={!selectedSbu || !SelectedWareHouse || !SelectedPlant}
          >
            Create New
          </button>
        )}
      >
        <div className="headerForm" style={{ marginBottom: "20px" }}>
          <div className="row">
            <div className="col-md-3">
              <div class="form-group">
                <label>SBU</label>
                <Select
                  value={selectedSbu}
                  onChange={setSelectedSbu}
                  options={sbuDDL}
                  styles={customStyles}
                />
              </div>
            </div>

            <div className="col-md-3">
              <div class="form-group">
                <label>Plant</label>
                <Select
                  value={SelectedPlant}
                  onChange={(data) => {
                    setSelectedPlant(data);
                    setSelectedWareHouse("");
                    // getWareHouseDDL
                    getWareHouseDDL(
                      profileData?.accountId,
                      selectedBusinessUnit.value,
                      data?.value,
                      setWareHouseDDL
                    );
                  }}
                  options={plantDDL}
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div class="form-group">
                <label>Warehouse</label>
                <Select
                  value={SelectedWareHouse}
                  onChange={setSelectedWareHouse}
                  options={wareHouseDDL}
                  styles={customStyles}
                  isDisabled={!SelectedPlant}
                />
              </div>
            </div>
            <div className="col-md-3">
              <button
                style={{ marginTop: "28px" }}
                type="button"
                class="btn btn-primary"
                disabled={!selectedSbu || !SelectedWareHouse || !SelectedPlant}
                onClick={(e) => {
                  getGridData(
                    profileData?.accountId,
                    selectedBusinessUnit.value,
                    selectedSbu.value,
                    SelectedPlant.value,
                    SelectedWareHouse.value,
                    setGridData
                  );
                  saveFormData();
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table class="table table table-head-custom table-vertical-center">
            <thead>
              <tr>
                <th tabindex="0">SL</th>
                <th tabindex="0">Transaction Code</th>
                <th tabindex="0">Transaction Group</th>
                <th tabindex="0">Reference Type</th>
                <th tabindex="0">Reference No</th>
                <th tabindex="0">Transaction Type</th>
                <th tabindex="0" class="text-right pr-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {gridData.map((item, i) => (
                <tr>
                  <td>{i}</td>
                  <td>{item.inventoryTransactionCode}</td>
                  <td>{item.inventoryTransectionGroupName}</td>
                  <td>{item.referenceTypeName}</td>
                  <td>{item.referenceCode}</td>
                  <td>{item.transactionTypeName}</td>
                  <td>
                    <div className="tableAction">
                      <IView
                        clickHandler={(e) => {
                          history.push({
                            pathname: `/inventory-management/warehouse-management/inventorytransaction/view/${item.inventoryTransactionId}`,
                            state: {
                              selectedSbu,
                              SelectedPlant,
                              SelectedWareHouse,
                            },
                          });
                        }}
                      />

                      <span
                        onClick={(e) => {
                          history.push({
                            pathname: `/inventory-management/warehouse-management/inventorytransaction/edit/${item.inventoryTransactionId}`,
                            state: {
                              selectedSbu,
                              SelectedPlant,
                              SelectedWareHouse,
                            },
                          });
                        }}
                      >
                        <IEdit />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* <BootstrapTable
          wrapperClasses="table-responsive"
          classes="table table-head-custom table-vertical-center"
          bootstrap4
          bordered={false}
          remote
          keyField="controllingUnitId"
          data={gridData}
          columns={columns}
        ></BootstrapTable> */}
      </ICustomCard>
    </>
  );
}
