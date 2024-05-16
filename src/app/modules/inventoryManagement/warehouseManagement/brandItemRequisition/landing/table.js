import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import IApproval from "../../../../_helper/_helperIcons/_approval";

export default function BrandItemRequisitionLandingTable({ obj }) {
  const { rowData, values, getSingleDataById } = obj;
  const history = useHistory();

  const status = values?.status?.value;
  return (
    <>
      {rowData?.data?.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th>Program Type</th>
                <th>Request Code</th>
                <th>Area Name</th>
                {/* <th>Territory</th>
              <th>Item Name</th>
              <th>Item Code</th>
              <th>UoM</th> */}
                <th>Requested Quantity</th>
                <th>Required Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.data?.map((td, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{td?.brandRequestTypeName}</td>
                  <td>{td?.brandRequestCode}</td>
                  <td>{td?.areaName}</td>
                  {/* <td>{td?.territoryName}</td>
                <td>{td?.itemName}</td>
                <td>{td?.itemCode}</td>
                <td>{td?.uoMname}</td> */}
                  <td>{td?.requestQuantity}</td>
                  <td>{_dateFormatter(td?.requiredDate)}</td>
                  <td>
                    <div className="d-flex justify-content-around">
                      {!td?.isApproveByL1 && (
                        <span>
                          <IEdit
                            onClick={() => {
                              history.push(
                                `/inventory-management/warehouse-management/branditemrequisition/edit/${td?.brandRequestId}`
                              );
                            }}
                          />
                        </span>
                      )}
                      <span>
                        <IView
                          clickHandler={() => {
                            history.push(
                              `/inventory-management/warehouse-management/branditemrequisition/view/${td?.brandRequestId}`
                            );
                          }}
                        />
                      </span>
                      {[1, 4].includes(status) && !td?.isApproveByL2 && (
                        <span>
                          <IApproval
                            title={
                              status === 1
                                ? "Regional Manager Approve"
                                : "Head Office Approve"
                            }
                            onClick={() => {
                              getSingleDataById(td?.brandRequestId);
                            }}
                          />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
