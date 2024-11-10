import React from "react";
import { Pie } from "@ant-design/charts";
import IHeart from "./../../_helper/_helperIcons/_heart";

const IPie = ({ isLoveHidden,itm }) => {
  const data = [
    {
      type: "Target",
      value: itm?.numTarget,
    },
    {
      type: "Actual",
      value: itm?.numAchivement,
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
      <Pie {...config} /> {!isLoveHidden && <IHeart />}
    </div>
  );
};

export default IPie;
