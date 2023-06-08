import React, { useState, useEffect } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { getGridData, approveCircular } from "./helper";
import "./loanReschedule.css";
import Loading from "../../../_helper/_loading";
import ICheckout from "../../../_helper/_helperIcons/_checkout";
import IView from "../../../_helper/_helperIcons/_view";
import PaginationTable from "../../../_helper/_tablePagination";

const OnBoardLanding = ({ history }) => {

  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    getGridData(setRowDto, setLoader,pageNo, pageSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize) => {
    getGridData(setRowDto, setLoader,pageNo, pageSize);
  };

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="On Boarding">
        {/* Table Start */}
        {rowDto?.data?.length > 0 && (
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Circular Title</th>
                <th style={{ width: "107px" }}>Total Applicants</th>
                <th style={{ width: "107px" }}>View Applicants</th>
                <th style={{ width: "100px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.data?.length >= 0 &&
                rowDto?.data?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="pl-2">{data?.strDesignation}</div>
                    </td>
                    <td>
                      <div className="text-center">{data?.totalCandidateCount}</div>
                    </td>
                    <td>
                      <div className="text-center">
                        <IView
                          clickHandler={() =>
                            history.push({
                              pathname: `/human-capital-management/jobcircular/viewCandidates/${data?.intJobRequisitionId}`,
                            })
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="pl-2 d-flex justify-content-around">
                        {!data?.isAprove && (
                          <ICheckout
                            checkout={() => {
                              approveCircular(
                                {
                                  intJobRequisitionId:
                                    data?.intJobRequisitionId,
                                },
                                setLoader
                              );
                            }}
                            id={data?.intJobRequisitionId}
                            title="Approve"
                          />
                        )}

                        <IView
                          clickHandler={() =>
                            history.push({
                              pathname: `/human-capital-management/jobcircular/edit-circular/${data?.intJobRequisitionId}`,
                            })
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {rowDto?.data?.length > 0 && (
          <PaginationTable
            count={rowDto?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </ICustomCard>
    </>
  );
};

export default OnBoardLanding;
