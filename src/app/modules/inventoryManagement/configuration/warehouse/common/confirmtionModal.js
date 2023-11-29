import React from "react";
import { Button, Modal } from "react-bootstrap";

export default function ConfirmtionModal({ show, handleClose, title, body }) {
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleClose(false)}>
            No
          </Button>
          <Button variant="success" onClick={() => handleClose(true)}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
