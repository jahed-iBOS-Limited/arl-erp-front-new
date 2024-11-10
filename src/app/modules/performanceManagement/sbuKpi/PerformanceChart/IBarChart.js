import React from "react";
import { Column } from "@ant-design/charts";
import IHeart from "../../../../_helper/_helperIcons/_heart";

const Chart = ({isShown, kpiId, updateIsShown}) => {
  const data = [
    {
      action: "Target",
      pv: 50000,
    },
    {
      action: "Actual",
      pv: 35000,
    },
  ];
  const config = {
    forceFit: true,
    data,
    padding: "0",
    xField: "action",
    yField: "pv",
    className: "bar",
    labelEmit: false,
    conversionTag: { visible: true },
  };
  return (
    <div className="d-flex justify-content-center">
      <Column {...config} /> <IHeart updateIsShown={updateIsShown} isShown={isShown} kpiId={kpiId} />
    </div>
  );
};

export default Chart;
