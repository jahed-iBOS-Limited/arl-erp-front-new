import React from "react";
import IHeart from "../../../../app/modules/_helper/_helperIcons/_heart";
import IDonut from "../../../../app/modules/performanceManagement/_chart/IDonutChart";
import ISpeedoMeter from "../../../../app/modules/performanceManagement/_chart/ISpeedoMeter";
import ApexBarChart from "../../../../app/modules/performanceManagement/_chart/apexBarChart";
function Card({ itm, updateIsShown }) {


  const subStrString = (str, maxLength) => {
    let newStr;
    if(str.length > maxLength){
      newStr = `${str.substr(0, maxLength)}...`
    }else{
      newStr = str;
    }
    return newStr;
  }


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
            // <IBarChart isLoveHidden={true} />
            <ApexBarChart itm={itm} />
          ) : itm.chart_type === 2 ? (
            <IDonut classes="donut" isLoveHidden={true}  itm={itm}/>
          ) : (
            <ISpeedoMeter isLoveHidden={true} itm={itm} />
          )}
        </div>
      </div>
    </>
  );
}
export default React.memo(Card);
