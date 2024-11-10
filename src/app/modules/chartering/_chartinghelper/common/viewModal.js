import React from "react";
import { Modal } from "react-bootstrap";
import ISpinner from "./../_spinner";
export default function IViewModal({
  id,
  show,
  onHide,
  history,
  isShow,
  children,
  title,
  btnText,
}) {
  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="example-modal-sizes-title-xl"
      >
        {isShow ? (
          <ISpinner isShow={isShow} />
        ) : (
          <>
            {" "}
            <Modal.Header className="bg-custom">
              <Modal.Title className="text-center">{title}</Modal.Title>
            </Modal.Header>
            {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
            <Modal.Body id="example-modal-sizes-title-xl">
              {children}
            </Modal.Body>
            <Modal.Footer>
              <div>
                <button
                  type="button"
                  onClick={() => onHide()}
                  className="btn btn-light btn-elevate"
                >
                  {btnText ? btnText : "Cancel"}
                </button>
                <> </>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}
