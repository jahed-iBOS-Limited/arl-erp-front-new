import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import AttendanceReportViewForm from "./ViewForm";

export default function AttendaceReportViewModal({ data, show, onHide }) {
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
            View Attendance Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="example-modal-sizes-title-xl">
          <AttendanceReportViewForm data={data} />
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
