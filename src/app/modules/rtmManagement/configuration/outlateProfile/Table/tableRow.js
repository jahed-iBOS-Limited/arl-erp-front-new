import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import {
  getGridData,
  getBeatApiDDL,
  getRouteNameDDL,
  getTerritotoryWithLevelByEmpDDL,
} from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";

import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import IView from "../../../../_helper/_helperIcons/_view";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  // const [values] = useState({});
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [territoryName, setTerritoryName] = useState("");
  const [routeNameDDL, setRouteNameDDL] = useState([]);
  const [routeName, setRrouteName] = useState("");
  const [beatNameDDL, setBeatNameDDL] = useState([]);
  const [beatName, setBeatName] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getTerritotoryWithLevelByEmpDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.employeeId,
        setTerritoryDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = () => {
    getGridData(
      profileData.accountId,
      selectedBusinessUnit?.value,
      routeName.value,
      beatName.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <ICustomCard
        title="Outlet Profile"
        renderProps={() => (
          <button
            onClick={() =>
              history.push({
                pathname: "/rtm-management/configuration/outletProfile/create",
                state: {
                  territoryName: territoryName,
                  routeName: routeName,
                  beatName: beatName,
                },
              })
            }
            className="btn btn-primary"
          >
            Create New
          </button>
        )}
      >
        {/* Table Start */}
        <div className="row global-form pr-0 pl-0">
          <div className="col-lg-3">
            <label>Select Territory</label>
            <Select
              onChange={(valueOption) => {
                getRouteNameDDL(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  valueOption?.value,
                  setRouteNameDDL
                );
                setTerritoryName(valueOption);
              }}
              options={territoryDDL || []}
              value={territoryName}
              isSearchable={true}
              name="territoryName"
              styles={customStyles}
              placeholder="Territory"
            />
          </div>
          <div className="col-lg-3">
            <label>Select Route</label>
            <Select
              onChange={(valueOption) => {
                setRrouteName(valueOption);
                getBeatApiDDL(valueOption?.value, setBeatNameDDL);
              }}
              options={routeNameDDL}
              value={routeName}
              isSearchable={true}
              name="routeName"
              styles={customStyles}
              placeholder="Route"
            />
          </div>
          <div className="col-lg-3">
            <label>Select Market</label>
            <Select
              onChange={(valueOption) => setBeatName(valueOption)}
              options={beatNameDDL}
              value={beatName}
              isSearchable={true}
              name="beatName"
              styles={customStyles}
              placeholder="Market"
            />
          </div>
          <div className="col-lg-1" style={{ marginTop: "17px" }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() =>
                getGridData(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  routeName.value,
                  beatName.value,
                  setGridData,
                  setLoading,
                  pageNo,
                  pageSize
                )
              }
              disabled={!routeName || !beatName}
            >
              View
            </button>
          </div>
        </div>

        <div className="row cash_journal">
          {loading && <Loading />}
          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Outlet Name</th>
                  <th>Outlet Type Name</th>
                  <th>Outlet Address</th>
                  <th>Owner Name</th>
                  <th>Mobile Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr>
                    <td className="text-center">{item?.sl}</td>
                    <td>
                      <div style={{ textAlign: "left" }} className="pl-2">
                        {item?.outletName}
                      </div>
                    </td>
                    <td>
                      <span className="pl-2">{item?.outletTypeName}</span>
                    </td>
                    <td>
                      <span className="pl-2">{item?.outletAddress}</span>
                    </td>
                    <td>
                      <span className="pl-2">{item?.ownerName}</span>
                    </td>
                    <td className="text-right">
                      <span className="pr-2">{item?.mobileNumber}</span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              history.push(
                                `/rtm-management/configuration/outletProfile/view/${item.outletId}`
                              );
                            }}
                          />
                        </span>
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/rtm-management/configuration/outletProfile/edit/${item.outletId}`
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

          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.counts}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              // values={values}
            />
          )}
        </div>
      </ICustomCard>
    </>
  );
}
