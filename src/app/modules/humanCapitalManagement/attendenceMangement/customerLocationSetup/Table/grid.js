import React from "react";
import { withRouter, useHistory } from "react-router-dom";

const GridData = ({ rowDto }) => {
  const history = useHistory();
  return (
    <>
      <div className="row cash_journal">
        <div className="col-lg-12">
          {rowDto?.length > 0 && (
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th style={{ width: "200px" }}>Partner Code</th>
                  <th style={{ width: "200px" }}>Partner Name</th>
                  <th style={{ width: "200px" }}>Partner Address</th>
                  <th style={{ width: "200px" }}>Latitude</th>
                  <th style={{ width: "200px" }}>Longitude</th>
                  <th style={{ width: "130px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {index + 1}</td>
                    <td> {tableData?.partnerCode}</td>
                    <td> {tableData?.partnerName}</td>
                    <td>{tableData?.partnerAddress} </td>
                    <td> {tableData?.longitude}</td>
                    <td> {tableData?.latitude}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      <button
                        onClick={() =>
                          history.push({
                            pathname: `/human-capital-management/attendancemgt/customerlocationsetup/customerlocation`,
                            state: tableData,
                          })
                        }
                        className="btn btn-outline-dark mr-1 pointer"
                        style={{
                          padding: "5px 4px",
                          fontZize: "12px",
                          width: "100px",
                        }}
                      >
                        Add Location
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default withRouter(GridData);
