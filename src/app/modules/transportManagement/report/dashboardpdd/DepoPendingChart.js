import React from "react";
import ReactApexChart from "react-apexcharts";

const DepoPendingChart = () => {
  const series = [
    {
      name: "Dipo Pending",
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      height: 350,
      type: "bar",
    },

    colors: ["#1BD6FF", "#00FF00", "#6E1FEC"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    xaxis: {
      labels: {
        style: {
          fontSize: "11px",
          fontWeight: 700,
          fontFamily: "Poppins",
        },
        // rotateAlways: true,
        rotate: -45,
      },
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      tickPlacement: "on",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 90, 100],
        type: "vertical",
      },
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="arrow_box">' +
          '<span class="">' +
          w.globals.categoryLabels[dataPointIndex] +
          "</span>" +
          "<span>" +
          series[seriesIndex][dataPointIndex] +
          "</span>" +
          "</div>"
        );
      },
    },
  };

  return (
    <div className='DepoPendingChart'>
      <p className=''>
        <h6>Dipo Pending</h6>
      </p>
      <div id='chart'>
        <ReactApexChart
          options={options}
          series={series}
          type='bar'
          height={300}
        />
      </div>
    </div>
  );
};

export default DepoPendingChart;
