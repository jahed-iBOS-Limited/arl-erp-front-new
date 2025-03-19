import React from "react";
import { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import customStyles from "../../../../selectCustomStyle";
import Select from "react-select";
import ICustomCard from "../../../../_helper/_customCard";
import IView from "../../../../_helper/_helperIcons/_view";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import {
  getPlantNameDDL_api,
  getShopfloorDDL,
  getShopFloorTransactionTypeDDL,
  ShopFloorTransactionLandingAction,
} from "./../helper";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { SetShopFloorInventoryTransactionAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import IViewModal from "../../../../_helper/_viewModal";
import { InventoryTransactionReportViewTableRow } from "../../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow";
export function TableRow() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [plantDDL, setPlantDDL] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [shopfloorDDL, setShopFloorDDL] = useState([]);
  const [selectedShopFloorDDL, setSelectedShopFloorDDL] = useState("");
  const [transactionTypeDDL, setTransactionTypeDDL] = useState([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [gridData, setGridData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get selected options from local Storage
  const { shopFloorInventoryTransaction } = useSelector((state) => {
    return state?.localStorage;
  }, shallowEqual);

  useEffect(() => {
    if (shopFloorInventoryTransaction?.selectedPlant?.value) {
      setSelectedPlant(shopFloorInventoryTransaction?.selectedPlant);
      setSelectedShopFloorDDL(
        shopFloorInventoryTransaction?.selectedShopFloorDDL
      );
      setSelectedTransactionType(
        shopFloorInventoryTransaction?.selectedTransactionType
      );
      if (!shopfloorDDL.length) {
        getShopfloorDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          shopFloorInventoryTransaction?.selectedPlant?.value,
          setShopFloorDDL
        );
      }
      ShopFloorTransactionLandingAction(
        shopFloorInventoryTransaction?.selectedPlant?.value,
        shopFloorInventoryTransaction?.selectedShopFloorDDL.value,
        shopFloorInventoryTransaction?.selectedTransactionType?.value,
        setGridData,
        setLoader
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopFloorInventoryTransaction, profileData, selectedBusinessUnit]);

  const pushData = () => {
    history.push({
      pathname:
        "/production-management/mes/shopFloorInventoryTransaction/create",
      state: { selectedTransactionType, selectedPlant, selectedShopFloorDDL },
    });
  };

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData.userId
    ) {
      getPlantNameDDL_api(
        profileData.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
      getShopFloorTransactionTypeDDL(setTransactionTypeDDL);
    }
  }, [selectedBusinessUnit, profileData, selectedPlant]);

  return (
    <>
      <ICustomCard
        title="Shop Floor Inventory Transaction"
        renderProps={() => (
          <button
            className="btn btn-primary"
            disabled={!selectedPlant || !selectedShopFloorDDL}
            onClick={pushData}
          >
            Create new
          </button>
        )}
      >
        <div className=" global-form">
          <div className="row">
            <div className="col-lg-3">
              <label>Plant Name</label>
              <Select
                onChange={(valueOption) => {
                  setSelectedPlant(valueOption);
                  getShopfloorDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    valueOption?.value,
                    setShopFloorDDL
                  );
                  setSelectedShopFloorDDL("");
                }}
                value={selectedPlant}
                options={plantDDL}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-3">
              <label>Shop Floor</label>
              <Select
                onChange={(valueOption) => {
                  setSelectedShopFloorDDL(valueOption);
                }}
                value={selectedShopFloorDDL}
                options={shopfloorDDL}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-3">
              <label>Transaction Type</label>
              <Select
                onChange={(valueOption) => {
                  setSelectedTransactionType(valueOption);
                  setGridData([]);
                }}
                value={selectedTransactionType}
                options={transactionTypeDDL}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
            <div className="col-lg-2">
              <button
                type="button"
                className="btn btn-primary mt-5"
                onClick={() => {
                  ShopFloorTransactionLandingAction(
                    selectedPlant?.value,
                    selectedShopFloorDDL?.value,
                    selectedTransactionType?.value,
                    setGridData,
                    setLoader
                  );
                  dispatch(
                    SetShopFloorInventoryTransactionAction({
                      selectedPlant,
                      selectedShopFloorDDL,
                      selectedTransactionType,
                    })
                  );
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
        {/* Table Start */}
        {loader && <Loading />}
        <div className="row cash_journal">
          <div className="col-lg-12 pr-0 pl-0">
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Transaction Code</th>
                    <th>Transaction Date</th>
                    <th>Transaction Quantity</th>
                    {(selectedTransactionType?.value === 2 ||
                      selectedTransactionType?.value === 3) && (
                      <>
                        <th>Reference Code</th>
                        <th>Receive From</th>
                      </>
                    )}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sl}</td>
                      <td>
                        <div className="text-center">
                          {item?.shopFloorInventoryTransactionCode}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(item?.transactionDateTime)}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2 text-center">
                          {item?.transactionQty}
                        </div>
                      </td>

                      {(selectedTransactionType?.value === 2 ||
                        selectedTransactionType?.value === 3) && (
                        <>
                          <td>
                            <div className="text-center">
                              {/* {item?.referenceCode} */}
                              <span
                                className="text-primary font-weight-bold cursor-pointer mr-2"
                                style={{ textDecoration: "underline" }}
                                onClick={() => {
                                  setCurrentRowData(item);
                                  setIsShowModal(true);
                                }}
                              >
                                {item?.referenceCode ? item?.referenceCode : ""}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.receiveFrom}</div>
                          </td>
                        </>
                      )}

                      <td>
                        <div className="d-flex justify-content-around">
                          <span className="view">
                            <IView
                              clickHandler={() => {
                                history.push({
                                  pathname: `/production-management/mes/shopFloorInventoryTransaction/view/${item?.shopFloorInventoryTransactionId}`,
                                  state: {
                                    selectedTransactionType,
                                    selectedPlant,
                                    selectedShopFloorDDL,
                                  },
                                });
                              }}
                            />
                          </span>

                          {/* Edit Commented | Assign By Mamun Ahmed */}
                          {/* <span
                          className="edit"
                          onClick={() => {
                            history.push({
                              pathname: `/production-management/mes/shopFloorInventoryTransaction/edit/${item?.shopFloorInventoryTransactionId}`,
                            });
                          }}
                        >
                          <IEdit />
                        </span> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
          <InventoryTransactionReportViewTableRow
            Invid={currentRowData?.referenceId}
            grId={currentRowData?.referenceTypeId}
            currentRowData={currentRowData}
          />
        </IViewModal>
      </ICustomCard>
    </>
  );
}
