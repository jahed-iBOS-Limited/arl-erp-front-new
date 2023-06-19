import React, { useState } from "react";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { empAttachment_action } from "../../humanCapitalManagement/humanResource/employeeInformation/helper";

const AttachFile = ({ obj }) => {
  const {
    open,
    setOpen,
    filesLimit,
    maxFileSize,
    acceptedFiles,
    setUploadedImage,
  } = obj;
  const [fileObjects, setFileObjects] = useState([]);
  return (
    <>
      <DropzoneDialogBase
        filesLimit={filesLimit ? filesLimit : 1}
        acceptedFiles={
          acceptedFiles ? acceptedFiles : ["image/*", "application/pdf"]
        }
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={maxFileSize ? maxFileSize : 1000000}
        open={open}
        onAdd={(newFileObjs) => {
          setFileObjects([].concat(newFileObjs));
        }}
        onDelete={(deleteFileObj) => {
          const newData = fileObjects.filter(
            (item) => item.file.name !== deleteFileObj.file.name
          );
          setFileObjects(newData);
        }}
        onClose={() => setOpen(false)}
        onSave={() => {
          setOpen(false);
          empAttachment_action(fileObjects).then((data) => {
            setUploadedImage(data);
          });
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </>
  );
};

export default AttachFile;
