import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import "./style.css";

const TripCostDetailsTable = ({ obj }) => {
  const { rowData } = obj;

  //   totals initialization
  let F_totalMillage = 0;
  let F_otalAdditionalMillage = 0;
  let F_totalStandardFuelCost = 0;
  let F_totalAdministrativeCost = 0;
  let F_totalDriverExpense = 0;
  let F_totalTripFare = 0;
  let F_totalDownTripFareCash = 0;
  let F_totalDownTripFareCredit = 0;
  let F_totalFuelCredit = 0;
  let F_totalNetPayable = 0;
  let F_manualNetPayable = 0;
  let F_systemNetPayable = 0;

  return (
    <>
      {rowData?.length > 0 && (
        <div>
          <div className="loan-scrollable-tafble">
            <div className="scroll-table _tafble">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th style={{ width: "143px" }}>Vehicle No.</th>
                    <th>ShipPoint</th>
                    <th>Shipment Code</th>
                    <th>Millage (KM)</th>
                    <th>Addition Millage (Km)</th>
                    <th>Standard Fuel Cost</th>
                    <th>Administrative Cost</th>
                    <th>Driver Exp</th>
                    <th>Trip Fare</th>
                    <th>Down Trip Fare Cash</th>
                    <th>Down Trip Fare Credit</th>
                    <th>Fuel Credit</th>
                    <th>Manual Net Payable</th>
                    <th>System Net Payable</th>
                    <th> Net Payable</th>
                    <th>Bill Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((item, index) => {
                    //==========row CalCulation============//
                    F_totalMillage += item?.millage;
                    F_otalAdditionalMillage += item?.additionalMillage;
                    F_totalStandardFuelCost += item?.standardFuelCost;
                    F_totalAdministrativeCost += item?.administrativeCost;
                    F_totalDriverExpense += item?.driverExpense;
                    F_totalTripFare += item?.tripFare;
                    F_totalDownTripFareCash += item?.downTripFareCash;
                    F_totalDownTripFareCredit += item?.downTripFareCredit;
                    F_totalFuelCredit += item?.fuelCredit;
                    F_totalNetPayable += item?.netPayable;
                    F_manualNetPayable += item?.manualNetPayable;
                    F_systemNetPayable += item?.systemNetPayable;

                    return (
                      <tr key={index}>
                        <td className="text-center"> {index + 1}</td>
                        <td>{item?.vehicleNo}</td>
                        <td>{item?.shipPointName}</td>
                        <td>{item?.shipmentCode}</td>
                        <td className="text-center">{item?.millage}</td>
                        <td className="text-center">
                          {item?.additionalMillage}
                        </td>
                        <td className="text-right">{item?.standardFuelCost}</td>
                        <td className="text-right">
                          {item?.administrativeCost}
                        </td>
                        <td className="text-right">{item?.driverExpense}</td>
                        <td className="text-right">{item?.tripFare}</td>
                        <td className="text-right">{item?.downTripFareCash}</td>
                        <td className="text-right">
                          {item?.downTripFareCredit}
                        </td>
                        <td className="text-right">{item?.fuelCredit}</td>
                        <td className="text-right">{item?.manualNetPayable}</td>
                        <td className="text-right">{item?.systemNetPayable}</td>
                        <td className="text-right">{item?.netPayable}</td>
                        <td>{_dateFormatter(item?.billDate)}</td>
                      </tr>
                    );
                  })}
                  <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                    <td className="text-right" colSpan="4">
                      Total
                    </td>

                    <td className="text-center">{F_totalMillage}</td>
                    <td className="text-center">{F_otalAdditionalMillage}</td>
                    <td>{F_totalStandardFuelCost}</td>
                    <td>{F_totalAdministrativeCost}</td>
                    <td>{F_totalDriverExpense}</td>
                    <td>{F_totalTripFare}</td>
                    <td>{F_totalDownTripFareCash}</td>
                    <td>{F_totalDownTripFareCredit}</td>
                    <td>{F_totalFuelCredit}</td>
                    <td>{F_manualNetPayable}</td>
                    <td>{F_systemNetPayable}</td>
                    <td>{F_totalNetPayable}</td>
                    <td> </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripCostDetailsTable;
