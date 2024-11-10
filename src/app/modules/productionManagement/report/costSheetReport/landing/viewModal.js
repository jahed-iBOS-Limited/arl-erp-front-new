/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getPoBaseViewById, getItemBaseViewById } from "../helper";

function PoBaseReportViewModal({ modalData }) {
  console.log(modalData);
  const [rowData, setRowData] = useState();

  useEffect(() => {
    if (modalData?.status === 1 && modalData?.id) {
      getPoBaseViewById(modalData?.id, setRowData);
    } else if (modalData?.status === 2 && modalData?.id) {
      getItemBaseViewById(
        modalData?.profileData?.accountId,
        modalData?.selectedBusinessUnit?.value,
        modalData?.values?.fromDate,
        modalData?.values?.toDate,
        modalData?.id,
        setRowData
      );
    }
  }, [modalData?.id]);

  return (
    <>
      <div className="mt-5">
        <h3>
          {`${modalData?.status === 1 ? "PO Base" : "Item Base"}`} Details View
        </h3>
      </div>

      {modalData?.status === 1 && rowData?.length > 0 && (
        <div className="col-lg-12 pr-0 pl-0 mb-5">
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Reference Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {rowData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-left">
                      <span className="pl-2">{item?.referenceName}</span>
                    </td>
                    <td className="text-left">
                      <span className="pl-2">{item?.type}</span>
                    </td>
                    <td className="text-right">
                      <span className="pr-2">{item?.amount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalData?.status === 2 && rowData?.length > 0 && (
        <div className="col-lg-12 pr-0 pl-0 mb-5">
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Reference Name</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {rowData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-left">
                      <span className="pl-2">{item?.referenceName}</span>
                    </td>
                    <td className="text-left">
                      <span className="pl-2">{item?.type}</span>
                    </td>
                    <td className="text-right">
                      <span className="pr-2">{item?.amount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default PoBaseReportViewModal;
