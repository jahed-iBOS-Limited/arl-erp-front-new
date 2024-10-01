import React from "react";
import HoldPartImage from "./images/hold.png";
import ExtraPartImage from "./images/extra-hold.png";
import EngineImage from "./images/engine.png";
import BackPartImage from "./images/back.png";

const VesselLayout = ({ vesselData, values }) => {
  const styles = {
    vesselLayoutContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      overflowX: "auto",
      whiteSpace: "nowrap",
    },
    vesselSection: {
      flex: "0 0 auto",
      textAlign: "center",
      // padding: "10px",
      position: "relative",
    },
    image: {
      width: "100%",
      height: "auto",
      maxWidth: "200px",
    },
    holdNumber: {
      fontSize: "20px",
      fontWeight: "bold",
      position: "absolute",
      top: "145px",
      left: "80px",
    },
    holdDescription: {
      margin: "10px 0",
      fontSize: "16px",
      position: "absolute",
      bottom: "25px",
      left: "22px",
      maxWidth: "152px",
      textAlign: "justify",
    },
  };

  return (
    <div style={styles.vesselLayoutContainer}>
      {/* Static Engine Room Image */}
      <div style={styles.vesselSection}>
        <img src={EngineImage} alt="Engine Room" style={styles.image} />
      </div>

      {/* Dynamic Hold Sections */}
      {Array.from({ length: vesselData?.intHoldNumber || 0 }, (_, index) => (
        <div style={styles.vesselSection} key={index}>
          {/* Hold Number */}
          <div
            style={
              index === 0
                ? { ...styles.holdNumber, top: "180px" }
                : styles.holdNumber
            }
          >
            {vesselData?.intHoldNumber - index}
          </div>
          {/* Hold Image */}
          <img
            src={index === 0 ? ExtraPartImage : HoldPartImage}
            alt={`Hold ${vesselData?.intHoldNumber - index}`}
            style={styles.image}
          />
          {/* Dynamic Hold Description */}
          <div style={styles.holdDescription}>
            IRON ORE {values?.[`numHold${vesselData?.intHoldNumber - index}`]}{" "}
            MT
          </div>
        </div>
      ))}

      {/* Static Front Section Image */}
      <div style={styles.vesselSection}>
        <img src={BackPartImage} alt="Front of Vessel" style={styles.image} />
      </div>
    </div>
  );
};

export default VesselLayout;
