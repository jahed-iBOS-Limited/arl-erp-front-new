import React, { useState } from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";
import FormikInput from "../../../../../helper/common/formikInput";
import { ownerInfoAttachment, validationSchema } from "../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../../helper/_redux/Actions";
import FormikSelect from "../../../../../helper/common/formikSelect";
import customStyles from "../../../../selectCustomStyle";
import IViewModal from "../../../../../helper/common/viewModal";
import BankInfoForm from "../../bankInfo/Form/addEditForm";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  setUploadImage,
  setLoading,
  bankDDL,
  setBankDDL,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
          <>
            <form className="form-card">
              <div className="form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info reset-btn ml-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2"}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="form-card-content">
                <div className="row">
                  {/* <div className="col-lg-3">
                    <label>Owner Name</label>
                    <FormikInput
                      value={values?.ownerName}
                      name="ownerName"
                      placeholder="Owner Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div> */}

                  <div className="col-lg-3">
                    <label>Company Name</label>
                    <FormikInput
                      value={values?.companyName}
                      name="companyName"
                      placeholder="Company Name"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Company Address</label>
                    <FormikInput
                      value={values?.companyAddress}
                      name="companyAddress"
                      placeholder="Company Address"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Owner Email</label>
                    <FormikInput
                      value={values?.ownerEmail}
                      name="ownerEmail"
                      placeholder="Owner Email"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Contact Number</label>
                    <FormikInput
                      value={values?.contactNumber}
                      name="contactNumber"
                      placeholder="Contact Number"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <label>Owner NID No.</label>
                    <FormikInput
                      value={values?.ownerNidNo}
                      name="ownerNidNo"
                      placeholder="Owner NID No."
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <label>Owner Bank Account</label>
                    <FormikInput
                      value={values?.ownerBankAccount}
                      name="ownerBankAccount"
                      placeholder="Owner Bank Account"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.bankName}
                      isSearchable={true}
                      options={bankDDL || []}
                      styles={customStyles}
                      name="bankName"
                      placeholder="Bank Name"
                      label="Bank Name"
                      onChange={(valueOption) => {
                        setFieldValue("bankName", valueOption);
                      }}
                      isDisabled={viewType === "view"}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {values?.bankName?.address ||
                  values?.bankName?.bankAddress ? (
                    <div className="col-lg-3">
                      <label>Bank Address</label>
                      <FormikInput
                        value={
                          values?.bankName?.address ||
                          values?.bankName?.bankAddress
                        }
                        name="address"
                        placeholder="Bank Address"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={true}
                      />
                    </div>
                  ) : null}

                  {values?.bankName?.code || values?.bankName?.swiftCode ? (
                    <div className="col-lg-3">
                      <label>Bank Swift Code</label>
                      <FormikInput
                        value={
                          values?.bankName?.code || values?.bankName?.swiftCode
                        }
                        name="Swift Code"
                        placeholder="Swift Code"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled={true}
                      />
                    </div>
                  ) : null}
                  {/* <div className="col-lg-3 mt-3"></div> */}

                  {/* <div className="col-lg-3 mt-3 d-flex align-items-center">
                    <input
                      type="checkbox"
                      name="isOwnCompany"
                      id="isOwnCompany"
                      value={values?.isOwnCompany}
                      checked={values?.isOwnCompany}
                      onChange={(e) =>
                        setFieldValue("isOwnCompany", e?.target?.checked)
                      }
                      disabled={viewType === "view"}
                    />
                    <label htmlFor="isOwnCompany" className="ml-1 pb-0">
                      Own Company
                    </label>
                  </div> */}

                  <div className="col-lg-3 mt-3 d-flex align-items-center">
                    {viewType !== "view" && (
                      <div className="d-flex">
                        <button
                          className="btn btn-primary mr-2"
                          type="button"
                          onClick={() => setShow(true)}
                        >
                          Add A New Bank
                        </button>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => setOpen(true)}
                        >
                          <i className="fas fa-paperclip"></i>{" "}
                          {`${viewType ? "Update File" : "Attach File"} `}
                        </button>
                      </div>
                    )}

                    {viewType && values?.filePath && (
                      <button
                        className="btn btn-primary d-flex align-items-center ml-2"
                        type="button"
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(
                              values?.filePath,
                              setLoading
                            )
                          );
                        }}
                      >
                        <i className="fas fa-eye mr-1"></i>
                        View File
                      </button>
                    )}

                    <DropzoneDialogBase
                      filesLimit={1}
                      acceptedFiles={["image/*"]}
                      fileObjects={fileObjects}
                      cancelButtonText={"cancel"}
                      submitButtonText={"submit"}
                      maxFileSize={1000000}
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
                        ownerInfoAttachment(fileObjects, setLoading).then(
                          (data) => {
                            setUploadImage(data);
                          }
                        );
                      }}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                  </div>
                </div>
              </div>
            </form>
            <IViewModal show={show} onHide={() => setShow(false)}>
              <BankInfoForm setShow={setShow} setBankDDL={setBankDDL} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
