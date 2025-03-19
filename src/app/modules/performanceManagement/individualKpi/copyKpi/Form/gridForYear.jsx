import React from "react";
function KpiYearGrid({ setGridData, gridData }) {

  const checkAllHandler = (name, value, grid, setGrid) => {
    const newData = grid?.map((item) => ({ ...item, [name]: value }));
    setGrid([...newData]);
  };

  const onCheckHandler = (name, value, index, grid, setGrid) => {
    const newData = [...grid];
    newData[index][name] = value;
    setGrid([...newData]);
  };

 
  return (
    <div className="row mt-4">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                name="isChecked"
                onChange={(e) => {
                  checkAllHandler(
                    e.target.name,
                    e.target.checked,
                    gridData,
                    setGridData
                  );
                }}
                
              ></input>
            </th>
            <th>SL</th>
            <th>Employee Enroll</th>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Supervisor</th>
          </tr>
        </thead>
        <tbody>
          {gridData &&
            gridData?.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    name="isChecked"
                    onChange={(e) =>
                      onCheckHandler(
                        e.target.name,
                        e.target.checked,
                        index,
                        gridData,
                        setGridData
                      )
                    }
                    checked={item?.isChecked}
                  ></input>
                </td>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item?.employeeId}</td>
                <td>{item?.employeeName}</td>
                <td>{item?.designation}</td>
                <td>{item?.department}</td>
                <td>{item?.supervisor}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default React?.memo(KpiYearGrid);
