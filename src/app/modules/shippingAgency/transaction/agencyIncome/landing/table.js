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
            <th>Demo</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.demo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LandingTable;
