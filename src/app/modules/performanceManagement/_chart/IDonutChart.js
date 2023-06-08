import React from "react";
import { Pie } from "@ant-design/charts";
import IHeart from "./../../_helper/_helperIcons/_heart";

const IDonut = ({ classes, isLoveHidden, itm }) => {
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
    appendPadding: 10,
    height: 250,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.6,
    innerRadius: 0.4,
    label: {
      type: "inner",
      offset: "-25",
      content: "{percentage}",
      style: {
        fill: "#000",
        fontSize: 10,
        fontWeight: 400,
        textAlign: "center",
      },
    },
    legend: {
      layout: "horizontal",
      position: "right",
      style: {
        color: "red",
        background: "red",
      },
    },
    statistic: {
      title: false,
      content: { formatter: (i, t, v, c) => console.log({ i, t, v, c }) },
    },
    className: classes || "bar",

    contentHeight: 10,
  };
  return (
    <div className="d-flex justify-content-center">
      <Pie hasLegend={false} {...config} /> {!isLoveHidden && <IHeart />}
    </div>
  );
};

export default IDonut;
