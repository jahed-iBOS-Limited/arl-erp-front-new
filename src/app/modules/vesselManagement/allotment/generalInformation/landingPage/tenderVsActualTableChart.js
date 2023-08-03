import React from "react";
import ReactApexChart from "react-apexcharts";
import { _formatMoney } from "../../../../_helper/_formatMoney";

function TargetVsSalesChart({ gridData }) {
   
  return (
    <>
      <div id='chart'>
        <ReactApexChart
          toolbar={true}
          options={{
            chart: {
              type: "bar",
              height: 600,
              toolbar: {
                show: true,
              },
              zoom: {
                enabled: true,
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
                dataLabels: {
                  position: "top",
                },
              },
            },
            dataLabels: {
              enabled: true,
              offsetX: -6,
              style: {
                fontSize: "12px",
                colors: ["#fff"],
              },
            },
            stroke: {
              show: true,
              width: 1,
              colors: ["#fff"],
            },
            tooltip: {
              shared: true,
              intersect: false,
              y: {
                formatter: function(val) {
                  return _formatMoney(val) + " ৳";
                },
              },
            },
            xaxis: {
              categories: gridData?.map((item) => item?.strMVesselName || ""),
            },
          }}
          series={[
            {
              color: "#eab308",
              name: "Total Revenue Approximate",
              data: gridData?.map((item) =>
                Math.abs(item?.TotalRevenueApproximate)
              ),
            },
            {
              color: "#a78bfa",
              name: "Total Revenue Actual",
              data: gridData?.map((item) => Math.abs(item?.TotalRevenueActual)),
            },
            {
              color: "#65a30d",
              name: "Variance Amount",
              data: gridData?.map((item) => Math.abs(item?.VarianceAmount)),
            },
      
          ]}
          type='bar'
          height={gridData?.length * 120}
        />
      </div>
    </>
  );
}

export default TargetVsSalesChart;
