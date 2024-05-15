import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import {
  getActivityDDL,
  getGridData,
  approvalApi,
  getModuleNameDDL,
  getPlantDDL,
  BOMApprovalLanding,
} from "../helper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import LeaveApprovalGrid from "../leaveApprovalGrid/landing";
import MovementApprovalGrid from "../moveApprovalGrid/landing";
import LoanApprovalGrid from "../loanApprovalGrid/landing";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import "./approval.css";
import PurchaseOrderApprovalGrid from "../purchaseOrder/landing";
import PurchaseRequestApprovalGrid from "../purchaseRequest/landing";
import ItemRequestApprovalGrid from "../itemRequest/landing";
import PurchaseReturnApprovalGrid from "../returnPo/landing";
import GatePassApprovalGrid from "../gatePass/landing";
import { setIBOS_app_activityAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import NewSelect from "../../../../_helper/_select";
import BillOfMaterialTable from "./billOfMaterialTable";
import { saveBOMApproval_api } from "./../helper";

export function TableRow(props) {
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  let history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  // paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [plantDDL, setPlantDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { ibos_app_activity } = useSelector((state) => {
    return state.localStorage;
  }, shallowEqual);

  // DDL & selected DDL Item
  const [moduleNameDDL, setModuleNameDDL] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [activityName, setActivityName] = useState("");
  const [activity, setActivity] = useState([]);
  const [activityChange, setActivityChange] = useState(0);

  // Load DDL
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getModuleNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setModuleNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // Other's Grid Data load by onchange
  const onChangeForActivity = (activity) => {
    if (
      activity?.label === "Loan Approval" ||
      activity?.label === "Movement Approval" ||
      activity?.label === "Leave Approval" ||
      activity?.label === "Purchase Order" ||
      activity?.label === "Purchase Request" ||
      activity?.label === "Item Request" ||
      activity?.label === "Purchase Return" ||
      activity?.label === "Gate Pass"
    ) {
      setActivityChange((prev) => prev + 1);
      return;
    } else {
      // getGridData(
      //   selectedBusinessUnit?.value,
      //   activity?.label,
      //   profileData?.userId,
      //   setGridData,
      //   setLoading,
      //   pageNo,
      //   pageSize
      // );
    }
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      activityName?.label === "Bill Of Material"
    ) {
      commonBillOfMaterialGridFunc(pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, activityName]);

  // const singleApprovalndler = (poId) => {
  //   let confirmObject = {
  //     title: "Are you sure?",
  //     message: `Do you want to approve this PO?`,
  //     yesAlertFunc: () => {

  //     },
  //     noAlertFunc: () => {
  //       //alert("Click No");
  //     },
  //   };
  //   Idal(confirmObject);
  // };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getGridData(
      selectedBusinessUnit?.value,
      activityName?.label,
      profileData?.userId,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  useEffect(() => {
    const activity = ibos_app_activity;
    if (activity) {
      setSelectedModule(activity?.moduleName);
      setActivityName(activity?.activityName);
      onChangeForActivity(activity.activityName);
      getActivityDDL(activity?.moduleName?.value, setActivity);
      setSelectedPlant(activity?.selectedPlant || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gridData?.data?.length > 0) {
      setRowDto({
        data: gridData?.data?.map((itm) => ({
          ...itm,
          isSelect: false,
        })),
        totalCount: gridData?.totalCount,
        currentPage: gridData?.currentPage,
        pageSize: gridData?.pageSize,
      });
    } else {
      setRowDto([]);
    }
  }, [gridData]);

  // one item select
  const itemSlectedHandler = (value, index) => {
    if (rowDto?.data?.length > 0) {
      let newRowDto = rowDto?.data;
      newRowDto[index].isSelect = value;
      setRowDto({
        ...rowDto,
        data: newRowDto,
      });
      // btn hide conditon
      const bllSubmitBtn = newRowDto?.some((itm) => itm.isSelect === true);
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  // All item select
  const allGridCheck = (value) => {
    if (rowDto?.data?.length > 0) {
      const modifyGridData = rowDto?.data?.map((itm) => ({
        ...itm,
        isSelect: value,
      }));
      setRowDto({
        ...rowDto,
        data: modifyGridData,
      });
      // btn hide conditon
      const bllSubmitBtn = modifyGridData?.some((itm) => itm.isSelect === true);
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  const commonBillOfMaterialGridFunc = (pageNo, pageSize) => {
    BOMApprovalLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectedPlant?.value,
      profileData?.userId,
      pageNo,
      pageSize,
      setLoading,
      setTableData
    );
  };

  const setPositionHandlerBillOfMaterial = (pageNo, pageSize) => {
    commonBillOfMaterialGridFunc(pageNo, pageSize);
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected approve submit`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.data?.filter(
          (item) => item?.isSelect
        );
        const payload = filterSelectedData?.map((item) => {
          return {
            activityName: activityName?.label,
            poId: item?.transectionId,
            businessUnitId: selectedBusinessUnit?.value,
            userId: profileData?.userId,
          };
        });
        // Bill Of Material
        if (activityName?.label === "Bill Of Material") {
          const filterSelectedData = tableData?.data?.filter(
            (item) => item?.isSelected
          );
          const billofmaterialpayload = filterSelectedData?.map((itm) => ({
            billOfMaterialId: itm?.billOfMaterialId || 0,
            actionBy: profileData?.userId,
          }));
          saveBOMApproval_api(billofmaterialpayload, () => {
            commonBillOfMaterialGridFunc(pageNo, pageSize);
          });
        } else {
          approvalApi(payload, activityName, onChangeForActivity);
        }
        setBillSubmitBtn(true);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <ICustomCard title="Store Requisition Approval">
        {/* Form & DDL */}
        <div className="row mt-3 m-0 global-form">
          <div className="col-lg-2">
            <NewSelect
              name="plant"
              placeholder="Select Plant"
              value={selectedPlant}
              onChange={(valueOption) => {
                setRowDto([]);
                setTableData([]);
                setActivityName("");
                setSelectedPlant(valueOption);
              }}
              options={plantDDL}
            />
          </div>

          <div className="col-lg-2">
            <label>Select Module Name</label>
            <Select
              placeholder="Module Name"
              value={selectedModule}
              onChange={(valueOption) => {
                setRowDto([]);
                setTableData([]);
                setActivityName("");
                setSelectedModule(valueOption);
                getActivityDDL(valueOption?.value, setActivity);
              }}
              styles={customStyles}
              isSearchable={true}
              options={moduleNameDDL}
            />
          </div>
          <div className="col-lg-2">
            <label>Select Activity Name</label>
            <Select
              placeholder="Activity Name"
              value={activityName}
              onChange={(valueOption) => {
                setRowDto([]);
                dispatch(
                  setIBOS_app_activityAction({
                    activityName: valueOption || "",
                    moduleName: selectedModule || "",
                    selectedPlant: selectedPlant || "",
                  })
                );
                setActivityName(valueOption);
                onChangeForActivity(valueOption);
                setTableData([]);
                commonBillOfMaterialGridFunc(pageNo, pageSize);
              }}
              styles={customStyles}
              isSearchable={true}
              options={activity}
            />
          </div>

          {activityName?.label === "Loan Approval" ||
          activityName?.label === "Movement Approval" ||
          activityName?.label === "Leave Approval" ||
          activityName?.label === "Purchase Order" ||
          activityName?.label === "Purchase Request" ||
          activityName?.label === "Item Request" ||
          activityName?.label === "Purchase Return" ||
          activityName?.label === "Gate Pass" ? null : (
            <div className="col-lg-3 mt-4 offset-3 d-flex justify-content-end">
              <button
                type="button"
                className="approvalButton btn btn-primary mr-1"
                onClick={() => approveSubmitlHandler()}
                disabled={billSubmitBtn}
              >
                Approve
              </button>
            </div>
          )}
        </div>

        {/* All Grid */}
        {activityName?.label === "Loan Approval" ||
        activityName?.label === "Movement Approval" ||
        activityName?.label === "Leave Approval" ||
        activityName?.label === "Purchase Order" ||
        activityName?.label === "Purchase Request" ||
        activityName?.label === "Item Request" ||
        activityName?.label === "Purchase Return" ||
        activityName?.label === "Gate Pass" ? (
          <>
            {activityName?.label === "Leave Approval" && <LeaveApprovalGrid />}
            {activityName?.label === "Movement Approval" && (
              <MovementApprovalGrid />
            )}
            {activityName?.label === "Loan Approval" && <LoanApprovalGrid />}
            {activityName?.label === "Purchase Order" && (
              <PurchaseOrderApprovalGrid
                onChangeForActivity={onChangeForActivity}
                activityName={activityName}
                activityChange={activityChange}
                selectedPlant={selectedPlant}
              />
            )}
            {}
            {activityName?.label === "Purchase Request" && (
              <PurchaseRequestApprovalGrid
                onChangeForActivity={onChangeForActivity}
                activityName={activityName}
                activityChange={activityChange}
                selectedPlant={selectedPlant}
              />
            )}
            {activityName?.label === "Item Request" && (
              <ItemRequestApprovalGrid
                onChangeForActivity={onChangeForActivity}
                activityName={activityName}
                activityChange={activityChange}
                selectedPlant={selectedPlant}
              />
            )}
            {activityName?.label === "Purchase Return" && (
              <PurchaseReturnApprovalGrid
                onChangeForActivity={onChangeForActivity}
                activityName={activityName}
                activityChange={activityChange}
                selectedPlant={selectedPlant}
              />
            )}
            {activityName?.label === "Gate Pass" && (
              <GatePassApprovalGrid
                onChangeForActivity={onChangeForActivity}
                activityName={activityName}
                activityChange={activityChange}
                selectedPlant={selectedPlant}
              />
            )}
          </>
        ) : (
          rowDto?.data?.length <= 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                {loading && <Loading />}
                <thead>
                  <tr>
                    <th style={{ width: "20px" }}>
                      <input
                        type="checkbox"
                        id="parent"
                        onChange={(event) => {
                          allGridCheck(event.target.checked);
                        }}
                      />
                    </th>
                    <th>SL</th>
                    <th>Reff Code</th>
                    <th>Transaction Date</th>
                    <th>Due Date</th>
                    {activityName?.label === "Purchase Order" && (
                      <th>Amount</th>
                    )}
                    <th>Quantity</th>
                    <th>Description</th>
                    <th className="text-right pr-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.data?.map((item, i) => (
                    <tr>
                      <td>
                        <input
                          id="isSelect"
                          type="checkbox"
                          value={item?.isSelect}
                          checked={item?.isSelect}
                          onChange={(e) => {
                            itemSlectedHandler(e.target.checked, i);
                          }}
                        />
                      </td>
                      <td className="text-center">{i + 1}</td>
                      <td>
                        <span className="pl-2">{item.reffCode}</span>
                      </td>
                      <td className="text-center">
                        {_todayDate(item.transectionDate)}
                      </td>
                      <td className="text-center">
                        {_dateFormatter(item.dueDate)}
                      </td>
                      {activityName?.label === "Purchase Order" && (
                        <td className="text-center">{item.amount}</td>
                      )}
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.description}</td>
                      <td className="text-center">
                        {/* <span
                      className="mr-2"
                      onClick={(e) => singleApprovalndler(item.transectionId)}
                    >
                 
                      <IApproval />
                    </span> */}

                        {activityName?.label === "Purchase Request" && (
                          <span
                            onClick={(e) => {
                              history.push(
                                `/mngProcurement/purchase-management/purchase-request/view/${item?.transectionId}/viewType`
                              );
                            }}
                          >
                            <OverlayTrigger
                              overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}
                            >
                              <span>
                                <i
                                  className={`fa pointer fa-eye`}
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </span>
                        )}

                        {activityName?.label === "Purchase Order" && (
                          <span
                            onClick={(e) => {
                              history.push({
                                pathname: `/mngProcurement/purchase-management/purchaseorder/view/${item?.transectionId}/${item?.intPurchaseOrderTypeId}`,
                                state: true,
                              });
                            }}
                          >
                            <OverlayTrigger
                              overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}
                            >
                              <span>
                                <i
                                  className={`fa pointer fa-eye`}
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </span>
                        )}

                        {activityName?.label === "Item Request" && (
                          <span
                            onClick={(e) => {
                              history.push(
                                `/inventory-management/warehouse-management/item-request/view/${item?.transectionId}`
                              );
                            }}
                          >
                            <OverlayTrigger
                              overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}
                            >
                              <span>
                                <i
                                  className={`fa pointer fa-eye`}
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </span>
                        )}

                        {/* <span>
                    <OverlayTrigger
                      overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}
                    >
                      <span>
                        <i
                          className={`fa pointer fa-eye`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </OverlayTrigger>
                  </span> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
        {activityName?.label === "Bill Of Material" && (
          <BillOfMaterialTable
            obj={{
              loading,
              tableData,
              setTableData,
              setBillSubmitBtn,
              setPageSize,
              pageSize,
              setPageNo,
              pageNo,
              setPositionHandler: setPositionHandlerBillOfMaterial,
            }}
          />
        )}

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
