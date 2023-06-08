import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ICs({ title }) {
  return (
    <OverlayTrigger
      overlay={
        <Tooltip id="cs-icon">{title || "Comparative Statement"}</Tooltip>
      }
    >
      <span>
        <i className="fa fa-question" aria-hidden="true"></i>
      </span>
    </OverlayTrigger>
  );
}
