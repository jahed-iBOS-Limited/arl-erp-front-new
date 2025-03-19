/* eslint-disable no-unused-vars */
import { isNaN, toArray } from "lodash";
import React, { useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { toast } from "react-toastify";
import IHeart from "./../../_helper/_helperIcons/_heart";

export default function ISpeedoMeter({ isLoveHidden, itm }) {
  const [color, setColor] = useState({
    colorOne: "#f39c12",
    colorTwo: "#bdc3c7",
    colorThree: "#7f8c8d",
  });
  const [percentArr, setPercentArr] = useState([0, 22, 62, 100]);
  const [percent, setPercent] = useState({
    firstPercent: 20,
    secondPercent: 50,
    thirdPercent: 30,
  });
  const { firstPercent, secondPercent, thirdPercent } = percent;

  const percentHandler = () => {
    if (!firstPercent || !secondPercent || !thirdPercent) {
      toast.warn("All field is required", { toastId: "prfmChart" });
    } else {
      if (!(+firstPercent + +secondPercent + +thirdPercent === 100)) {
        toast.warn("Total must be 100", { toastId: "prfmChart" });
      } else {
        let arr = [];
        arr[0] = 0;
        arr[1] = +firstPercent;
        arr[2] = +firstPercent + +secondPercent || 100 - +thirdPercent;
        arr[3] = 100;
        setPercentArr([...arr]);
      }
    }
  };

  return (
    toArray(color).length > 0 && (
      <div className="d-flex justify-content-around">
        <ReactSpeedometer
          forceRender={true}
          needleHeightRatio={0.7}
          customSegmentStops={percentArr}
          maxSegmentLabels={5}
          segments={2}
          textColor={"black"}
          maxValue={100}
          value={
            (itm?.numAchivement * 100) / itm?.numTarget > 100
              ? 100
              : isNaN((itm?.numAchivement * 100) / itm?.numTarget)
              ? 0
              : ((itm?.numAchivement * 100) / itm?.numTarget).toFixed(2)
          }
          ringWidth={45}
          segmentColors={toArray(color)}
          needleColor="#C5283D"
          needleTransitionDuration={2000}
          needleTransition={"easeBounceOut"}
          width={170}
          height={120}
          dimensionUnit={"px"}
        />
        {!isLoveHidden && <IHeart />}
      </div>
    )
  );
}
