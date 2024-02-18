import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import "./style.css";
import ICustomTable from "../../../../chartering/_chartinghelper/_customTable";
import moment from "moment";

const headers = [
  { name: "SL", style: { minWidth: "30px" } },
  { name: "Vehicle No.", style: { minWidth: "160px" } },
  { name: "ShipPoint", style: { minWidth: "160px" } },
  { name: "Shipment Code", style: { minWidth: "130px" } },
  { name: "Shipment Qty", style: { minWidth: "70px" } },
  { name: "Out Date-Time", style: { minWidth: "120px" } },
  { name: "In Date-Time", style: { minWidth: "120px" } },
  { name: "Standard Millage (KM)", style: { minWidth: "70px" } },
  { name: "Addition Millage (Km)", style: { minWidth: "70px" } },
  { name: "Actual Millage (Km)", style: { minWidth: "70px" } },
  { name: "Standard Fuel Cost", style: { minWidth: "70px" } },
  { name: "Actual Fuel Cost", style: { minWidth: "70px" } },
  { name: "Bridge Toll", style: { minWidth: "70px" } },
  // { name: "Chada", style: { minWidth: "70px" } },
  { name: "Labour Tips", style: { minWidth: "70px" } },
  { name: "Police Tips", style: { minWidth: "70px" } },
  { name: "Maintenance", style: { minWidth: "70px" } },
  { name: "Millage Allowance", style: { minWidth: "70px" } },
  { name: "Carrying Allowance", style: { minWidth: "70px" } },
  { name: "DA", style: { minWidth: "70px" } },
  { name: "Down Trip Allowance", style: { minWidth: "70px" } },
  { name: "Total Trip Cost", style: { minWidth: "70px" } },
  { name: "Advance Amount", style: { minWidth: "70px" } },
  { name: "Down Trip Fare Cash", style: { minWidth: "70px" } },
  { name: "Shipment Cost Total", style: { minWidth: "70px" } },
  { name: "Total Income", style: { minWidth: "70px" } },
  { name: "Profit/Loss on Trip", style: { minWidth: "70px" } },
  { name: "Driver Net Payable", style: { minWidth: "70px" } },
  { name: "Bill Date", style: { minWidth: "70px" } },
];

