/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IClose from "../../../../_helper/_helperIcons/_close";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";

const DamageEntryLandingTable = ({ obj }) => {
  const {
    values,
    getRows,
    gridData,
    cancelHandler,
    dataChangeHandler,
    salesReturnApprove,
  } = obj;

  return (
    <>
      {gridData?.data?.length > 0 && (
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Challan No</th>
              <th>Customer Name</th>
              <th>Customer Code</th>
              <th style={{ width: "120px" }}>Quantity</th>
              <th style={{ width: "120px" }}>Amount</th>
              <th>Entry Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => (
              <tr key={index}>
                <td className="text-center"> {index + 1}</td>
                <td> {item?.deliveryChallan}</td>
                <td> {item?.businessPartnerName}</td>
                <td> {item?.businessPartnerCode}</td>

                <td className="text-right">
                  {item?.editMode
                    ? values?.viewAs?.value === 1 && (
                        <InputField
                          value={item?.tempQty}
                          name="tempQty"
                          placeholder="Quantity"
                          type="number"
                          onChange={(e) => {
                            dataChangeHandler(
                              index,
                              "tempQty",
                              e?.target?.value
                            );
                          }}
                          onBlur={(e) => {
                            if (e?.target?.value > item?.numDeliveryQnt) {
                              toast.warn(
                                "Damage qty can not be greater than delivery qty"
                              );
                            }
                          }}
                        />
                      )
                    : _fixedPoint(item?.quantity || item?.totalReturnQty, true)}
                </td>
                <td className="text-right">
                  {_fixedPoint(
                    item?.returnAmount || item?.totalReturnAmount,
                    true
                  )}
                </td>
                <td> {_dateFormatter(item?.returnDateTime)}</td>
                <td>
                  {item?.isApprovedBySupervisor && item?.isApprovedByAccount
                    ? "Approved by Supervisor and Account"
                    : item?.isApprovedBySupervisor
                    ? "Approved by Supervisor"
                    : !item?.isActive
                    ? "Canceled"
                    : "Pending"}
                </td>
                <td>
                  <div className="d-flex justify-content-around">
                    {(!item?.isApprovedByAccount ||
                      !item?.isApprovedBySupervisor) &&
                      item?.isActive && (
                        <>
                          {[1].includes(values?.viewAs?.value) &&
                            !item?.isApprovedByAccount &&
                            !item?.isApprovedBySupervisor && (
                              <span
                                onClick={() => {
                                  getRows(item);
                                }}
                              >
                                <IEdit title="Update and Approve" />
                              </span>
                            )}
                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              cancelHandler(item, values);
                            }}
                          >
                            <IClose title="Cancel Sales Return" />
                          </span>
                          {[2, 0].includes(values?.status?.value) &&
                            [2].includes(values?.viewAs?.value) && (
                              <span
                                onClick={() => {
                                  salesReturnApprove(values, item);
                                }}
                              >
                                <IApproval title="Approve the Sales Return" />
                              </span>
                            )}
                        </>
                      )}
                  </div>
                </td>
              </tr>
            ))}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td colSpan={4} className="text-right">
                <b>Total</b>
              </td>
              <td>
                {_fixedPoint(
                  gridData?.data?.reduce((a, b) => a + b?.totalReturnQty, 0),
                  true,
                  0
                )}
              </td>
              <td>
                {_fixedPoint(
                  gridData?.data?.reduce((a, b) => a + b?.totalReturnAmount, 0),
                  true
                )}
              </td>
              <td colSpan={3}></td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default DamageEntryLandingTable;
