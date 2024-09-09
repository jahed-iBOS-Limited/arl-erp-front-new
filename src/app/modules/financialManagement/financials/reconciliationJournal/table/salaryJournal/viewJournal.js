import React, { useMemo } from "react";
import numberWithCommas from "../../../../../_helper/_numberWithCommas";

const SalaryJournalTable = ({ salaryJournal }) => {
  // total gross salary
  const totalGrossSalary = useMemo(() => {
    return salaryJournal?.reduce((acc, item) => acc + item?.numGrossSalary, 0);
  }, [salaryJournal]);

  // total monthly payable
  const totalMonthlyPayable = useMemo(() => {
    return salaryJournal?.reduce(
      (acc, item) => acc + item?.numNetPayableSalary,
      0
    );
  }, [salaryJournal]);

  // total allowance
  const totalAllowance = useMemo(() => {
    return salaryJournal?.reduce(
      (acc, item) => acc + item?.numTotalAllowance,
      0
    );
  }, [salaryJournal]);

  // total deduction
  const totalDeduction = useMemo(() => {
    return salaryJournal?.reduce(
      (acc, item) => acc + item?.numTotalDeduction,
      0
    );
  }, [salaryJournal]);

  // total net pay
  const totalNetPay = useMemo(() => {
    return salaryJournal?.reduce((acc, item) => acc + item?.netPay, 0);
  }, [salaryJournal]);

  // total cash pay
  const totalCashPay = useMemo(() => {
    return salaryJournal?.reduce((acc, item) => acc + item?.cashPay, 0);
  }, [salaryJournal]);
  return (
    <>
      <h4 className="mb-0 mt-2">Salary Journal</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
          <thead className="bg-secondary">
            <tr>
              <th>SL</th>
              <th>Employee Name</th>
              <th>Salary</th>
              <th>Monthly Payable</th>
              <th>Total Allowance</th>
              <th>Total Deduction</th>
              <th>Net Pay</th>
              <th>Cash Pay</th>
            </tr>
          </thead>
          <tbody>
            <>
              {salaryJournal?.map((item, index) => (
                <tr key={index} className="text-right">
                  <td>{index + 1}</td>
                  <td className="text-left">{item?.strEmployeeName}</td>
                  <td>{numberWithCommas(item?.numGrossSalary)}</td>
                  <td>{numberWithCommas(item?.numNetPayableSalary)}</td>
                  <td>{numberWithCommas(item?.numTotalAllowance)}</td>
                  <td>{numberWithCommas(item?.numTotalDeduction)}</td>
                  <td>{numberWithCommas(item?.netPay)}</td>
                  <td>{numberWithCommas(item?.cashPay)}</td>
                </tr>
              ))}
            </>
            <tr className="text-right">
              <td colSpan={2} className="text-center">
                Total
              </td>
              <td>{numberWithCommas(totalGrossSalary)}</td>
              <td>{numberWithCommas(totalMonthlyPayable)}</td>
              <td>{numberWithCommas(totalAllowance)}</td>
              <td>{numberWithCommas(totalDeduction)}</td>
              <td>{numberWithCommas(totalNetPay)}</td>
              <td>{numberWithCommas(totalCashPay)}</td>
            </tr>
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </>
  );
};
export default SalaryJournalTable;
