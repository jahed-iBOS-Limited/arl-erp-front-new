import React from "react";

const AkijEssentialLandingDataTable = ({ rowData = [] }) => {
  console.log({ rowData });
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Enroll</th>
              <th>Field Force Name</th>
              <th>Design.</th>
              <th>Territory</th>
              <th>Target Chinigura</th>
              <th>Target Others</th>
              <th>Total Target</th>
              <th>Achv. Chinigira %</th>
              <th>Achv. Other %</th>
              <th>Total Achv.</th>
              <th>Incentive Chinigura</th>
              <th>Incentive Others</th>
              <th>Payable Incentive</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.map((item, index) => (
              <tr>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item.intEmployeeIdSO}</td>
                <td className="text-center">{item.strEmployeeNameTSO}</td>
                <td className="text-center">{item.strDesignationName}</td>
                <td className="text-center">{item.territoryid}</td>
                <td className="text-center">{item.numTargetQntChiniguraTon}</td>
                <td className="text-center">
                  {item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">
                  {item.numTargetQntChiniguraTon +
                    item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">{item.numChiniguraAchievement}</td>
                <td className="text-center">
                  {item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">
                  {item.numChiniguraAchievement +
                    item.numTargetQntWithoutChiniguraTon}
                </td>
                <td className="text-center">
                  {item.numChiniguraCommissionAmount}
                </td>
                <td className="text-center">
                  {item.numwithoutChiniguraCommissionAmount}
                </td>
                <td className="text-center">{item.numTotalCommission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AkijEssentialLandingDataTable;
