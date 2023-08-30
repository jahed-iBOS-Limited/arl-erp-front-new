import React, { useEffect, useState } from "react";
import InputField from "../../../_helper/_inputField";
export default function PlannedFundRequirement({ rowData }) {
  const [listData, setListData] = useState({
    typeOne: [],
    typeTwo: [],
    typeThree: [],
  });

  const [financialCostOne, setFinancialCostOne] = useState(0);
  const [financialCostTwo, setFinancialCostTwo] = useState(0);

  useEffect(() => {
    if (rowData?.length) {
      const data = {
        typeOne: rowData?.filter((item) => item?.TypeId === 1),
        typeTwo: rowData?.filter((item) => item?.TypeId === 2),
        typeThree: rowData?.filter((item) => item?.TypeId === 3),
      };

      setListData(data);
    }
  }, [rowData]);
  return (
    <>
      {rowData?.length > 0 ? (
        <div className="row">
          <div>
            <h4 className="mt-5 ml-5">
              <strong>Working Capital/ Short-Term Loan Requirement</strong>
            </h4>
          </div>
          <div className="col-lg-12">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Particulars</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {listData?.typeOne?.length > 0 &&
                  listData?.typeOne?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {item?.strGeneralLedgerCode}
                      </td>
                      <td>{item?.strGeneralLedgerName}</td>
                      <td className="text-center">{item?.MonthlyAvgValue}</td>
                    </tr>
                  ))}
                {listData?.typeOne?.length > 0 && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <strong> Total Current Assest (a)</strong>
                    </td>

                    <td className="text-center">
                      {listData?.typeOne?.reduce(
                        (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                        0
                      )}
                    </td>
                  </tr>
                )}

                {listData?.typeTwo?.length > 0 &&
                  listData?.typeTwo?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {item?.strGeneralLedgerCode}
                      </td>
                      <td>{item?.strGeneralLedgerName}</td>
                      <td className="text-center">{item?.MonthlyAvgValue}</td>
                    </tr>
                  ))}
                {listData?.typeTwo?.length > 0 && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <strong> Total Current Liabibility (b)</strong>
                    </td>

                    <td className="text-center">
                      {listData?.typeTwo?.reduce(
                        (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                        0
                      )}
                    </td>
                  </tr>
                )}
                {listData?.typeTwo?.length > 0 && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <strong>Net Working Capital/STL Requirement (c)</strong>
                    </td>

                    <td className="text-center">
                      {listData?.typeOne?.reduce(
                        (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                        0
                      ) -
                        listData?.typeTwo?.reduce(
                          (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                          0
                        )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {rowData?.length > 0 ? (
        <div className="row">
          <div>
            <h4 className="mt-5 ml-5">
              <strong>Long-Term Loan</strong>
            </h4>
          </div>
          <div className="col-lg-12">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Particulars</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {listData?.typeThree?.length > 0 &&
                  listData?.typeThree?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        {item?.strGeneralLedgerCode}
                      </td>
                      <td>{item?.strGeneralLedgerName}</td>
                      <td className="text-center">{item?.MonthlyAvgValue}</td>
                    </tr>
                  ))}
                {listData?.typeThree?.length > 0 && (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <strong> Total Long Term Liability</strong>
                    </td>

                    <td className="text-center">
                      {listData?.typeThree?.reduce(
                        (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                        0
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {rowData?.length > 0 ? (
        <div className="row">
          <div>
            <h4 className="mt-5 ml-5">
              <strong>Total Fund Requirement</strong>
            </h4>
          </div>
          <div className="col-lg-12">
            <table className="table table-striped table-bordered mt-3">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Particulars</th>
                  <th>Value</th>
                  <th>Int Rate</th>
                  <th>Finance Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>STL</td>
                  <td>Net Working Capital</td>
                  <td className="text-center">
                    {listData?.typeOne?.reduce(
                      (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                      0
                    ) -
                      listData?.typeTwo?.reduce(
                        (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                        0
                      )}
                  </td>
                  <td>
                    <InputField
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        let total =
                          listData?.typeOne?.reduce(
                            (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                            0
                          ) -
                          listData?.typeTwo?.reduce(
                            (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                            0
                          );

                        setFinancialCostOne((total * +e.target.value) / 12);
                      }}
                    />
                  </td>
                  <td>{financialCostOne || ""}</td>
                </tr>
                <tr>
                  <td>LTL</td>
                  <td>Long Term Bank Loan</td>
                  <td className="text-center">
                    {listData?.typeThree?.reduce(
                      (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                      0
                    )}
                  </td>
                  <td>
                    {" "}
                    <InputField
                      type="number"
                      onChange={(e) => {
                        if (+e.target.value < 0) return;
                        let total = listData?.typeThree?.reduce(
                          (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                          0
                        );

                        setFinancialCostOne((total * +e.target.value) / 12);
                      }}
                    />
                  </td>
                  <td>{setFinancialCostTwo || ""}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
