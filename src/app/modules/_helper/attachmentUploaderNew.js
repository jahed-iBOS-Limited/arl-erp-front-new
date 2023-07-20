import React, { useState } from "react";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { toast } from "react-toastify";
import { compressfile } from "./compressfile";
import { uploadAttachment } from "../financialManagement/invoiceManagementSystem/billregister/helper";

export default function AttachmentUploaderNew({ CBAttachmentRes }) {
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => setOpen(true)}
      >
        Attachment
      </button>

      <DropzoneDialogBase
        filesLimit={3}
        acceptedFiles={["image/*", "application/pdf"]}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={1000000}
        open={open}
        onAdd={(newFileObjs) => {
          setFileObjects && setFileObjects(fileObjects?.concat(newFileObjs));
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
                uploadAttachment(compressedFile)
                  .then((res) => {
                    if (res?.length) {
                      setOpen(false);
                      CBAttachmentRes && CBAttachmentRes(res);
                    } else {
                      CBAttachmentRes && CBAttachmentRes([]);
                    }
                  })
                  .catch((error) => {
                    CBAttachmentRes && CBAttachmentRes([]);
                  });
              }
            } catch (error) {
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
