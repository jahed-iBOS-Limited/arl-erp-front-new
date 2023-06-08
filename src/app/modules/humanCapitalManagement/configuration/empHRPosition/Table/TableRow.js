import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import { getHRPositionPagination } from "../helper";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function TableRow() {
  const history = useHistory();
  const [rowData, setRowData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value)
      getHRPositionPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        setRowData,
        setLoader
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getHRPositionPagination(
      profileData?.accountId,
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

  console.log(rowData?.data, "rowData");

  const headers = [
    "SL",
    "HR Position Name",
    "HR Position Code",
    "Position Group",
    "Action",
  ];

  // get controlling unit list  from store

  // UI Context
  const HRTable = () => {
    return (
      <>
        {loader && <Loading />}
        {rowData?.data?.length > 0 &&
          rowData?.data?.map((item, index) => {
            return (
              <tr>
                <td>{item.sl}</td>
                <td>{item.positionName}</td>
                <td>{item.positionCode}</td>
                <td>{item.positionGroupName}</td>
                <td
                  style={{ textAlign: "center" }}
                  onClick={() =>
                    history.push(
                      `/human-capital-management/hcmconfig/emphrposition/edit/${item.positionId}`
                    )
                  }
                >
                  <IEdit />
                </td>
              </tr>
            );
          })}
      </>
    );
  };

  return (
    <>
      <PaginationSearch
        placeholder="HR Position Name & Code Search"
        paginationSearchHandler={paginationSearchHandler}
      />
      <ICustomTable ths={headers}>
        <HRTable />
      </ICustomTable>

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
