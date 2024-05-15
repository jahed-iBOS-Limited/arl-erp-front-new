/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../../../_helper/_helperIcons/_edit";
import Select from "react-select";
import { GetLoadUnloadBillPagination, getShipPointDDL } from "../helper";
import customStyles from "../../../../../../selectCustomStyle";
import Loading from "../../../../../../_helper/_loading";
import PaginationTable from "../../../../../../_helper/_tablePagination";
export function TableRow() {
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [selectShipPoint, setSelectShipPoint] = useState("");
  const [landingPageData, setLandingPageData] = useState([]);
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getShipPointDDL(
      profileData.accountId,
      selectedBusinessUnit?.value,
      setShipPointDDL
    );
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    GetLoadUnloadBillPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectShipPoint?.value,
      setLandingPageData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      shipPointDDL?.length > 0
    ) {
      setSelectShipPoint(shipPointDDL[0]);
      GetLoadUnloadBillPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        shipPointDDL[0]?.value,
        setLandingPageData,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, shipPointDDL]);
  return (
    <>
      {/* Table Start */}
      <div className="row global-form">
        <div className="col-lg-3">
          <label>Select ShipPoint</label>
          <Select
            placeholder="Select Ship Point"
            value={selectShipPoint}
            onChange={(valueOption) => {
              setSelectShipPoint(valueOption);
              GetLoadUnloadBillPagination(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                valueOption?.value,
                setLandingPageData,
                setLoading,
                pageNo,
                pageSize
              );
            }}
            styles={customStyles}
            options={shipPointDDL}
          />
        </div>
      </div>
      {loading && <Loading />}

      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Item Name</th>

              <th>Vehicle Capacity</th>
              <th>Quantity</th>
              <th>Load Amount</th>
              <th>Unload Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {landingPageData?.data?.map((item, index) => (
              <tr key={index}>
                <td> {item.sl}</td>
                <td>
                  <div className="pl-2">{item?.itemName || item?.itemName}</div>
                </td>
                <td>
                  <div className="pl-2">{item?.vehicleCapacityName}</div>
                </td>
                <td>
                  <div className="pl-2">{item?.quantity || item?.quantity}</div>
                </td>
                <td>
                  <div className="pl-2">
                    {item?.loadAmount || item?.loadAmount}
                  </div>
                </td>
                <td>
                  <div className="pl-2">
                    {item?.unloadAmount || item?.unloadAmount}
                  </div>
                </td>
                <td>
                  <div className="d-flex justify-content-around">
                    <span
                      className="edit"
                      onClick={() => {
                        history.push(
                          `/sales-management/configuration/loadunloadbillconfig/edit/${item.itemId}`
                        );
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

      {landingPageData?.data?.length > 0 && (
        <PaginationTable
          count={landingPageData?.count}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
