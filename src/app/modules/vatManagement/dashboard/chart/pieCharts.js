import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
function PieCharts({ title, seriesList, labels }) {
  const [options, ] = useState({
    chart: {
      width: 350,
      type: "pie",
      height: 300,
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  const [series, setSeries] = useState([44, 55, 100]);
  useEffect(() => {
    if (seriesList?.length > 0) {
      setSeries(seriesList);
    }else {
      setSeries([44, 55, 100])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesList]);
  console.log(seriesList, "Pie")
  return (
    <div className="chart-wrapper">
      <h6>{title}</h6>
      <div className="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          width={350}
        />
      </div>
    </div>
  );
}

export default PieCharts;
