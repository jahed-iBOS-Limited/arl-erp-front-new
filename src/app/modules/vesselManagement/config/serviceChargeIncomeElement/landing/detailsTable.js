import React from "react";

const DetailsTable = ({ obj }) => {
  const { costs, revenues } = obj;

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
                  <th style={{ minWidth: "30px" }}>SL</th>
                  <th>Cost Element</th>
                  <th>Rate (BDT)</th>
                </tr>
              </thead>
              <tbody>
                {costs?.map((item, i) => {
                  return (
                    <tr>
                      <td style={{ minWidth: "30px" }} className="text-center">
                        {i + 1}
                      </td>
                      <td>{item?.serviceElementName}</td>
                      <td>{item?.rate}</td>
                    </tr>
                  );
                })}
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
                  <th>SL</th>
                  <th>Revenue Element</th>
                  <th>Rate (BDT)</th>
                </tr>
              </thead>
              <tbody>
                {revenues?.map((item, i) => {
                  return (
                    <tr>
                      <td className="text-center">{i + 1}</td>
                      <td>{item?.serviceElementName}</td>
                      <td>{item?.rate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsTable;