const TripCostDetailsTable = ({ obj }) => {
  const { rowData } = obj;

  //   totals initialization
  let F_totalMillage = 0;
  let F_totalAdditionalMillage = 0;
  let F_totalStandardFuelCost = 0;
  let F_totalActualFuelCost = 0;

  let totalBridgeToll = 0,
    totalLaborTips = 0,
    totalPoliceTips = 0,
    totalMaintenance = 0,
    totalMillageAllowance = 0,
    totalCarryingAllowance = 0,
    totalDailyAllowance = 0,
    totalDownTripAllowance = 0,
    grandTotalTripCost = 0,
    totalDownTripFareCash = 0,
    grandTotalShipmentCost = 0,
    grandTotalIncome = 0,
    totalProfitLoss = 0,
    totalDriverPayable = 0,
    totalShipmentQty = 0,
    totalAdvanceAmount = 0;

  return (
    <>
      {rowData?.length > 0 && (
        <div>
          <ICustomTable ths={headers} scrollable={true}>
            {rowData?.map((item, index) => {
              //==========row CalCulation============//
              F_totalMillage += item?.millage;
              F_totalAdditionalMillage += item?.additionalMillage;
              F_totalStandardFuelCost += item?.fuelStandard;
              F_totalStandardFuelCost += item?.fuelActual;
              // F_totalAdministrativeCost += item?.administrativeCost;
              // F_totalDriverExpense += item?.driverExpense;
              // F_totalTripFare += item?.tripFare;
              // F_totalDownTripFareCredit += item?.downTripFareCredit;
              // F_totalFuelCredit += item?.fuelCredit;
              // F_totalNetPayable += item?.netPayable;
              // F_manualNetPayable += item?.manualNetPayable;
              // F_systemNetPayable += item?.systemNetPayable;

              totalDownTripFareCash += item?.downTripFareCash;
              totalBridgeToll += item?.bridgeTollChada;
              totalLaborTips += item?.laborTips;
              totalPoliceTips += item?.policeTips;
              totalMaintenance += item?.maintenance;
              totalMillageAllowance += item?.mileageAllowance;
              totalCarryingAllowance += item?.carryingAllowance;
              totalDailyAllowance += item?.dailyAllowance;
              totalDownTripAllowance += item?.downTripAllowance;
              grandTotalShipmentCost += item?.shipmentFareAmount;
              totalShipmentQty += item?.shipmentQnt;
              totalAdvanceAmount += item?.advanceAmount;

              const totalTripCost =
                item?.fuelActual +
                item?.bridgeTollChada +
                item?.laborTips +
                item?.policeTips +
                item?.maintenance +
                item?.mileageAllowance +
                item?.carryingAllowance +
                item?.dailyAllowance +
                item?.downTripAllowance;

              grandTotalTripCost += totalTripCost;

              const totalIncome =
                item?.shipmentFareAmount + item?.downTripFareCash;

              grandTotalIncome += totalIncome;

              const profitLoss = totalIncome - totalTripCost;
              totalProfitLoss += profitLoss;

              const driverNetPayable =
                totalTripCost -
                (item?.fuelActual +
                  item?.downTripFareCash +
                  item?.advanceAmount);

              totalDriverPayable += driverNetPayable;

              const inOutTime = item?.inOutTime?.split(" ");

              const inDateTime = `${_dateFormatter(item?.inDate)}${
                item?.inOutTime
                  ? `, ${moment(inOutTime[3]?.split(".")[0], "HH:mm:ss").format(
                      "hh:mm A"
                    )}`
                  : ""
              }`;

              const outDateTime = `${_dateFormatter(item?.outDate)}${
                item?.inOutTime
                  ? `, ${moment(inOutTime[6]?.split(".")[0], "HH:mm:ss").format(
                      "hh:mm A"
                    )}`
                  : ""
              }`;

              return (
                <tr key={index}>
                  <td className="text-center"> {index + 1}</td>
                  <td>{item?.vehicleNo}</td>
                  <td>{item?.shipPointName}</td>
                  <td>{item?.shipmentCode}</td>
                  <td className="text-right">{item?.shipmentQnt}</td>
                  <td>{item?.inDate ? inDateTime : ""}</td>
                  <td>{item?.outDate ? outDateTime : ""}</td>
                  <td className="text-right">{item?.millage}</td>
                  <td className="text-right">{item?.additionalMillage}</td>
                  <td className="text-right">
                    {item?.millage + item?.additionalMillage}
                  </td>
                  <td className="text-right">{item?.fuelStandard}</td>
                  <td className="text-right">{item?.fuelActual}</td>
                  <td className="text-right">{item?.bridgeTollChada}</td>
                  {/* <td className="text-right">{"Chada"}</td> */}
                  <td className="text-right">{item?.laborTips}</td>
                  <td className="text-right">{item?.policeTips}</td>
                  <td className="text-right">{item?.maintenance}</td>
                  <td className="text-right">{item?.mileageAllowance}</td>
                  <td className="text-right">{item?.carryingAllowance}</td>
                  <td className="text-right">{item?.dailyAllowance}</td>
                  <td className="text-right">{item?.downTripAllowance}</td>
                  <td className="text-right">{totalTripCost}</td>
                  <td className="text-right">{item?.advanceAmount}</td>
                  <td className="text-right">{item?.downTripFareCash}</td>
                  <td className="text-right">{item?.shipmentFareAmount}</td>
                  <td className="text-right">{totalIncome}</td>
                  <td
                    className="text-right"
                    style={{
                      backgroundColor: `${
                        profitLoss > 0 ? "#26f5188f" : "#ff000070"
                      }`,
                    }}
                  >
                    {profitLoss}
                  </td>
                  <td className="text-right">{driverNetPayable}</td>
                  <td>{_dateFormatter(item?.billDate)}</td>
                </tr>
              );
            })}
            <tr style={{ textAlign: "right", fontWeight: "bold" }}>
              <td></td>
              <td className="text-right" colSpan="3">
                Total
              </td>

              <td>{totalShipmentQty}</td>
              <td colSpan={2}></td>
              <td>{F_totalMillage}</td>

              <td>{F_totalAdditionalMillage}</td>
              <td>{F_totalAdditionalMillage + F_totalMillage}</td>
              <td>{F_totalStandardFuelCost}</td>
              <td>{F_totalActualFuelCost}</td>
              <td>{totalBridgeToll}</td>
              <td>{totalLaborTips}</td>
              <td>{totalPoliceTips}</td>
              <td>{totalMaintenance}</td>
              <td>{totalMillageAllowance}</td>
              <td>{totalCarryingAllowance}</td>
              <td>{totalDailyAllowance}</td>
              <td>{totalDownTripAllowance}</td>

              <td> {grandTotalTripCost} </td>
              <td> {totalAdvanceAmount} </td>
              <td> {totalDownTripFareCash} </td>
              <td> {grandTotalShipmentCost} </td>
              <td> {grandTotalIncome} </td>
              <td> {totalProfitLoss} </td>
              <td> {totalDriverPayable} </td>
              <td> </td>
            </tr>
          </ICustomTable>
        </div>
      )}
    </>
  );
};

export default TripCostDetailsTable;
