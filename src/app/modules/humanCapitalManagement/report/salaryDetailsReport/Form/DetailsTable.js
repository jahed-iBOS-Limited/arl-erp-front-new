import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const DetailsTable = ({ reports }) => {
  return (
    <>
      <div className="loan-scrollable-table employee-overall-status mt-1">
        <div style={{ maxHeight: "500px" }} className="scroll-table _table">
          <table className="table table-striped table-bordered bj-table bj-table-landing">
            <thead>
              <tr>
                <th style={{ minWidth: "70px" }}>Enroll No.</th>
                <th>Employee Name</th>
                <th>Group Name</th>
                <th style={{ minWidth: "70px" }}>Job Type</th>
                <th style={{ minWidth: "120px" }}>Department</th>
                <th style={{ minWidth: "120px" }}>Section</th>
                <th style={{ minWidth: "120px" }}>Designation</th>
                <th style={{ minWidth: "70px" }}>Joining Date</th>
                <th>Service Length</th>
                <th style={{ minWidth: "70px" }}>Date of Birth</th>
                <th>Age</th>
                <th style={{ minWidth: "130px" }}>Email</th>
                <th style={{ minWidth: "120px" }}>Phone No</th>
                <th style={{ minWidth: "120px" }}>Region/Category</th>
                <th style={{ minWidth: "120px" }}>Area/Sub Category</th>
                <th style={{ minWidth: "120px" }}>Territory/Child Category</th>
                <th>Category/Group</th>
                <th style={{ minWidth: "120px" }}>
                  Job Station/Sub Child Category
                </th>
                <th>Unit</th>
                <th style={{ minWidth: "120px" }}>Banck Account No</th>
                <th>Bank Name</th>
                <th style={{ minWidth: "100px" }}>Branch Name</th>
                <th style={{ minWidth: "100px" }}>District</th>
                <th style={{ minWidth: "80px" }}>Routing No</th>
                <th style={{ minWidth: "80px" }}>Working Days</th>
                <th style={{ minWidth: "70px" }}>Present</th>
                <th style={{ minWidth: "70px" }}>Absent</th>
                <th style={{ minWidth: "70px" }}>Off Day</th>
                <th style={{ minWidth: "70px" }}>Holiday</th>
                <th style={{ minWidth: "70px" }}>CL</th>
                <th style={{ minWidth: "70px" }}>SL</th>
                <th style={{ minWidth: "70px" }}>EL</th>
                <th style={{ minWidth: "70px" }}>ML</th>
                <th style={{ minWidth: "70px" }}>PL</th>
                <th style={{ minWidth: "70px" }}>BL</th>
                <th style={{ minWidth: "70px" }}>SPL</th>
                <th style={{ minWidth: "70px" }}>LWP</th>
                <th style={{ minWidth: "70px" }}>Late</th>
                <th style={{ minWidth: "70px" }}>Leave Deduct Days</th>
                <th style={{ minWidth: "70px" }}>Night Duty</th>
                <th style={{ minWidth: "70px" }}>Total OT Hour</th>
                <th style={{ minWidth: "70px" }}>Per Hour Salary</th>
                <th style={{ minWidth: "70px" }}>Basic</th>
                <th style={{ minWidth: "70px" }}>House Rent</th>
                <th style={{ minWidth: "70px" }}>Medical Allowance</th>
                <th style={{ minWidth: "70px" }}>Transport Amount</th>
                <th style={{ minWidth: "70px" }}>Other Amount</th>
                <th style={{ minWidth: "70px" }}>Gross Salary</th>
                <th style={{ minWidth: "70px" }}>Salary</th>
                <th style={{ minWidth: "70px" }}>PF Amount</th>
                <th style={{ minWidth: "70px" }}>Tax Amount</th>
                <th style={{ minWidth: "70px" }}>Loan Amount</th>
                <th style={{ minWidth: "70px" }}>Hajj Loan</th>
                <th style={{ minWidth: "70px" }}>Home Loan</th>
                <th style={{ minWidth: "70px" }}>Car/Motorcycle Loan</th>
                <th style={{ minWidth: "70px" }}>Punishment Schedule</th>
                <th style={{ minWidth: "70px" }}>Security Deposit</th>
                <th style={{ minWidth: "70px" }}>Flat Installment</th>
                <th style={{ minWidth: "100px" }}>Flat Installment Dr</th>
                <th style={{ minWidth: "100px" }}>Flat Installment Cr</th>
                <th style={{ minWidth: "70px" }}>Coin Amount</th>
                <th style={{ minWidth: "70px" }}>Absent Punishment</th>
                <th style={{ minWidth: "70px" }}>Leave Punishment</th>
                <th style={{ minWidth: "70px" }}>Late Punishment</th>
                <th style={{ minWidth: "70px" }}>Punishment</th>
                <th style={{ minWidth: "70px" }}>AEFPS</th>
                <th style={{ minWidth: "70px" }}>Electic Bill</th>
                <th style={{ minWidth: "70px" }}>Dish Bill</th>
                <th style={{ minWidth: "70px" }}>Transport Bill</th>
                <th style={{ minWidth: "70px" }}>Cafeteia Bill</th>
                <th style={{ minWidth: "70px" }}>Gym Bill</th>
                <th style={{ minWidth: "70px" }}>Canteen Bill</th>
                <th style={{ minWidth: "70px" }}>Union Fee</th>
                <th style={{ minWidth: "70px" }}>Accomodation</th>
                <th style={{ minWidth: "70px" }}>Total Deduction</th>
                <th style={{ minWidth: "70px" }}>Night Allowance</th>
                <th style={{ minWidth: "70px" }}>Attendance Benifit</th>
                <th style={{ minWidth: "70px" }}>Non Tab Benifit</th>
                <th style={{ minWidth: "70px" }}>Night Benifit</th>
                <th style={{ minWidth: "70px" }}>Day Off Benifit</th>
                <th style={{ minWidth: "70px" }}>Doffer Benifit</th>
                <th style={{ minWidth: "70px" }}>Dormatory Benifit</th>
                <th style={{ minWidth: "70px" }}>Scott Benifit</th>
                <th style={{ minWidth: "70px" }}>Lieu Benifit</th>
                <th style={{ minWidth: "70px" }}>Heat Benifit</th>
                <th style={{ minWidth: "70px" }}>Driver Allowance</th>
                <th style={{ minWidth: "70px" }}>Motor Cycle Allowance</th>
                <th style={{ minWidth: "70px" }}>Convey. Allowance</th>
                <th style={{ minWidth: "70px" }}>House Rent Allowance</th>
                <th style={{ minWidth: "100px" }}>Union Donation Allowance</th>
                <th style={{ minWidth: "100px" }}>Spacial Salary Allowance</th>
                <th style={{ minWidth: "70px" }}>Mobile Allowance</th>
                <th style={{ minWidth: "70px" }}>OT Amount</th>
                <th style={{ minWidth: "70px" }}>PL Amount</th>
                <th style={{ minWidth: "70px" }}>TADA Amount</th>
                <th style={{ minWidth: "70px" }}>Total Allowance</th>
                <th style={{ minWidth: "70px" }}>Net Payable Salary</th>
                <th style={{ minWidth: "70px" }}>Play In Cash</th>
                <th style={{ minWidth: "70px" }}>Manual Add</th>
                <th style={{ minWidth: "70px" }}>Manual Deduct</th>
                <th style={{ minWidth: "70px" }}>Join Date Penalty</th>
                <th style={{ minWidth: "70px" }}>PF Company Contribution</th>
                <th style={{ minWidth: "70px" }}>Gratuity</th>
                <th style={{ minWidth: "70px" }}>Loan</th>
                <th style={{ minWidth: "70px" }}>Service Benifit</th>
              </tr>
            </thead>
            <tbody>
              {reports?.map((item) => (
                <tr>
                  <td>{item?.intEmpID}</td>
                  <td>{item?.strName}</td>
                  <td>{item?.strWorkplaceGroupName}</td>
                  <td>{item?.strJobType}</td>
                  <td>{item?.strDepartment}</td>
                  <td>{item?.strSectionName || ""}</td>
                  <td>{item?.strDesignation}</td>
                  <td className="text-center">
                    {_dateFormatter(item?.dteJoining)}
                  </td>
                  <td>{item?.strServiceLength}</td>
                  <td className="text-center">
                    {_dateFormatter(item?.dteBirth)}
                  </td>
                  <td className="text-center">{item?.strDOB}</td>
                  <td>{item?.strOfficeEmail}</td>
                  <td className="text-center">{item?.strContactNo}</td>
                  <td>{item?.strRegionName}</td>
                  <td>{item?.strAreaName}</td>
                  <td>{item?.strTeritoryName}</td>
                  <td>{item?.strGroupName}</td>
                  <td>{item?.strJobStationName}</td>
                  <td>{item?.strUnit}</td>
                  <td className="text-center">{item?.strBankAccountNo}</td>
                  <td>{item?.strBankName}</td>
                  <td>{item?.strBankBranchName}</td>
                  <td>{item?.strDistrict}</td>
                  <td className="text-center">{item?.strRoutingNumber}</td>
                  <td className="text-center">{item?.intWorkingDays}</td>
                  <td className="text-center">{item?.intPresent}</td>
                  <td className="text-center">{item?.intAbsent}</td>
                  <td className="text-center">{item?.intOffday}</td>
                  <td className="text-center">{item?.intHoliday}</td>
                  <td className="text-center">{item?.intCL}</td>
                  <td className="text-center">{item?.intSL}</td>
                  <td className="text-center">{item?.intEL}</td>
                  <td className="text-center">{item?.intML}</td>
                  <td className="text-center">{item?.intPL}</td>
                  <td className="text-center">{item?.intBL}</td>
                  <td className="text-center">{item?.intSPL}</td>
                  <td className="text-center">{item?.intLWP}</td>
                  <td className="text-center">{item?.intLate}</td>
                  <td className="text-center">{item?.intLeaveDeductDays}</td>
                  <td className="text-center">{item?.intNightDuty}</td>
                  <td className="text-center">{item?.monTotalOTHour}</td>
                  <td className="text-right">
                    {_formatMoney(item?.monPerHourSalary, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monBasicAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monHouseRentAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monMedicalAllowanceAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monTransportAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monOtherAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monGrossSalary, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monSalary, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monPFAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monTaxAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monLoanAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monHajjLoan, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monHomeLoan, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monCarMotorcycleLoan)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monPunishmentSchedule, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monSecurityDeposit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monFlatInstallment, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.intFlatInstallmentDr, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.intFlatInstallmentCr, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monCoinAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monAbsentPunishmentAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monLeavePunishmentAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monLatePunishmentAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monPunishment, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monDueAEFPS, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monElectricBill, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monDishBill, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monTransportBill, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monCafeteriaBill, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monGymBill, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monCanteenBill, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monUnionFee, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monAccommodation, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monTotalDeduction, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monNightAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monAttendanceBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monNontabBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monNightBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monDayoffBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monDofferBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monDormataryBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monScottBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monLieuBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monHeatBenefit, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monDriverAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monMotorCycleAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monConveyanceAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monHouseRentAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monUnionDonationAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monSpecialSalaryAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monMobileAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monOTAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monPLAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monTADAAmount, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monTotalAllowance, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monNetPayableSalary, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monSalaryAllowancePayInCash, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monManualAdd, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monManualDeduct, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monJoindatePenalty, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monPFEmployerContribution, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monGratuity, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monLoan, 2)}
                  </td>
                  <td className="text-right">
                    {_formatMoney(item?.monServiceBenefits, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DetailsTable;
