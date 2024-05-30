import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
function HealthSummaryModal({ clickRowData }) {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);
  const [, getHealthCheckPendingList, ,] = useAxiosGet();
  useEffect(() => {
    getHealthCheckPendingList(
      `/asset/AssetMaintanance/GetMachineHealthCheckPendingList?checkDate=${clickRowData?.fromDate}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${clickRowData?.plant?.value}&shopfloorId=${clickRowData?.shopfloor?.value}&sectionName=${clickRowData?.strSectionName}`,
      (resData) => {
        setGridData(resData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0">
          <thead>
            <tr>
              <th>SL</th>
              <th>Machine Name</th>
              <th>Section Name</th>
              <th>CheckList Criteria</th>
              <th>CheckList Criteria Type</th>
              <th>HealthCheck Status</th>
              <th>Work Status</th>
              <th>Work Section</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.machineName}</td>
                <td>{item?.sectionName}</td>
                <td>{item?.checkListCriteria}</td>
                <td>{item?.checkListCriteriaType}</td>
                <td>{item?.healthCheckStatus}</td>
                <td>{item?.workStatus}</td>
                <td>{item?.workSection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HealthSummaryModal;
