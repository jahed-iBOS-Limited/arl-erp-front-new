import React, { useState } from "react";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import FuelLogPringModal from "../modalView/fuelLogPringModal";

const EmployeeWiseFuelCostTbl = ({ rowData, values }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const [item, setItem] = useState(null);
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Employee Wise Fuel Report</strong>
      </h4>
      <div  className="loan-scrollable-table">
        <div style={{maxHeight: "550px"}} className="scroll-table _table table-responsive">
          <table
            className="table table-striped table-bordered bj-table bj-table-landing"
          >
            <thead>
              <tr className="cursor-pointer">
                <th>SL</th>
                <th style={{ width: "180px" }}> Used By Employee </th>
                <th> Designation </th>
                <th> Vehicel User Enroll </th>
                <th> Personal KM Ceiling </th>
                <th> Total Mileage (KM) </th>
                <th> Total Personal Mileage (KM) </th>
                <th> Fuel Cash </th>
                <th> Fuel Credit </th>
                <th> Total Fuel Cost (Tk) </th>
                <th> Total Toll Cost (Tk) </th>
                <th> Total Route Cost </th>
                <th> Total Other Expenses (Tk) </th>
                <th> Total Cost </th>
                <th> Per KM Cost </th>
                <th> Personal Cost Deduct </th>
                <th> Net Payable </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.map((item, index) => {
                //row calculation
                const totalPersonalKM =
                  item?.numCeilingKM + item?.numCeilingKM * 0.25;
                const totalFuelCost = item?.fuelCash + item?.fuelCredit;
                const totalRouteCost = totalFuelCost + item?.numTollAmount;
                const totalCost = totalRouteCost + item?.otherExpanse;
                const perKMCost = totalRouteCost / (item?.totalKM || 1);
                const personalCostDeduction =
                  (totalPersonalKM - item?.numCeilingKM) * perKMCost;
                const netPayable =
                  totalCost - item?.fuelCredit - personalCostDeduction;

                return (
                  <tr key={index}>
                    <td style={{ width: "20px" }} className="text-center">
                      {index + 1}
                    </td>
                    <td style={{ width: "180px" }}>{item?.strEmployeeName}</td>
                    <td> {item?.strDesignation} </td>
                    <td className="text-center"> {item?.vehicelUserEnroll} </td>
                    <td style={{ textAlign: "right" }}>
                      {_formatMoney(item?.numCeilingKM)}
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
                    <td className="text-center">
                      <IView
                        clickHandler={() => {
                          setItem(item);
                          setIsShowModal(true);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
            <FuelLogPringModal item={item} values={values} />
          </IViewModal>
        </div>
      </div>
    </div>
  );
};

export default EmployeeWiseFuelCostTbl;
