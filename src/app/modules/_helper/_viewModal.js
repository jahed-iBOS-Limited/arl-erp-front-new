import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
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
  modelSize,
  isModalFooterActive = true,
  dialogClassName,
  backdrop
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
        size={modelSize ? modelSize : "xl"}
        aria-labelledby="example-modal-sizes-title-xl"
        dialogClassName={dialogClassName}
        backdrop={backdrop}
      >
        {isLoading && <ModalProgressBar variant="query" />}
        {isShow ? (
          <ISpinner isShow={isShow} />
        ) : (
          <>
            {" "}
            <Modal.Header className="bg-custom ">
              <Modal.Title className="text-center">{title}</Modal.Title>
            </Modal.Header>
            {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
            <Modal.Body id="example-modal-sizes-title-xl">
              {children}
            </Modal.Body>
            {isModalFooterActive && (
              <Modal.Footer>
                <div>
                  <button
                    type="button"
                    onClick={() => onHide()}
                    className="btn btn-light btn-elevate"
                  >
                    {btnText ? btnText : "Close"}
                  </button>
                  <> </>
                </div>
              </Modal.Footer>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
