import { DoubleArrow } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import VectorImg from "./vector.png";
import ArrowIcon from "./arrow.png";
import "./kpisorecardStyles.css";
import { useSelector } from "react-redux";
const KPIScoreCard = () => {
  const [index, setIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const { currentItem, newData, heading, from, to, year } = useSelector(
    (state) => state?.localStorage?.KPIScoreData
  );

  useEffect(() => {
    setIndex(currentItem?.index);
  }, [currentItem]);
  let colorArr = ["#a6a6a6", "#ffd966"];

  const handleArrowRight = () => {
    // right arrow key
    if (newData[index + 1]) {
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
    if (newData[index - 1]) {
      setIndex(index - 1);
    } else {
      setIndex(newData?.length - 1);
    }
    if (colorArr[colorIndex - 1]) {
      setColorIndex(colorIndex - 1);
    } else {
      setColorIndex(colorArr.length - 1);
    }
  };

  return (
    <div className="individual-kpi-report-wrapper">
      <div className="individual-kpi-report-container">
        <div className="individual-kpi-report-header">
          <h2>{heading}</h2>
          <p>
            {newData[index]?.strFrequency} ({from?.label} - {to?.label},{" "}
            {year?.label})
          </p>
        </div>
        <div className="individual-kpi-report-body">
          <div className="button-container-grid row">
            <div className="col-md-2 button">
              <p style={{ marginRight: "1rem" }}>
                <DoubleArrow />
              </p>
              <p style={{ fontSize: "1.3rem" }}>Process</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-11 scorecard-container">
              <div className="scorecard-grid">
                <div className="scorecard">
                  <div className="scorecard-heading">
                    <div className="scorecard-title">
                      <p>Objective</p>
                    </div>
                    <img className="vector-img" src={VectorImg} alt="vector" />
                  </div>
                  <div className="scorecard-body-container">
                    <div className="scorecard-body">
                      {newData[index]?.objective}
                    </div>
                  </div>
                </div>
                <div className="scorecard">
                  <div className="scorecard-heading">
                    <div className="scorecard-title">
                      <p>KPI</p>
                    </div>
                    <img className="vector-img" src={VectorImg} alt="vector" />
                  </div>{" "}
                  <div className="scorecard-body-container">
                    <div className="scorecard-body">{newData[index]?.kpi}</div>
                  </div>
                </div>
                <div className="scorecard">
                  <div className="scorecard-heading">
                    <div className="scorecard-title">
                      <p>SRF</p>
                    </div>
                    <img className="vector-img" src={VectorImg} alt="vector" />
                  </div>
                  <div className="scorecard-body-container">
                    <div className="scorecard-body">
                      {newData[index]?.strFrequency}
                    </div>
                  </div>
                </div>
                <div className="scorecard">
                  <div className="scorecard-heading">
                    <div className="scorecard-title">
                      <p>Target</p>
                    </div>
                    <img className="vector-img" src={VectorImg} alt="vector" />
                  </div>
                  <div className="scorecard-body-container">
                    <div className="scorecard-body">
                      {newData[index]?.numTarget || 0}
                    </div>
                  </div>
                </div>
                <div className="scorecard">
                  <div className="scorecard-heading">
                    <div className="scorecard-title">
                      <p>Achievement</p>
                    </div>
                    <img className="vector-img" src={VectorImg} alt="vector" />
                  </div>
                  <div className="scorecard-body-container">
                    <div className="scorecard-body">
                      {newData[index]?.numAchivement || 0}
                    </div>
                  </div>
                </div>
                <div className="scorecard">
                  <div className="scorecard-heading">
                    <div className="scorecard-title">
                      <p>Progress</p>
                    </div>
                    <img className="vector-img" src={VectorImg} alt="vector" />
                  </div>
                  <div className="scorecard-body-container">
                    <div className="scorecard-body">
                      {newData[index]?.numAchivement === 0 &&
                      newData[index]?.numTarget === 0
                        ? 0
                        : newData[index]?.intMaxMin === 1
                        ? (
                            (newData[index]?.numAchivement * 100) /
                            newData[index]?.numTarget
                          ).toFixed(2)
                        : (
                            (newData[index]?.numTarget * 100) /
                            newData[index]?.numAchivement
                          ).toFixed(2)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-1 position-relative">
              <div className="position-absolute navigate-action-container">
                <div
                  style={{
                    marginBottom: "1rem",
                    textAlign: "center",
                    color: "#1D2939",
                    fontWeight: 500,
                    fontSize: "1.1rem",
                  }}
                >
                  {index + 1} / {newData?.length}
                </div>
                <div
                  className="arrow arrowUp"
                  onClick={() => handleArrowLeft()}
                >
                  <img src={ArrowIcon} alt="arrow" />
                </div>
                <div
                  className="arrow arrowDown"
                  onClick={() => handleArrowRight()}
                >
                  <img src={ArrowIcon} alt="arrow" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 row">
            <div
              className="col-md-11"
              style={{ backgroundColor: "#FFFAE6", padding: "1.5rem" }}
            >
              <h2
                style={{
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "#344054",
                }}
              >
                REMARKS
              </h2>
              <p
                style={{
                  fontWeight: 400,
                  color: "#172B4D",
                  fontSize: "1.1rem",
                  marginTop: "1.3rem",
                }}
              >
                A remark is usually a casual and passing expression of opinion:
                a remark about a play. A comment expresses judgment or explains
                a particular.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIScoreCard;
