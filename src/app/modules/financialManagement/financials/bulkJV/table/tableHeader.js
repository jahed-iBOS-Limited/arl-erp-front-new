/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { useSelector, shallowEqual } from "react-redux";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { getBuTransactionDDL, saveBulkJV } from "../helper";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = Yup.object().shape({
  buTransaction: Yup.object().shape({
    label: Yup.string().required("Business Transaction is required"),
    value: Yup.string().required("Business Transaction is required"),
  }),
  partnerType: Yup.object().shape({
    label: Yup.string().required("Partner Type is required"),
    value: Yup.string().required("Partner Type is required"),
  }),
});

const initData = {
  narration: "",
  buTransaction: "",
  partnerType:{value: 2, label: "Customer"},
};

const BulkJVLanding = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileObject, setFileObject] = useState("");
  const [buTransactionDDL, setBuTransactionDDL] = useState([]);
  const [responseMsg, setResponseMsg] = useState();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getBuTransactionDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setBuTransactionDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (fileObject?.length === 0) {
      toast.warning("Please upload a excel file");
      return;
    }

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      saveBulkJV(
        profileData?.accountId,
        profileData?.userId,
        selectedBusinessUnit?.value,
        values,
        fileObject,
        cb,
        setLoading
      );
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, (msg) => {
            setResponseMsg(msg);
            resetForm(initData);
            setFileObject("");
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Bulk JV"}>
                <CardHeaderToolbar>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form">
                  <div className="col-lg-3">
                      <NewSelect
                        isSearchable={true}
                        label="Partner Type"
                        options={[{value: 1, label: "Supplier"}, {value: 2, label: "Customer"}]}
                        name="partnerType"
                        value={values?.partnerType || ""}
                        onChange={(valueOption) => {
                          setFieldValue("partnerType", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        isSearchable={true}
                        label="Business Transaction"
                        options={buTransactionDDL || []}
                        name="buTransaction"
                        placeholder="Business Transaction"
                        value={values?.buTransaction || ""}
                        onChange={(valueOption) => {
                          setFieldValue("buTransaction", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Narration</label>
                      <InputField
                        value={values?.narration || ""}
                        name="narration"
                        placeholder="Narration"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-2">
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary mr-2 d-flex align-items-center"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Upload
                        <i className="fa fa-upload ml-2"></i>
                      </button>
                    </div>
                  </div>
                  {responseMsg ? (
                    <h6 className="mt-2">
                      NB: {responseMsg}
                      <span
                        className="ml-10"
                        onClick={() => {
                          setResponseMsg();
                        }}
                      >
                        <i className="fa fa-close"></i>
                      </span>
                    </h6>
                  ) : null}

                  <>
                    {/* Attachment Modal */}
                    <DropzoneDialogBase
                      filesLimit={1}
                      acceptedFiles={[".xlsx", ".xls"]}
                      fileObjects={fileObject}
                      cancelButtonText={"cancel"}
                      submitButtonText={"submit"}
                      maxFileSize={1000000}
                      open={open}
                      onAdd={(newFileObjs) => {
                        setFileObject(newFileObjs);
                      }}
                      onDelete={(deleteFileObj) => {
                        const newData = fileObject.filter(
                          (item) => item.file.name !== deleteFileObj.file.name
                        );
                        setFileObject(newData);
                      }}
                      onClose={() => setOpen(false)}
                      onSave={() => {
                        console.log(fileObject);
                        setOpen(false);
                      }}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                  </>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default BulkJVLanding;
