import React from "react";

const Table = () => {
  return (
    <>
      <div className="row">
        <div className="col-lg-6">
          <div className="react-bootstrap-table table-responsive">
            <table
              className={"table table-striped table-bordered global-table "}
            >
              <thead>
                <tr>
                  <th>All Check</th>
                  <th>SL</th>
                  <th>Cost Element</th>
                  <th>Rate (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>checkbox</td>
                  <td>1</td>
                  <td>Cost Element</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="react-bootstrap-table table-responsive">
            <table
              className={"table table-striped table-bordered global-table "}
            >
              <thead>
                <tr>
                  <th>All Check</th>
                  <th>SL</th>
                  <th>Cost Element</th>
                  <th>Rate (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>checkbox</td>
                  <td>1</td>
                  <td>Cost Element</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
