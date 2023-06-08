import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import LoanRescheduleReportViewForm from "./ViewForm";

export default function ViewModalPayrollDetails({ data, show, onHide }) {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    // setShow(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
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

        <Modal.Header>
          <Modal.Title className="mt-3">
            Employee Payroll Report Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="example-modal-sizes-title-xl">
          <LoanRescheduleReportViewForm data={data} />
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
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
