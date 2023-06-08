import React from "react";

function ViewForm({ singleData }) {
  return (
    <div className="row my-6">
      <div className="form-group col-lg-3">
        <label htmlFor="empPostionGrp">Employee Position Group</label>
        <input
          type="text"
          className="form-control"
          id="empPostionGrp"
          value={
            singleData &&
            singleData.length > 0 &&
            singleData[0]?.positionGroupName
          }
          placeholder="Employee Position Group"
          disabled={true}
        />
      </div>
      <div className="form-group col-lg-3">
        <label htmlFor="code">Code</label>
        <input
          type="text"
          className="form-control"
          id="code"
          value={
            singleData &&
            singleData.length > 0 &&
            singleData[0]?.positionGroupCode
          }
          placeholder="Code"
          disabled={true}
        />
      </div>
    </div>
  );
}

export default ViewForm;
