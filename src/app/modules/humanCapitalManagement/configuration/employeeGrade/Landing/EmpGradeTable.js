/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import { fetchLandingData } from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

const headers = [
  "SL",
  "Employee Position Group",
  "Employee HR Position",
  "Action",
];

const TBody = ({ loader, rowData, profileData }) => {
  const history = useHistory();

  return (
    <>
      {loader && <Loading />}
      {rowData.length > 0 &&
        rowData.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "center" }}>
                {item?.employeePositionGroupName}
              </td>
              <td style={{ textAlign: "center" }}>{item?.positionName}</td>
              <td colSpan="" style={{ textAlign: "center" }}>
                <IView
                  clickHandler={() =>
                    history.push(
                      `/human-capital-management/hcmconfig/empgrade/view/${profileData.accountId}/${item?.positionId}/${item?.employeePositionGroupId}`
                    )
                  }
                  title="View"
                />
                <span
                  className="mx-2"
                  onClick={(e) =>
                    history.push(
                      `/human-capital-management/hcmconfig/empgrade/edit/${profileData.accountId}/${item?.positionId}/${item?.employeePositionGroupId}`
                    )
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

export function EmpGradeTable() {
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    fetchLandingData(
      profileData.accountId,
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
        children={
          <TBody
            rowData={rowData?.data || []}
            loader={loader}
            profileData={profileData}
          />
        }
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
