import React from "react";
import BackPartImage from "./images/back.png";
import EngineImage from "./images/engine.png";

const VesselLayout = ({ vesselData, values, holdRows }) => {
  // const styles = {
  //   vesselLayoutContainer: {
  //     display: "flex",
  //     alignItems: "center",
  //     overflowX: "auto",
  //     whiteSpace: "nowrap",
  //   },
  //   vesselSection: {
  //     flex: "0 0 auto",
  //     textAlign: "center",
  //     // padding: "10px",
  //     position: "relative",
  //   },
  //   image: {
  //     width: "100%",
  //     height: "auto",
  //     maxWidth: "200px",
  //   },
  //   holdNumber: {
  //     fontSize: "16px",
  //     fontWeight: "bold",
  //     position: "absolute",
  //     top: "145px",
  //     left: "90px",
  //   },
  //   holdDescription: {
  //     margin: "10px 0",
  //     fontSize: "10px",
  //     position: "absolute",
  //     bottom: "1px",
  //     left: "25px",
  //     maxWidth: "152px",
  //     textAlign: "justify",
  //   },
  //   emptyholdDescription: {
  //     margin: "10px 0",
  //     fontSize: "10px",
  //     position: "absolute",
  //     bottom: "12px",
  //     left: "100px",
  //     maxWidth: "152px",
  //     textAlign: "justify",
  //   },
  // };

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
      <div className="vessel_wrapper">
        {/* Static Engine Room Image */}
        <div className="vessel_part vessel_back">
          <div className="img_wrapper">
            <img src={EngineImage} alt="Engine Room" />
          </div>
        </div>

        <div className="vessel_hold_wrapper">
          {/* Dynamic Hold Sections */}
          {Array.from({ length: vesselData?.intHoldNumber || 0 }, (_, index) => {
            const holdNumber = vesselData?.intHoldNumber - index;
            const holdData = getHoldData(holdNumber);
            return (
              <div key={index} className="vessel_part vessel_hold">
                {/* Hold Number */}
                <div className="hold_number_label">{vesselData?.intHoldNumber - index}</div>
                {/* Hold Image */}

                {/* {index === 0 ? (
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
              )} */}

                {/* Dynamic Hold Description */}
                <div className="hold_box">
                  {holdData.cargoNames?.length > 0 ? (
                    <>
                      <p>{holdData.cargoNames.join(", ")}</p>
                      <p>{holdData.totalQuantity} MT</p>
                      <p> {holdData.portNames.join(", ")}</p>
                    </>
                  ) : (
                    <p>NIL</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Static Front Section Image */}
        <div className="vessel_part vessel_front">
          <div className="img_wrapper">
            <img src={BackPartImage} alt="Front of Vessel" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselLayout;
