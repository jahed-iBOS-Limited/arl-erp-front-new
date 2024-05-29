import React from "react";
import { withRouter } from "react-router-dom";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import IExtend from "./../../../../_helper/_helperIcons/_extend";
const GridData = ({ history, rowDto }) => {
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          {rowDto?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th style={{ width: "35px" }}>SL</th>
                    <th style={{ width: "50px" }}>Plant</th>
                    <th style={{ width: "50px" }}>Code</th>
                    <th style={{ width: "35px" }}>Address</th>
                    <th style={{ width: "20px" }}>Action </th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((tableData, index) => (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td> {tableData.plantName} </td>
                      <td> {tableData.plantCode} </td>
                      <td> {tableData.plantAddress} </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <span
                            onClick={() => {
                              history.push({
                                pathname: `/inventory-management/configuration/plant/edit/${tableData?.plantId}`,
                                state: tableData,
                              });
                            }}
                          >
                            <IEdit />
                          </span>

                          <span
                            onClick={() => {
                              history.push({
                                pathname: `/inventory-management/configuration/plant/extend/${tableData?.plantId}`,
                                state: tableData,
                              });
                            }}
                          >
                            <IExtend />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
