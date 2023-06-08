import { toArray } from "lodash";
import React, { useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { toast } from "react-toastify";
import IHeart from "../../_helper/_helperIcons/_heart";

export default function ISpeedoMeter({isShown, kpiId, updateIsShown}) {
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

  const customDiv = {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  };

  console.log(percent);
  console.log(percentArr);

  return (
    // <div className="mt-5">
    //   <div className="d-flex flex-column">
    //     <div style={customDiv}>
    //       <input
    //         type="color"
    //         value={color.colorOne}
    //         name="colorOne"
    //         onChange={(e) => setColor({ ...color, colorOne: e.target.value })}
    //       />
    //       <input
    //         name="firstPercent"
    //         onChange={(e) =>
    //           setPercent({ ...percent, firstPercent: e.target.value })
    //         }
    //         value={firstPercent}
    //         className="ml-2"
    //         type="number"
    //       />
    //     </div>
    //     <div style={customDiv}>
    //       <input
    //         type="color"
    //         name="colorTwo"
    //         value={color.colorTwo}
    //         onChange={(e) => setColor({ ...color, colorTwo: e.target.value })}
    //       />
    //       <input
    //         name="secondPercent"
    //         onChange={(e) =>
    //           setPercent({ ...percent, secondPercent: e.target.value })
    //         }
    //         value={secondPercent}
    //         className="ml-2"
    //         type="number"
    //       />
    //     </div>
    //     <div style={customDiv}>
    //       <input
    //         type="color"
    //         name="colorThree"
    //         value={color.colorThree}
    //         onChange={(e) => setColor({ ...color, colorThree: e.target.value })}
    //       />
    //       <input
    //         name="thirdPercent"
    //         onChange={(e) =>
    //           setPercent({ ...percent, thirdPercent: e.target.value })
    //         }
    //         value={thirdPercent}
    //         className="ml-2"
    //         type="number"
    //       />
    //       <button
    //         style={{ padding: "6px 8px", border: "none" }}
    //         onClick={percentHandler}
    //         className="ml-2 btn btn-primary"
    //       >
    //         Apply
    //       </button>
    //     </div>
    //   </div>

    // </div>
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
          value={(7500 * 100) / 8000}
          ringWidth={45}
          segmentColors={toArray(color)}
          needleColor="#C5283D"
          needleTransitionDuration={2000}
          needleTransition={"easeBounceOut"}
          width={170}
          height={120}
          // fluidWidth={true}
          dimensionUnit={"px"}
        />
        <IHeart updateIsShown={updateIsShown} isShown={isShown} kpiId={kpiId} />
      </div>
    )
  );
}
