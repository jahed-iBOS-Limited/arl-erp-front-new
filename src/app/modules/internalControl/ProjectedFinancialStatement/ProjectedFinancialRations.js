import React from "react";
import { _formatMoney } from "../../_helper/_formatMoney";

const ProjectedFinancialRations = ({
  ratioTableData,
  componentTableData,
  values,
  selectedBusinessUnit,
}) => {
  return (
    <div className="row">
      <div className="col-12 text-center">
        <h3>{selectedBusinessUnit}</h3>
        <p>
          From <span>{values?.fromDate}</span> To <span>{values?.toDate}</span>
        </p>
      </div>
      <div className="col-lg-6">
        <h4>Financial Ratio</h4>
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
              <th>Rario Name</th>
              <th>Std Ratio</th>
              <th>Act Ratio</th>
              <th>Matric</th>
            </tr>
          </thead>
          <tbody>
            {ratioTableData?.length &&
              ratioTableData?.map((item, index) => {
                return (
                  <tr
                    key={index}
                    style={{
                      fontWeight: Number.isInteger(item?.numSL || 0)
                        ? "bold"
                        : "",
                    }}
                  >
                    <>
                      <td className="text-right">{item?.numSL}</td>
                      <td className="text-left">{item?.strRarioName}</td>

                      <td className="text-right">
                        {item?.stdRatio ? item?.stdRatio : ""}
                      </td>
                      <td className="text-right">
                        {item?.numRatio ? item?.numRatio : ""}
                      </td>
                      <td>{item?.strMatric}</td>
                    </>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className="col-lg-6">
        <h4>Financial Ratio Component</h4>
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>Com. Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {componentTableData?.length &&
              componentTableData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <>
                      <td className="text-left">{item?.strComName}</td>
                      <td className="text-right">
                        {_formatMoney(Math.round(item?.numAmount), 0)}
                      </td>
                    </>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectedFinancialRations;
