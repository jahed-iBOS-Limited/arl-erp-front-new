import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IDelete({remover, id, title }) {
  return (
    <div>
      <OverlayTrigger
        overlay={<Tooltip id="delete-icon">{title || "Delete"}</Tooltip>}
      >
        <span>
          <i
            onClick={() => remover && remover(id)}
            className="fa fa-lg fa-trash deleteBtn text-danger"
            aria-hidden="true"
          ></i>
        </span>
      </OverlayTrigger>
    </div>
  );
}
