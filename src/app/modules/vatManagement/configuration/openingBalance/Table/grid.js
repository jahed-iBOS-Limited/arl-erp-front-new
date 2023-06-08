import React from "react";
import { withRouter } from "react-router-dom";

const GridData = ({ rowDto, status }) => {
  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th style={{ width: "60px" }}>SD</th>
                <th style={{ width: "50px" }}>VAT</th>
                {status !== "deduction" && (
                  <th style={{ width: "50px" }}>SURCHARGE</th>
                )}
              </tr>
            </thead>
            <tbody>
              {rowDto?.data?.map((item, index) => (
                <tr key={item.taxBranchId}>
                  <td> {item.sl}</td>
                  <td>
                    <div className="text-center">{item?.numSD}</div>
                  </td>
                  <td>
                    <div className="text-center">{item?.numVAT}</div>
                  </td>
                  {status !== "deduction" && (
                    <td>
                      <div className="text-center">{item?.numsurcharge}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
