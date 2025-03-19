import React, { useEffect, useState } from "react";
import InputField from "../../_helper/_inputField";
import numberWithCommas from "../../_helper/_numberWithCommas";
import ProjectedPlannedFundRequirementForAll from "./ProjectedPlannedFundRequirementForAll";
export default function ProjectedPlannedFundRequirement({ rowData, values }) {
  const [listData, setListData] = useState({
    typeOne: [],
    typeTwo: [],
    typeThree: [],
  });

  const [financialCostOne, setFinancialCostOne] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [financialCostTwo, setFinancialCostTwo] = useState(0);
  console.log({ values });

  //check condition for dynamic table
  const isDynamicTable =
    values?.reportType?.value === 8 &&
    values?.subDivisionBusinessUnit?.value === 0;

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
      {rowData?.length > 0 && !isDynamicTable ? (
        <div className="row">
          <div>
            <h4 className="mt-5 ml-5">
              <strong>Working Capital/ Short-Term Loan Requirement</strong>
            </h4>
          </div>
          <div className="col-lg-12">
            <div className="table-responsive">
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
                        <td className="text-center">
                          {numberWithCommas(
                            Math.round(item?.MonthlyAvgValue) || 0
                          )}
                        </td>
                      </tr>
                    ))}
                  {listData?.typeOne?.length > 0 && (
                    <tr>
                      <td colSpan={2} className="text-center">
                        <strong> Total Current Assest (a)</strong>
                      </td>

                      <td className="text-center">
                        {numberWithCommas(
                          Math.round(
                            listData?.typeOne?.reduce(
                              (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                              0
                            )
                          ) || 0
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
                        <td className="text-center">
                          {numberWithCommas(
                            Math.round(item?.MonthlyAvgValue) || 0
                          )}
                        </td>
                      </tr>
                    ))}
                  {listData?.typeTwo?.length > 0 && (
                    <tr>
                      <td colSpan={2} className="text-center">
                        <strong> Total Current Liabibility (b)</strong>
                      </td>

                      <td className="text-center">
                        {numberWithCommas(
                          Math.round(
                            listData?.typeTwo?.reduce(
                              (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                              0
                            )
                          ) || 0
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
                        {numberWithCommas(
                          Math.round(
                            listData?.typeOne?.reduce(
                              (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                              0
                            ) -
                              listData?.typeTwo?.reduce(
                                (acc, curr) =>
                                  acc + (curr?.MonthlyAvgValue || 0),
                                0
                              )
                          ) || 0
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {rowData?.length > 0 && isDynamicTable && (
        <ProjectedPlannedFundRequirementForAll rowData={rowData} />
      )}

      {rowData?.length > 0 ? (
        <div className="row">
          <div>
            <h4 className="mt-5 ml-5">
              <strong>Long-Term Loan</strong>
            </h4>
          </div>
          <div className="col-lg-12">
            <div className="table-responsive">
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
                        <td className="text-center">
                          {numberWithCommas(
                            Math.round(item?.MonthlyAvgValue) || 0
                          )}
                        </td>
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
            <div className="table-responsive">
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
                      {numberWithCommas(
                        Math.round(
                          listData?.typeOne?.reduce(
                            (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                            0
                          ) -
                            listData?.typeTwo?.reduce(
                              (acc, curr) => acc + (curr?.MonthlyAvgValue || 0),
                              0
                            )
                        )
                      ) || 0}
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

                          setFinancialCostOne(
                            (total * Math.round(+e.target.value)) / 12
                          );
                        }}
                      />
                    </td>
                    <td>
                      {numberWithCommas(Math.round(financialCostOne)) || ""}
                    </td>
                  </tr>
                  <tr>
                    <td>LTL</td>
                    <td>Long Term Bank Loan</td>
                    <td className="text-center">
                      {numberWithCommas(
                        Math.round(
                          listData?.typeThree?.reduce(
                            (acc, curr) => acc + curr?.MonthlyAvgValue || 0,
                            0
                          )
                        ) || 0
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
        </div>
      ) : null}

      {rowData?.length > 0 ? (
        <div className="mt-5">
          <h4
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://docs.google.com/spreadsheets/d/1fqDF9_CW9sP6jc6HG851MFteC4Mw4zN_O07aYo1lfnI/edit#gid=0",
                "_blank"
              );
            }}
            style={{ textDecoration: "underline", cursor: "pointer" }}
            className="text-primary"
          >
            Forecasted Long-Term Loan Amortization
          </h4>
        </div>
      ) : null}
    </>
  );
}
