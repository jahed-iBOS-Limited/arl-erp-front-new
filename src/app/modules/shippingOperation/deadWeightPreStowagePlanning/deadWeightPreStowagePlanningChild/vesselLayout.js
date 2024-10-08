import React from "react";
import HoldPartImage from "./images/hold.png";
import ExtraPartImage from "./images/extra-hold.png";
import EngineImage from "./images/engine.png";
import BackPartImage from "./images/back.png";

const VesselLayout = ({ vesselData, values, holdRows }) => {
  const styles = {
    vesselLayoutContainer: {
      display: "flex",
      alignItems: "center",
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
      fontSize: "16px",
      fontWeight: "bold",
      position: "absolute",
      top: "145px",
      left: "90px",
    },
    holdDescription: {
      margin: "10px 0",
      fontSize: "10px",
      position: "absolute",
      bottom: "1px",
      left: "25px",
      maxWidth: "152px",
      textAlign: "justify",
    },
    emptyholdDescription: {
      margin: "10px 0",
      fontSize: "10px",
      position: "absolute",
      bottom: "12px",
      left: "100px",
      maxWidth: "152px",
      textAlign: "justify",
    },
  };

  // Function to get merged data for each hold
  const getHoldData = (holdNumber) => {
    const holdData = holdRows.filter((row) => row.numHoldId === holdNumber);

    if (holdData?.length === 0) return [];

    // Merge cargo names, sum quantities, and collect unique port names
    const mergedData = holdData.reduce(
      (acc, current) => {
        // Collect cargo names
        if (!acc.cargoNames.includes(current.strCargoName)) {
          acc.cargoNames.push(current.strCargoName);
        }

        // Sum the cargo quantities
        acc.totalQuantity += current.numCargoQuantity;

        // Collect unique port names
        if (!acc.portNames.includes(current.strPortName)) {
          acc.portNames.push(current.strPortName);
        }

        return acc;
      },
      { cargoNames: [], totalQuantity: 0, portNames: [] }
    );

    return mergedData;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={styles.vesselLayoutContainer}>
        {/* Static Engine Room Image */}
        <div style={styles.vesselSection}>
          <img
            src={EngineImage}
            alt="Engine Room"
            style={{ ...styles.image, marginTop: "5px" }}
          />
        </div>

        {/* Dynamic Hold Sections */}
        {Array.from({ length: vesselData?.intHoldNumber || 0 }, (_, index) => {
          const holdNumber = vesselData?.intHoldNumber - index;
          const holdData = getHoldData(holdNumber);
          return (
            <div style={styles.vesselSection} key={index}>
              {/* Hold Number */}
              <div style={styles.holdNumber} className="hold_number_label">
                {vesselData?.intHoldNumber - index}
              </div>
              {/* Hold Image */}

              {index === 0 ? (
                <>
                  <img
                    src={ExtraPartImage}
                    alt={`Hold ${vesselData?.intHoldNumber - index}`}
                    style={{
                      width: "100%",
                      height: "248px",
                      maxWidth: "200px",
                    }}
                  />
                </>
              ) : (
                <>
                  <img
                    src={HoldPartImage}
                    alt={`Hold ${vesselData?.intHoldNumber - index}`}
                    style={styles.image}
                  />
                </>
              )}

              {/* Dynamic Hold Description */}
              {holdData.cargoNames?.length > 0 ? (
                <div style={styles.holdDescription}>
                  <p style={{ margin: 0, padding: 0 }}>
                    {holdData.cargoNames.join(", ")}
                  </p>
                  <p>
                    {holdData.totalQuantity} MT
                    <br />
                    {holdData.portNames.join(", ")}
                  </p>
                </div>
              ) : (<div style={index === 0 ? {...styles.emptyholdDescription, left:"75px"} : styles.emptyholdDescription}>
                <p>
                  NIL
                </p>
              </div>)}
            </div>
          )
        })}

        {/* Static Front Section Image */}
        <div style={styles.vesselSection}>
          <img
            src={BackPartImage}
            alt="Front of Vessel"
            style={{
              width: "100%",
              height: "243px",
              maxWidth: "200px",
              marginTop: "5px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VesselLayout;
