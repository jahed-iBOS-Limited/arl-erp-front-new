import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IExtend({ title, classes }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="cs-icon">{title || "Extend"}</Tooltip>}>
      <span>
        <i className={`fa fa-arrows-alt ${classes}`}></i>
      </span>
    </OverlayTrigger>
  );
}
