import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { uploadAttachment, uploadAttachmentNew } from "../financialManagement/invoiceManagementSystem/billregister/helper";
import { compressfile } from "./compressfile";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Loading from "./_loading";

export default function AttachmentUploaderNew({ CBAttachmentRes, showIcon, attachmentIcon, customStyle, tooltipLabel, fileUploadLimits, isExistAttachment=false, isForPublicRoute=false }) {
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] =  useState(false)

  const defaultStyle = { border: 'none', }
  const mergeStyle = customStyle ? { ...defaultStyle, ...customStyle } : defaultStyle

  return (
    <>
    {
      loading && <Loading/>
    }
      {!showIcon ? (
        <button
          className={`btn ${isExistAttachment ? "btn-success" : "btn-primary"}`}
          type="button"
          onClick={() => setOpen(true)}
        >
          Attachment
        </button>
      ) : (
        <OverlayTrigger overlay={<Tooltip id="cs-icon">{tooltipLabel || "Upload Attachment"}</Tooltip>}>

          <button
            onClick={() => setOpen(true)}
            type="button"
            style={mergeStyle}>
            <i class={`${attachmentIcon || 'fa fa-upload'}`} style={{ fontSize: "16px" }} aria-hidden="true"></i>
          </button>
        </OverlayTrigger>
      )}

      <DropzoneDialogBase
        filesLimit={fileUploadLimits || 3}
        showAlerts={false}
        acceptedFiles={["image/*", "application/pdf"]}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={7000000}
        open={open}
        onAdd={(newFileObjs) => {
          // Previous
          // setFileObjects && setFileObjects(fileObjects?.concat(newFileObjs));

          // Current
          setFileObjects((prevFileObjs) => {
            if (fileObjects.length >= fileUploadLimits) {
              toast.warn(`Your file limit is ${fileUploadLimits} only`)
              return prevFileObjs
            } else {
              return [...prevFileObjs, ...newFileObjs]
            }
          })
        }}
        onDelete={(deleteFileObj) => {
          const newData = fileObjects?.filter(
            (item) => item?.file?.name !== deleteFileObj?.file?.name
          );
          setFileObjects && setFileObjects(newData);
        }}
        onClose={() => {
          setOpen(false);
          setFileObjects([]);
        }}
        onSave={() => {
          (async () => {
            setOpen(false);
            setLoading(true)
            try {
              let compressedFile = [];
              if (fileObjects?.length > 0) {
                compressedFile = await compressfile(
                  fileObjects?.map((f) => f?.file)
                );
              }
              if (compressedFile?.length < 1) {
                return toast.warn("Attachment required");
              } else {
                const uploadFunction = isForPublicRoute ? uploadAttachmentNew : uploadAttachment;
                uploadFunction(compressedFile, setLoading)
                  .then((res) => {
                    if (res?.length) {
                      setOpen(false);
                      CBAttachmentRes && CBAttachmentRes(res);
                      setFileObjects([])
                    } else {
                      CBAttachmentRes && CBAttachmentRes([]);
                    }
                  })
                  .catch((error) => {
                    CBAttachmentRes && CBAttachmentRes([]);
                  });
              }
              setLoading(false)
            } catch (error) {
              setLoading(false)
              toast.error("File upload error");
            }
          })();
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </>
  );
}
