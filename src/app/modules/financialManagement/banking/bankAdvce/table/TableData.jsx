import React, { useMemo } from 'react';
// import ICustomTable from "../../../../_helper/_customTable";
import numberWithCommas from '../../../../_helper/_numberWithCommas';

const TableData = ({ adviceReportData, setAdviceReportData }) => {
  const totalAmount = useMemo(
    () => adviceReportData.reduce((acc, item) => acc + +item.numAmount, 0),
    [adviceReportData]
  );

  return (
    adviceReportData?.length > 0 && (
      <div className="table-responsive">
        <table
          className={
            'table table-striped table-bordered global-table mt-0 table-font-size-sm advice_table'
          }
        >
          <thead className="bg-secondary">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    adviceReportData?.length > 0
                      ? adviceReportData?.every((item) => item?.checked)
                      : false
                  }
                  onChange={(e) => {
                    setAdviceReportData(
                      adviceReportData?.map((item) => {
                        return {
                          ...item,
                          checked: e?.target?.checked,
                        };
                      })
                    );
                  }}
                />
              </th>
              <th>SL</th>
              <th>Account No</th>
              <th>Type</th>
              <th>Account Name</th>
              <th>Bank</th>
              <th>Branch</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Instrument</th>
              <th>Code</th>
              <th>Payee</th>
              <th>Routing</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {adviceReportData?.map((item, index) => (
              <tr
                key={index}
                className={
                  item?.printCount || item?.mailCount ? 'font_color_red' : ''
                }
              >
                <td className="text-center align-middle">
                  <input
                    type="checkbox"
                    // value = {item?.checked ? true:false}
                    checked={item?.checked}
                    onChange={(e) => {
                      item['checked'] = e.target.checked;
                      setAdviceReportData([...adviceReportData]);
                    }}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{item?.strAccountNo}</td>
                <td>{item?.strBankAccType}</td>
                <td>{item?.strBankAccountName}</td>
                <td>{item?.strBankName}</td>
                <td>{item?.strBankBranchName}</td>
                <td>{item?.strBranchAddress}</td>
                <td className="text-right">
                  {numberWithCommas(item?.numAmount)}
                </td>
                <td>{item?.strInstrumentNo}</td>
                <td>{item?.strPayeCode}</td>
                <td>{item?.strPayee}</td>
                <td>{item?.strRoutingNumber}</td>
                <td>
                  P-{item?.printCount}, M-{item?.mailCount}{' '}
                </td>
              </tr>
            ))}
            {adviceReportData.length > 0 && (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <b className="pl-2">Total</b>
                </td>
                <td className="text-right">
                  <div className="pr-2">{(totalAmount || 0).toFixed(2)}</div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )

    // adviceReportData?.length > 0 && (
    // <ICustomTable
    //   ths={[
    //     "SL",
    //     "Account No",
    //     "Account Type",
    //     "Account Name",
    //     "Bank",
    //     "Branch",
    //     "Address",
    //     "Amount",
    //     "Instrument",
    //     "Code",
    //     "Payee",
    //     "Routing",
    //   ]}
    // >
    //   {adviceReportData?.map((item, index) => (
    //     <tr>
    //       <td>{index + 1}</td>
    //       <td>{item?.strAccountNo}</td>
    //       <td>{item?.strBankAccType}</td>
    //       <td>{item?.strBankAccountName}</td>
    //       <td>{item?.strBankName}</td>
    //       <td>{item?.strBankBranchName}</td>
    //       <td>{item?.strBranchAddress}</td>
    //       <td className="text-right">{numberWithCommas(item?.numAmount)}</td>
    //       <td>{item?.strInstrumentNo}</td>
    //       <td>{item?.strPayeCode}</td>
    //       <td>{item?.strPayee}</td>
    //       <td>{item?.strRoutingNumber}</td>
    //     </tr>
    //   ))}
    // </ICustomTable>
    //   )
  );
};

export default TableData;
