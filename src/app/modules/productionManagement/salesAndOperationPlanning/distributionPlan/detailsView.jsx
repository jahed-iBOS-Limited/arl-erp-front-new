import React, { useEffect } from "react";
import { _formatMoney } from "../../../_helper/_formatMoney";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";

export default function DetailsDistributionView({ singleData }) {
  const [rowData, getRowDto, loading] = useAxiosGet();

  useEffect(() => {
    getRowDto(
      `/oms/DistributionChannel/GetDistributionItemById?DistributionPlanningId=${singleData?.distributionPlanningId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  return (
    <div className="row">
      {loading && <Loading />}
      <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Item UoM Name</th>
                <th>Plan Qty</th>
                <th>Plan Rate</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.length > 0 &&
                rowData?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-center">{item?.itemCode}</td>
                    <td>{item?.itemName}</td>
                    <td>{item?.itemUoMName}</td>
                    <td className="text-center">{item?.planQty}</td>
                    <td className="text-right">
                      {_formatMoney(item?.planRate)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
