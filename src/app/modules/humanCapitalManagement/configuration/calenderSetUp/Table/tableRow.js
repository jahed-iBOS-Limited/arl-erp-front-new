/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { GetCalenderSetUpPagination } from "../helper";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetCalenderSetUpPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setLoader,
        pageNo,
        pageSize
      );
    }
  }, []);

  const setPositionHandler = (pageNo, pageSize) => {
    GetCalenderSetUpPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoader,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      {loader && <Loading />}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th style={{ width: "50px" }}>Calender Name</th>
                <th style={{ width: "50px" }}>Start Time</th>
                <th style={{ width: "50px" }}>End Time</th>
                <th style={{ width: "50px" }}>Minimum Work Hour</th>
                <th style={{ width: "50px" }}>Last Start Time</th>
                <th style={{ width: "30px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.length > 0 &&
                gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    {/* key={item.businessUnitId} */}
                    <td>{item.sl}</td>
                    <td>
                      <div className="pl-2">{item.calenderName}</div>
                    </td>
                    <td>
                      <div className="text-center">
                        {_timeFormatter(item.startTime)}
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        {_timeFormatter(item.endTime)}
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        {_timeFormatter(item.minWorkHour)}
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        {_timeFormatter(item.lastStartTime)}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              history.push(
                                `/human-capital-management/calendar/calandersetup/view/${item?.calenderId}`
                              );
                            }}
                          />
                        </span>
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/human-capital-management/calendar/calandersetup/edit/${item?.calenderId}`
                            );
                          }}
                        >
                          <IEdit />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div>
            {gridData?.data?.length > 0 && (
              <PaginationTable
                count={gridData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
