import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import { getDDL, getKPIConfigureLanding } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import Loading from "../../../../_helper/_loading";
import IExtend from "../../../../_helper/_helperIcons/_extend";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";

export function TableRow() {
  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get BCS Perspective DDL
  const [BSCPerspectiveDDL, setBSCPerspectiveDDL] = useState([]);
  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getDDL(`/pms/CommonDDL/BSCPerspectiveDDL`, setBSCPerspectiveDDL);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getKPIConfigureLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getKPIConfigureLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading,
      searchValue
    );
  };

  // Search handler
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      {/* Table Start */}
      {loading && <Loading />}
      <div className="row cash_journal">
        <div className="col-md-4 pt-5">
          <PaginationSearch
            placeholder="KPI Name"
            paginationSearchHandler={paginationSearchHandler}
          />
        </div>
        <div className="col-md-4">
          <NewSelect
            name="BSCPerspective"
            options={BSCPerspectiveDDL || []}
            label="BSC Perspective"
            onChange={(e) => {
              getKPIConfigureLanding(
                profileData.accountId,
                selectedBusinessUnit.value,
                pageNo,
                pageSize,
                setGridData,
                setLoading,
                "",
                e.value
              );
            }}
            placeholder="BSC Perspective"
          />
        </div>
        <div className="col-lg-12 pr-0 pl-0">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>BSC Perspective</th>
                <th>KPI Name</th>
                <th>KPI Format</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, index) => (
                <tr key={index} className="text-left">
                  <td> {index + 1}</td>
                  <td>
                    <div className="pl-2">{item?.strBscperspective}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.strKpiName}</div>
                  </td>
                  <td>
                    <div className="pl-2 text-center">{item?.strKpiformat}</div>
                  </td>
                  <td>
                    <div className="pl-2 text-center">{item?.strComments}</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <span
                        onClick={() => {
                          history.push(
                            `/performance-management/individual-kpi/kpi-configure/edit/${item?.intKpiId}`
                          );
                        }}
                      >
                        <IEdit />
                      </span>
                      <span
                        onClick={() => {
                          history.push(
                            `/performance-management/individual-kpi/kpi-configure/extend/${item?.intKpiId}`
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

          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              // setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </div>
    </>
  );
}
