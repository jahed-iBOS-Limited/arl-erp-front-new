import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IApproval({ title, classes, onClick }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id="cs-icon">{title || "Complete"}</Tooltip>}
    >
      <span onClick={onClick}>
        <i className={`fas fa-check-circle pointer ${classes}`}></i>
      </span>
    </OverlayTrigger>
  );
}
