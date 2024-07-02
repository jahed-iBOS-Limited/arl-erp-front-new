import moment from "moment";
import React from "react";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";

const PrintHeader = ({ singleData }) => {
  const {
    id,
    layTimeTypeId,
    layTimeDate,
    // portAt,
    cargo,
    cargoQty,
    demurrageRate,
    despatchRate,
    loadingCommenced,
    loadingCompleted,
    loadingRate,
    notTendered,
    vesselArrived,
    timeAllowedForLoading,
    vesselName,
    voyageNo,
    loadUnloadRateSuffix,
    cargoUomSuffix,
  } = singleData || {};

  const portAtName = singleData?.portAt?.label || singleData?.portAt || "";
  const berthedPortCountry =
    singleData?.portAt?.berthedPortCountry ||
    singleData?.berthedPortCountry ||
    "";
  return (
    <div>
      {id ? (
        <h5 className="text-center">
          {portAtName
            ? `LAYTIME STATEMENT AT ${portAtName}${
                berthedPortCountry ? `, ${berthedPortCountry || ""}` : ""
              }`
            : ""}
        </h5>
      ) : null}
      <h6 className="text-right">{layTimeDate}</h6>
      <div className="row">
        <div style={{ width: "40%" }} className="col-lg-4">
          <h6>Name of Vessel:</h6>
          <h6>Vessel arrived:</h6>
          <h6>BERTHED/Port at:</h6>
          <h6>Cargo:</h6>
          <h6>NOR Tendered:</h6>
          <h6>{layTimeTypeId === 1 ? "Loading" : "Discharging"} Commenced:</h6>
          <h6> {layTimeTypeId === 1 ? "Loading" : "Discharging"} Completed:</h6>
          <br />
          <div className="d-flex justify-content-between">
            <div>
              <h6>Cargo Quantity :</h6>
              <h6> {layTimeTypeId === 1 ? "Loading" : "Discharging"} Rate:</h6>
              <h6>Demurrage Rate:</h6>
              <h6>Despatch Rate:</h6>
              <h6>
                Time allowed for{" "}
                {layTimeTypeId === 1 ? "Loading" : "Discharging"}
              </h6>
            </div>
            <div className="text-right">
              <h6>{cargoQty || "-"}</h6>
              <h6>{_formatMoney(loadingRate) || "-"}</h6>
              <h6>{_formatMoney(demurrageRate) || "-"}</h6>
              <h6>{_formatMoney(despatchRate) || "-"}</h6>
              <h6>{timeAllowedForLoading || "-"}</h6>
            </div>
          </div>
        </div>
        <div style={{ width: "60%" }} className="col-lg-8 border-left">
          <h6>{`${vesselName?.label} & V${voyageNo?.label}` || "-"}</h6>
          <h6>
            {moment(vesselArrived).format("DD-MMM-yyyy, HH:mm") || "-"} HRS LT
          </h6>
          <h6>
            {portAtName
              ? `${portAtName}${
                  berthedPortCountry ? `, ${berthedPortCountry || ""}` : ""
                }`
              : ""}
          </h6>
          <h6>{cargo?.label || "-"} IN BULK</h6>
          <h6>
            {" "}
            {moment(notTendered).format("DD-MMM-yyyy, HH:mm") || "-"} HRS LT
          </h6>
          <h6>
            {moment(loadingCommenced).format("DD-MMM-yyyy, HH:mm") || "-"} HRS
            LT
          </h6>
          <h6>
            {moment(loadingCompleted).format("DD-MMM-yyyy, HH:mm") || "-"} HRS
            LT
          </h6>
          <br />
          <h6>MTS {cargoUomSuffix && `| ${cargoUomSuffix}`}</h6>
          <h6>MTS {loadUnloadRateSuffix && `${loadUnloadRateSuffix}`}</h6>
          <h6>(USD) / PDPR</h6>
          <h6>(USD) / PDPR</h6>
          <h6>Days</h6>
        </div>
      </div>
    </div>
  );
};

export default PrintHeader;
