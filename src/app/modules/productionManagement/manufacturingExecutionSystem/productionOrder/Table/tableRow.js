import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import {
  getItemTransferInPagination,
  getPlantDDL_api,
  getShopFloorDDL,
  itemRequest_api,
  productionOrderClose,
} from "../helper";
// import itemRequest from "../../../../_helper/images/item_request.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import customStyles from "../../../../selectCustomStyle";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../../_helper/_confirmModal";
import PaginationSearch from "../../../../_helper/_search";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ProductionOrderViewFormModel from "./viewModal";
// import findIndex from "./../../../../_helper/_findIndex";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { SetManufacturePOTableLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { ItemReqViewTableRow } from "../../../../inventoryManagement/warehouseManagement/itemRequest/report/tableRow";
import ItemRequestModal from "./itemRequestModal";
import ProductionDetails from "./productionDetails";

export function TableRow() {
  const { manufacturePOTableLanding } = useSelector(
    (state) => state.localStorage
  );
  const [gridData, setGridData] = useState([]);
  const [rowDto, setSetRowDto] = useState([]);
  const [selectItemRequest, setSelectItemRequest] = useState([]);
  const [modelShow, setModelShow] = useState(false);
  const [itemRequestModal, setItemRequestModal] = useState(false);
  const [itemRequest, setItemRequest] = useState(true);
  // GetPlantNameDDL
  const [plantName, setPlantName] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(
    manufacturePOTableLanding?.plant
  );
  // GetShopFloorDDL
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [selectedDDLShop, setselectedDDLShop] = React.useState(
    manufacturePOTableLanding?.shopfloor
  );
  // GetStatusDDL
  const [selectedStatus, setSelectedStatus] = useState(
    manufacturePOTableLanding?.status
  );
  const [isShowModal, setIsShowModal] = useState(false);
  const [itemRequestId, setItemRequestId] = useState(null);
  const [isShowProductionModal, setIsShowProductionModal] = useState(false);
  const [productionOrderId, setProductionOrderId] = useState(null);
  const [warehouseDDL, getWarehouseDDL, warehouseDDLloader] = useAxiosGet();
  const history = useHistory();
  const dispatch = useDispatch();

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [, postData] = useAxiosPost();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getPlantDDL_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantName
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const pushData = () => {
    history.push({
      pathname: "/production-management/mes/productionorder/create",
    });
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getItemTransferInPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectedPlant?.value,
      selectedDDLShop?.value,
      selectedStatus?.value,
      setLoader,
      setGridData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  useEffect(() => {
    selectedPlant?.value &&
      selectedDDLShop?.value &&
      getItemTransferInPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        selectedPlant?.value,
        selectedDDLShop?.value,
        selectedStatus?.value,
        setLoader,
        setGridData,
        pageNo,
        pageSize
      );
    selectedPlant?.value &&
      getShopFloorDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        selectedPlant?.value,
        setShopFloorDDL
      );
    getWarehouseDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${selectedPlant?.value}&OrgUnitTypeId=8`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Delete Grid Data
  const singlePOHandler = (index, poId) => {
    if (index && profileData?.accountId && selectedBusinessUnit?.value) {
      let confirmObject = {
        title: "Are you sure to close?",
        message: "If you close this, it can not be undone",
        yesAlertFunc: async () => {
          // Delete Data and Fetch Grid Data
          productionOrderClose(
            poId,
            profileData?.accountId,
            selectedBusinessUnit?.value,
            selectedPlant?.value,
            setLoader,
            setGridData,
            pageNo,
            pageSize
          );
        },
        noAlertFunc: () => {
          history.push("/production-management/mes/productionorder");
        },
      };
      IConfirmModal(confirmObject);
    }
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...gridData?.data];
    copyRowDto[index].isItemRequestCheck = !copyRowDto[index]
      .isItemRequestCheck;
    setGridData({
      ...gridData,
      data: copyRowDto,
    });

    const approval = copyRowDto?.some((itm) => itm.isItemRequestCheck === true);
    if (approval) {
      setItemRequest(false);
    } else {
      setItemRequest(true);
    }
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      isItemRequestCheck: !itm?.isClose && itm?.isItemRequest ? value : false,
    }));
    setGridData({
      ...gridData,
      data: modifyGridData,
    });
    const approval = modifyGridData?.some(
      (itm) => itm.isItemRequestCheck === true
    );
    if (approval) {
      setItemRequest(false);
    } else {
      setItemRequest(true);
    }
  };

  // itemRequest Handler
  const itemRequestHandler = () => {
    const selectedItemRequest = gridData?.data?.filter(
      (item) => item.isItemRequestCheck === true
    );
    if (selectedItemRequest) {
      const payload = selectedItemRequest;
      const callbackFunc = () => {
        setSelectItemRequest(selectedItemRequest);
        setItemRequestModal(true);
      };
      itemRequest_api(
        payload.map((item) => item?.productionOrderId),
        setSetRowDto,
        callbackFunc,
        setLoader
      );
    }
  };

  return (
    <ICustomCard
      title="Production Order"
      renderProps={() => (
        <button className="btn btn-primary" onClick={pushData}>
          Create new
        </button>
      )}
    >
      <Formik>
        <>
          {(loader || warehouseDDLloader) && <Loading />}
          <div className="global-form">
            {/* Header Start */}
            <div>
              <div className="row">
                <div className="col-md-4">
                  <label>Plant</label>
                  <Select
                    onChange={(valueOption) => {
                      setGridData([]);
                      setSelectedPlant(valueOption);
                      setselectedDDLShop("");
                      setSelectedStatus("");
                      getShopFloorDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setShopFloorDDL
                      );
                      getWarehouseDDL(
                        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                      );
                      dispatch(
                        SetManufacturePOTableLandingAction({
                          plant: valueOption,
                          shopfloor: "",
                          status: "",
                        })
                      );
                    }}
                    placeholder="Plant"
                    value={selectedPlant}
                    options={plantName || []}
                    isSearchable={true}
                    styles={customStyles}
                    name={plantName}
                  />
                </div>
                <div className="col-md-4">
                  <label>Shop Floor</label>
                  <Select
                    name={shopFloorDDL}
                    options={shopFloorDDL || []}
                    value={selectedDDLShop}
                    label="Shop Floor"
                    onChange={(valueOption) => {
                      setGridData([]);
                      setselectedDDLShop(valueOption);
                      setSelectedStatus("");
                      dispatch(
                        SetManufacturePOTableLandingAction({
                          plant: selectedPlant,
                          shopfloor: valueOption,
                          status: "",
                        })
                      );
                    }}
                    placeholder="Shop Floor"
                    isSearchable={true}
                    styles={customStyles}
                  />
                </div>
                {/* changes from miraj bhai */}
                <div className="col-md-4">
                  <label>Status</label>
                  <Select
                    name={selectedStatus}
                    options={[
                      { value: "0", label: "All" },
                      { value: "1", label: "Open" },
                      { value: "2", label: "Closed" },
                    ]}
                    value={selectedStatus}
                    label="Status"
                    onChange={(valueOption) => {
                      setGridData([]);
                      setSelectedStatus(valueOption);
                      getItemTransferInPagination(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        selectedPlant?.value,
                        selectedDDLShop.value,
                        valueOption.value,
                        setLoader,
                        setGridData,
                        pageNo,
                        pageSize
                      );
                      dispatch(
                        SetManufacturePOTableLandingAction({
                          plant: selectedPlant,
                          shopfloor: selectedDDLShop,
                          status: valueOption,
                        })
                      );
                    }}
                    placeholder="Status"
                    isSearchable={true}
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row cash_journal">
            <div className="col-lg-12 pr-0 pl-0 mt-2">
              <div className="d-flex">
                <PaginationSearch
                  placeholder="Production Order Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                />
                <div className="ml-2" style={{ marginTop: "0px" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const selectedItemRequest = gridData?.data?.filter(
                        (item) =>
                          item.isItemRequestCheck === true &&
                          item?.isBackCalculation === 2
                      );

                      const isExist = selectedItemRequest?.some(
                        (item) => item?.isBackCalculation === 2
                      );

                      if (
                        selectedDDLShop?.value === 106 &&
                        isExist &&
                        selectedItemRequest?.length > 1
                      ) {
                        return toast.warn(
                          "You cannot have multiple item requests for Shop Floor => Contract Manufacturing (Rice)"
                        );
                      }
                      itemRequestHandler();
                    }}
                    disabled={itemRequest}
                  >
                    Item Request
                  </button>
                </div>
              </div>

              {gridData?.data?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "23px" }}>
                          <input
                            type="checkbox"
                            id="parent"
                            onChange={(event) => {
                              allGridCheck(event.target.checked);
                            }}
                          />
                        </th>
                        <th>SL</th>
                        <th>Production Order Date</th>
                        <th>Production Order Code</th>
                        <th>Item Name</th>
                        <th>BOM Type</th>
                        <th>WorkCenter Name</th>
                        <th>Order Qty</th>
                        <th>Uom Name</th>
                        <th>Item Request Code</th>
                        <th style={{ width: "120px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.length > 0 &&
                        gridData?.data?.map((item, index) => (
                          <tr>
                            <td>
                              <input
                                id="itemCheck"
                                type="checkbox"
                                className=""
                                value={item.isItemRequestCheck}
                                checked={item.isItemRequestCheck}
                                name={item.isItemRequestCheck}
                                onChange={(e) => {
                                  //setFieldValue("itemCheck", e.target.checked);
                                  itemSlectedHandler(e.target.checked, index);
                                }}
                                disabled={
                                  item?.isItemRequestFalse || item?.isClose
                                }
                              />
                            </td>
                            <td className="text-center">{item?.sl}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.startDate)}
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.productionOrderCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.itemName} [{item?.itemCode}]
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.strBillOfTypeName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.workCenterName}</div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.orderQty}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.uomName}</div>
                            </td>
                            <td
                              className="text-center pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemRequestId(item?.itemRequestId);
                                setIsShowModal(true);
                              }}
                            >
                              <span style={{ color: "rgb(3 88 176)" }}>
                                {item?.isBackCalculation === 2 ||
                                item?.isBackCalculation === 0
                                  ? item?.itemRequestCode
                                  : ""}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      history.push(
                                        `/production-management/mes/productionorder/view/${item?.productionOrderId}`
                                      );
                                    }}
                                  />
                                </span>

                                <button
                                  className="edit btn p-0"
                                  onClick={() => {
                                    history.push(
                                      `/production-management/mes/productionorder/edit/${item?.productionOrderId}`
                                    );
                                  }}
                                  disabled={
                                    item?.isItemRequestFalse || item?.isClose
                                  }
                                >
                                  <IEdit />
                                </button>

                                {item?.isBackCalculation === 0 ? (
                                  <button
                                    className="btn p-0"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/production-management/mes/productionorder/createSubPO/${item?.productionOrderId}`,
                                        state: {
                                          orderQty: item?.orderQty,
                                          bomId: item?.bomId,
                                          lotSize: item?.lotSize,
                                          shopFloorId: item?.shopFloorId,
                                        },
                                      });
                                    }}
                                    disabled={!item?.isBOM || item?.isClose}
                                  >
                                    <span className="extend">
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">
                                            {"Create Sub-PO"}
                                          </Tooltip>
                                        }
                                      >
                                        <span>
                                          <i className={`fa fa-arrows-alt`}></i>
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                  </button>
                                ) : null}

                                {item?.isBackCalculation === 2 ? (
                                  <button
                                    className="btn p-0"
                                    onClick={() => {
                                      setIsShowProductionModal(true);
                                      setProductionOrderId(
                                        item?.productionOrderId
                                      );
                                    }}
                                  >
                                    <span className="extend">
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">
                                            {"Production Details"}
                                          </Tooltip>
                                        }
                                      >
                                        <span>
                                          <i
                                            className={`fa fa-info-circle`}
                                          ></i>
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                  </button>
                                ) : null}

                                {item?.isBackCalculation === 0 && (
                                  <>
                                    {/* business logic cange by Miraj vai */}
                                    <button
                                      className="btn p-0"
                                      onClick={() => {
                                        singlePOHandler(
                                          item?.productionOrderId,
                                          item?.productionOrderId
                                        );
                                      }}
                                      disabled={item?.isClose === true}
                                    >
                                      <span>
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip id="delete-icon">
                                              {"Close"}
                                            </Tooltip>
                                          }
                                        >
                                          <span>
                                            <i
                                              className="fas fa-times-circle text-danger"
                                              aria-hidden="true"
                                            ></i>
                                          </span>
                                        </OverlayTrigger>
                                      </span>
                                    </button>
                                  </>
                                )}

                                {false && (
                                  <>
                                    {/* Miraj Vai Changes  */}
                                    <button
                                      className="btn p-0"
                                      onClick={() => {
                                        history.push({
                                          pathname: `/production-management/mes/productionorder/closed`,
                                          state: { ...item },
                                        });
                                        console.log(item.sl);
                                      }}
                                      disabled={item?.isClose === true}
                                    >
                                      <span>
                                        <OverlayTrigger
                                          overlay={
                                            <Tooltip id="delete-icon">
                                              {"Close"}
                                            </Tooltip>
                                          }
                                        >
                                          <span>
                                            <i
                                              className="fas fa-times-circle text-danger"
                                              aria-hidden="true"
                                            ></i>
                                          </span>
                                        </OverlayTrigger>
                                      </span>
                                    </button>
                                  </>
                                )}
                                <button
                                  className="btn p-0"
                                  disabled={!item?.isDeleteEnable}
                                  onClick={() => {
                                    postData(
                                      // `/mes/ProductionOrder/DeleteProductionOrder?ProductionOrderId=${item?.productionOrderId}`,
                                      `/mes/ProductionOrder/DeleteProductionOrder?ProductionOrderId=${item?.productionOrderId}&ActionBy=${profileData?.accountId}`,
                                      null,
                                      () => {
                                        getItemTransferInPagination(
                                          profileData?.accountId,
                                          selectedBusinessUnit?.value,
                                          selectedPlant?.value,
                                          selectedDDLShop?.value,
                                          setLoader,
                                          setGridData,
                                          pageNo,
                                          pageSize
                                        );
                                      },
                                      true
                                    );
                                  }}
                                >
                                  <IDelete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Pagination Code */}
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{
                pageNo,
                setPageNo,
                pageSize,
                setPageSize,
              }}
            />
          )}
          <ProductionOrderViewFormModel
            show={modelShow}
            plantNameDDL={plantName}
            onHide={() => {
              setModelShow(false);
              getItemTransferInPagination(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                plantName[0]?.value,
                setLoader,
                setGridData,
                pageNo,
                pageSize
              );
            }}
          />

          {/* item request list  */}
          <ItemRequestModal
            callLandingApiAgain={() => {
              getItemTransferInPagination(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                selectedPlant?.value,
                selectedDDLShop?.value,
                selectedStatus?.value,
                setLoader,
                setGridData,
                pageNo,
                pageSize,
                ""
              );
            }}
            show={itemRequestModal}
            onHide={() => setItemRequestModal(false)}
            rowDto={rowDto}
            selectItemRequest={selectItemRequest}
            setItemRequestModal={setItemRequestModal}
            wareHouseId={selectedDDLShop?.wearHouseId}
            warehouseDDL={warehouseDDL}
          />
        </>
      </Formik>
      <IViewModal
        show={isShowModal && itemRequestId}
        onHide={() => {
          setItemRequestId(null);
          setIsShowModal(false);
        }}
      >
        <ItemReqViewTableRow IrId={itemRequestId} />
      </IViewModal>
      <IViewModal
        show={isShowProductionModal}
        onHide={() => {
          setProductionOrderId(null);
          setIsShowProductionModal(false);
        }}
      >
        <ProductionDetails
          productionOrderId={productionOrderId}
          selectedBusinessUnit={selectedBusinessUnit}
        />
      </IViewModal>
    </ICustomCard>
  );
}
