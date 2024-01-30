import React from "react";
import IDelete from "../../../../../_helper/_helperIcons/_delete";

const CarryingAllowanceTable = ({ gridData,setGridData, setDaAmount, removeRowData }) => {
  const handleChange = (configId, e) => {
    const data = [...gridData];
    const updatedData = data?.map((item) => {
      if (item?.configId === configId) {
        return {
          ...item,
          [e.target.name]: e.target.value,
        };
      }
      return {
        ...item,
      };
    });
    setGridData(updatedData);
  };


console.log({gridData})
  return (
    <div className="row">
      <div className="col-lg-12 pr-0">
        <table className={"table table-responsive mt-1 bj-table"}>
          <thead className={`${gridData?.length < 1 && "d-none"}`}>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th style={{ width: "120px" }}>Vehicle Capacity</th>
              <th style={{ width: "100px" }}>Carring Allowance  Rate</th>

              <th style={{ width: "50px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => (
              <tr key={item?.configId}>
                <td>{index + 1}</td>
                <td>
                  <div className="text-center">
                    {item?.vahicleCapacity?.label || item?.vehicleCapacityName}
                  </div>
                </td>
                <td>
                  <div>
                    <div className="text-right pr-2">
                      <input
                        name="carrierAllowanceRate"
                        type="number"
                        className="trans-date cj-landing-date"
                        style={{
                          padding: "0 10px",
                          maxWidth: "98%",
                        }}
                        value={item?.carrierAllowanceRate}
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            handleChange(item?.configId, e);
                          }
                        }}
                      />
                    </div>
                  </div>
                </td>
                

                <td className="text-center">
                  {item?.isDeleted ? (
                    <IDelete remover={removeRowData} id={index} />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarryingAllowanceTable;
