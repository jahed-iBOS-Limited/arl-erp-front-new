import React from "react";
import ReactApexChart from "react-apexcharts";
import { _formatMoney } from "../../../_helper/_formatMoney";

function G2GinventoryChart({ rowData, reportType }) {
  const categories = () => {
    if ([5, 6, 7].includes(reportType)) {
      return rowData?.map((item) => item?.strMVesselName || "");
    } else if ([8, 9].includes(reportType)) {
      return rowData?.map((item) => item?.strG2GItemName || "");
    } else {
      return [];
    }
  };

  return (
    <>
      <div>
        <strong className='ml-2'>
          Total In Qty:{" "}
          {_formatMoney(
            rowData?.reduce((acc, obj) => acc + Math.abs(obj?.numInQty), 0)
          )}{" "}
        </strong>
        <strong className='ml-2'>
          Total Out Qty:{" "}
          {_formatMoney(
            rowData?.reduce((acc, obj) => acc + Math.abs(obj?.numOutQty), 0)
          )}{" "}
        </strong>
        <strong className='ml-2'>
          Total Close Qty:{" "}
          {_formatMoney(
            rowData?.reduce((acc, obj) => acc + Math.abs(obj?.numCloseQty), 0)
          )}{" "}
        </strong>
      </div>

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
                  return _formatMoney(val);
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
              name: "In Qty",
              data: rowData?.map((item) => Math.abs(item?.numInQty)),
            },
            {
              color: "#a78bfa",
              name: "Out Qty",
              data: rowData?.map((item) => Math.abs(item?.numOutQty)),
            },
            {
              color: "#65a30d",
              name: "Close Qty",
              data: rowData?.map((item) => Math.abs(item?.numCloseQty)),
            },
          ]}
          type='bar'
          height={rowData?.length * 120}
        />
      </div>
    </>
  );
}

export default G2GinventoryChart;
