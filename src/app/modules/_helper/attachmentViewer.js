import React from "react";
import axios from "axios";
import PDFViewer from "mgr-pdf-viewer-react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../_metronic/_partials/controls";
import ISpinner from "./_spinner";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setDownlloadFileViewEmpty } from "./_redux/Actions";
const AttachmentViewer = ({ isShow, btnText }) => {
  const imageView = useSelector((state) => {
    return state?.commonDDL?.imageView;
  }, shallowEqual);
  const dispatch = useDispatch();

  const download = () => {
    axios({
      url: imageView?.url,
      method: "GET",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileExtension = imageView?.type.split('/')[1];
      link.setAttribute("download", `Ibos.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
    });
  };
  return (
    <>
      <div className="viewModal">
        <Modal
          show={imageView?.model}
          onHide={() => {
            dispatch(setDownlloadFileViewEmpty());
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
                <i
                  onClick={() => download()}
                  class="fas fa-file-download"
                  style={{
                    position: "absolute",
                    right: "24px",
                    top: "6px",
                    fontSize: "25px",
                    color: "#197bde",
                    cursor: "pointer",
                  }}
                ></i>
              </Modal.Header>
              {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
              <Modal.Body id="example-modal-sizes-title-xl">
                <div style={{ border: "1px solid #cccccc61" }}>
                  <div></div>
                  <div style={{overflowX:"scroll"}}>
                    {imageView?.type === "application/pdf" ? (
                      <PDFViewer
                        document={{
                          url: imageView?.url,
                        }}
                      />
                    ) : (
                      <img
                        src={imageView?.url}
                        alt=""
                        style={{ width: "100%" }}
                      />
                    )}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setDownlloadFileViewEmpty());
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

export default AttachmentViewer;
