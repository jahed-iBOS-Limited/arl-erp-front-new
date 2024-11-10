import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IQuotation({ title }) {
  return (
    <OverlayTrigger
      overlay={<Tooltip id="cs-icon">{title || "Quotation"}</Tooltip>}
    >
      <span>
        <i className="fas fa-angle-double-right"></i>
      </span>
    </OverlayTrigger>
  );
}
