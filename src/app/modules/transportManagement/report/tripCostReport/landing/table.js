import React, { useState } from "react";
import InfoCircle from "../../../../_helper/_helperIcons/_infoCircle";
import { dateFormatWithMonthName } from "../../../../_helper/_dateFormate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import "./style.css";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import TripCostDetailsTable from "./details";
import { toast } from "react-toastify";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const Table = ({ obj }) => {
  const { accId, buId, gridData, values, buName, printRef } = obj;
  const [rowData, getDetails, loading] = useAxiosGet();
  const [open, setOpen] = useState(false);

  //   totals initialization
  let F_totalMillage = 0;
  let F_otalAdditionalMillage = 0;
  let F_T_totalMillage = 0;
  let F_totalStandardFuelCost = 0;
  let F_totalAdministrativeCost = 0;
  let F_totalDriverExpense = 0;
  let F_T_totalRouteExpense = 0;
  let F_totalTripFare = 0;
  let F_totalDownTripFareCash = 0;
  let F_totalDownTripFareCredit = 0;
  let F_T_totalTripFare = 0;
  let F_totalNetIncome = 0;
  let F_totalFuelCredit = 0;
  let F_totalNetPayable = 0;

  return (
    <div>
      {loading && <Loading />}
      {gridData?.length > 0 && (
        <div ref={printRef}>
          <div className="text-center my-2">
            <h3>
              <b> {buName} </b>
            </h3>

            <h4>Summary Report For Vehicle Trip Cost</h4>
            <div className="d-flex justify-content-center">
              <h5>
                For The Month:
                {dateFormatWithMonthName(values?.fromDate)}
              </h5>
              <h5 className="ml-5">
                To: {dateFormatWithMonthName(values?.toDate)}
              </h5>
            </div>
          </div>
          <div className="loan-scrollable-tafble">
            <div className="scroll-table _tafble">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Bill No</th>
                    <th style={{ width: "143px" }}>Vehicle No.</th>
                    {/* <th style={{ width: "143px" }}>Vehicle Type</th> */}
                    <th>Millage (KM)</th>
                    <th>Addition Millage (Km)</th>
                    <th>Total Millage (KM)</th>
                    <th>Actual Fuel Cost</th>
                    {/* <th>Standard Fuel Cost</th> */}
                    <th>Administrative Cost</th>
                    <th>Driver Exp</th>
                    <th>Total Route Exp.</th>
                    <th>Trip Fare</th>
                    <th>Total Down Trip Fare Cash</th>
                    <th>Total Down Trip Fare Credit</th>
                    <th>Total Trip Fare</th>
                    <th>Net Income</th>
                    <th>Total Fuel Credit</th>
                    <th>Net Payable</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.map((item, index) => {
                    //totalMillage
                    const totalMillage =
                      item?.millage + item?.additionalMillage;
                    //totalRouteExpense
                    const totalRouteExpense =
                      item?.standardFuelCost +
                      item?.administrativeCost +
                      item?.driverExpense;
                    //totalTripFare
                    const totalTripFare =
                      item?.tripFare +
                      item?.downTripFareCash +
                      item?.downTripFareCredit;
                    ///netIncome
                    const netIncome = totalRouteExpense - totalTripFare;

                    //==========row CalCulation============//
                    F_totalMillage += item?.millage;

                    F_otalAdditionalMillage += item?.additionalMillage;

                    F_T_totalMillage += totalMillage;

                    F_totalStandardFuelCost += item?.standardFuelCost;

                    F_totalAdministrativeCost += item?.administrativeCost;

                    F_totalDriverExpense += item?.driverExpense;

                    F_T_totalRouteExpense += totalRouteExpense;

                    F_totalTripFare += item?.tripFare;

                    F_totalDownTripFareCash += item?.downTripFareCash;

                    F_totalDownTripFareCredit += item?.downTripFareCredit;

                    F_T_totalTripFare += totalTripFare;

                    F_totalNetIncome += netIncome;

                    F_totalFuelCredit += item?.fuelCredit;

                    F_totalNetPayable += item?.netPayable;

                    return (
                      <tr key={index}>
                        <td className="text-center"> {index + 1}</td>
                        <td className="text-center">{item?.billregisterCode}</td>
                        <td className="text-center">{item?.vehicleNo}</td>
                        {/* <td className="text-center">{item?.vehicleType}</td> */}
                        <td className="text-center">{item?.millage}</td>
                        <td className="text-center">
                          {item?.additionalMillage}
                        </td>
                        <td className="text-center">{totalMillage}</td>
                        <td className="text-center">
                          {item?.standardFuelCost}
                        </td>
                        <td className="text-center">
                          {item?.administrativeCost}
                        </td>
                        <td className="text-center">{item?.driverExpense}</td>
                        <td className="text-center">{totalRouteExpense}</td>
                        <td className="text-center">{item?.tripFare}</td>
                        <td className="text-center">
                          {item?.downTripFareCash}
                        </td>
                        <td className="text-center">
                          {item?.downTripFareCredit}
                        </td>
                        <td className="text-center">{totalTripFare}</td>
                        <td className="text-center">
                          {_fixedPoint(netIncome, true)}
                        </td>
                        <td className="text-center">{item?.fuelCredit}</td>
                        <td className="text-center">{item?.netPayable}</td>
                        <td className="text-center">
                          <InfoCircle
                            title={"View Details"}
                            clickHandler={() => {
                              getDetails(
                                `/tms/ShipmentExpReport/GetTripCostReportByVehicleId?AccountId=${accId}&BusinessUnitId=${buId}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&vehicleid=${item?.vehicelId}`,
                                (resData) => {
                                  if (resData?.length) {
                                    setOpen(true);
                                  } else {
                                    toast.warn("Data not found");
                                  }
                                }
                              );
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="text-right" colSpan="3">
                      <b>Total:</b>
                    </td>

                    <td className="text-center">
                      <b>{_fixedPoint(F_totalMillage, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_otalAdditionalMillage, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_T_totalMillage, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalStandardFuelCost, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalAdministrativeCost, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalDriverExpense, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_T_totalRouteExpense, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalTripFare, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalDownTripFareCash, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalDownTripFareCredit, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_T_totalTripFare, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalNetIncome, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalFuelCredit, true)}</b>
                    </td>
                    <td className="text-center">
                      <b>{_fixedPoint(F_totalNetPayable, true)}</b>
                    </td>
                    <td className="text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <IViewModal
        show={open}
        onHide={() => setOpen(false)}
        title={"Trip Cost Details"}
      >
        <TripCostDetailsTable obj={{ rowData }} />
      </IViewModal>
    </div>
  );
};

export default Table;
