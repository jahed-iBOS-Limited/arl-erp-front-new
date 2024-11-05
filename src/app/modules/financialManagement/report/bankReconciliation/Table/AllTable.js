import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import Total from "./Total";

const ths = [
  "Voucher Code",
  "Type",
  "Issue Date",
  "Ref No",
  "Particulars",
  "Amount",
];

// const getTotal = arr => {
//   return arr.reduce((a,b)=>a+b.monAmount,0)
// }

const AllTable = ({ report, values }) => {
  return (
    <div>
      <ICustomTable ths={ths} className="table-font-size-sm">
        {report?.typeOne?.length > 0 && (
          <tr>
            <td
              colSpan="6"
              className="text-left"
              style={{ fontSize: "15px", fontWeight: "bold" }}
            >
              1.Add: Cheque issued but not presented in bank
            </td>
          </tr>
        )}
        {report?.typeOne?.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{item?.strVoucherCode}</td>
            <td className="text-left">{item?.strType}</td>
            <td className="text-center">
              {item?.strIssuDate && _dateFormatter(item?.strIssuDate)}
            </td>
            <td className="text-center">{item?.strChequeNo}</td>
            <td className="text-left">{item?.strParty}</td>
            <td className="text-right">
              {numberWithCommas((item?.monAmount || 0).toFixed(2))}
            </td>
          </tr>
        ))}
        {report?.typeOne?.length > 0 && (
          <Total total={report?.typeOneTotal} running={report?.typeOneTotal} />
        )}

        {report?.typeTwo?.length > 0 && (
          <tr>
            <td
              colSpan="6"
              className="text-left"
              style={{ fontSize: "15px", fontWeight: "bold" }}
            >
              2.Less: Amount debited in bank book but not credited in bank
              statement
            </td>
          </tr>
        )}
        {report?.typeTwo?.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{item?.strVoucherCode}</td>
            <td className="text-left">{item?.strType}</td>
            <td className="text-center">
              {item?.strIssuDate && _dateFormatter(item?.strIssuDate)}
            </td>
            <td className="text-center">{item?.strChequeNo}</td>
            <td className="text-left">{item?.strParty}</td>
            <td className="text-right">
              {numberWithCommas((item?.monAmount || 0).toFixed(2))}
            </td>
          </tr>
        ))}
        {report?.typeTwo?.length > 0 && (
          <Total
            total={report?.typeTwoTotal}
            running={report?.typeOneTotal + report?.typeTwoTotal}
          />
        )}

        {report?.typeThree?.length > 0 && (
          <tr>
            <td
              colSpan="6"
              className="text-left"
              style={{ fontSize: "15px", fontWeight: "bold" }}
            >
              3.Add: Amount credited in bank statement but not yet debited in
              bank book
            </td>
          </tr>
        )}
        {report?.typeThree?.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{item?.strVoucherCode}</td>
            <td className="text-left">{item?.strType}</td>
            <td className="text-center">
              {item?.strIssuDate && _dateFormatter(item?.strIssuDate)}
            </td>
            <td className="text-center">{item?.strChequeNo}</td>
            <td className="text-left">{item?.strParty}</td>
            <td className="text-right">
              {numberWithCommas((item?.monAmount || 0).toFixed(2))}
            </td>
          </tr>
        ))}
        {report?.typeThree?.length > 0 && (
          <Total
            total={report?.typeThreeTotal}
            running={
              report?.typeOneTotal +
              report?.typeTwoTotal +
              report?.typeThreeTotal
            }
          />
        )}

        {report?.typeFour?.length > 0 && (
          <tr>
            <td
              colSpan="6"
              className="text-left"
              style={{ fontSize: "15px", fontWeight: "bold" }}
            >
              4.Less: Amount debited in bank statement but not yet credited in
              bank book
            </td>
          </tr>
        )}
        {report?.typeFour?.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{item?.strVoucherCode}</td>
            <td className="text-left">{item?.strType}</td>
            <td className="text-center">
              {item?.strIssuDate && _dateFormatter(item?.strIssuDate)}
            </td>
            <td className="text-center">{item?.strChequeNo}</td>
            <td className="text-left">{item?.strParty}</td>
            <td className="text-right">
              {numberWithCommas((item?.monAmount || 0).toFixed(2))}
            </td>
          </tr>
        ))}
        {report?.typeFour?.length > 0 && (
          <Total
            total={report?.typeFourTotal}
            running={
              report?.typeOneTotal +
              report?.typeTwoTotal +
              report?.typeThreeTotal +
              report?.typeFourTotal
            }
          />
        )}
        {/* new typeFive */}
        {report?.typeFive?.length > 0 && (
          <tr>
            <td
              colSpan="6"
              className="text-left"
              style={{ fontSize: "15px", fontWeight: "bold" }}
            >
              5.Less: Amount Adjusted in bank statement but not yet credited in bank book
            </td>
          </tr>
        )}
        {report?.typeFive?.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{item?.strVoucherCode}</td>
            <td className="text-left">{item?.strType}</td>
            <td className="text-center">
              {item?.strIssuDate && _dateFormatter(item?.strIssuDate)}
           
            </td>
            <td className="text-center">{item?.strChequeNo}</td>
            <td className="text-left">{item?.strParty}</td>
            <td className="text-right">
              {numberWithCommas((item?.monAmount || 0).toFixed(2))}
            </td>
          </tr>
        ))}
        {report?.typeFive?.length > 0 && (
          <Total
            total={report?.typeFiveTotal}
            running={
              report?.typeOneTotal +
              report?.typeTwoTotal +
              report?.typeThreeTotal +
              report?.typeFourTotal +
              report?.typeFiveTotal
            }
          />
        )}

        {report?.typeBalanceOfBankBook?.length > 0 && (
          <tr>
            <td
              colSpan="6"
              className="text-left"
              style={{ fontSize: "15px", fontWeight: "bold" }}
            >
              Balance Of Bank Book
            </td>
          </tr>
        )}
        {report?.typeBalanceOfBankBook?.map((item, index) => (
          <tr key={index}>
            <td className="text-center">{item?.strVoucherCode}</td>
            <td className="text-left">{item?.strType}</td>
            <td className="text-center">
              {item?.strIssuDate && _dateFormatter(item?.strIssuDate)}
            </td>
            <td className="text-center">{item?.strChequeNo}</td>
            <td className="text-left">{item?.strParty}</td>
            <td className="text-right">
              {numberWithCommas((item?.monAmount || 0).toFixed(2))}
            </td>
          </tr>
        ))}
        {report?.typeBalanceOfBankBook?.length > 0 && (
          <Total
            total={report?.typeBalanceOfBankBookTotal}
            running={
              report?.typeOneTotal +
              report?.typeTwoTotal +
              report?.typeThreeTotal +
              report?.typeFourTotal +
              report?.typeFiveTotal+
              report?.typeBalanceOfBankBookTotal
            }
          />
        )}

        <tr>
          <td colSpan="4" className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              Aggregated Bank Statement Closing
            </span>
          </td>
          <td className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              {"As On " + values?.date}
            </span>
          </td>
          <td className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              {numberWithCommas(
                (
                  report?.typeOneTotal +
                    report?.typeTwoTotal +
                    report?.typeThreeTotal +
                    report?.typeFourTotal +
                    report?.typeFiveTotal+
                    report?.typeBalanceOfBankBookTotal || 0
                ).toFixed(2)
              )}
            </span>
          </td>
        </tr>
        <tr>
          <td colSpan="5" className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              Difference
            </span>
          </td>
          <td className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              {console.log(
                report?.typeOneTotal +
                  report?.typeTwoTotal +
                  report?.typeThreeTotal +
                  report?.typeFourTotal +
                  report?.typeFiveTotal+
                  report?.typeBalanceOfBankBookTotal -
                  report?.bankStatementClosing
              )}
              {_formatMoney(
                Number(
                  (
                    report?.typeOneTotal +
                    report?.typeTwoTotal +
                    report?.typeThreeTotal +
                    report?.typeFourTotal +
                    report?.typeFiveTotal+
                    report?.typeBalanceOfBankBookTotal
                  ).toFixed(2)
                ) - Number(report?.bankStatementClosing.toFixed(2))
              )}
            </span>
          </td>
        </tr>
        <tr>
          <td colSpan="4" className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              Actual Bank Statement Closing
            </span>
          </td>
          <td className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              {"As On " + values?.date}
            </span>
          </td>
          <td className="text-right">
            <span
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              {numberWithCommas((report?.bankStatementClosing).toFixed(2))}
            </span>
          </td>
        </tr>
      </ICustomTable>
    </div>
  );
};

export default AllTable;
