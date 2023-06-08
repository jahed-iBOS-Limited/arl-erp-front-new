import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function ICheckout({ checkout, id, title }) {
  return (
    <div>
      <OverlayTrigger
        overlay={<Tooltip id="checkout-icon">{title || "Checkout"}</Tooltip>}
      >
        <span>
          <i
            onClick={() => checkout && checkout(id)}
            className="fa fa-check-circle checkoutBtn"
            aria-hidden="true"
            style={{color: '#3699ff'}}
          ></i>
        </span>
      </OverlayTrigger>
    </div>
  );
}
