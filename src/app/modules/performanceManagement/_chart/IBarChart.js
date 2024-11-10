import React from "react";
import { Column } from "@ant-design/charts";
import IHeart from "./../../_helper/_helperIcons/_heart";

const Chart = ({ classes, isLoveHidden, itm }) => {
  const data = [
    {
      action: "Target",
      pv: parseFloat(itm?.numTarget),
    },
    {
      action: "Actual",
      pv: parseFloat(itm?.numAchivement) ,
    },
  ];
  const config = {
    forceFit: true,
    data,
    padding: "0",
    xField: "action",
    yField: "pv",
    className: classes || "bar",
    labelEmit: false,
    conversionTag: { visible: true },
  };
  return (
    <div className="d-flex justify-content-center">
      <Column {...config} /> {!isLoveHidden && <IHeart />}
    </div>
  );
};

export default Chart;
