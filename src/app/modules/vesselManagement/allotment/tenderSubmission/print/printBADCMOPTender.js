import React from "react";

const PrintBADCMOPTender = ({ tenderDetails }) => {
  return (
    <div className="">
      <div>
        <p>
          {" "}
          <strong>Annexure-A:</strong> Transportation and stacking of MOP
          fertilizer from the ghats of Chattogram port/private ghat and the
          godowns of Chattogram city corporation areas/industrial areas/port
          areas/BADC's Transit godown 1&2/Dewanhat/any other local godowns of
          BADC to the following godowns/center
        </p>
      </div>
      <table style={{ margin: "20px 0" }} className="badc-tender-table">
        <thead style={{ padding: "10px 0", textAlign: "center" }}>
          <tr>
            <th rowSpan={3}>No</th>
            <th rowSpan={3}>Descriptions of Route</th>
            <th rowSpan={3}>
              Distance
              <br /> KM
            </th>
            <th rowSpan={3}>
              Quantity <br />
              (M.Ton)
            </th>
            <th style={{ width: "120px" }} rowSpan={1} colSpan={1}>
              Unit Rate BDT
            </th>
            <th style={{ width: "120px" }} rowSpan={1} colSpan={1}>
              Amount BDT
            </th>
          </tr>
          <tr>
            <th rowSpan={1} colSpan={2}>
              in Figure & in Words
            </th>
          </tr>
          <tr>
            <th rowSpan={1} colSpan={2}>
              To be filled in by the Tenderer
            </th>
          </tr>
        </thead>
        <tbody>
          {tenderDetails?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.ghatName}</td>
              <td>{item?.distance}</td>
              <td>{item?.quantity}</td>
              <td>{item?.costAmount}</td>
              <td>{item?.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintBADCMOPTender;
