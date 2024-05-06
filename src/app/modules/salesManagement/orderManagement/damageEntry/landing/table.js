/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IClose from "../../../../_helper/_helperIcons/_close";
import InputField from "../../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";

const DamageEntryLandingTable = ({ obj }) => {
  const {
    values,
    // getRows,
    gridData,
    allSelect,
    selectedAll,
    setGridData,
    cancelHandler,
    dataChangeHandler,
    salesReturnApprove,
  } = obj;

  const dispatch = useDispatch();

  return (
    <>
      {gridData?.data?.length > 0 && (
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              {values?.status?.value === 2 && (
                <th
                  onClick={() => allSelect(!selectedAll())}
                  className="text-center cursor-pointer"
                  style={{ width: "40px" }}
                >
                  <input
                    type="checkbox"
                    value={selectedAll()}
                    checked={selectedAll()}
                    onChange={() => {}}
                  />
                </th>
              )}
              <th>SL</th>
              <th>Challan No</th>
              <th>Delivery Date</th>
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
                {!item?.isApprovedBySupervisor && values?.status?.value === 2 && (
                  <td
                    onClick={() => {
                      let _data = [...gridData?.data];
                      _data[index]["isSelected"] = !item.isSelected;
                      setGridData({ ...gridData, data: _data });
                    }}
                    className="text-center"
                  >
                    <input
                      type="checkbox"
                      value={item?.isSelected}
                      checked={item?.isSelected}
                      onChange={() => {}}
                    />
                  </td>
                )}
                <td className="text-center"> {index + 1}</td>
                <td> {item?.deliveryChallan}</td>
                <td className="text-center"> {_dateFormatter(item?.deliveryDate)}</td>
                <td> {item?.businessPartnerName}</td>
                <td> {item?.businessPartnerCode}</td>

                <td className="text-right">
                  {item?.isSelected
                    ? values?.viewAs?.value === 1 && (
                        <InputField
                          value={item?.totalReturnQty}
                          name="totalReturnQty"
                          placeholder="Quantity"
                          type="number"
                          min={0.2}
                          onChange={(e) => {
                            dataChangeHandler(
                              index,
                              "totalReturnQty",
                              +e?.target?.value
                            );
                          }}
                          onBlur={(e) => {
                            if (+e?.target?.value > item?.numDeliveryQnt) {
                              toast.warn(
                                "Damage qty can not be greater than delivery qty"
                              );
                            }

                            if (+e?.target?.value < 0.2) {
                              toast.warn("Return qty can not be less than 0.2");
                            }
                          }}
                        />
                      )
                    : _fixedPoint(item?.totalReturnQty, true)}
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
                          {/* {[1].includes(values?.viewAs?.value) &&
                            !item?.isApprovedByAccount &&
                            !item?.isApprovedBySupervisor && (
                              <span
                                onClick={() => {
                                  getRows(item);
                                }}
                              >
                                <IEdit title="Update and Approve" />
                              </span>
                            )} */}
                          {!item?.isApprovedBySupervisor && (
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                cancelHandler(item, values);
                              }}
                            >
                              <IClose title="Cancel Sales Return" />
                            </span>
                          )}
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
                    <span>
                      <ICon
                        title={
                          item?.attatchment
                            ? "Show attached file"
                            : "File not attached"
                        }
                        onClick={() => {
                          if (item?.attatchment) {
                            dispatch(
                              getDownlloadFileView_Action(item?.attatchment)
                            );
                          }
                        }}
                      >
                        <i class="far fa-image"></i>{" "}
                      </ICon>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td colSpan={5} className="text-right">
                <b>Total</b>
              </td>
              <td>
                {_fixedPoint(
                  gridData?.data?.reduce((a, b) => a + +b?.totalReturnQty, 0),
                  true
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
