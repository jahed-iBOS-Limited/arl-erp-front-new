/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import { fetchLandingData } from "../helper/Actions";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

const headers = ["SL", "Position Group", "Group Code", "Action"];

const TBody = ({ loader, rowData }) => {
  const history = useHistory();

  return (
    <>
      {loader && <Loading />}
      {rowData?.data?.length > 0 &&
        rowData?.data?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center", width:"40px" }}>{item?.sl}</td>
              <td>{item?.positionGroupName}</td>
              <td style={{ textAlign: "center" }}>{item?.positionGroupCode}</td>
              <td style={{ textAlign: "center", width:"60px" }}>
                <IView
                  clickHandler={() =>
                    history.push(
                      `/human-capital-management/hcmconfig/emppositiongroup/view/${item?.positionGroupId}`
                    )
                  }
                  title="View"
                />
                <span
                  onClick={(e) =>
                    history.push(
                      `/human-capital-management/hcmconfig/emppositiongroup/edit/${item.positionGroupId}`
                    )
                  }
                  className="mx-2"
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

export function EmpPositionGroupTable() {
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);
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
      pageNo,
      pageSize,
      setRowData,
      setLoader
    );
  }, []);

  const setPositionHandler = (pageNo, pageSize) => {
    fetchLandingData(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize,
      setRowData,
      setLoader
    );
  };

  return (
    <>
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
