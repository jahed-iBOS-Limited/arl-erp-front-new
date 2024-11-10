import React from "react";
import ReactApexChart from "react-apexcharts";

function PieChart() {
  return (
    <div style={{ width: "50%" }} id="chart">
      <ReactApexChart
        options={{
          chart: {
            width: 380,
            type: "pie",
          },
          labels: [
            "Team A",
            "Team B",
            "Team C",
            "Team D",
            "Team E",
            "Team F",
            "Team G",
          ],
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
        }}
        series={[30, 40, 5, 8, 12, 15, 20]}
        type="pie"
      />
    </div>
  );
}

export default PieChart;
