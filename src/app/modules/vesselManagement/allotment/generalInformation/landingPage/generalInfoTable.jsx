import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { DeleteLighterAllotment } from "../helper";
import IConfirmModal from "../../../../_helper/_confirmModal";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import PaginationTable from "../../../../_helper/_tablePagination";

export default function GeneralInfoTable({
  gridData,
  values,
  history,
  setLandingData,
  pageNo,
  pageSize,
  setPageSize,
  setPageNo,
  setLoading,
}) {
  let totalQty = 0;
  return (
    <>
      {gridData?.data?.length > 0 && values?.status?.value === 1 && (
        <div className="row cash_journal">
          <div className="col-lg-12">
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>SL</th>
                    <th>Date</th>
                    <th>Mother Vessel</th>
                    <th>Loading Port</th>
                    <th>CNF</th>
                    <th>Program No</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => {
                    totalQty += item?.surveyQnt;
                    return (
                      <tr key={index}>
                        <td> {item?.sl}</td>
                        <td>{_dateFormatter(item?.alltmentDate)}</td>
                        <td>{item?.motherVesselName}</td>
                        <td>{item?.portName}</td>
                        <td>{item?.cnfname}</td>
                        <td>{item?.program}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.surveyQnt, true)}
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <span className="text-center">
                              <IView
                                clickHandler={() =>
                                  history.push({
                                    pathname: `/vessel-management/allotment/generalinformation/view/${item?.allotmentNo}`,
                                  })
                                }
                              />
                            </span>
                            <span
                              className="edit"
                              onClick={() => {
                                history.push(
                                  `/vessel-management/allotment/generalinformation/edit/${item?.allotmentNo}`
                                );
                              }}
                            >
                              <IEdit />
                            </span>
                            <span
                              className="mr-1"
                              onClick={() => {
                                let confirmObject = {
                                  title: "Are you sure?",
                                  message:
                                    "Are you sure you want to delete this information",
                                  yesAlertFunc: async () => {
                                    DeleteLighterAllotment(
                                      item?.allotmentNo,
                                      setLoading,
                                      () => {
                                        setLandingData(
                                          pageNo,
                                          pageSize,
                                          values
                                        );
                                      }
                                    );
                                  },
                                  noAlertFunc: () => {
                                    "";
                                  },
                                };
                                IConfirmModal(confirmObject);
                              }}
                            >
                              <IDelete />
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {gridData?.data?.length > 0 && (
                    <tr style={{ fontWeight: "bold" }}>
                      <td className="text-right" colSpan={6}>
                        Total
                      </td>
                      <td className="text-right">
                        {_fixedPoint(totalQty, true)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setLandingData}
              paginationState={{
                pageNo,
                setPageNo,
                pageSize,
                setPageSize,
              }}
              values={values}
            />
          )}
        </div>
      )}
    </>
  );
}
