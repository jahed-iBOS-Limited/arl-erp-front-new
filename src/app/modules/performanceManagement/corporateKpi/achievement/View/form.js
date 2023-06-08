import React, { useState } from "react";
import { IInput } from "../../../../_helper/_input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { DropzoneDialogBase } from "material-ui-dropzone";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import IView from "../../../../_helper/_helperIcons/_view";
import { empAttachment_action } from "../../../../inventoryManagement/warehouseManagement/assetReceive/helper/Actions";
import TextArea from "antd/lib/input/TextArea";
import { getPmsReportAction } from "../../../_helper/getReportAction";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  btnRef,
  resetBtnRef,
  initData,
  saveHandler,
  target,
  rowDto,
  rowDtoHandler,
  selectedBusinessUnit,
  enroll,
  selectedYear,
  objective,
  kpi,
  setReport,
}) {
  const dispatch = useDispatch();

  const [clickedMonth, setClickedMonth] = useState("");
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  let date = new Date();
  let year = date.getFullYear();

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData)

            getPmsReportAction(
              setReport,
              selectedBusinessUnit.value,
              enroll,
              selectedYear?.value,
              0,
              0,
              false,
              4
            );
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
            <Form className="form form-label-right">
              {console.log(target)}
              <div className="row">
                <div className="col-lg">
                  <p style={{ fontSize: "14px", marginTop: "5px" }}>
                    {" "}
                    <b>Objective</b> : {objective}{" "}
                  </p>
                  <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                    {" "}
                    <b>KPI</b> : {kpi}{" "}
                  </p>
                </div>
              </div>
              <div className="mt-5">
                {target?.objRow?.length ? (
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th></th>
                        {target?.objHeader &&
                          Object.values(target?.objHeader)?.map((th, index) => {
                            return <th key={index}>{th}</th>;
                          })}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="align-middle">Target</td>
                        {target?.objRow &&
                          target?.objRow.map((itm, index) => (
                            <td
                              key={index}
                              className="disabled-feedback disable-border target-input"
                            >
                              <IInput
                                value={itm?.target}
                                // placeholder={itm}
                                name=""
                                type="number"
                                disabled={true}
                                min="0"
                              />
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="align-middle">Actual</td>
                        {target?.objRow &&
                          target.objRow.map((itm, index) => (
                            <td
                              key={index}
                              className="disabled-feedback disable-border str-achievement"
                              onClick={() => {
                                setClickedMonth(
                                  Object.keys(target?.objRow)[index]
                                );
                              }}
                            >
                              <IInput
                                value={rowDto[index]?.numAchivment}
                                type="number"
                                min="0"
                                name="numAchivment"
                                placeholder={itm?.achivment}
                                step="any"
                                onChange={(e) =>
                                  rowDtoHandler(
                                    "numAchivment",
                                    e.target.value,
                                    index,
                                    itm.rowId
                                  )
                                }
                              />
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="align-middle">Remarks</td>
                        {target?.objRow &&
                          target.objRow.map((itm, index) => (
                            <td
                              key={index}
                              className="disabled-feedback disable-border str-achievement"
                            >
                              <TextArea
                                value={rowDto[index]?.remarks}
                                name="remarks"
                                placeholder={itm?.remarks}
                                rows="1"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "remarks",
                                    e.target.value,
                                    index,
                                    itm.rowId
                                  );
                                }}
                                max={1000}
                                errors={errors}
                                touched={touched}
                              />
                            </td>
                          ))}
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <h3>No data found!</h3>
                )}
              </div>

              {clickedMonth >= 0 && clickedMonth !== "" && (
                <div className="mt-3">
                  <span>
                    <b>
                      {target?.objRow?.[clickedMonth]?.monthName
                        ? `Month : ${target?.objRow?.[clickedMonth]?.monthName}`
                        : Object.values(target?.objHeader)[clickedMonth] ===
                          "Yearly"
                        ? "Year " + year
                        : Object.values(target?.objHeader)[clickedMonth] +
                          " Quarter"}
                    </b>{" "}
                  </span>
                  {(target?.objRow?.[clickedMonth]?.documentString ||
                    rowDto[clickedMonth]?.documentString) && (
                    <IView
                      clickHandler={() => {
                        dispatch(
                          getDownlloadFileView_Action(
                            rowDto[clickedMonth]?.documentString ||
                              target?.objRow?.[clickedMonth]?.documentString
                          )
                        );
                      }}
                    />
                  )}

                  {!target?.objRow?.[clickedMonth]?.isApproved && (
                    <ButtonStyleOne
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={() => setOpen(true)}
                      label="Upload"
                    />
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
                      console.log("onSave", fileObjects);
                      setOpen(false);
                      empAttachment_action(fileObjects).then((data) => {
                        rowDtoHandler(
                          "documentString",
                          data?.[0]?.id,
                          clickedMonth,
                          target?.objRow?.[clickedMonth]?.rowId
                        );
                        setFileObjects([]);
                      });
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </div>
              )}

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
    </div>
  );
}
