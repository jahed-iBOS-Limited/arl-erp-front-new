/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";

import { fetchLandingData } from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

const headers = [
  "SL",
  "Designation",
  "Designation Code",
  "Position",
  "BusinessUnit",
  "Action",
];

const TBody = ({ loader, rowData }) => {
  const history = useHistory();

  return (
    <>
      {loader && <Loading />}
      {rowData &&
        rowData.length > 0 &&
        rowData.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td>
                <div className="pl-2">{item.designationName}</div>
              </td>
              <td>
                <div className="pl-2">{item.designationCode}</div>
              </td>
              <td>
                <div className="pl-2">{`${item?.positionName} (${item?.positionCode})`}</div>
              </td>
              <td>
                <div className="pl-2">{item.businessUnit}</div>
              </td>
              <td colSpan="" style={{ textAlign: "center" }}>
                <span
                  onClick={(e) =>
                    history.push({
                      pathname: `/human-capital-management/hcmconfig/empfundesignation/edit/${item.designationId}`,
                      state: {
                        department: item?.department,
                        businessUnit: item?.businessUnit,
                      },
                    })
                  }
                >
                  <IEdit title="Edit" />
                </span>
              </td>
            </tr>
          );
        })}
    </>
  );
};

export function EmpFuncDesgTable() {
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Landing Pasignation Data
  useEffect(() => {
    fetchLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowData,
      setLoader,
      pageNo,
      pageSize
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    fetchLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRowData,
      setLoader,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <PaginationSearch
        placeholder=" Name & Code Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <ICustomTable
        ths={headers}
        children={<TBody loader={loader} rowData={rowData?.data || []} />}
      />

      {/* Pagination Code */}
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
