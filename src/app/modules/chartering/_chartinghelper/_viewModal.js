/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ISpinner from "./_spinner";
export default function IViewModal({
  id,
  show,
  onHide,
  history,
  isShow,
  children,
  title,
  btnText,
  size,
}) {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    // setShow(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size={size ? size : "xl"}
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
            <Modal.Footer style={{ padding: ".5rem" }}>
              <div>
                <button
                  type="button"
                  onClick={() => onHide()}
                  className="btn btn-danger px-3 py-2"
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
