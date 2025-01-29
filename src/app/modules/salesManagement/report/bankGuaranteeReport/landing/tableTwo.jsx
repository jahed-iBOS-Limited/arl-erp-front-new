import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

const ths_2 = [
  "Sl",
  "Partner Name",
  "Existing Mortgage Amount",
  "Updated Mortgage Amount",
  "Existing Bank Name",
  "Updated Bank Name",
  "Branch Name",
  "Issue Date",
  "Expire Date",
  "Remarks",
];

const TableTwo = ({ obj }) => {
  const { rowDto } = obj;
  return (
    <>
      <ICustomTable ths={ths_2} id="table-to-xlsx">
        {rowDto?.map((itm, index) => {
          return (
            <>
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td> {itm?.businessPartnerName}</td>
                <td className="text-right">
                  {_fixedPoint(itm?.existingMortgageAmount, true, 0)}
                </td>
                <td className="text-right">
                  {_fixedPoint(itm?.numMortgageAmount, true, 0)}
                </td>
                <td>{itm?.preBankName}</td>
                <td>{itm?.strBankName}</td>
                <td>{itm?.strBranchName}</td>
                <td>
                  {
                    itm?.dteIssueDate
                    // ? excelDateFormatter(itm?.dteIssueDate)
                    // : ""
                  }
                </td>
                <td>
                  {
                    itm?.dteExpireDate
                    // ? excelDateFormatter(itm?.dteExpireDate)
                    // : ""
                  }
                </td>
                <td className="text-right">{itm?.strNarration}</td>
              </tr>
            </>
          );
        })}
        {/* <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={2}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalBG, true)}
                          </td>

                          <td colSpan={5}></td>
                        </tr> */}
      </ICustomTable>
    </>
  );
};

export default TableTwo;
