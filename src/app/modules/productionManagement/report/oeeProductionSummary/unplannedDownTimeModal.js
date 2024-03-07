import React, { useEffect } from "react";
import { dateFormatWithMonthName } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

export default function UnPlannedDownTimeModal({ values,singleData }) {
  const [rowData, getRowData, loadingRowData] = useAxiosGet();

  useEffect(() => {
    getRowData(
      `/asset/AssetMaintanance/GetUnPlanDownTimeListByDate?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${values?.businessUnit?.value}&PlantId=${values?.plant?.value}&ShopfloorId=${values?.shopFloor?.value}&MachineId=${singleData?.intMachineId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
  return (
    <>
      {loadingRowData && <Loading />}
      <div>
        <div
          style={{ marginTop: "40px" }}
          className="mt-4  d-flex align-items-center justify-content-between"
        >
          <div>
            <p>
              <strong>Business Unit : {values?.businessUnit?.label}</strong>
            </p>
            <p>
              <strong>Plant Name : {values?.plant?.label}</strong>
            </p>
          </div>
          <div>
            <p>
              <strong>Machine Section : {rowData[0]?.strMachineName}</strong>
            </p>
            <p>
              <strong>From Date : {values?.fromDate}</strong>
            </p>
            <p>
              <strong>To Date : {values?.toDate}</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="loan-scrollable-table">
        <div
          style={{ maxHeight: "550px" }}
          className="scroll-table _table table-responsive"
        >
          <table className="table table-striped three-column-sticky table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th className="text-center">Date</th>
                <th className="text-center">Machine Name</th>
                <th className="text-center">Category Name</th>
                <th className="text-center">SubCategory Name</th>
                <th style={{ minWidth: "200px" }} className="text-center">
                  Reason
                </th>
                <th className="text-center">Loss Time (Min)</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">
                    {item?.dteLossTimeDate && dateFormatWithMonthName(
                      item?.dteLossTimeDate?.split("T")[0]
                    )}
                  </td>
                  <td className="text-center">{item?.strWrokCenterName}</td>
                  <td className="text-center">{item?.strCategoryName}</td>
                  <td className="text-center">{item?.strSubCategoryName}</td>
                  <td className="text-center">{item?.strReason}</td>
                  <td className="text-center">{item?.intLossTimeInMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
