import React, { useEffect, useState } from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../_helper/_confirmModal";
import { shallowEqual, useSelector } from "react-redux";
export default function UpdateItemRateModal({ propsObj }) {
  const {
    getLandingData,
    values,
    pageNo,
    pageSize,
    singleData,
    setIsShowHistoryModal,
  } = propsObj;
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [modifyData, setModifyData] = useState({});
  const [, updateHandler] = useAxiosPost();

  useEffect(() => {
    setModifyData({ ...singleData });
  }, [singleData]);
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Uom</th>
              <th>Effective Date</th>
              <th>Rate (Dhaka)</th>
              <th>Rate (Chittagong)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">{modifyData?.itemCode}</td>
              <td>{modifyData?.itemName}</td>
              <td className="text-center">{modifyData?.uomName}</td>
              <td className="text-center">
                <InputField
                  type="date"
                  value={_dateFormatter(modifyData?.effectiveDate)}
                  onChange={(e) => {
                    const data = { ...modifyData };
                    data["effectiveDate"] = e.target.value;
                    setModifyData(data);
                  }}
                />
              </td>
              <td className="text-center">
                <InputField
                  type="number"
                  value={modifyData?.itemRate || ""}
                  onChange={(e) => {
                    if (+e.target.value < 0) return;
                    const data = { ...modifyData };
                    data["itemRate"] = +e.target.value;
                    setModifyData(data);
                  }}
                />
              </td>
              <td className="text-center">
                <InputField
                  type="number"
                  value={modifyData?.itemOthersRate || ""}
                  onChange={(e) => {
                    if (+e.target.value < 0) return;
                    const data = { ...modifyData };
                    data["itemOthersRate"] = +e.target.value;
                    setModifyData(data);
                  }}
                />
              </td>
              <td className="text-center">
                <div className="">
                  <span className="mr-3">
                    <button
                      disabled={
                        !modifyData?.effectiveDate ||
                        (!modifyData?.itemRate && !modifyData?.itemOthersRate)
                      }
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        IConfirmModal({
                          message: `Are you sure to Update?`,
                          yesAlertFunc: () => {
                            updateHandler(
                              `/procurement/PurchaseOrder/UpdateItemRateConfiguration`,
                              {
                                itemRateConfigId: modifyData?.itemRateConfigId,
                                itemId: modifyData?.itemId,
                                itemName: modifyData?.itemName,
                                itemRate: modifyData?.itemRate || 0,
                                itemRateOthers: modifyData?.itemOthersRate || 0,
                                businessUnitId: selectedBusinessUnit?.value,
                                plantId: modifyData?.plantId,
                                warehouseId: modifyData?.warehouseId,
                                effectiveDate: modifyData?.effectiveDate,
                                isActive: true,
                                updatedBy: profileData?.userId,
                              },
                              () => {
                                getLandingData(values, pageNo, pageSize, "");
                              },
                              true
                            );
                          },
                          noAlertFunc: () => {},
                        });
                      }}
                    >
                      Update
                    </button>
                  </span>
                  <span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setIsShowHistoryModal(true);
                      }}
                    >
                      History
                    </button>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
