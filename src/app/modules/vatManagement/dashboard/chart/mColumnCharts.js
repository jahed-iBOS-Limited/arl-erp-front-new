import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

function MColumnCharts({ title, seriesList, labels, leftsideTitle }) {
  const [series, setSeries] = useState([]);
  const [options, seOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      width: 800,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: leftsideTitle,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val;
        },
      },
    },
    responsive: [
      {
        breakpoint: 668,
        options: {
          chart: {
            height: 350,
            width: 350,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 668,
        options: {
          chart: {
            height: 350,
            width: 500,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  useEffect(() => {
    if (seriesList) {
      setSeries(seriesList);
    }
  }, [seriesList]);

  useEffect(() => {
    if (labels) {
      seOptions({
        ...options,
        xaxis: {
          categories: labels,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels]);

  return (
    <div className="chart-wrapper">
      <h6>{title}</h6>
      <div className="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={250}
          width={800}
        />
      </div>
    </div>
  );
}

export default MColumnCharts;
