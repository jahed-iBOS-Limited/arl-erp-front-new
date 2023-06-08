/* eslint-disable no-restricted-imports */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import { Formik } from "formik";
import { ModalProgressBar } from "./../../../../../../_metronic/_partials/controls/ModalProgressBar";
import { SaveBulkSalesTargetSetup } from "../helper";
import { DropzoneDialog } from "material-ui-dropzone";
import Button from "@material-ui/core/Button";

const BulkSalesTargetSetup = () => {
  const [fileObject, setFileObject] = useState("");

  const [open, setOpen] = React.useState(false);

  const SaveHandler = () => {
    const formData = new FormData();
    formData.append("SalesExcel", fileObject);
    SaveBulkSalesTargetSetup(formData);
  };
  return (
    <>
      <Formik>
        <>
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Bulk Sales Target Setup"></CardHeader>

            <CardBody>
              <div className="d-flex justify-content-between pt-3">
                <div>
                  <Button
                    className="btn btn-primary"
                    variant="contained"
                    onClick={() => setOpen(true)}
                  >
                    Import Excel
                  </Button>
                  <DropzoneDialog
                    acceptedFiles={[
                      ".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                    ]}
                    cancelButtonText={"cancel"}
                    submitButtonText={"submit"}
                    maxFileSize={5000000}
                    open={open}
                    onClose={() => setOpen(false)}
                    onSave={(files) => {
                      setFileObject(files[0]);
                      setOpen(false);
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </div>
                <CardHeaderToolbar>
                  <button
                    onClick={() => SaveHandler()}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </div>
            </CardBody>
          </Card>
        </>
      </Formik>
    </>
  );
};

export default BulkSalesTargetSetup;
