import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IExtend from "../../../../_helper/_helperIcons/_extend";
import Loading from "../../../../_helper/_loading";
import { GetTransportOrganizationPagination } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // eslint-disable-next-line no-unused-vars
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    GetTransportOrganizationPagination(
      profileData?.accountId,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const setPositionHandler=(pageNo, pageSize)=>{

    GetTransportOrganizationPagination(
      profileData?.accountId,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    )
  }

  return (
    <>
      {loading && <Loading />}
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
        <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>SL</th>
                <th style={{ width: "30%" }}>Transport Organization Name</th>
                <th style={{ width: "30%" }}>Code</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, index) => (
                <tr key={index}>
                  <td> {item?.sl}</td>
                  <td>
                    <div className="pl-2">
                      {item?.transportOrganizationName}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">
                      {item?.transportOrganizationCode}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <span
                        onClick={() => {
                          history.push(
                            `/transport-management/configuration/transportorganization/extend/${item.transportOrganizationId}`
                          );
                        }}
                      >
                        <IExtend />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
        </div>
      </div>
    </>
  );
}
