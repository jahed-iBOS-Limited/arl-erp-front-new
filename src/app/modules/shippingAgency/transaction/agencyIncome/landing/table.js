import React from "react";

const LandingTable = ({ obj }) => {
  const { gridData } = obj;

  return (
    <div className='table-responsive'>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th
              style={{
                width: "30px",
              }}
            >
              SL
            </th>
            <th>Voyage No</th>
            <th>Vessel Type</th>
            <th>Vessel Name</th>
            <th>Customer Name</th>
            <th>Exchange Rate</th>
            <th>Estimated Amount</th>
            <th>Total Bill</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.voyageNo}</td>
              <td>{item?.vesselType}</td>
              <td>{item?.vesselName}</td>
              <td>{item?.customerName}</td>
              <td className='text-right'>{item?.exchangeRate}</td>
              <td className='text-right'>{item?.estimatedAmount}</td>
              <td className='text-right'>{item?.totalBill}</td>
              <td>
                <div className="d-flex justify-content-center align-items-center">
                  <button className='btn btn-primary' type="button">JV</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LandingTable;
