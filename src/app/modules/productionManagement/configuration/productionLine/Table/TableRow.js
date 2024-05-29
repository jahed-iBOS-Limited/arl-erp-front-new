/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import NewSelect from "../../../../_helper/_select";
import { getLandingData, getPlantNameDDL } from "../helper";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [selectedDDLItem, setSelectedDDLItem] = React.useState({});

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [landingData, setLandingData] = useState([]);
  const [plantNameDDl, setPlantNameDDl] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getPlantNameDDL(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantNameDDl
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    if (plantNameDDl?.length > 0) {
      setSelectedDDLItem(plantNameDDl[0]);
      getLandingData(
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

  const history = useHistory();

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectedDDLItem?.value,
      setLoader,
      setLandingData,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      {loader && <Loading />}
      <div className="row">
        <div className="col-lg-3 global-form">
          <NewSelect
            name="plantName"
            options={plantNameDDl}
            placeholder="Plant Name"
            value={selectedDDLItem}
            onChange={(valueOption) => {
              setSelectedDDLItem(valueOption);
              if (valueOption) {
                getLandingData(
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  valueOption?.value,
                  setLoader,
                  setLandingData,
                  pageNo,
                  pageSize
                );
              }
            }}
            errors={"errors"}
            touched={"touched"}
          />
        </div>
        <div className="col-lg-12 pr-0 pl-0">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>SL</th>
                  <th style={{ width: "50px" }}>Production Line Name</th>
                  <th style={{ width: "50px" }}>Production Line Code</th>
                  {/* <th style={{ width: "50px" }}>Plant Name</th> */}{" "}
                  {/* Last Change Assign By Miraj Hossain (BA) */}
                  <th style={{ width: "50px" }}>Shop Floor</th>
                  <th style={{ width: "50px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {landingData?.data?.map((data, index) => (
                  <tr key={index}>
                    <td>{data.sl}</td>
                    <td>{data.productionLineName}</td>
                    <td>{data.productionLineCode}</td>
                    {/* <td>{data?.plantName}</td> */}{" "}
                    {/* Last Change Assign By Miraj Hossain (BA) */}
                    <td>{data?.shopFloorName}</td>
                    <td className="text-center">
                      <span
                        onClick={() => {
                          history.push(
                            `/production-management/configuration/productionline/edit/${data.productionLineId}`
                          );
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
    </>
  );
}
