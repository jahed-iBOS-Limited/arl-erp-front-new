// import React from "react";
// import Logo from "./images/akijShippingText.png"; // Assuming you'll add the image for the logo
// import VesselLayout from "./vesselLayout";

// const VesselLayoutPDF = ({ vesselData, values }) => {
//   const styles = {
//     container: {
//       margin: "20px",
//       padding: "10px",
//       border: "1px solid #000",
//     },
//     header: {
//       textAlign: "center",
//       marginBottom: "20px",
//     },
//     logo: {
//       width: "150px",
//       marginBottom: "10px",
//     },
//     title: {
//       fontSize: "24px",
//       fontWeight: "bold",
//     },
//     subTitle: {
//       fontSize: "18px",
//       marginTop: "5px",
//     },
//     vesselSection: {
//       marginBottom: "20px",
//     },
//     remarks: {
//       marginTop: "20px",
//       borderTop: "1px solid #000",
//       paddingTop: "10px",
//       fontSize: "14px",
//     },
//     chiefOfficer: {
//       textAlign: "right",
//       marginTop: "20px",
//       fontWeight: "bold",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       {/* Top Section */}
//       <div style={styles.header}>
//         <img src={Logo} alt="Akij Shipping Line" style={styles.logo} />
//         <h2 style={styles.title}>CARGO PRE-STOWAGE PLAN</h2>
//         <p style={styles.subTitle}>MV. AKIJ WAVE</p>

//         <p>
//           <strong>Date:</strong> 21/07/2019 <br />
//           <strong>Cargo:</strong> Iron Ore in Bulk <br />
//           <strong>Total Cargo:</strong> 45,500 MT
//         </p>

//         <p>
//           <strong>Voy No:</strong> 059 <br />
//           <strong>Load Port:</strong> Paradip, India <br />
//           <strong>Discharge Port:</strong> Tianjin, China <br />
//           <strong>Departure Draft:</strong> Forward 11.59 m / Aft 11.63 m <br />
//           <strong>Sea Water Density:</strong> 1.025
//         </p>
//       </div>

//       {/* Middle Section - Vessel Layout */}
//       <div style={styles.vesselSection}>
//         <VesselLayout vesselData={vesselData} values={values} />
//       </div>

//       {/* Bottom Section */}
//       <div style={styles.remarks}>
//         <strong>Remarks: Subject to alter due to:</strong>
//         <ol>
//           <li>Trim & Stability</li>
//           <li>Loading manner of the stevedore</li>
//           <li>Actual stowage factor</li>
//           <li>Availability of cargo</li>
//         </ol>
//       </div>

//       {/* Chief Officer */}
//       <div style={styles.chiefOfficer}>
//         <p>CHIEF OFFICER</p>
//       </div>
//     </div>
//   );
// };

// export default VesselLayoutPDF;

import React from "react";
import FullLogo from "./images/akijShippingText.png"; // Replace with your logo image path
import VesselLayout from "./vesselLayout"; // Ensure this component is styled as needed
import moment from "moment";

const VesselLayoutPDF = ({ vesselData, values, vesselNominationData, holdRows }) => {

console.log("holdRows", holdRows)
const uniqueLoadPorts = [...new Set(holdRows.map(item => item.strPortName))];
const uniqueCargos = [...new Set(holdRows.map(item => item.strCargoName))];

  const styles = {
    container: {
      margin: "0 auto",
      padding: "20px",
      // border: "1px solid #000",
      fontFamily: "Arial, sans-serif",
      width: "100%", // Adjust width to match your layout
    },
    header: {
      textAlign: "left",
      marginBottom: "10px",
    },
    logo: {
      width: "100%",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "10px 0",
    },
    subTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      margin: "5px 0",
    },
    section: {
      marginBottom: "20px",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between", // Use "space-between" instead of "between"
    },
    remarks: {
      marginTop: "20px",
      //   borderTop: "1px solid #000",
      paddingTop: "10px",
      fontSize: "14px",
    },
    chiefOfficer: {
      textAlign: "right",
      marginTop: "20px",
      fontWeight: "bold",
    },
    cargoInfo: {
      marginTop: "10px",
      fontSize: "14px",
    },
    list: {
      paddingLeft: "0",
      margin: "0 0 0 40px",
    },
    listItem: {
      marginBottom: "5px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Top Section */}
      <div style={styles.header}>
        <div
          style={{
            width: "500px",
            objectFit: "contain",
          }}
        >
          <img src={FullLogo} alt="Akij Shipping Line" style={styles.logo} />
        </div>
        <p style={{}}>
          <strong style={{ display: "block" }}>198.AKIJ HOUSE, BIR UTTAM MIR SHAWKAT SARAK, TEJGAON, DHAKA 1208</strong>
          <strong style={{ display: "block" }}>Tel : +88-09613311783</strong>
          <strong style={{ display: "block" }}>E-mail: operation.asll@akij.net</strong>
        </p>
      </div>

      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <h3>CARGO PRE-STOWAGE PLAN</h3>
        <h5>M.V. {vesselNominationData?.strNameOfVessel || ""} </h5>
      </div>

      <div style={styles.section}>
        <p style={styles.cargoInfo}>
          <strong>Date:</strong> {moment().format("DD/MM/YYYY")} <br />
          {/* <strong>Cargo:</strong> {vesselNominationData?.strCargo} <br /> */}
          <strong>Cargo:</strong> {uniqueCargos?.join(', ')} <br />
          <strong>Total Cargo:</strong> {holdRows?.reduce((sum, item) => sum + (item.numCargoQuantity || 0), 0)} MT
        </p>
        <p style={styles.cargoInfo}>
          <strong>Voyage No:</strong> {vesselNominationData?.intVoyageNo} <br />
          {/* <strong>Load Port:</strong> {vesselNominationData?.strNameOfLoadPort} <br /> */}
          <strong>Load Port:</strong> {uniqueLoadPorts?.join(', ')} <br />
          <strong>Discharge Port:</strong> {vesselNominationData?.strDischargePort} <br />
          <strong>Departure Draft:</strong> Forward {vesselNominationData?.numDepatureDraftForward || 0} m / Aft {vesselNominationData?.numDepatureDraftAft || 0} m <br />
          <strong>Water Density:</strong> {values?.intDockWaterDensity}
        </p>
      </div>

      {/* Middle Section - Vessel Layout */}
      <div style={styles.vesselSection} className={`images_wrapper ${vesselData?.intHoldNumber < 7 ? "less_then_seven" : vesselData?.intHoldNumber === 7 ? "equal_seven" : "greater_then_seven"}`}>
        <VesselLayout vesselData={vesselData} values={values} holdRows={holdRows}/>
      </div>

      {/* Bottom Section */}
      <div style={styles.remarks}>
        <strong>Remarks: Subject to alter due to:</strong>
        <ol style={styles.list} type="1">
          <li style={styles.listItem}>Trim & Stability</li>
          <li style={styles.listItem}>Loading manner of the stevedore</li>
          <li style={styles.listItem}>Actual stowage factor</li>
          <li style={styles.listItem}>Availability of cargo</li>
        </ol>
      </div>

      {/* Chief Officer */}
      <div style={styles.chiefOfficer}>
        <p
          style={{
            display: "inline-block",
            borderTop: "1px solid #000",
            marginRight: "45px",
          }}
        >
          CHIEF OFFICER
        </p>
      </div>
    </div>
  );
};

export default VesselLayoutPDF;
