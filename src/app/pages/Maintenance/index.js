import React from "react";
import maintenanceImage from "./maintenance.png";

function Maintenance() {
  return (
    <div className="maintenanceImage d-flex justify-content-center align-items-center vh-100">
      <img src={maintenanceImage} alt="Maintenance" />
    </div>
  );
}

export default Maintenance;
