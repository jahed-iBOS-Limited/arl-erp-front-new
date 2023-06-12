/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import {
  GetBillofMaterialPagination,
  getPlantDDL,
  getShopFloorDDL,
} from "../helper";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";
import CostView from "./../../../../personal/approval/commonApproval/Table/_costView";
import IViewModal from "../../../../_helper/_viewModal";
import CostViewTable from "./../../../../personal/approval/commonApproval/Table/CostView/CostView";
import { SetManufactureBOMTableLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { Formik } from "formik";
import ICustomCard from "../../../../_helper/_customCard";

export function TableRow() {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [isShowModalForCostView, setisShowModalForCostView] = useState(false);
  const [item, setItem] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [selectedDDLItem, setSelectedDDLItem] = React.useState("");
  const [selectedDDLShop, setselectedDDLShop] = React.useState("");

  const { manufactureBOMTableLanding } = useSelector(
    (state) => state.localStorage
  );

  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (manufactureBOMTableLanding) {
      GetBillofMaterialPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        manufactureBOMTableLanding?.plant?.value,
        manufactureBOMTableLanding?.shopfloor?.value,
        setLoading,
        setGridData,
        pageNo,
        pageSize
      );
      manufactureBOMTableLanding?.plant?.value !== selectedDDLItem?.value &&
        setSelectedDDLItem(manufactureBOMTableLanding?.plant);
      manufactureBOMTableLanding?.shopfloor?.value !== selectedDDLShop?.value &&
        setselectedDDLShop(manufactureBOMTableLanding?.shopfloor);
      manufactureBOMTableLanding?.plant?.value !== selectedDDLShop?.value &&
        getShopFloorDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          manufactureBOMTableLanding?.plant?.value,
          setShopFloorDDL
        );
    }
  }, [profileData, selectedBusinessUnit, manufactureBOMTableLanding]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    GetBillofMaterialPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectedDDLItem?.value,
      selectedDDLShop?.value,
      setLoading,
      setGridData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  console.log(manufactureBOMTableLanding);

  return (
    <ICustomCard
      title="Bill of Materials"
      renderProps={() => (
        <button className="btn btn-primary" onClick={() => {
          history.push({
            pathname: '/production-management/mes/bill-of-material/create',
          });
        }}>
          Create
        </button>
      )}
    >
      <Formik>
        <>
          {loading && <Loading />}
          <div
            style={{
              paddingBottom: "8px",
              marginLeft: "-13px",
              paddingLeft: ".50rem",
              paddingRight: ".50rem",
              width: "max-content",
            }}
            className="d-flex mt-3 bank-journal bank-journal-custom bj-left expenseRegister"
          >
            <div style={{ width: "375px" }}>
              <div className="row">
                <div className="col-lg-6">
                  <label>Plant</label>
                  <Select
                    onChange={(valueOption) => {
                      // dispatch(setBomLandingAction(valueOption));
                      setSelectedDDLItem(valueOption);
                      setselectedDDLShop("");
                      dispatch(
                        SetManufactureBOMTableLandingAction({
                          plant: valueOption,
                          shopfloor: "",
                        })
                      );
                    }}
                    value={selectedDDLItem}
                    options={plantDDL || []}
                    isSearchable={true}
                    styles={customStyles}
                    name={plantDDL}
                  />
                </div>
                <div className="col-lg-6">
                  <label>Shop Floor</label>
                  <Select
                    name={shopFloorDDL}
                    options={shopFloorDDL || []}
                    value={selectedDDLShop}
                    onChange={(valueOption) => {
                      setselectedDDLShop(valueOption);
                      GetBillofMaterialPagination(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        selectedDDLItem?.value,
                        valueOption?.value,
                        setLoading,
                        setGridData,
                        pageNo,
                        pageSize
                      );
                      dispatch(
                        SetManufactureBOMTableLandingAction({
                          plant: selectedDDLItem,
                          shopfloor: valueOption,
                        })
                      );
                    }}
                    isSearchable={true}
                    styles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row cash_journal">
            <div className="col-lg-12 pr-0 pl-0">
              <PaginationSearch
                placeholder="BOM Code Search"
                paginationSearchHandler={paginationSearchHandler}
              />
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    <th style={{ width: "90px" }}>Item Code</th>
                    <th>BOM Name</th>
                    <th>BOM Version Name</th>
                    {/* <th style={{ width: "50px" }}>BOM Code</th> */}
                    <th style={{ width: "60px" }}>Lot Size</th>
                    <th style={{ width: "90px" }}>UoM</th>
                    <th style={{ width: "90px" }}>Status</th>
                    <th style={{ width: "90px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => (
                      <tr key={index}>
                        {/* key={item.businessUnitId} */}
                        <td>{item?.sl}</td>
                        <td>
                          <div className="text-center">{item?.itemCode}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item?.billOfMaterialName}</div>
                        </td>
                        <td>
                          <div className="text-center">
                            {item?.boMItemVersionName}
                          </div>
                        </td>
                        {/* <td>
                      <div className="text-center">
                        {item.billOfMaterialCode}
                      </div>
                    </td> */}
                        {/* <td>
                      <div className="text-left pl-2">{item.plantName}</div>
                    </td> */}
                        <td>
                          <div className="text-center">{item?.lotSize}</div>
                        </td>
                        <td>
                          <div className="text-left pl-2">{item?.uoMName}</div>
                        </td>
                        <td>
                          <div style={{
                            color: item?.isApproved ? "green" : "yellow",
                            fontWeight:800
                          }} className="text-center pl-2">{item?.isApproved ? "Approved" : "Pending"}</div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <span className="view mr-3 mt-1">
                              <IView
                                clickHandler={() => {
                                  history.push(
                                    `/production-management/mes/bill-of-material/view/${item?.billOfMaterialId}`
                                  );
                                }}
                              />
                            </span>
                            <span
                              className="edit mr-3 mt-1"
                              onClick={() => {
                                history.push({
                                  pathname: `/production-management/mes/bill-of-material/edit/${item?.billOfMaterialId}`,
                                  state: { plantId: item.plantId },
                                });
                              }}
                            >
                              <IEdit />
                            </span>
                            <span className="view">
                              <CostView
                                title={"Cost View"}
                                clickHandler={() => {
                                  setisShowModalForCostView(true);
                                  setItem(item);
                                  console.log("item: ", item);
                                }}
                              />
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination Code */}
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}

          {/* modal 2 */}
          <IViewModal
            show={isShowModalForCostView}
            onHide={() => setisShowModalForCostView(false)}
          >
            <CostViewTable item={item} />
          </IViewModal>
        </>
      </Formik>
    </ICustomCard>


  );
}
