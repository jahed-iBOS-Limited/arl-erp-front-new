import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IClose({ closer, id, title }) {
  return (
    <div>
      <OverlayTrigger
        overlay={<Tooltip id="close-icon">{title || "Close"}</Tooltip>}
      >
        <span>
          <i
            onClick={() => closer && closer(id)}
            className="fa fa-times-circle closeBtn cursor-pointer"
            aria-hidden="true"
          ></i>
        </span>
      </OverlayTrigger>
    </div>
  );
}
