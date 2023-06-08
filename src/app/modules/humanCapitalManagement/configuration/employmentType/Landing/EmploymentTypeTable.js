/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { fetchLandingData } from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

const headers = ["SL", "Business Unit", "Employment Type", "Action"];

const TBody = ({ rowData, loader }) => {
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
              <td style={{ textAlign: "center" }}>{item?.businessUnit}</td>
              <td style={{ textAlign: "center" }}>{item?.employmentType}</td>
              <td colSpan="" style={{ textAlign: "center" }}>
                <span
                  onClick={(e) =>
                    history.push({
                      pathname: `/human-capital-management/hcmconfig/employmenttype/edit/${item.employmentTypeId}`,
                      state: {
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

export function EmploymentTypeTable() {
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
      profileData.accountId,
      selectedBusinessUnit.value,
      setRowData,
      setLoader,
      pageNo,
      pageSize
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    fetchLandingData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setRowData,
      setLoader,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <ICustomTable
        ths={headers}
        children={<TBody rowData={rowData?.data} loader={loader} />}
      />

      {/* Pagination Code */}
      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
