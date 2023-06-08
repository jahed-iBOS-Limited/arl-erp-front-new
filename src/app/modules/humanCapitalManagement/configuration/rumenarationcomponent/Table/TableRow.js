/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import { getRumenarationComponentPagination } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  const history = useHistory();

  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  console.log(profileData);

  useEffect(() => {
    if (profileData?.accountId)
      getRumenarationComponentPagination(
        profileData?.accountId,
        setRowData,
        setLoader,
        pageNo,
        pageSize
      );
  }, [profileData.accountId]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getRumenarationComponentPagination(
      profileData?.accountId,
      setRowData,
      setLoader,
      pageNo,
      pageSize
    );
  };

  const headers = [
    "SL",
    "Component",
    "Component Code",
    "Component Type",
    "Percent On Basic Remuneration",
    "Action",
  ];

  return (
    <>
      {loader && <Loading />}
      <ICustomTable ths={headers}>
        {rowData?.data?.map((item) => {
          return (
            <tr>
              <td style={{ textAlign: "center" }}>{item.sl}</td>
              <td style={{ textAlign: "center" }}>
                {item.remunerationComponent}
              </td>
              <td style={{ textAlign: "center" }}>
                {item.remunerationComponentCode}
              </td>
              <td style={{ textAlign: "center" }}>
                {item.remunerationComponetType}
              </td>
              <td style={{ textAlign: "center" }}>
                {item.defaultPercentOnBasic.toFixed(2) + "%"}
              </td>
              <td
                style={{ textAlign: "center" }}
                onClick={() =>
                  history.push(
                    `/human-capital-management/hcmconfig/hrrumenarationcomponent/edit/${item.remunerationComponentId}`
                  )
                }
              >
                <IEdit />
              </td>
            </tr>
          );
        })}
      </ICustomTable>

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
