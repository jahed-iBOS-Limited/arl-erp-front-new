/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Select from "react-select";
import { useSelector, shallowEqual } from "react-redux";
import { getLandingPageData, getPlantNameDDL } from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import customStyles from "../../../../selectCustomStyle";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";

const headers = [
  "SL",
  "Item Name",
  "BoM Name",
  "BoM Version",
  "Work Center",
  // "Plant",   {/* Last Change Assign By Miraj Hossain (BA) */}
  "Action",
];

const TBody = ({ landingPageData }) => {
  const history = useHistory();
  return (
    <>
      {landingPageData?.length > 0 &&
        landingPageData?.map((data, index) => (
          <tr style={{ textAlign: "left" }} key={index}>
            <td>
              {" "}
              <div className="pl-2">{index + 1}</div>
            </td>

            <td>
              <div className="pl-2">{data.itemName}</div>
            </td>

            <td>
              <div className="pl-2">{data.billOfMaterialName}</div>
            </td>
            <td>
              <div className="pl-2">{data.bomVersion}</div>
            </td>

            <td>
              <div className="pl-2">{data.workCenterName}</div>
            </td>

            {/* Last Change Assign By Miraj Hossain (BA) */}
            {/* <td>
              <div className="pl-2">{data.plantName}</div>
            </td> */}

            <td style={{ textAlign: "center" }}>
              <span className="ml-3">
                <IView
                  clickHandler={() =>
                    history.push({
                      pathname: `/production-management/configuration/routing/view/${data.routingId}`,
                      state: { isView: true },
                    })
                  }
                ></IView>
              </span>
              <span
                className="ml-3"
                onClick={() =>
                  history.push(
                    `/production-management/configuration/routing/edit/${data.routingId}`
                  )
                }
              >
                <IEdit></IEdit>
              </span>
            </td>
          </tr>
        ))}
    </>
  );
};

const RoutingLanding = () => {
  const history = useHistory();
  const [selectplant, setselectPlant] = useState("");
  const [plant, setPlantNameDDL] = useState([]);
  const [landingPageData, setLandingPageData] = useState([]);
  const [loader, setLoader] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPlantNameDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit?.value,
      setPlantNameDDL
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (plant?.length > 0) {
      setselectPlant(plant[0]);
      getLandingPageData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plant[0]?.value,
        setLoader,
        setLandingPageData,
        pageNo,
        pageSize
      );
    }
  }, [plant]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getLandingPageData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectplant?.value,
      setLoader,
      setLandingPageData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <ICustomCard
      title="Routing Basic Information"
      renderProps={() => (
        <button
          className="btn btn-primary"
          onClick={() =>
            history.push("/production-management/configuration/routing/create")
          }
        >
          Create New
        </button>
      )}
    >
      <div className="row">
        <div className="col-lg-3">
          <div className="global-form">
            <label>Select Plant</label>
            <Select
              placeholder="Select Plant"
              value={selectplant}
              onChange={(valueOption) => {
                setselectPlant(valueOption);
                getLandingPageData(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  valueOption?.value,
                  setLoader,
                  setLandingPageData,
                  pageNo,
                  pageSize
                );
              }}
              styles={customStyles}
              options={plant}
            />
          </div>
        </div>
      </div>

      <PaginationSearch
        placeholder="Routing Name Search"
        paginationSearchHandler={paginationSearchHandler}
      />

      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
          {loader && <Loading />}
          <thead>
            <tr>
              {headers.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            <TBody landingPageData={landingPageData?.data || []} />
          </tbody>
        </table>
      </div>

      {/* Pagination Code */}
      {landingPageData?.data?.length > 0 && (
        <PaginationTable
          count={landingPageData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </ICustomCard>
  );
};

export default RoutingLanding;
