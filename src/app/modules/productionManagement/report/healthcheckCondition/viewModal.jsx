import React, { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import { _dateFormatter } from "../../../_helper/_dateFormate";
export function DamageViewModal({ values, singleData }) {
  const [viewData, getViewData, loading] = useAxiosGet();
  useEffect(() => {
    getViewData(
      `/asset/AssetMaintanance/GetMachineDamageStatusReport?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${values?.businessUnit?.value}&PlantId=${values?.plant?.value}&MachineId=${singleData?.intMachineId}&SectionName=${singleData?.SectionName}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, singleData]);
  return (
    <>
      {loading && <Loading />}
      <div className="form-group  global-form">
        <div
          style={{ fontSize: "12px" }}
          className="d-flex justify-content-between"
        >
          <div>
            <p>Business Unit: {values?.businessUnit?.label}</p>
            <p>Plant Name: {singleData?.strPlantname}</p>
            <p>Shopfloor Name: {singleData?.strShopfloorName}</p>
          </div>
          <div>
            <p>Employee Section: {singleData?.SectionName}</p>
            <p>Machine: {singleData?.strMachineName}</p>
          </div>
        </div>
      </div>
      <div className="table-responsive mt-5">
        <div>
          <strong className="mr-5">From Date: {values?.fromDate}</strong>{" "}
          <strong className="ml-5">To Date: {values?.toDate}</strong>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table mt-0">
            <thead>
              <tr>
                <th>SL</th>
                <th>Date</th>
                <th>Checklist Criteria Type</th>
                <th>Checklist Criteria</th>
                <th>Standard Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {viewData?.length
                ? viewData.map((item, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td className="text-center">
                          {_dateFormatter(item?.dteCheckedDatetime)}
                        </td>
                        <td>{item?.strCheckListCriteriaType}</td>
                        <td>{item?.strCheckListCriteria}</td>
                        <td>{item?.strStandardValue}</td>
                        <td className="text-center">{item?.strWorkStatus}</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
