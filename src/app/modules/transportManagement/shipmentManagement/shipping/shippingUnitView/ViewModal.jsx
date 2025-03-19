import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import ShippingPrint from "./shippingPrint";
export function ViewModal({ id, shipmentCode, show, onHide, history }) {
  const [isLoading, setLoading] = useState(true);
  const { state } = useLocation();
  useEffect(() => {
    // setShow(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="example-modal-sizes-title-xl"
      >
        {isLoading && <ModalProgressBar variant="query" />}

        <Modal.Body id="example-modal-sizes-title-xl">
          <ShippingPrint id={id} shipmentCode={shipmentCode} state={state} />
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => onHide()}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            <> </>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
