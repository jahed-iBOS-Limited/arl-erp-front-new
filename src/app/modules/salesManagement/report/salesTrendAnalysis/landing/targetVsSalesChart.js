import React from "react";
import ReactApexChart from "react-apexcharts";

function TargetVsSalesChart({ rowData, topSheetId }) {
  return (
    <div id="chart">
      <ReactApexChart
        options={{
          chart: {
            type: "bar",
            height: 430,
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
          },
          xaxis: {
            categories: rowData?.map((item) =>
              topSheetId === 3 ? item?.strArea : item?.strRegion
            ),
          },
        }}
        series={[
          {
            color: "#eab308",
            name: "Target Sales",
            data: rowData?.map((item) => item?.QntTargetMonthly1),
          },
          {
            color: "#0284c7",
            name: "Actual Sales",
            data: rowData?.map((item) => item?.onmonthTotal),
          },
        ]}
        type="bar"
        height={600}
      />
    </div>
  );
}

export default TargetVsSalesChart;
