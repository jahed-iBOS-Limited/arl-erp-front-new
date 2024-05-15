import React from "react";
import IDelete from "../../../../../_helper/_helperIcons/_delete";

const DailyAllowanceTable = ({ gridData, setGridData, setDaAmount, removeRowData }) => {

  const handleChange = (nthItem, e) => {
    const updatedData = [...gridData];
    updatedData.splice(nthItem, 1, {
      ...updatedData[nthItem],
      [e.target.name]: e.target.value,
    });
    setGridData(updatedData);
  };





  const handleDaComponentChange = (configId, value) => {
    const data = [...gridData];
    const updatedData = data?.map((item) => {
      if (item?.configId === configId) {
        return {
          ...item,
          daamount: value,
        };
      }
      return {
        ...item,
      };
    });
    setGridData(updatedData)
  };
  return (
    <div className="row">
      <div className="col-lg-12 table-responsive">
        <table className={"table table-responsive mt-1 bj-table"}>
          <thead className={gridData.length < 1 && "d-none"}>
            <tr>
              <th style={{ width: "30px" }}>SL</th>
              <th style={{ width: "120px" }}>Vehicle Capacity</th>
              <th style={{ width: "100px" }}>DA Amount</th>
              <th style={{ width: "100px" }}>DA Component</th>
              <th style={{ width: "100px" }}>Down Trip Allowance Component</th>
              <th style={{ width: "100px" }}>Down Trip Allowance Amount</th>

              <th style={{ width: "50px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => (
              <tr key={index}>
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
                        name="daamount"
                        type="number"
                        className="trans-date cj-landing-date"
                        style={{
                          padding: "0 10px",
                          maxWidth: "98%",
                        }}
                        value={item?.daamount}
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            // handleDaComponentChange(item?.configId, e.target.value)
                            handleChange(index, e)
                            // setDaAmount(index, e.target.value, e.target.name);
                          }
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-center">
                    {item?.daComponent?.label || item?.dacostComponentName}
                  </div>
                </td>
                <td>
                  <div className="text-center">
                    {item?.allowance?.label || item?.downTripAllowanceName}
                  </div>
                </td>
                <td>
                  {/* <div className="text-center">
                                  {item?.allowance?.label ||
                                    item?.downTripAllowance}
                                </div> */}
                  <div>
                    <div className="text-right pr-2">
                      <input
                        name="downTripAllowance"
                        type="number"
                        className="trans-date cj-landing-date"
                        style={{
                          padding: "0 10px",
                          maxWidth: "98%",
                        }}
                        value={item?.downTripAllowance}
                        onChange={(e) => {
                          if (e.target.value >= 0) {
                            handleChange(index, e)
                            // setDaAmount(index, e.target.value, e.target.name);
                          }
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="text-center">
                  {item?.isDeleted ? (
                       <IDelete remover={removeRowData}  id={index}/>
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

export default DailyAllowanceTable;
