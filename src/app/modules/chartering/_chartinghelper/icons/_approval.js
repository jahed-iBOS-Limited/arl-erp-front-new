import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IApproval({ title, classes }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id="cs-icon">{title || "Complete"}</Tooltip>}
    >
      <span>
        <i className={`fas fa-check-circle pointer ${classes}`}></i>
      </span>
    </OverlayTrigger>
  );
}
