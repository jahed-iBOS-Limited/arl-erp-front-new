import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import {
  getBusinessPartnersWithoutTerritory,
  getTerritoryList,
  updateTerritory,
} from "../helper";

export function PartnerTerritoryUpdate({ value }) {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  // const [pageNo, setPageNo] = React.useState(0);
  // const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getGridData = (searchValue = "", pageNo = 0, pageSize = 15000) => {
    getBusinessPartnersWithoutTerritory(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      searchValue,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    getTerritoryList(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      value?.channel?.value,
      setTerritoryDDL
    );
    getGridData("", 0, 15000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePartnerTerritory = (item) => {
    const payload = {
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intTerritoryId: item?.strTerritoryName?.value,
      intBusinessPartnerId: item?.intBusinessPartnerId,
      intActionBy: profileData?.userId,
    };
    updateTerritory(payload, setLoading, () => {
      getGridData("", 0, 15000);
    });
  };

  const dataChangeHandler = (name, index, value) => {
    const newData = [...gridData.data];
    newData[index][name] = value;
    setGridData({ ...gridData, data: newData });
  };

  const paginationSearchHandler = (searchValue) => {
    getGridData(searchValue, 0, 15000);
  };

  return (
    <>
      {loading && <Loading />}
      <div className="mt-1">
        <PaginationSearch
          placeholder="Search by Partner Name or Code"
          paginationSearchHandler={paginationSearchHandler}
        />
      </div>
      {gridData?.data?.length > 0 && (
        <>
          <div className="table-responsive"><table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Code</th>
                <th style={{ width: "250px" }}>Name</th>
                <th>Address</th>
                <th style={{ width: "200px" }}>Territory</th>
                <th style={{ width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, index) => (
                <tr key={index}>
                  <td> {index + 1}</td>
                  <td>{item?.strBusinessPartnerCode}</td>
                  <td>{item?.strBusinessPartnerName}</td>
                  <td>{item?.strBusinessPartnerAddress}</td>
                  <td>
                    <NewSelect
                      name="strTerritoryName"
                      value={item?.strTerritoryName}
                      onChange={(valueOption) => {
                        dataChangeHandler(
                          "strTerritoryName",
                          index,
                          valueOption
                        );
                      }}
                      options={territoryDDL}
                    />
                  </td>

                  <td>
                    <div className="d-flex justify-content-around">
                      <button
                        style={
                          !item?.strTerritoryName ? { cursor: "no-drop" } : {}
                        }
                        disabled={!item?.strTerritoryName}
                        className="btn btn-success"
                        onClick={() => {
                          updatePartnerTerritory(item);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </>
      )}
      {/* {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.counts}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )} */}
    </>
  );
}
