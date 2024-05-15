import React, { useState } from "react";
import { IInput } from "../../../_helper/_input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDailyTargetData, saveDailyTargetRow } from "./helper";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { empAttachment_action } from "../../../inventoryManagement/warehouseManagement/assetReceive/helper/Actions";
import IView from "../../../_helper/_helperIcons/_view";
import TextArea from "antd/lib/input/TextArea";
import { getPmsReportAction } from "../../../performanceManagement/_helper/getReportAction";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";

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
  getTarget,
  setRowDto,
  selectedYear,
  objective,
  kpi,
  setReport,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [clickedMonth, setClickedMonth] = useState("");
  const [dailyEntryRow, setDailyEntryRow] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  // daily entry row handler
  const dailyEntryHandler = (value, index) => {
    const xData = [...dailyEntryRow];
    xData[index].amount = value;
    setDailyEntryRow([...xData]);
  };

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
            resetForm(initData);
            history.push(
              "/self-service/kpi-target-entry"
            );

            getPmsReportAction(
              setReport,
              selectedBusinessUnit.value,
              enroll,
              selectedYear?.value,
              13,
              24,
              false,
              1
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
                   <div className='table-responsive'>
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th></th>

                        {target?.objRow &&
                          Object.values(target?.objRow)?.map((th, index) => {
                            return <th key={index}>{th?.monthName}</th>;
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
                                onClick={() => alert("H")}
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
                          target?.objRow.map((itm, index) => (
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
                                placeholder={itm?.achivment}
                                type="number"
                                min="0"
                                name="numAchivment"
                                step="any"
                                onClick={() => {
                                  getDailyTargetData(
                                    target?.kpiid,
                                    target?.objRow[index]?.monthId,
                                    setDailyEntryRow
                                  );
                                }}
                                onChange={(e) =>
                                  rowDtoHandler(
                                    "numAchivment",
                                    e.target.value,
                                    index,
                                    itm.rowId
                                  )
                                }
                                disabled={
                                  itm?.isApproved === itm?.isReject
                                    ? false
                                    : true
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
                  </div>
                ) : (
                  <h3>No data found!</h3>
                )}
              </div>

              {/* Upload Attachment */}

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

              {/* Daily Entry Field, if isDaily entry true, only then this will be visible */}

              {target?.objRow &&
                target?.objRow[0]?.isDailyEntry === true &&
                clickedMonth && (
                  <div className="indKpiDailyEntry">
                    <div className="d-flex align-items-center mb-2">
                      <b className="text-capitalize">
                        Month Name : {clickedMonth}{" "}
                      </b>
                      <button
                        className="btn btn-primary btn-sm ml-2"
                        type="button"
                        onClick={() =>
                          saveDailyTargetRow(dailyEntryRow, getTarget)
                        }
                      >
                        Save
                      </button>
                    </div>
                    <table style={{ width: "50%" }} className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                        </tr>
                      </thead>

                      {dailyEntryRow?.length > 0 ? (
                        <tbody>
                          {dailyEntryRow?.map((item, index) => (
                            <tr>
                              <td>{_dateFormatter(item?.date)}</td>
                              <td>
                                <IInput
                                  value={item?.amount}
                                  placeholder="Amount"
                                  type="number"
                                  min="0"
                                  name="amount"
                                  step="any"
                                  onChange={(e) =>
                                    dailyEntryHandler(e.target.value, index)
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        "...loading"
                      )}
                    </table>
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
