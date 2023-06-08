/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import { getWorkplaceGroupPagination } from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

export default function TableRow(props) {
  const history = useHistory();

  const headers = ["SL", "Workplace Group Name", "Group Code", "Action"];

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (profileData.accountId) {
      getWorkplaceGroupPagination(
        profileData.accountId,
        setGridData,
        setLoader,
        pageNo,
        pageSize
      );
    }
  }, [profileData.accountId]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getWorkplaceGroupPagination(
      profileData.accountId,
      setGridData,
      setLoader,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <ICustomTable ths={headers}>
        <TableBody
          history={history}
          gridData={gridData?.data || []}
          loader={loader}
        ></TableBody>
      </ICustomTable>

      {/* Pagination Code */}
      <div>
        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}

export const TableBody = ({ loader, gridData, history }) => {
  return (
    <>
      {loader && <Loading />}
      {gridData.map((item, index) => (
        <tr style={{ textAlign: "center" }} key={index}>
          <td>{item.sl}</td>
          <td>{item.workplaceGroupName}</td>
          <td>{item.workplaceGroupCode}</td>
          <td>
            <span
              onClick={() => {
                history.push(
                  `/human-capital-management/hcmconfig/workplcgroup/edit/${item.workplaceGroupId}`
                );
              }}
            >
              <IEdit></IEdit>
            </span>
          </td>
        </tr>
      ))}
    </>
  );
};
