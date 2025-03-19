import React, { Component } from "react";
import Chart from "react-apexcharts";

class ApexBarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: "apexchart-example",
          type: "bar",
        },

        xaxis: {
          categories: ["Target", "Actual"],
        },
      },
      series: [
        {
          name: "",
          data: [this.props.itm?.numTarget, this.props.itm?.numAchivement],
        },
      ],
    };
  }
  render() {
    return (
      <div className="d-flex justify-content-center">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          width={170}
          height={140}
        />
      </div>
    );
  }
}

export default ApexBarChart;
