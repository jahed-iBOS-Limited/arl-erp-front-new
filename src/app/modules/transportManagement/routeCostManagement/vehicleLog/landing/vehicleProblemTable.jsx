import React from "react";

const VehicleProblemTable = ({ obj }) => {
  const { rowData } = obj;

  return (
    <>
      {rowData?.data?.length > 0 && (
       <div className="table-responsive">
         <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Problem</th>
              <th>Vehicle</th>
              <th>ShipPoint</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.length &&
              rowData?.data?.map((data, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>

                  <td>{data.problemTypeName}</td>
                  <td>{data.vehicleName}</td>
                  <td>{data.shipPointName}</td>
                </tr>
              ))}
          </tbody>
        </table>
       </div>
      )}
    </>
  );
};

export default VehicleProblemTable;
