/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { fetchLandingData } from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";

const headers = ["SL", "Bonus Name", "Bonus Description", "Action"];

const TBody = ({ loader, rowData }) => {
  const history = useHistory();

  return (
    <>
      {loader && <Loading />}
      {rowData?.data?.length > 0 &&
        rowData?.data?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td>
                <div className="pl-2">{item?.strBonusName}</div>
              </td>
              <td>
                <div className="pl-2">{item?.strBonusDescription}</div>
              </td>
              <td colSpan="" style={{ textAlign: "center" }}>
                <span
                  onClick={(e) =>
                    history.push(
                      `/human-capital-management/hcmconfig/createbonusname/edit/${item?.intBonusId}`
                    )
                  }
                  className="mx-2"
                >
                  <IEdit title="Edit" />
                </span>
                {/* <button className="btn btn-primary">Active</button> */}
              </td>
            </tr>
          );
        })}
    </>
  );
};

export function BonusNameTable() {
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  // Get Landing Pasignation Data
  useEffect(() => {
    fetchLandingData(
      profileData.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setRowData,
      setLoader
    );
  }, []);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    fetchLandingData(
      profileData.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setRowData,
      setLoader,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <PaginationSearch
        placeholder="Bonus Name Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <ICustomTable
        ths={headers}
        children={<TBody loader={loader} rowData={rowData} />}
      />

      <div>
        {rowData?.data?.length > 0 && (
          <PaginationTable
            count={rowData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
