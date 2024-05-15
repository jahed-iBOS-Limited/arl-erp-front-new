import React, { useEffect } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import { _formatMoney } from "../../../_helper/_formatMoney";

export default function ViewModal({ singleData, values }) {
  const [rowData, getRowData, loader] = useAxiosGet();

  useEffect(() => {
    const [year, month] = values?.monthYear.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    getRowData(
      `/fino/Report/GetCostOfProductionDetail?businessUnitId=${values?.currentBusinessUnit?.value}&itemId=${singleData?.intItemId}&BudCOGS=${singleData?.numBudTotalCost}&ActCOGS=${singleData?.numActTotalCost}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, singleData]);
  return (
    <div>
      {loader && <Loading />}
      <div className="row mt-5">
        <div className="col-lg-12 cost-of-production">
          <div className="table-responsive">
            <table
              id="table-to-xlsx"
              className="table table-striped table-bordered bj-table bj-table-landing"
            >
              <thead>
                <tr>
                  <th>Particulars</th>
                  <th>Budget Cost</th>
                  <th>Actual Cost</th>
                  <th>Variance</th>
                </tr>
              </thead>
              <tbody>
                {rowData?.length > 0 &&
                  rowData?.map((item, index) => (
                    <tr key={index}>
                      <td>{item?.strParticulars}</td>
                      <td className="text-right">
                        {_formatMoney(item?.numBudgetCost)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numActualCost)}
                      </td>
                      <td className="text-right">
                        {_formatMoney(item?.numVariance)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
