import React, { useMemo } from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { convertToText } from "../helper";

const PrintBADCMOPTender = ({ tenderDetails }) => {

  const totalAmount = useMemo(
    () =>
      tenderDetails?.reduce((acc, item) => {
        acc += item?.amount === null ? 0 : item?.amount;
        return acc;
      }, 0),
    [tenderDetails]
  );

  // console.log(totalAmount);
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
      <table style={{ margin: "20px 0" }}>
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
              <td className="text-center">{item?.distance}</td>
              <td>{item?.quantity}</td>
              <td className="text-right">{_formatMoney(item?.costAmount)}</td>
              <td className="text-right">{_formatMoney(item?.amount)}</td>
            </tr>
          ))}

          <tr>
            <td colSpan={5}>
              In Words:{" "}
              <span className="text-uppercase">
                {convertToText(totalAmount)}
              </span>
            </td>
            <td className="text-right">{_formatMoney(totalAmount)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrintBADCMOPTender;
