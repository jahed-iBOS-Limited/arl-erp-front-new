import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import ProductionEntryViewForm from "./ViewForm";

export default function BackCalculationPEViewModal({ data, show, onHide }) {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);
  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="example-modal-sizes-title-xl"
        size="xl"
      >
        {isLoading && <ModalProgressBar variant="query" />}
        <Modal.Header>
          <Modal.Title className="mt-3">View Production Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body id="example-modal-sizes-title-xl">
          <ProductionEntryViewForm data={data} />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={() => onHide()}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
