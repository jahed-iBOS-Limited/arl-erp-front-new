/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import ApexBarChart from "../../_chart/apexBarChart";
import IDonut from "./../../_chart/IDonutChart";
import ISpeedoMeter from "./../../_chart/ISpeedoMeter";
import IHeart from "./../../../_helper/_helperIcons/_heart";
import { subStrString } from "../../_helper/subStrString";

function Card({ itm, updateIsShown }) {
  return (
    <>
      <div className="kpi_item_">
        <div>
          <IHeart
            kpiId={itm.kpiId}
            updateIsShown={updateIsShown}
            isShown={true}
          />
          
          <a
            style={{ position: "absolute", right: "10px", top: "9px" }}
            className="ml-3"
            href={`${itm?.strURL}`}
            target="_blank"
          >
            <i
              className={
                itm?.strURL ? "fas fa-link text-primary" : "fas fa-link"
              }
            ></i>
          </a>
        </div>

        <div className="kpi_chart_title">
          <h6 className="text-center">
            <b> {subStrString(itm?.kpi, 50)} </b>
          </h6>
        </div>
        <div className="chart_">
          {itm.chart_type === 1 ? (
            // <IBarChart itm={itm} isLoveHidden={true} />
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
