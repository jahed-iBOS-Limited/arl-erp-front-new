import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IAdd({ title, classes }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Add Service"}</Tooltip>}>
      <span>
        <i className={`fas fa-plus-square pointer ${classes}`}></i>
      </span>
    </OverlayTrigger>
  );
}