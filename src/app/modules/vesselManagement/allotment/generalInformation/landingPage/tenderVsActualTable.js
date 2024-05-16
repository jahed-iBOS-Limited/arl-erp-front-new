import React from "react";
import TargetVsSalesChart from "./tenderVsActualTableChart";

const TenderVsActualTable = ({ gridData }) => {
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ width: "40px" }}>SL</th>
                  <th>Mother Vessel</th>
                  <th>International</th>
                  <th>Total Revenue Approximate</th>
                  <th>Total Revenue Actual</th>
                  <th>Variance Amount</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td> {index + 1}</td>
                      <td>{item?.strMVesselName}</td>
                      <td>{item?.international}</td>
                      <td>{item?.TotalRevenueApproximate}</td>
                      <td>{item?.TotalRevenueActual}</td>
                      <td>{item?.VarianceAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TargetVsSalesChart gridData={gridData} />
    </>
  );
};

export default TenderVsActualTable;
