import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function ConfirmtionModal({
  show,
  handleClose,
  onYesAction,
  title,
  message,
}) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onYesAction}>
           Sure, Update
          </Button>
          <Button variant="success" onClick={() => handleClose(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
