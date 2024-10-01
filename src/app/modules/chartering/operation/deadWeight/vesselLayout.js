import React from "react";
import HoldPartImage from "./images/hold.png";
import EngineImage from "./images/engine.png";
import BackPartImage from "./images/back.png";

const VesselLayout = ({ vesselData, values }) => {
  const styles = {
    vesselLayoutContainer: {
      display: "flex",
      justifyContent: "center", // Align items to the start to make them line up
      alignItems: "center",
      width: "100%",
      overflowX: "auto", // Add horizontal scrolling for smaller screens
      whiteSpace: "nowrap", // Prevent wrapping to new lines
    },
    vesselSection: {
      flex: "0 0 auto", // Prevent flex items from shrinking
      textAlign: "center",
      // padding: "10px",
    },
    image: {
      width: "100%",
      height: "auto",
      maxWidth: "150px", // Adjust this based on your design
    },
    holdNumber: {
      fontSize: "20px",
      fontWeight: "bold",
    },
    holdDescription: {
      margin: "10px 0",
      fontSize: "16px",
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
          <div style={styles.holdNumber}>
            {vesselData?.intHoldNumber - index}
          </div>
          {/* Hold Image */}
          <img
            src={HoldPartImage}
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
