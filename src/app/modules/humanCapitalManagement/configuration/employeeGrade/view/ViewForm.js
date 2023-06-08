import React from "react";

function ViewForm({tableData}) {
  return (
    <div className="row my-6 global-form">
      <div className="form-group col-lg-3">
        <label htmlFor="empPostionGrp">Employee Position Group</label>
        <input
          value={tableData[0]?.positionGroupName}
          type="text"
          className="form-control"
          id="empPostionGrp"
          placeholder="Employee Position Group"
          disabled={true}
        />
      </div>
      <div className="form-group col-lg-3">
        <label htmlFor="code">Employee HR Position</label>
        <input
          value={tableData[0]?.positionName}
          type="text"
          className="form-control"
          id="empHrPostion"
          placeholder="Employee HR Position"
          disabled={true}
        />
      </div>
    </div>
  );
}

export default ViewForm;
