import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const VoyageChecklistView = ({data}) => {
  return (
    <>
      <div className="voyageChecklistView px-4">
        <div className="marine-form-card-content row ">
          <div className="col-lg-4">
            <h6>Vessel Name: {data?.VesselName || "N/A"}</h6>
            <h6>Voyage No: {data?.VoyageNo || "N/A"}</h6>
            <h6>Load/Discharge Rate: N/A</h6>
            <h6>Load Port: {data?.StartPortName || "N/A"}</h6>
            <h6 style={{marginBottom: "0px"}}>Discharge Port: {data?.EndPortName || "N/A"}</h6>
          </div>
          <div className="col-lg-4">
            <h6>Charterers details: {data?.ChaterName || "N/A"}</h6>
            <h6>Laycan Date: {_dateFormatter(data?.LayCanDate) || "N/A"}</h6>
            <h6>CP Date: {_dateFormatter(data?.CpDate) || "N/A"}</h6>
            <h6>Commenced Date: {_dateFormatter(data?.VoyageStartDate) || "N/A"}</h6>
            <h6 style={{marginBottom: "0px"}}>Completed Date: {_dateFormatter(data?.VoyageEndDate)|| "N/A"}</h6>
          </div>
          <div className="col-lg-4">
            <h6>Broker details: N/A</h6>
            <h6>Demurrage/Dispatch: N/A</h6>
            <h6>Cargo: N/A</h6>
            <h6>Load Port agent details: N/A</h6>
            <h6 style={{marginBottom: "0px"}}>Discharge Port agent details: N/A</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoyageChecklistView;
