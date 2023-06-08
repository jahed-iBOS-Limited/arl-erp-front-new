import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function InfoCircle({ title, clickHandler, classes }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Info Details"}</Tooltip>}>
      <span onClick={() => clickHandler()}>
        <i className={`fas pointer fa-info-circle ${classes}`} aria-hidden="true"></i>
      </span>
    </OverlayTrigger>
  );
}
