import React, { useRef, useState } from "react";
import { attachmentUpload } from "../../../_helper/attachmentUpload";
import Loading from "../../../_helper/_loading";
import placeholderImg from "../../../_helper/images/placeholderImg.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import Styles from "./attachmentField.module.css";

export default function AttachmentField({ label, attachment, setFieldValue }) {
  const [isLoading, setIsLoading] = useState();
  const dispatch = useDispatch();
  const inputAttachFile = useRef(null);

  // on button click activate file input
  const triggerAttachmentField = () => {
    inputAttachFile.current.click();
  };

  return (
    <>
      {isLoading && <Loading />}
      <label className="w-100">{label || "Attachment"}</label>
      <input
        onChange={async (e) => {
          if (e.target.files?.[0]) {
            const attachmentResponse = await attachmentUpload(e.target.files, setIsLoading);

            setFieldValue("attachment", attachmentResponse);
          }
        }}
        type="file"
        ref={inputAttachFile}
        id="file"
        style={{ display: "none" }}
      />
      {!attachment?.[0]?.id && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "6px",
          }}
        >
          <div
            className={
              attachment?.[0]?.id
                ? `${Styles["image-upload-box"]} ${Styles["with-img"]}`
                : Styles["image-upload-box"]
            }
            onClick={triggerAttachmentField}
          >
            <div className="w-100 d-flex align-items-center justify-content-center">
              <img
                style={{ maxWidth: "50px" }}
                src={placeholderImg}
                className="img-fluid"
                alt="Upload or drag documents"
              />
            </div>
          </div>
        </div>
      )}
      {attachment?.[0]?.id && (
        <>
          <div className="w-100">
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#0072E5",
                cursor: "pointer",
                margin: "0px",
              }}
              onClick={triggerAttachmentField}
            >
              {attachment?.[0]?.fileName}{" "}
              <OverlayTrigger overlay={<Tooltip id="cs-icon">View Attachment</Tooltip>}>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(
                      getDownlloadFileView_Action(attachment?.[0]?.id, null, null, setIsLoading)
                    );
                  }}
                  className="ml-2"
                >
                  <i
                    style={{ fontSize: "16px" }}
                    className={`fa pointer fa-eye`}
                    aria-hidden="true"
                  ></i>
                </span>
              </OverlayTrigger>
            </p>
          </div>
        </>
      )}
    </>
  );
}
