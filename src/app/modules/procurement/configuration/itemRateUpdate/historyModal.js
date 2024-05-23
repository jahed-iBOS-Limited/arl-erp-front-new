import React, { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
export default function ItemRateHistoryModal({ propsObj }) {
  const { singleData } = propsObj;
  const [historyData, getHistoryData] = useAxiosGet();

  useEffect(() => {
    getHistoryData(
      `/procurement/PurchaseOrder/GetItemRateConfigurationHistory?itemId=${singleData?.itemId}&configId=${singleData?.itemRateConfigId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  return (
    <>
      <div className="form-group  global-form row">
        <p className="col-lg-3">
          <strong>Item Code</strong> : {singleData?.itemCode}
        </p>
        <p className="col-lg-3">
          <strong>Item Name</strong> : {singleData?.itemName}
        </p>
        <p className="col-lg-3">
          <strong>Item UoM</strong> : {singleData?.uomName}
        </p>
      </div>
      <div className="table-responsive">
        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>Sl</th>
              <th>Effective Date</th>
              <th>Last Update Date</th>
              <th>Update By</th>
              <th>Rate (Dhaka)</th>
              <th>Rate (Chittagong)</th>
            </tr>
          </thead>
          <tbody>
            {historyData?.length > 0 &&
              historyData?.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="text-center">
                    {_dateFormatter(item?.effectiveDate)}
                  </td>
                  <td className="text-center">
                    {_dateFormatter(item?.updatedAt)}
                  </td>
                  <td>{item?.updatedByName}</td>
                  <td className="text-center">{item?.itemRate}</td>
                  <td className="text-center">{item?.itemRateOthers}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
