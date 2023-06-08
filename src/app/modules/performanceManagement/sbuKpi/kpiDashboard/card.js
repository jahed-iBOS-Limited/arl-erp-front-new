import React from "react";
import IDonut from "./../../_chart/IDonutChart";
import ISpeedoMeter from "./../../_chart/ISpeedoMeter";
import IHeart from "./../../../_helper/_helperIcons/_heart";
import ApexBarChart from "../../_chart/apexBarChart";
import { subStrString } from "../../_helper/subStrString";

function Card({ itm, updateIsShown }) {
  return (
    <>
      <div className="kpi_item_">
        <IHeart
          kpiId={itm.kpiId}
          updateIsShown={updateIsShown}
          isShown={true}
        />
        <div className="kpi_chart_title">
          <h6 className="text-center">
            <b> {subStrString(itm?.kpi, 50)} </b>
          </h6>
        </div>
        <div className="chart_">
          {itm.chart_type === 1 ? (
            <ApexBarChart itm={itm} />
          ) : itm.chart_type === 2 ? (
            <IDonut itm={itm} classes="donut" isLoveHidden={true} />
          ) : (
            <ISpeedoMeter itm={itm} isLoveHidden={true} />
          )}
        </div>
      </div>
    </>
  );
}
export default React.memo(Card);
