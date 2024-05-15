import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../../_helper/_select";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { getDownlloadFileView_Action } from "../../../../../../_helper/_redux/Actions";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { empAttachment_action } from "./../../../../../../inventoryManagement/warehouseManagement/assetReceive/helper/Actions";
import IView from "./../../../../../../_helper/_helperIcons/_view";
import IDelete from "./../../../../../../_helper/_helperIcons/_delete";
import { _dateFormatter } from "../../../../../../_helper/_dateFormate";
import { getDocumentTypeDDL } from "./helper";
// eslint-disable-next-line no-unused-vars
import { TrainOutlined } from "@material-ui/icons";
import InputField from "../../../../../../_helper/_inputField";
import { useDispatch } from "react-redux";
import ButtonStyleOne from "../../../../../../_helper/button/ButtonStyleOne";
// import { _todayDate } from "./../../../../../../_helper/_todayDate";
// Validation schema
const validationSchema = Yup.object().shape({
  // docType: Yup.object().shape({
  //   label: Yup.string().required("Document Type is required"),
  //   value: Yup.string().required("Document Type is required"),
  // }),
  effectiveDate: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Effective Date is required"),
});

export default function _Form({
  initData,
  saveHandler,
  disableHandler,
  setEdit,
  accountId,
  profileData,
  edit,
  rowDto,
  setFileObjects,
  fileObjects,
  rowDataAddHandler,
  setUploadImage,
  getDocAttachMentById,
  editClick,
  setEditClick,
  remover,
  singleData,
  setRowDto,
  isDisabled,
  uploadImage,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [DocTypeDDL, setDocTypeDDL] = useState("");
  useEffect(() => {
    getDocumentTypeDDL(accountId, setDocTypeDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

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
          setValues,
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Document Management"}>
                <CardHeaderToolbar>
                  {edit ? (
                    <>
                      <button
                        onClick={() => {
                          setEdit(false);
                          resetForm(initData);
                          setEditClick(false);
                          setRowDto([]);
                          getDocAttachMentById();
                          // !singleData.length > 0 && setRowDto([]);
                        }}
                        className="btn btn-light "
                        type="button"
                      >
                        <i className="fas fa-times pointer"></i>
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-primary ml-2"
                        type="submit"
                        disabled={isDisabled}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEdit(true)}
                      className="btn btn-light"
                      type="button"
                    >
                      <i className="fas fa-pen-square pointer"></i>
                      Edit
                    </button>
                  )}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {edit && (
                    <div className="row global-form global-form-custom bj-left pb-2">
                      <div className="col-lg-3">
                        <NewSelect
                          name="docType"
                          options={DocTypeDDL}
                          value={values?.docType}
                          label="Document Type"
                          onChange={(valueOption) => {
                            setFieldValue("docType", valueOption);
                          }}
                          placeholder="Document Type"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit}
                        />
                      </div>
                      <div className="col-lg">
                        <label>Effective Date</label>
                        <InputField
                          value={values?.effectiveDate}
                          name="effectiveDate"
                          placeholder="Effective Date"
                          type="date"
                        />
                      </div>

                      <div
                        style={{ marginTop: "16px" }}
                        className={!edit ? "d-none" : "col-lg-6"}
                      >
                        <ButtonStyleOne
                          className="btn btn-primary mr-2"
                          type="button"
                          onClick={() => setOpen(true)}
                          label="Attachment"
                        />

                        {!editClick && (
                          <ButtonStyleOne
                            className="btn btn-primary"
                            type="button"
                            onClick={() => rowDataAddHandler(values)}
                            disabled={!uploadImage || !values?.docType}
                            label="Add"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* row end */}
                  {/* Table Start */}
                  {!editClick && (
                    <div className="row">
                      <div className="col-lg-12 pr-0 pl-0">
                        {rowDto?.length > 0 && (
                           <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                            <thead>
                              <tr>
                                <th style={{ width: "35px" }}>SL</th>
                                <th style={{ width: "35px" }}>Document Type</th>
                                <th style={{ width: "35px" }}>
                                  Effective Date
                                </th>
                                <th style={{ width: "35px" }}>Created By</th>
                                <th style={{ width: "35px" }}>Created Date</th>
                                <th style={{ width: "35px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((itm, index) => (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>

                                  <td className="text-center">
                                    {itm?.strDocType}
                                  </td>
                                  <td className="text-center">
                                    {_dateFormatter(itm?.effectiveDate)}
                                  </td>
                                  <td className="text-center">
                                    {itm?.createdByName}
                                  </td>
                                  <td className="text-center">
                                    {_dateFormatter(itm?.createdDateTime)}
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-around">
                                      <span>
                                        <IView
                                          clickHandler={() => {
                                            dispatch(
                                              getDownlloadFileView_Action(
                                                itm?.intDocumentId
                                              )
                                            );
                                          }}
                                        />
                                      </span>
                                      {edit && (
                                        <span>
                                          <IDelete
                                            remover={remover}
                                            id={index}
                                          />
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Table End */}
                  <DropzoneDialogBase
                    filesLimit={1}
                    acceptedFiles={["image/*", "application/pdf"]}
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
                      console.log("onSave", fileObjects);
                      setOpen(false);
                      empAttachment_action(fileObjects).then((data) => {
                        setUploadImage(data);
                        setFileObjects([]);
                      });
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
