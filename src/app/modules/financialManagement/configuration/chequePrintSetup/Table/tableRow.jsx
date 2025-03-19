import React, { useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import PaginationTable from "../../../../_helper/_tablePagination";
import Loading from "../../../../_helper/_loading";
import { getBankChequePrintPagination } from "./../helper";

export function TableRow() {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [loading, setLoading] = React.useState(false);

  const [gridData, setGridData] = React.useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // const userRole = useSelector(
  //   (state) => state?.authData?.userRole,
  //   shallowEqual
  // );
  // const bankAccount = userRole[7];

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getBankChequePrintPagination(
        profileData.accountId,
        selectedBusinessUnit.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getBankChequePrintPagination(
      profileData.accountId,
      selectedBusinessUnit.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div className="table-responsive">
        <table className="table custom-table global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Bank</th>
              <th>Branch</th>
              <th>Account No</th>
              <th>Prefix</th>
              <th>Start No</th>
              <th>End No</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.objData?.length > 0 &&
              gridData?.objData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <div className="pl-2">{item?.bankName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.branchName}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.accountNo}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.prefix}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.startNo}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.endNo}</div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {gridData?.objData?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
