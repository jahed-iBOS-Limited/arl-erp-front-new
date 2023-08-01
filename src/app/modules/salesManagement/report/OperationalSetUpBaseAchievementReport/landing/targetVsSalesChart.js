import React from "react";
import ReactApexChart from "react-apexcharts";
import { _formatMoney } from "../../../../_helper/_formatMoney";

function TargetVsSalesChart({ rowData, reportType }) {
  const categories = () => {
    switch (reportType) {
      case 2:
        return rowData?.map((item) => item?.nl7 || "");
      case 3:
        return rowData?.map((item) => item?.nl6 || "");
      case 4:
        return rowData?.map((item) => item?.nl5 || "");
      default:
        return [];
    }
  };

  return (
    <>
      <div>
        <strong className="ml-2">
          Total Collection Amount:{" "}
          {_formatMoney(
            rowData?.reduce(
              (acc, obj) => acc + Math.abs(obj?.monCollectionAmount),
              0
            )
          )}{" "}
        </strong>
        <strong className="ml-2">
          Total Revenue Target Amount:{" "}
          {_formatMoney(
            rowData?.reduce(
              (acc, obj) => acc + Math.abs(obj?.monTotalRevenueTarget),
              0
            )
          )}{" "}
        </strong>
        <strong className="ml-2">
          Total Sales Amount:{" "}
          {_formatMoney(
            rowData?.reduce((acc, obj) => acc + Math.abs(obj?.montsales), 0)
          )}{" "}
        </strong>
      </div>

      <div id="chart">
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
              categories: categories(),
            },
          }}
          series={[
            {
              color: "#eab308",
              name: "Total Revenue Target",
              data: rowData?.map((item) =>
                Math.abs(item?.monTotalRevenueTarget)
              ),
            },
            {
              color: "#a78bfa",
              name: "Seventy Percent Target Revenue",
              data: rowData?.map((item) =>
                Math.abs(item?.monSeventyPercentTRT)
              ),
            },
            {
              color: "#65a30d",
              name: "Collection Amount",
              data: rowData?.map((item) => Math.abs(item?.monCollectionAmount)),
            },
            // {
            //   color: "#0284c7",
            //   name: "Monthly Sales",
            //   data: rowData?.map((item) => item?.montsales),
            // },
          ]}
          type="bar"
          height={rowData?.length * 120}
        />
      </div>
    </>
  );
}

export default TargetVsSalesChart;
