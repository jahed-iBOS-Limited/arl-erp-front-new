import React from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import ISpinner from "./_spinner";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getMultipleFileViewEmpty } from "./_redux/Actions";
import { getDownlloadFileView_Action } from "./_redux/Actions";
import { APIUrl } from "../../App";
import printIcon from "../_helper/images/printIcon.svg";
const MultipleAttachmentViewer = ({ isShow, btnText }) => {
  const multipleImageView = useSelector((state) => {
    return state?.commonDDL?.multipleImageView;
  }, shallowEqual);
  const dispatch = useDispatch();

  return (
    <>
      <div className="viewModal">
        <Modal
          show={multipleImageView?.model}
          onHide={() => {
            dispatch(getMultipleFileViewEmpty());
          }}
          size="xl"
          aria-labelledby="example-modal-sizes-title-xl"
          dialogClassName=""
        >
          {<ModalProgressBar variant="query" />}
          {isShow ? (
            <ISpinner isShow={isShow} />
          ) : (
            <>
              <Modal.Header className="bg-custom">
                <Modal.Title className="text-center">
                  Attachment View
                </Modal.Title>
              </Modal.Header>
              {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
              <Modal.Body id="example-modal-sizes-title-xl">
                <div style={{ border: "1px solid #cccccc61" }}>
                  <div></div>
                  <div>
                    {multipleImageView?.url?.map((id) => {
                      if (id?.includes(".pdf")) {
                        return (
                          <img
                            style={{ width: "150px" }}
                            src={printIcon}
                            alt="print-icon"
                            onClick={() => {
                              dispatch(getDownlloadFileView_Action(id));
                            }}
                          />
                        );
                      } else {
                        return (
                          <img
                            src={`${APIUrl}/domain/Document/DownlloadFile?id=${id}`}
                            alt=""
                            style={{
                              width: "200px",
                              height: "200px",
                              padding: "4px",
                              borderRadius: "10px",
                            }}
                            onClick={() => {
                              dispatch(getDownlloadFileView_Action(id));
                            }}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(getMultipleFileViewEmpty());
                    }}
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
    </>
  );
};

export default MultipleAttachmentViewer;
