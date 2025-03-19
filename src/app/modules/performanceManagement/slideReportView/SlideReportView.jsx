import React, { useState, useEffect } from "react";
import { _dateFormatter } from "../../_helper/_dateFormate";
import "./slideReportView.css";

// this report table is used from four place,
// individual kpi, sbu kpi, department kpi, corporate kpi
export default function SlideReportView({ heading, currentItem, newData }) {
  const [index, setIndex] = useState("");
  const [datas, setDatas] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    setIndex(currentItem.index);
    setDatas(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  let colorArr = ["#a6a6a6", "#ffd966"];

  const handleArrowRight = () => {
    // right arrow key
    if (datas[index + 1]) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }

    if (colorArr[colorIndex + 1]) {
      setColorIndex(colorIndex + 1);
    } else {
      setColorIndex(0);
    }
  };

  const handleArrowLeft = () => {
    // left arrow key
    if (datas[index - 1]) {
      setIndex(index - 1);
    } else {
      setIndex(datas.length - 1);
    }
    if (colorArr[colorIndex - 1]) {
      setColorIndex(colorIndex - 1);
    } else {
      setColorIndex(colorArr.length - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 37) {
      handleArrowLeft();
    }
    if (e.keyCode === 39) {
      handleArrowRight();
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, colorIndex]);

  return (
    <>
      <div className="pms-report-view pms-slider-report-view">
        {/* title */}
        <div className="pms-report-view-head">{heading}</div>

        {/* body */}
        <div className="pms-report-view-box pms-slider-report-view-box">
          {/* content */}
          <div className="pms-slider-report-view-box-content">
            <div className="row">
              <div className="col-lg-3">
                <div className="single-pms-slider-report-item">
                  <div className="single-pms-slider-report-item-head color-one">
                    <h2 className="title">Project Name</h2>
                  </div>
                  <div className="single-pms-slider-report-item-card border-one bg-one">
                    <span>{datas[index]?.particularsName || "-"}</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="single-pms-slider-report-item">
                  <div className="single-pms-slider-report-item-head color-two">
                    <h2 className="title">Start Date</h2>
                  </div>
                  <div className="single-pms-slider-report-item-card border-two bg-two">
                    {_dateFormatter(datas[index]?.startDate) || "-"}
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="single-pms-slider-report-item">
                  <div className="single-pms-slider-report-item-head color-three">
                    <h2 className="title">Comletion Date</h2>
                  </div>
                </div>
                <div className="single-pms-slider-report-item-card border-three  bg-three">
                  {_dateFormatter(datas[index]?.endDate) || "-"}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="single-pms-slider-report-item">
                  <div className="single-pms-slider-report-item-head color-four">
                    <h2 className="title">Progress Start</h2>
                  </div>
                </div>
                <div className="single-pms-slider-report-item-card border-four bg-four">
                  {datas[index]?.statusValueLabel?.label || "-"}
                </div>
              </div>
            </div>
          </div>
          {/* remarks */}
          <div className="pms-slider-report-view-footer">
            <div className="remarks">
              <h2>Remarks : {datas[index]?.comment || ""} </h2>
            </div>
            <div className="pms-report-view-direction pms-slider-report-view-direction">
              <div
                onClick={() => handleArrowLeft()}
                className="right-direction"
              ></div>
              <div
                onClick={() => handleArrowRight()}
                className="left-direction"
              ></div>
            </div>
            {/* <div className="pms-report-view-pagination pms-slider-report-view-pagination">
            {index + 1} / {datas.length}
          </div> */}
          </div>
        </div>
      </div>
      <div className="pms-report-view-pagination pms-slider-report-view-pagination">
        {index + 1} / {datas.length}
      </div>
    </>
  );
}
