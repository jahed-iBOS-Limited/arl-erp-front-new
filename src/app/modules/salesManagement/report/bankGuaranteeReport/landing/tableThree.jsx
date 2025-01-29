import React from "react";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const ths = [
  "Sl",
  "Party Name",
  "Bank Guarantee",
  "Actual Credit Limit",
  "BG vs Limit (%)",
  "Approved OD (20%)",
  "Used OD",
  "Out of 20% OD",
  "Debit",
  "Sales",
  "BG COMM/Bag",
  "Total BG Commission",
  "Remarks",
];

export default function TableThree({ obj }) {
  const { rowDto, setRowDto } = obj;

  const allSelect = (value) => {
    let _data = [...rowDto?.data];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowDto({ ...rowDto, data: modify });
  };

  const selectedAll = () => {
    return rowDto?.data?.length > 0 &&
      rowDto?.data?.filter((item) => item?.isSelected)?.length ===
        rowDto?.data?.length
      ? true
      : false;
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowDto?.data];
    _data[index][name] = value;
    setRowDto({ ...rowDto, data: _data });
  };

  let totalBG = 0;
  let totalActualCreditLimit = 0;
  let totalBGvsLimit = 0;
  let totalApprovedOD = 0;
  let totalUsedOD = 0;
  let totalOutOf30OD = 0;
  let totalDebit = 0;
  let totalSales = 0;
  // let totalBGComm = 0;
  let totalCommission = 0;
  return (
    <>
      <div className="react-bootstrap-table table-responsive">
        <table
          className={"table table-striped table-bordered global-table "}
          id="table-to-xlsx"
        >
          <thead>
            <tr>
              <th
                onClick={() => allSelect(!selectedAll())}
                style={{ minWidth: "30px" }}
              >
                <input
                  type="checkbox"
                  value={selectedAll()}
                  checked={selectedAll()}
                  onChange={() => {}}
                />
              </th>
              {ths.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
            </tr>
          </thead>
          <tbody>
            {rowDto?.data?.map((itm, index) => {
              totalBG += itm.bankGuaranteeAmount;
              totalActualCreditLimit += itm.actualCreditLimit;
              totalBGvsLimit += itm.bgNlimitPercentage;
              totalApprovedOD += itm.approvedOd30percent;
              totalUsedOD += itm.usedOd;
              totalOutOf30OD += itm.outOf30PercentOd;
              totalDebit += itm.debit;
              totalSales += itm.sales;
              // totalBGComm += itm.BGCommissionBag;
              totalCommission += itm.totalBgCommission;

              return (
                <>
                  <tr key={index}>
                    <td
                      onClick={() => {
                        rowDataHandler("isSelected", index, !itm.isSelected);
                      }}
                      className="text-center"
                    >
                      <input
                        type="checkbox"
                        value={itm?.isSelected}
                        checked={itm?.isSelected}
                        onChange={() => {}}
                        disabled={false}
                      />
                    </td>
                    <td className="text-center">{index + 1}</td>
                    <td> {itm?.businessPartnerName}</td>
                    <td className="text-right">
                      {" "}
                      {_fixedPoint(itm?.bankGuaranteeAmount, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(itm?.actualCreditLimit, true)}
                    </td>
                    <td className="text-right">{itm?.bgNlimitPercentage}</td>
                    <td className="text-right">
                      {_fixedPoint(itm?.approvedOd30percent, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(itm?.usedOd, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(itm?.outOf30PercentOd, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(itm?.debit, true)}
                    </td>
                    <td className="text-right">
                      {_fixedPoint(itm?.sales, true)}
                    </td>
                    <td className="text-right">{itm?.bgCommissionPerBag}</td>
                    <td className="text-right">
                      {_fixedPoint(itm?.totalBgCommission, true)}
                    </td>
                    <td className="text-right">{itm?.remarks}</td>
                  </tr>
                </>
              );
            })}
            <tr style={{ fontWeight: "bold" }}>
              <td className="text-right" colSpan={3}>
                Total
              </td>
              <td className="text-right">{_fixedPoint(totalBG, true)}</td>
              <td className="text-right">
                {_fixedPoint(totalActualCreditLimit, true)}
              </td>
              <td className="text-right">{totalBGvsLimit}</td>
              <td className="text-right">
                {_fixedPoint(totalApprovedOD, true)}
              </td>
              <td className="text-right">{_fixedPoint(totalUsedOD, true)}</td>
              <td className="text-right">
                {_fixedPoint(totalOutOf30OD, true)}
              </td>
              <td className="text-right">{_fixedPoint(totalDebit, true)}</td>
              <td className="text-right">{_fixedPoint(totalSales, true)}</td>
              <td className="text-right"></td>
              <td className="text-right">
                {_fixedPoint(totalCommission, true)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
