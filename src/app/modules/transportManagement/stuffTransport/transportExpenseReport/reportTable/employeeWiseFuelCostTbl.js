import React, { useState } from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import FuelLogPringModal from "../modalView/fuelLogPringModal";
import TripExpenseModal from "../modalView/tripExpenseModal";

const EmployeeWiseFuelCostTbl = ({ rowData, values }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowTripExpenseModal, setShowTripExpenseModal] = useState(false);
  const [item, setItem] = useState(null);

  //table total calculation
  let grandTotalNumCilingKM = 0;
  let grandTotalTotalKM = 0;
  let grandTotalPersonalKM = 0;
  let grandTotalFuelCash = 0;
  let grandTotalFuelCredit = 0;
  let grandTotalFuelCost = 0;
  let grandTotalNumTollAmount = 0;
  let grandTotalRouteCost = 0;
  let grandTotalOtherExpanse = 0;
  let grandTotalCost = 0;
  let grandTotalPerKMCost = 0;
  let grandTotalPersonalCostDeduction = 0;
  let grandTotalNetPayable = 0;
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Employee Wise Fuel Report</strong>
      </h4>
      <div className="loan-scrollable-table">
        <div
          style={{ maxHeight: "550px" }}
          className="scroll-table _table table-responsive"
        >
          <table className="table table-striped three-column-sticky table-bordered bj-table bj-table-landing">
            <thead>
              <tr className="cursor-pointer">
                <th style={{ minWidth: "59px !important" }}>SL</th>
                <th> Used By Employee </th>
                <th> Designation </th>
                <th style={{ minWidth: "95px"}}>
                  Personal KM Ceiling{" "}
                </th>
                <th style={{ minWidth: "95px"}}> Total Mileage (KM) </th>
                <th style={{ minWidth: "95px" }}>
                  {" "}
                  Total Personal Mileage (KM){" "}
                </th>
                <th style={{ minWidth: "90px" }}> Fuel Cash </th>
                <th style={{ minWidth: "95px" }}> Fuel Credit </th>
                <th style={{ minWidth: "80px" }}>
                  {" "}
                  Total Fuel Cost (Tk){" "}
                </th>
                <th style={{ minWidth: "80px" }}>
                  {" "}
                  Total Toll Cost (Tk){" "}
                </th>
                <th style={{ minWidth: "80px" }}> Total Route Cost </th>
                <th style={{ minWidth: "96px" }}>
                  {" "}
                  Total Other Expenses (Tk){" "}
                </th>
                <th style={{ minWidth: "80px" }}> Total Cost </th>
                <th style={{ minWidth: "80px" }}> Per KM Cost </th>
                <th style={{ minWidth: "95px" }}>
                  {" "}
                  Personal Cost Deduct{" "}
                </th>
                <th style={{ minWidth: "80px" }}> Net Payable </th>
                <th style={{ minWidth: "80px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.map((item, index) => {
                //row calculation
                const totalPersonalKM =
                  item?.personalKM
                const totalFuelCost = item?.fuelCash + item?.fuelCredit;
                const totalRouteCost = totalFuelCost + item?.numTollAmount;
                const totalCost = totalRouteCost + item?.otherExpanse;
                const perKMCost = totalRouteCost / (item?.totalKM || 1);
                const personalCostDeduction = (totalPersonalKM || 0)  * (perKMCost || 0);
                const netPayable =
                  totalCost - item?.fuelCredit - personalCostDeduction;

                //table total calculation
                grandTotalNumCilingKM += item?.numCeilingKM || 0;
                grandTotalTotalKM += item?.totalKM || 0;
                grandTotalPersonalKM += totalPersonalKM;
                grandTotalFuelCash += item?.fuelCash || 0;
                grandTotalFuelCredit += item?.fuelCredit || 0;
                grandTotalFuelCost += totalFuelCost;
                grandTotalNumTollAmount += item?.numTollAmount || 0;
                grandTotalRouteCost += totalRouteCost;
                grandTotalOtherExpanse += item?.otherExpanse || 0;
                grandTotalCost += totalCost;
                grandTotalPerKMCost += perKMCost;
                grandTotalPersonalCostDeduction += personalCostDeduction;
                grandTotalNetPayable += netPayable;

                return (
                  <tr key={index}>
                    <td style={{}} className="text-center">
                      {index + 1}
                    </td>
                    <td
                      style={{ minWidth: "180px" }}
                    >{`${item?.strEmployeeName} [${item?.vehicelUserEnroll}]`}</td>
                    <td> {item?.strDesignation} </td>
                    <td style={{ textAlign: "right" }}>
                      {parseInt(_formatMoney(item?.numCeilingKM))}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(item?.totalKM)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(totalPersonalKM)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(item?.fuelCash)}{" "}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(item?.fuelCredit)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(totalFuelCost)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(item?.numTollAmount)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(totalRouteCost)}{" "}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(item?.otherExpanse)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(totalCost)}{" "}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(perKMCost)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(personalCostDeduction)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {" "}
                      {_formatMoney(netPayable)}{" "}
                    </td>
                    <td  className="text-center">
                      <IView
                        clickHandler={() => {
                          setItem(item);
                          setIsShowModal(true);
                        }}
                      />
                      <span style={{marginLeft:"5px"}}>
                      <IView
                      title="View Trip Expense"
                      classes={"fa-regular fa-file"}
                        clickHandler={() => {
                          setItem(item);
                          setShowTripExpenseModal(true);
                        }}
                      />
                      </span>
                     
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={3}>
                  <strong>Total</strong>
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalNumCilingKM)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalTotalKM)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalPersonalKM)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalFuelCash)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalFuelCredit)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalFuelCost)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalNumTollAmount)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalRouteCost)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalOtherExpanse)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalCost)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalPerKMCost)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalPersonalCostDeduction)}
                </td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {_formatMoney(grandTotalNetPayable)}
                </td>
              </tr>
            </tbody>
          </table>
          <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
            <FuelLogPringModal item={item} values={values} />
          </IViewModal>
          <IViewModal show={isShowTripExpenseModal} onHide={() => setShowTripExpenseModal(false)}>
            <TripExpenseModal item={item} values={values} />
          </IViewModal>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWiseFuelCostTbl;
