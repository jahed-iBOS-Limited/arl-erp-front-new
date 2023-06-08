/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import { useSelector, shallowEqual } from "react-redux";
import { getPlantNameDDl, getWorkCenterLanding } from "../helper";
import NewSelect from "../../../../_helper/_select";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";

const tableHeader = [
  "SL",
  "Work Center Name",
  "Work Center Code",
  // "Plant Name",   {/* Last Change Assign By Miraj Hossain (BA) */}
  "Shop Floor",
  "Action",
];

export default function TableRow({ setSelectedDDLPlant }) {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [landingData, setLandingData] = useState([]);
  const [plantNameDDl, setPlantNameDDl] = useState([]);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [selectedDDLItem, setSelectedDDLItem] = React.useState({});

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPlantNameDDl(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantNameDDl
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    if (plantNameDDl?.length > 0) {
      setSelectedDDLItem(plantNameDDl[0]);
      getWorkCenterLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plantNameDDl[0]?.value,
        setLoader,
        setLandingData,
        pageNo,
        pageSize
      );
    }
  }, [plantNameDDl]);

  useEffect(() => {
    setSelectedDDLPlant(selectedDDLItem);
  }, [selectedDDLItem]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getWorkCenterLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectedDDLItem?.value,
      setLoader,
      setLandingData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <div className="row">
      <div className="col-lg-3 global-form ml-4">
        <NewSelect
          name="plantName"
          options={plantNameDDl}
          placeholder="Plant Name"
          onChange={(valueOption) => {
            setSelectedDDLItem(valueOption);
            getWorkCenterLanding(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              valueOption?.value,
              setLoader,
              setLandingData,
              pageNo,
              pageSize
            );
          }}
          value={selectedDDLItem}
          errors={"errors"}
          touched={"touched"}
        />
      </div>
      <div className="col-lg-12">
        <PaginationSearch
          placeholder="Work Center Code Search"
          paginationSearchHandler={paginationSearchHandler}
        />
        <ICustomTable ths={tableHeader}>
          <>
            {loader && <Loading />}
            {landingData?.data?.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>
                  <div className="pl-2">{item.workCenterName}</div>
                </td>
                <td>
                  <div className="pl-2">{item.workCenterCode}</div>
                </td>
                {/* Last Change Assign By Miraj Hossain (BA) */}
                {/* <td>
                  <div className="pl-2">{item.plantName}</div>
                </td> */}
                <td>
                  <div className="pl-2">{item.shopFloor}</div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span className="ml-3">
                    <IView
                      clickHandler={() => {
                        history.push(
                          `/production-management/configuration/workcenter/view/${item.workCenterId}`
                        );
                      }}
                    ></IView>
                  </span>
                  <span
                    className="ml-3"
                    onClick={() => {
                      history.push(
                        `/production-management/configuration/workcenter/edit/${item.workCenterId}`
                      );
                    }}
                  >
                    <IEdit></IEdit>
                  </span>
                </td>
              </tr>
            ))}
          </>
        </ICustomTable>
        {/* Pagination Code */}
        {landingData?.data?.length > 0 && (
          <PaginationTable
            count={landingData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </div>
  );
}
