/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";

const dHeader = [
  "SL",
  "Customer Name",
  "Cheque No",
  "Cheque Bearer",
  "Cheque Date",
  "Submission Date",
  "Bank Name",
  "Branch Name",
  "Amount",
  "Advance (70%)",
  "Previous (30%)",
  "Remarks",
  "Status",
  "Actions",
];

const tsHeader = ["SL", "Submission Date", "Completed", "Pending", "Cancelled"];

const getHeader = (id) => (id === 1 ? dHeader : tsHeader);

const PartnerCheckSubmitTable = ({ obj }) => {
  const {
    values,
    pageNo,
    pageSize,
    setPageNo,
    setPageSize,
    filteredData,
    deleteOrMrrCheque,
    setPositionHandler,
  } = obj;

  const history = useHistory();

  let totalMrrAmount = 0;
  let totalAdvanceAmount70P = 0;
  let totalPreviousAmount30P = 0;
  let totalCompleted = 0;
  let totalPending = 0;
  let totalCancelled = 0;
  return (
    <>
      {filteredData?.data?.length > 0 && (
       <div className="table-responsive">
         <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              {getHeader(values?.viewType?.value)?.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {filteredData?.data?.map((item, index) => {
              // total calculation
              totalMrrAmount += item?.mrramount || 0;
              totalAdvanceAmount70P += item?.advanceAmount70P || 0;
              totalPreviousAmount30P += item?.previousAmount30P || 0;
              totalCompleted += item?.complete || 0;
              totalPending += item?.pending || 0;
              totalCancelled += item?.cancel || 0;

              return values?.viewType?.value === 1 ? (
                <tr key={index}>
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{item?.businessPartnerName}</td>
                  <td>{item?.chequeNo}</td>
                  <td>{item?.chequeBearerName}</td>
                  <td>{_dateFormatter(item?.chequeDate)}</td>
                  <td>{_dateFormatter(item?.submitDate)}</td>
                  <td>{item?.bankName}</td>
                  <td>{item?.branchName}</td>
                  <td className="text-right">
                    {_fixedPoint(item?.mrramount, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.advanceAmount70P, true)}
                  </td>
                  <td className="text-right">
                    {_fixedPoint(item?.previousAmount30P, true)}
                  </td>
                  <td>{item?.comments}</td>
                  <td
                    style={
                      item?.isActive
                        ? item?.isPosted
                          ? { backgroundColor: "#35e635" }
                          : { backgroundColor: "yellow" }
                        : { backgroundColor: "red" }
                    }
                  >
                    {item?.isActive
                      ? item?.isPosted
                        ? "Completed"
                        : "Pending"
                      : "Cancelled"}
                  </td>
                  <td style={{ width: "80px" }} className="text-center">
                    {item?.isActive && !item?.isPosted && (
                      <div className="d-flex justify-content-around">
                        <span>
                          <IEdit
                            onClick={() => {
                              history.push({
                                pathname: `/config/partner-management/partnerchecksubmit/edit/${item?.configId}`,
                                state: item,
                              });
                            }}
                          />
                        </span>
                        <span
                          onClick={() => {
                            deleteOrMrrCheque(
                              item?.configId,
                              item,
                              values,
                              "delete"
                            );
                          }}
                        >
                          <IDelete />
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td style={{ width: "40px" }} className="text-center">
                    {index + 1}
                  </td>
                  <td>{_dateFormatter(item?.submitDate)}</td>
                  <td className="text-right">{item?.complete}</td>
                  <td className="text-right">{item?.pending}</td>
                  <td className="text-right">{item?.cancel}</td>
                </tr>
              );
            })}
            {values?.viewType?.value !== 1 && (
              <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                <td colSpan={2}>Total</td>
                <td>{_fixedPoint(totalCompleted, true)}</td>
                <td>{_fixedPoint(totalPending, true)}</td>
                <td>{_fixedPoint(totalCancelled, true)}</td>
              </tr>
            )}
            {values?.viewType?.value === 1 && (
              <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                <td colSpan={8}>Total</td>
                <td>{_fixedPoint(totalMrrAmount, true)}</td>
                <td>{_fixedPoint(totalAdvanceAmount70P, true)}</td>
                <td>{_fixedPoint(totalPreviousAmount30P, true)}</td>

                <td colSpan={3}></td>
              </tr>
            )}
          </tbody>
        </table>
       </div>
      )}

      {filteredData?.data?.length > 0 && (
        <PaginationTable
          count={filteredData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
          values={values}
        />
      )}
    </>
  );
};

export default PartnerCheckSubmitTable;
