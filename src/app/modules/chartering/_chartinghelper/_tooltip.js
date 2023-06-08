import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ITooltip({ content }) {
  return (
    <>
      <span className="ml-1">
        <OverlayTrigger
          overlay={<Tooltip className="mytooltip" id="info-tooltip"> {content()} </Tooltip>}
        >
          <i
            style={{ fontSize: "13.5px", color: "#000000" }}
            className="fa fa-info-circle pointer"
            aria-hidden="true"
          ></i>
        </OverlayTrigger>
      </span>
    </>
  );
}
