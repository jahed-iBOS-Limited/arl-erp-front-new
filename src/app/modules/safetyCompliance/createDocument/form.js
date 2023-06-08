import { Form, Formik } from "formik";
import React, { useRef } from "react";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import InputField from "../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../_helper/_redux/Actions";
import NewSelect from "../../_helper/_select";
import { attachment_action, nameCutter } from "../legalDocRegistration/helper";
import "./style.css";
import placeholderImg from "../../_helper/images/placeholderImg.png";
import ButtonStyleOne from "../../_helper/button/ButtonStyleOne";
import IDelete from "../../_helper/_helperIcons/_delete";
import ICustomTable from "../../_helper/_customTable";

// Validation schema
const validationSchema = Yup.object().shape({
  documentName: Yup.string()
    .min(1, "Minimum 1 number")
    .max(1000, "Maximum 100 number")
    .required("Document Name is required"),
  unit: Yup.object().shape({
    label: Yup.string().required("Unit is required"),
    value: Yup.string().required("Unit is required"),
  }),
  workplaceGroup: Yup.object().shape({
    label: Yup.string().required("Workplace Group is required"),
    value: Yup.string().required("Workplace Group is required"),
  }),
  workplace: Yup.object().shape({
    label: Yup.string().required("Workplace is required"),
    value: Yup.string().required("Workplace is required"),
  }),
  reminderDate: Yup.string().required("Remainder Date is required"),
  frequency: Yup.string()
    .min(1, "Minimum 1 number")
    .max(1000, "Maximum 100 number")
    .required("Frequency is required"),
});

