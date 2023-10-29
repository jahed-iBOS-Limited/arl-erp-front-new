/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import TextArea from "../../../_helper/TextArea";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import { _todayDate } from "../../../_helper/_todayDate";
import { compressfile } from "../../../_helper/compressfile";
import ICon from "../../../chartering/_chartinghelper/icons/_icon";
import { attachFilesForBanking, fundManagementAttch } from "./helper";

export default function AttachmentUploadForm({
  typeId,
  fdrNo,
  setShow,
  attachments,
}) {
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [, setUploadedFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    if (attachments?.length > 0) {
      setForms([]);
    } else {
      setForms([
        {
          date: _todayDate(),
          title: "",
          narration: "",
          attachment: "",
          fileName: "",
        },
      ]);
    }
  }, [accId, buId, attachments]);

  const saveHandler = () => {
    const payload = forms?.map((item) => {
      return {
        typeId: typeId,
        typeName: typeId === 1 ? "FDR" : "Loan",
        attatchmentDate: item?.date,
        actionBy: userId,
        narration: item?.narration,
        fdrnumber: fdrNo,
        attatchment: item?.attachment,
        title: item?.title,
      };
    });

    attachFilesForBanking(payload, setLoading, () => {
      setShow(false);
    });
  };

  const addAnother = () => {
    const newForm = {
      date: _todayDate(),
      title: "",
      narration: "",
      attachment: "",
    };
    setForms([...forms, newForm]);
  };

  const removeForm = (index) => {
    setForms(forms?.filter((item, i) => i !== index));
  };

  const onChangeHandler = (index, key, value) => {
    const _data = [...forms];
    _data[index][key] = value;
    setForms(_data);
  };

  const isDisable = () => {
    const lastForm = forms[forms?.length - 1];
    return !lastForm?.date || !lastForm?.attachment || !lastForm?.title;
  };

  const docView = async (attachmentNo, cb) => {
    await dispatch(getDownlloadFileView_Action(attachmentNo));
    cb();
  };

  const getFileType = (item) => {
    return item?.attatchment?.split(".")[
      item?.attatchment?.split(".")?.length - 1
    ];
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={() => {
          saveHandler();
        }}
      >
        {({ touched, handleSubmit }) => (
          <>
            <div className="d-flex justify-content-between mt-2">
              <h3>{`Attach ${
                attachments?.length > 0 ? "or View" : ""
              } Your Documents`}</h3>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleSubmit()}
                disabled={loading || isDisable()}
              >
                Done
              </button>
            </div>
            {attachments?.length > 0 && (
              <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
                <thead className="bg-secondary">
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    <th>Document Title</th>
                    <th style={{ width: "100px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attachments?.map((item, i) => {
                    return (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{item?.title}</td>
                        <td className="text-center">
                          <ICon
                            title="View your file"
                            onClick={() => {
                              setLoading(true);
                              docView(item?.attatchment, () => {
                                setLoading(false);
                              });
                            }}
                          >
                            {getFileType(item) === "pdf" ? (
                              <i class="far fa-file-pdf"></i>
                            ) : ["png", "jpg", "jpeg"].includes(
                                getFileType(item)
                              ) ? (
                              <i class="fad fa-file-image"></i>
                            ) : (
                              <i class="fas fa-file"></i>
                            )}
                          </ICon>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {forms?.length > 0 && (
              <form className="form form-label-right">
                <div className="global-form">
                  {forms?.map((item, i) => {
                    return (
                      <div className="row" key={i}>
                        <div className="col-lg-2">
                          <InputField
                            value={item?.date}
                            name="date"
                            type="date"
                            touched={touched}
                            label="Date"
                            onChange={(e) => {
                              onChangeHandler(i, "date", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <InputField
                            value={item?.title}
                            name="title"
                            type="text"
                            touched={touched}
                            label="Title"
                            placeholder="Title"
                            onChange={(e) => {
                              onChangeHandler(i, "title", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-5">
                          <label htmlFor="narration">Narration</label>
                          <TextArea
                            placeholder="Narration"
                            value={item?.narration}
                            name="narration"
                            type="text"
                            touched={touched}
                            rows={2}
                            onChange={(e) => {
                              onChangeHandler(i, "narration", e?.target?.value);
                            }}
                          />
                        </div>

                        <div className="col-lg-3 mt-5">
                          <div className="d-flex justify-content-between">
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary p-2"
                                onClick={() => setOpen(true)}
                              >
                                Attach
                              </button>
                              {!item?.attachment ? (
                                <p className="text-danger mt-1">
                                  Attach the document
                                </p>
                              ) : (
                                <p
                                  className="text-success mt-1 cursor-pointer"
                                  onClick={() => {
                                    docView(item?.attachment, () => {
                                      setLoading(false);
                                    });
                                  }}
                                >
                                  <b>Document attached</b>
                                </p>
                              )}
                            </div>
                            {(i !== 0 || attachments?.length > 0) && (
                              <button
                                type="button"
                                className="btn btn-danger p-2"
                                onClick={() => {
                                  removeForm(i);
                                }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        <DropzoneDialogBase
                          filesLimit={5}
                          acceptedFiles={["image/*", "application/pdf"]}
                          fileObjects={fileObjects}
                          cancelButtonText={"cancel"}
                          submitButtonText={"submit"}
                          maxFileSize={100000000000000}
                          open={open}
                          onAdd={(newFileObjs) => {
                            setFileObjects([].concat(newFileObjs));
                          }}
                          onDelete={(deleteFileObj) => {
                            const newData = fileObjects.filter(
                              (item) =>
                                item.file.name !== deleteFileObj.file.name
                            );
                            setFileObjects(newData);
                          }}
                          onClose={() => setOpen(false)}
                          onSave={async () => {
                            setLoading(true);
                            setOpen(false)

                            const compressedFile = await compressfile(
                              fileObjects?.map((f) => f.file)
                            );

                            fundManagementAttch(
                              compressedFile,
                              setUploadedFiles
                            ).then((data) => {
                              if (data?.length) {
                                onChangeHandler(i, "attachment", data[0]?.id);
                                onChangeHandler(
                                  i,
                                  "fileName",
                                  data[0]?.fileName
                                );
                                setOpen(false);
                                toast.success("Uploaded Successfully!");
                                setLoading(false);
                              }
                            }).catch(err => {
                              setLoading(false);
                              console.log("err", err)
                            });
                          }}
                          showPreviews={true}
                          showFileNamesInPreview={true}
                        />
                      </div>
                    );
                  })}
                </div>
              </form>
            )}
            <div className="text-right mt-3">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  addAnother();
                }}
                disabled={
                  attachments?.length > 0 && forms?.length < 1
                    ? false
                    : isDisable()
                }
              >
                Add another
              </button>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
