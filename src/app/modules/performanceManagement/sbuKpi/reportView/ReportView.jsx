import React, { useState, useEffect } from "react";
import "./reportView.css";

// this report table is used from four place,
// individual kpi, sbu kpi, department kpi, corporate kpi
export default function ReportView({
  heading,
  currentItem,
  newData,
  from,
  to,
  year,
}) {
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
    <div className="pms-report-view">
      <div className="pms-report-view-head">{heading}</div>
      <h6 className="pms-report-view-frequency">
        {datas[index]?.strFrequency} ({from?.label} - {to?.label} ,{" "}
        {year?.label})
      </h6>
      <div class="pms-report-view-box">
        <div className="pms-report-view-sub-title">{datas[index]?.heading}</div>
        <div
          className="pms-report-view-objective-kpi"
          style={{
            // background: `${colorArr[colorIndex]}`,
            border: `1px solid ${colorArr[colorIndex]}`,
          }}
        >
          <div className="pms-report-view-objective">
            {datas[index]?.objective}
          </div>
          <div className="pms-report-view-kpi">{datas[index]?.kpi}</div>
        </div>

        <div className="pms-report-view-card">
          <div className="pms-report-view-single-card">
            <div
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                background: "rgb(167, 193, 228)",
                height: "100px",
                width: "180px",
              }}
            >
              <h2>Target</h2>
              <h1>{datas[index]?.numTarget || 0}</h1>
            </div>
            <div
              style={{
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                background: "#66FFFF",
                height: "100px",
                width: "180px",
              }}
            >
              <h2>Previous Target</h2>
              <h1>{datas[index]?.previousYearTarget || 0}</h1>
            </div>
          </div>
          <div className="pms-report-view-single-card">
            <div
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                background: "rgb(167, 193, 228)",
                height: "100px",
                width: "180px",
              }}
            >
              <h2>Achievement</h2>
              <h1>{datas[index]?.numAchivement || 0}</h1>
            </div>
            <div
              style={{
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                background: "#66FFFF",
                height: "100px",
                width: "180px",
              }}
            >
              <h2>Previous Achievement</h2>
              <h1>{datas[index]?.previousYearAchivement || 0}</h1>
            </div>
          </div>
          <div className="pms-report-view-single-card">
            <div
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                background: "rgb(167, 193, 228)",
                height: "100px",
                width: "180px",
              }}
            >
              <h2>Progress</h2>

              <h1>
                {datas[index]?.intMaxMin === 1
                  ? (
                      ((datas[index]?.numAchivement || 0) /
                        (datas[index]?.numTarget || 0)) *
                      100
                    ).toFixed(2)
                  : (
                      ((datas[index]?.numTarget || 0) /
                        (datas[index]?.numAchivement || 0)) *
                      100
                    ).toFixed(2)} %
              </h1>
            </div>
            <div
              style={{
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                background: "#66FFFF",
                height: "100px",
                width: "180px",
              }}
            >
              <h2>Previous Year Progress</h2>
              <h1>
                {datas[index]?.intMaxMin === 1
                  ? (
                      ((datas[index]?.previousYearAchivement || 0) /
                        (datas[index]?.previousYearTarget || 0)) *
                      100
                    ).toFixed(2)
                  : (
                      ((datas[index]?.previousYearTarget || 0) /
                        (datas[index]?.previousYearAchivement || 0)) *
                      100
                    ).toFixed(2)} %
              </h1>
            </div>
          </div>
        </div>

        <div className="remarks">
          <h2>Remarks : </h2>
          {datas[index]?.remarks}
        </div>

        <div className="pms-report-view-pagination">
          {index + 1} / {datas.length}
        </div>
        <div className="pms-report-view-direction">
          <span onClick={() => handleArrowLeft()} className="mr-5 pointer">
            <i className="fas fa-angle-left"></i>
          </span>
          <span onClick={() => handleArrowRight()} className="pointer">
            <i className="fas fa-angle-right"></i>
          </span>
        </div>
      </div>
    </div>
  );
}
