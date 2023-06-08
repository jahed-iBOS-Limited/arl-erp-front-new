import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

function ColumnCharts({ title, seriesList, labels }) {
  const [series, setSeries] = useState([
    
  ]);
  const [options, seOptions] = useState({
    chart: {
      width: 800,
      height: 250,
      type: "bar",
      events: {
        click: function(chart, w, e) {
          // console.log(chart, w, e)
        },
      },
    },
    // colors: colors,
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: "12px",
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

export default ColumnCharts;
