import React from "react";
import ICustomCard from "../../../_helper/_customCard";
import ColumnCharts from "./columnCharts";
import MColumnCharts from "./mColumnCharts";
import PieCharts from "./pieCharts";

function Chart({
  monthlyTAXinfoDashBoard,
  itemWIsePurchaseDashBoard,
  itemWiseSalesDashBoard,
  dashBoardBarchtByTracType,
  dashBoardSalesProduction
}) {
  //seriesList Func
  const seriesListFunc = (arr, grandTotal, totalValue) => {
    const arryGrandTotal = arr?.map((itm) => itm?.[grandTotal]);
    const totalValuef = arr?.map((itm) => itm?.[totalValue]);
    return [
      {
        name: "Grand Total",
        data: arryGrandTotal,
      },
      {
        name: "Total Value",
        data: totalValuef,
      },
    ];
  };
  //SalesVSPurchaseseriesListFunc
  const SalesVSPurchaseseriesListFunc = (arr, grandTotal, totalValue) => {
    const totalSales = arr?.map((itm) => itm?.[grandTotal]);
    const totalPurchase = arr?.map((itm) => itm?.[totalValue]);
    return [
      {
        name: "Total Sales",
        data: totalSales,
      },
      {
        name: "Total Purchase",
        data: totalPurchase,
      },
    ];
  };
  return (
    <ICustomCard title="VAT DESHBOARD">
      <div className="row ">
        {/* Monthly TAX info */}
        <div className="col-lg-12 vatChart">
          <PieCharts
            title="Monthly TAX info"
            labels={["SD", "Surcharge", "VAT"]}
            seriesList={Object.values(monthlyTAXinfoDashBoard)}
          />
        </div>
        {/* tem WIse Purchase */}
        <div className="col-lg-12 vatChart">
          <ColumnCharts
            title="Item WIse Purchase"
            seriesList={[
              {
                data: itemWIsePurchaseDashBoard?.map((itm) => itm?.qty),
                name: "Quantity",
              },
            ]}
            labels={itemWIsePurchaseDashBoard?.map(
              (itm) => itm?.taxItemGroupName
            )}
          />
        </div>
        {/* Item Wise Sales */}
        <div className="col-lg-12 vatChart">
          <MColumnCharts
            title="Item Wise Sales"
            labels={itemWiseSalesDashBoard?.map((itm) => itm?.taxItemGroupName)}
            seriesList={seriesListFunc(
              itemWiseSalesDashBoard,
              "grandTotal",
              "totalValue"
            )}
          />
        </div>
        {/* Sales VS Purchase */}
        <div className="col-lg-12 vatChart">
          <MColumnCharts
            title="Sales VS Purchase"
            labels={dashBoardSalesProduction?.map((itm) => itm?.taxItemGroupName)}
            seriesList={SalesVSPurchaseseriesListFunc(
              dashBoardSalesProduction,
              "salesTotal",
              "purchaseTotal"
            )}
          />
        </div>
        {/* Item Wise Sales (type) */}
        <div className="col-lg-12 vatChart">
          <MColumnCharts
            title="Item Wise Sales (type)"
            labels={dashBoardBarchtByTracType?.map(
              (itm) => itm?.taxItemGroupName
            )}
            seriesList={seriesListFunc(
              dashBoardBarchtByTracType,
              "grandTotal",
              "totalValue"
            )}
          />
        </div>
      </div>
    </ICustomCard>
  );
}

export default Chart;
