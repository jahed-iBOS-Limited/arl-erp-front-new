import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function IDelete({ remover, id, title, style }) {
  return (
    <div>
      <OverlayTrigger
        overlay={<Tooltip id="delete-icon">{title || "Delete"}</Tooltip>}
      >
        <span>
          <i
           style={style}
            onClick={() => remover && remover(id)}
            className="fa fa-trash deleteBtn text-danger"
            aria-hidden="true"
          ></i>
        </span>
      </OverlayTrigger>
    </div>
  );
}
