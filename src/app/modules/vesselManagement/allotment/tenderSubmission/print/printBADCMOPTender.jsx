import React, { useMemo } from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { convertToText } from "../helper";

const PrintBADCMOPTender = ({ tenderDetails, tenderPrintId }) => {
  // total amount
  const totalAmount = useMemo(() => {
    // total rate
    const totalQuantity = tenderDetails?.reduce(
      (acc, item) => acc + (!Boolean(item?.quantity) ? 0 : item?.quantity),
      0
    );

    // total rate
    const totalRate = tenderDetails?.reduce(
      (acc, item) => acc + (!Boolean(item?.totalRate) ? 0 : item?.totalRate),
      0
    );

    return (totalQuantity * totalRate).toFixed(2);
  }, [tenderDetails]);

  // total actual bill amount
  const totalActualBillAmount = useMemo(
    () =>
      tenderDetails?.reduce(
        (acc, item) => acc + item?.actualQuantityBillAmount,
        0
      ),
    [tenderDetails]
  );

  // total actual cost amount
  const totalActualCostAmount = useMemo(
    () =>
      tenderDetails?.reduce(
        (acc, item) => acc + item?.actualQuantityCostAmount,
        0
      ),
    [tenderDetails]
  );

  // total actual profit amount
  const totalActualProfitAmount = useMemo(
    () =>
      tenderDetails?.reduce(
        (acc, item) => acc + item?.actualQuantityProfitAmount,
        0
      ),
    [tenderDetails]
  );

  // if tender print id is 0 than show final report or the print id is 1 or 4 than show chittagong and mangla respectively

  return tenderPrintId === 0 ? (
    <div className="">
      <table style={{ margin: "20px 0", width: "100%" }}>
        <thead style={{ padding: "10px 0", textAlign: "center" }}>
          <tr>
            <th>No</th>
            <th>Descriptions of Route</th>
            <th>
              Actual Quantity <br />
              (M.Ton)
            </th>
            <th>Acutal Bill Amount</th>
            <th>Acutal Cost Amount</th>
            <th>Acutal Profit Amount</th>
          </tr>
        </thead>
        <tbody>
          {tenderDetails?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.ghatName}</td>
              <td className="text-center">{item?.actualQuantity}</td>
              <td className="text-right">
                {_formatMoney(item?.actualQuantityBillAmount)}
              </td>
              <td className="text-right">
                {_formatMoney(item?.actualQuantityCostAmount)}
              </td>
              <td className="text-right">
                {_formatMoney(Math.abs(item?.actualQuantityProfitAmount))}
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan={3}>Total</td>
            <td className="text-right">
              {_formatMoney(totalActualBillAmount)}
            </td>
            <td className="text-right">
              {_formatMoney(totalActualCostAmount)}
            </td>
            <td className="text-right">
              {_formatMoney(Math.abs(totalActualProfitAmount))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div className="">
      <div>
        <p>
          {" "}
          <strong>
            Annexure-
            {tenderPrintId === 1 ? "A" : tenderPrintId === 4 ? "B" : ""}:
          </strong>{" "}
          {tenderPrintId === 1
            ? `Transportation and stacking of MOP fertilizer from the ghats of Chattogram port/private ghat and the
godowns of Chattogram city corporation areas/industrial areas/port areas/BADC's Transit godown
1&2/Dewanhat/any other local godowns of BADC to the following godowns/center:`
            : tenderPrintId === 4
            ? `Transportation and stacking of MOP fertilizer from the godowns of
          Khulna city corporation areas/ industrial areas/any other local
          godowns in Mongla port/Khulna ghat's local godown/Boyra
          godown/Ruzvelt's Transit godown/Shiromoni ghat/any other local godowns
          of BADC to the following godowns/center`
            : ""}
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
              <td className="text-center">{item?.quantity}</td>
              <td className="text-center">{_formatMoney(item?.totalRate)}</td>
              <td className="text-right">
                {_formatMoney(item?.quantity * item?.totalRate)}
              </td>
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
