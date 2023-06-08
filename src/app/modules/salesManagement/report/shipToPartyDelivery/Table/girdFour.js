import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

function TableGirdFour({ rowDto, values }) {
  let SeventonLabourCost = 0,
    SeventonnumQuantity = 0,
    FivetonLabourCost = 0,
    FivetonQuantity = 0,
    ThreetonLabourCost = 0,
    ThreetonQuantity = 0,
    OneHalfLabourCost = 0,
    OneHalfQuantity = 0,
    FourteenTonLabourCost = 0,
    FourteenTonQuantity = 0,
    TwentyTonLabourCost = 0,
    TwentyTonQuantity = 0;
  return (
    <div className="react-bootstrap-table table-responsive">
      <table className={"table table-striped table-bordered global-table "}>
        <thead>
          <tr>
            <th>SL </th>
            <th>Vehicle Capacity Name</th>
            <th>Vehicle No</th>
            <th>Driver Name</th>
            <th>Driver Contact</th>
            <th>Seven Ton Labour Cost</th>
            <th>Seven Ton Quantity</th>
            <th>Five Ton Labour Cost</th>
            <th>Five Ton Quantity</th>
            <th>Three Ton Labour Cost</th>
            <th>Three Ton Quantity</th>
            <th>OneHalf Labour Cost</th>
            <th>OneHalf Quantity</th>
            <th>Fourteen Ton Labour Cost</th>
            <th>Fourteen Ton Quantity</th>
            <th>Twenty Ton Labour Cost</th>
            <th>Twenty Ton Quantity</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((itm, idx) => {
            SeventonLabourCost += itm?.SeventonLabourCost || 0;
            SeventonnumQuantity += itm?.SeventonnumQuantity || 0;
            FivetonLabourCost += itm?.FivetonLabourCost || 0;
            FivetonQuantity += itm?.FivetonQuantity || 0;
            ThreetonLabourCost += itm?.ThreetonLabourCost || 0;
            ThreetonQuantity += itm?.ThreetonQuantity || 0;
            OneHalfLabourCost += itm?.OneHalfLabourCost || 0;
            OneHalfQuantity += itm?.OneHalfQuantity || 0;
            FourteenTonLabourCost += itm?.FourteenTonLabourCost || 0;
            FourteenTonQuantity += itm?.FourteenTonQuantity || 0;
            TwentyTonLabourCost += itm?.TwentyTonLabourCost || 0;
            TwentyTonQuantity += itm?.TwentyTonQuantity || 0;
            return (
              <tr>
                <td>{idx + 1}</td>
                <td>{itm?.strVehicleCapacityName}</td>
                <td>{itm?.strVehicleNo}</td>
                <td>{itm?.strDriverName}</td>
                <td>{itm?.strDriverContact}</td>
                <td className="text-right">
                  {_fixedPoint(itm?.SeventonLabourCost)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.SeventonnumQuantity)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.FivetonLabourCost)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.FivetonQuantity)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.ThreetonLabourCost)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.ThreetonQuantity)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.OneHalfLabourCost)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.OneHalfQuantity)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.FourteenTonLabourCost)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.FourteenTonQuantity)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.TwentyTonLabourCost)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.TwentyTonQuantity)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td colspan={5}>
              <b>Total</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(SeventonLabourCost, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(SeventonnumQuantity, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(FivetonLabourCost, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(FivetonQuantity, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(ThreetonLabourCost, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(ThreetonQuantity, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(OneHalfLabourCost, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(OneHalfQuantity, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(FourteenTonLabourCost, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(FourteenTonQuantity, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(TwentyTonLabourCost, true, 0)}</b>
            </td>
            <td className="text-right">
              <b>{_fixedPoint(TwentyTonQuantity, true, 0)}</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableGirdFour;