const _Form = ({
  initData,
  btnRef,
  resetBtnRef,
  saveHandler,
  workplaceDDL,
  workplaceGroupDDL,
  unitDDL,
  getWpGroup,
  getWp,
  getDataById,
  attachmentFile,
  setAttachmentFile,
  setAttachmentFileName,
  setAttachmentFileArray,
  setDeletedRow,
  setDisabled,
  attachmentFileName,
  attachmentFileArray,
  remover,
  deletedRow,
  regId,
  singleData,
}) => {
  const dispatch = useDispatch();

  // attachment file
  const inputAttachFile = useRef(null);
  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "align",
    "list",
    "bullet",
    "indent",
    "link",
    // "image",
  ];

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      // ["link", "image"],
    ],
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          textEditorData: singleData?.strDescriptionHTML || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            regId && getDataById();
            !regId && setAttachmentFileArray([]);
            setAttachmentFile("");
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
            <Form className="form form-label-right legalDocument-entry">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-4">
                        <InputField
                          value={values?.documentName}
                          placeholder="Document Name"
                          label="Document Name"
                          name="documentName"
                        />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="unit"
                          options={[{ value: 0, label: "All" }, ...unitDDL]}
                          value={values?.unit}
                          label="Unit"
                          onChange={(valueOption) => {
                            setFieldValue("workplace", "");
                            setFieldValue("workplaceGroup", "");
                            setFieldValue("unit", valueOption);
                            getWpGroup(
                              `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=WorkplaceGroupIdByBusinessUnitId&intBusinessUnitId=${valueOption?.value}`
                            );
                          }}
                          placeholder="Unit"
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="workplaceGroup"
                          options={[
                            { value: 0, label: "All" },
                            ...workplaceGroupDDL,
                          ]}
                          value={values?.workplaceGroup}
                          label="Workplace Group"
                          onChange={(valueOption) => {
                            setFieldValue("workplace", "");
                            setFieldValue("workplaceGroup", valueOption);
                            getWp(
                              `/hcm/SafetyAndCompliance/LegalDocumentALLGET?strPartType=WorkplaceByWorkplaceGroupId&intBusinessUnitId=${values?.unit?.value}&intWorkplaceGroupId=${valueOption?.value}`
                            );
                          }}
                          placeholder="Workplace Group"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.unit}
                        />
                      </div>
                      <div className="col-lg-4">
                        <NewSelect
                          name="workplace"
                          options={[
                            { value: 0, label: "All" },
                            ...workplaceDDL,
                          ]}
                          value={values?.workplace}
                          label="Workplace"
                          onChange={(valueOption) => {
                            setFieldValue("workplace", valueOption);
                          }}
                          placeholder="Workplace"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.workplaceGroup}
                        />
                      </div>
                      <div className="col-lg-4">
                        <InputField
                          type="date"
                          value={values?.reminderDate}
                          placeholder="Reminder Date"
                          label="Reminder Date"
                          name="reminderDate"
                        />
                      </div>
                      <div className="col-lg-4">
                        <InputField
                          value={values?.frequency}
                          placeholder="Frequency"
                          label="Frequency"
                          name="frequency"
                        />
                      </div>

                      <div className="col-lg-12 editor">
                        <label className="my-3" htmlFor="textEditorData">
                          Description
                        </label>
                        <ReactQuill
                          theme="snow"
                          onChange={(e) => {
                            setFieldValue("textEditorData", e);
                          }}
                          value={values?.textEditorData}
                          modules={modules}
                          formats={formats}
                        />
                      </div>

                      <div
                        className="col-lg-3 mt-2"
                        style={{ marginTop: "20px" }}
                      >
                        <div className="d-flex flex-column my-2">
                          Attachment
                          {attachmentFile && (
                            <span
                              className="pointer"
                              onClick={() => {
                                dispatch(
                                  getDownlloadFileView_Action(attachmentFile)
                                );
                              }}
                            >
                              <i
                                className="fa fa-eye"
                                aria-hidden="true"
                                style={{
                                  marginRight: "10px",
                                  color: "#0072E5",
                                }}
                              ></i>
                            </span>
                          )}
                        </div>
                        <div
                          className={
                            attachmentFile
                              ? "image-upload-box with-img"
                              : "image-upload-box"
                          }
                          onClick={onButtonAttachmentClick}
                          style={{
                            cursor: "pointer",
                            position: "relative",
                            height: "35px",
                          }}
                        >
                          <input
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                attachment_action(e.target.files, setDisabled)
                                  .then((data) => {
                                    setAttachmentFile(data?.[0]?.id);
                                    setAttachmentFileName(data[0]);
                                  })
                                  .catch((error) => {
                                    toast.warn("Failed, try again");
                                  });
                              }
                            }}
                            type="file"
                            ref={inputAttachFile}
                            id="file"
                            style={{ display: "none" }}
                          />

                          <div>
                            {!attachmentFile && (
                              <img
                                style={{ maxWidth: "65px" }}
                                src={placeholderImg}
                                className="img-fluid"
                                alt="Upload or drag documents"
                              />
                            )}
                          </div>

                          {attachmentFile && (
                            <div className="d-flex align-items-center">
                              <p
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  color: "#0072E5",
                                  cursor: "pointer",
                                  margin: "0px",
                                }}
                              >
                                {nameCutter(0, 10, attachmentFile)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-1" style={{ marginTop: "38px" }}>
                        <ButtonStyleOne
                          type="button"
                          label="Add"
                          onClick={() => {
                            if (!attachmentFile)
                              return toast.warn("File not found!", {
                                toastId: 457,
                              });

                            const isFound =
                              attachmentFileArray.filter(
                                (itm) =>
                                  itm?.fileName === attachmentFileName?.fileName
                              ).length > 0;

                            if (isFound)
                              return toast.warn(
                                "Not allowed to duplicate item!",
                                {
                                  toastId: 456,
                                },
                                setAttachmentFile("")
                              );

                            let prevData = [...attachmentFileArray];
                            prevData.push({
                              ...attachmentFileName,
                              isCreate: true,
                              isDelete: false,
                            });
                            setAttachmentFileArray(prevData);
                            setAttachmentFile("");
                          }}
                        />
                      </div>
                    </>
                  </div>
                </div>
              </div>
              <ICustomTable ths={["SL", "Document File Name", "Action"]}>
                {attachmentFileArray?.length !== 0 &&
                  attachmentFileArray?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.fileName}</td>
                      <td className="text-center">
                        <span
                          onClick={(e) => {
                            if (
                              regId &&
                              item?.intDocumentNameId &&
                              window?.location?.pathname?.includes("edit")
                            ) {
                              const data = [...deletedRow];
                              data.push({
                                ...item,
                                isCreate: false,
                                isDelete: true,
                              });
                              setDeletedRow(data);
                            }
                            remover(index);
                          }}
                        >
                          <IDelete remover={() => ""} id={index} />
                        </span>
                      </td>
                    </tr>
                  ))}
              </ICustomTable>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default _Form;
