import React from "react";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
// import "./style.scss";
function YeildReport({ tableData }) {
  return (
    <>
      <div className='row YeildReport'>
        <div className='col-lg-12'>
          <div className='table-responsive'>
            <table className='table table-striped table-bordered global-table'>
              <>
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL.</th>
                    <th>Product</th>
                    <th>Issue</th>
                    <th>Consumption KG</th>
                    <th>WIP</th>
                    <th>Production KG</th>
                    <th>By Product KG</th>
                    <th>Rice(%)</th>
                    <th>By Product(%)</th>
                    <th
                      style={{
                        width: "30px",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((item, index) => {
                    let byProductPercent =
                      (+item?.byProducationQty || 0) /
                      (+item?.producationQty || 0);
                    return (
                      <>
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item?.itemName}</td>
                          <td>{_fixedPoint(item?.issueQty || 0)}</td>
                          <td>{_fixedPoint(item?.consumtionQty || 0)}</td>
                          <td>{_fixedPoint(item?.wip || 0)}</td>
                          <td>{_fixedPoint(item?.producationQty || 0)}</td>
                          <td>{_fixedPoint(item?.byProducationQty || 0)}</td>
                          <td>{_fixedPoint(item?.yieldPer || 0)}</td>
                          <td>
                            {_fixedPoint(
                              isFinite(byProductPercent) ? byProductPercent : 0
                            )}
                          </td>
                          <td>
                            <div className='d-flex justify-content-center align-items-center'>
                              <button
                                className='btn btn-primary mr-2'
                                type='button'
                                onClick={() => {}}
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default YeildReport;
