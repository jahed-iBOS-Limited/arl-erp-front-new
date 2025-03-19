import React, { useEffect } from "react";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

export default function IncentiveModal({ incentiveConfigId }) {
  const [incentiveData, getIncentiveData, loadIncentiveData] = useAxiosGet();
  useEffect(() => {
    if (incentiveConfigId) {
      getIncentiveData(
        `/oms/IncentiveConfig/GetIncentiveConfigById?IncentiveConfigId=${incentiveConfigId}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incentiveConfigId]);
  return (
    <>
      {loadIncentiveData && <Loading />}
      <h2 className="text-center mt-3 mb-3" style={{ color: "red" }}>
        {incentiveData?.businessUnitName}
      </h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Based On</th>
              <th>From Slab</th>
              <th>To Slab</th>
              <th>Incentive</th>
            </tr>
          </thead>
          <tbody>
            {incentiveData?.row?.length > 0 &&
              incentiveData?.row?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{item?.basedOn}</td>
                  <td className="text-center">{item?.fromSlab}</td>
                  <td className="text-center">{item?.toSlab}</td>
                  <td className="text-center">{item?.incentivePercentage}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
