/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Loading from "../../../../_helper/_loading";
import { getShopfloorIssueReportItemWiseDetailData } from "../helper";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

function DetailsModal({ modalData }) {
  const { item, values, profileData, selectedBusinessUnit } = modalData;

  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      item?.itemId &&
      values?.plant?.value
    )
      getShopfloorIssueReportItemWiseDetailData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant?.value,
        values?.shopFloor?.value,
        values?.fromDate,
        values?.toDate,
        item?.itemId,
        setGridData,
        setLoading
      );
  }, [
    item?.itemId,
    profileData?.accountId,
    selectedBusinessUnit?.value,
    values?.plant?.value,
  ]);

  const printRef = useRef();

  return (
    <>
      {loading && <Loading />}
      <div
        style={{ marginTop: "15px" }}
        className="col-lg-12 d-flex justify-content-end"
      >
        <div>
          <ReactToPrint
            trigger={() => (
              <button type="button" className="btn btn-primary px-4 py-1">
                <img
                  style={{ width: "25px", paddingRight: "5px" }}
                  src={printIcon}
                  alt="print-icon"
                />
                Print
              </button>
            )}
            content={() => printRef.current}
          />
        </div>
      </div>
      <>
        {gridData?.length > 0 && (
          <div ref={printRef} className="col-lg-12 pr-0 pl-0">
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Transaction Date</th>
                    <th>Transaction Code</th>
                    <th>Issued Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        <span>{_dateFormatter(item?.transactionDate)}</span>
                      </td>
                      <td className="text-center">
                        <span className="pl-2">
                          {item?.inventoryTransactionCode}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="pr-2">
                          {Math.abs(item?.issueQuantity)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    </>
  );
}

export default DetailsModal;
