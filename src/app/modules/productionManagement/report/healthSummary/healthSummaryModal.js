import React, { useEffect, useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import IViewModal from "../../../_helper/_viewModal";
function HealthSummaryModal({ clickRowData }) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [clickRowDataMachienDetils, setClickRowDataMachienDetils] = useState(
    {}
  );
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);
  const [, getHealthCheckPendingList, ,] = useAxiosGet();
  useEffect(() => {
    getHealthCheckPendingList(
      `/asset/AssetMaintanance/GetMachineHealthCheckPendingList?checkDate=${clickRowData?.fromDate}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${clickRowData?.plant?.value}&shopfloorId=${clickRowData?.shopfloor?.value}&sectionName=${clickRowData?.strSectionName}&type=MachineWiseCheckPercentage`,
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
              <th>CheckList Criteria Total</th>
              <th>CheckList Criteria Pending</th>
              <th>CheckList Criteria Complete</th>
              <th>Complete(%)</th>
              <th>Pending(%)</th>
              <th>CheckList Criteria Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.machineName}</td>
                <td>{item?.sectionName}</td>
                <td>{item?.totalCheckListCriteria}</td>
                <td>{item?.pendingCheckListCriteria}</td>
                <td>{item?.completeCheckListCriteria}</td>
                <td>{item?.completePercentage || 0}%</td>
                <td>{item?.pendingPercentage || 0}&</td>
                <td>{item?.checkListCriteriaStatus}</td>
                <td>
                  <div className="d-flex justify-content-around">
                    <span
                      className="btn btn-primary"
                      onClick={() => {
                        setIsShowModal(true);
                        setClickRowDataMachienDetils(item);
                      }}
                    >
                      View
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isShowModal && (
        <>
          <IViewModal
            show={isShowModal}
            onHide={() => {
              setIsShowModal(false);
              setClickRowDataMachienDetils({});
            }}
            title={clickRowDataMachienDetils?.machineName || ""}
          >
            <MachienDetils
              clickRowData={clickRowData}
              selectedBusinessUnit={selectedBusinessUnit}
              clickRowDataMachienDetils={clickRowDataMachienDetils}
            />
          </IViewModal>
        </>
      )}
    </div>
  );
}

export default HealthSummaryModal;

const MachienDetils = ({
  clickRowData,
  selectedBusinessUnit,
  clickRowDataMachienDetils,
}) => {
  const [gridData, setGridData] = useState([]);
  const [, getHealthCheckPendingList, ,] = useAxiosGet();

  useEffect(() => {
    getHealthCheckPendingList(
      `/asset/AssetMaintanance/GetMachineHealthCheckPendingList?checkDate=${clickRowData?.fromDate}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${clickRowData?.plant?.value}&shopfloorId=${clickRowData?.shopfloor?.value}&sectionName=${clickRowData?.strSectionName}&type=MachineWisePendingCheckList&machineId=${clickRowDataMachienDetils?.machineId}`,
      (resData) => {
        setGridData(resData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0">
          <thead>
            <tr>
              <th>SL</th>
              <th>Section Name</th>
              <th>CheckList Criteria Type</th>
              <th>CheckList Criteria</th>
              <th>Work Section</th>
              <th>Health Check Status</th>
              <th>Work Status</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item?.sectionName}</td>
                <td>{item?.checkListCriteriaType}</td>
                <td>{item?.checkListCriteria}</td>
                <td>{item?.workSection}</td>
                <td>{item?.healthCheckStatus}</td>
                <td>{item?.workStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
