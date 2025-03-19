import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IUpdate({ title, classes }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Update"}</Tooltip>}>
      <span>
        <i className={`fas fa-edit pointer ${classes}`}></i>
      </span>
    </OverlayTrigger>
  );
}