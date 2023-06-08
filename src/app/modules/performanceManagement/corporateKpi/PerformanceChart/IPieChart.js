import React from "react";
import { Pie } from "@ant-design/charts";
import IHeart from "../../../../_helper/_helperIcons/_heart";

const IPie = ({isShown, kpiId, updateIsShown}) => {
  const data = [
    {
      type: "Target",
      value: 400,
    },
    {
      type: "Actual",
      value: 270,
    },
  ];
  const config = {
    appendPadding: 4,
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    legend: false,
    className: "myChart",
    label: {
      type: "inner",
      offset: "-50",
      content: "{name} {percentage}",
      style: {
        fill: "#fff",
        width: "2px",
        fontSize: 9,
        fontWeight: "normal",
        textAlign: "center",
      },
    },
  };
  return (
    <div className="d-flex justify-content-center">
      <Pie {...config} /> <IHeart updateIsShown={updateIsShown} isShown={isShown} kpiId={kpiId} />
    </div>
  );
};

export default IPie;
