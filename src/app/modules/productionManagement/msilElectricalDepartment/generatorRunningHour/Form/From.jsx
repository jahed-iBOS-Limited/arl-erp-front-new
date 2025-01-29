import { Form, Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  convertDecimalToTime,
  convertTimeIntoDecimal,
  getDifferenceBetweenTime,
} from "../../../msilProduction/meltingProduction/helper";
import { getActualDuration } from "./helper";

export default function GeneratorRunningHourForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  validationSchema,
  location,
  selectedBusinessUnit,
  rowData,
  setRowData,
  addRowDataData,
  removeHandler,
  generatorNameDDL,
}) {
  const [, getData] = useAxiosGet();
  const params = useParams();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <InputField
                    disabled={location?.state?.dteDate}
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: "A", label: "A" },
                      { value: "B", label: "B" },
                      { value: "C", label: "C" },
                      { value: "General", label: "General" },
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shift", valueOption);
                      } else {
                        setFieldValue("generatorName", "");
                        setFieldValue("shift", "");
                      }
                    }}
                    isDisabled={!values?.date || params?.id}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="generatorName"
                    options={generatorNameDDL || []}
                    value={values?.generatorName}
                    label="Generator Name"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        if (selectedBusinessUnit?.value === 4) {
                          getData(
                            `/mes/MSIL/GetPreviousGeneratorReading?BusinessUnitId=4&GeneratorName=${valueOption?.label}`,
                            (data) => {
                              setFieldValue(
                                "numPreviousReading",
                                data?.numPreviousReading
                              );
                            }
                          );
                        }
                        setFieldValue("generatorName", valueOption);
                      } else {
                        setFieldValue("generatorName", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.shift || params?.id}
                  />
                </div>
                {selectedBusinessUnit.value !== 4 ? (
                  <div className="col-lg-4">
                    <InputField
                      value={values?.runningLoad}
                      label="Running Load"
                      name="runningLoad"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("runningLoad", +e.target.value);
                      }}
                    />
                  </div>
                ) : null}
                {selectedBusinessUnit.value === 4 ? (
                  <div className="col-lg-4">
                    <InputField
                      value={values?.numPreviousReading}
                      label="Previous Reading"
                      name="numPreviousReading"
                      type="number"
                      disabled={true}
                    />
                  </div>
                ) : null}
                {selectedBusinessUnit.value === 4 ? (
                  <div className="col-lg-4">
                    <InputField
                      value={values?.numPresentReading}
                      label="Present Reading"
                      name="numPresentReading"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("numPresentReading", +e.target.value);
                        setFieldValue(
                          "numGeneration",
                          +e.target.value - values?.numPreviousReading
                        );
                      }}
                      disabled={params?.id && selectedBusinessUnit?.value === 4}
                    />
                  </div>
                ) : null}
                {selectedBusinessUnit.value === 4 ? (
                  <div className="col-lg-4">
                    <InputField
                      value={values?.numGeneration}
                      label="Generation"
                      name="numGeneration"
                      type="number"
                      disabled={true}
                    />
                  </div>
                ) : null}
                <div className="col-lg-4">
                  <InputField
                    value={values?.startTime}
                    label="Start Time"
                    name="startTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select date");
                      setFieldValue("startTime", e.target.value);
                      if (
                        values?.date &&
                        values?.endTime &&
                        selectedBusinessUnit?.value !== 4
                      ) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          e.target.value,
                          values?.endTime
                        );
                        setFieldValue("totalTime", difference);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-4">
                  <InputField
                    value={values?.endTime}
                    label="End Time "
                    name="endTime"
                    type="time"
                    onChange={(e) => {
                      if (!values?.date)
                        return toast.warn("Please select date");
                      setFieldValue("endTime", e.target.value);
                      if (
                        values?.date &&
                        values?.startTime &&
                        selectedBusinessUnit?.value !== 4
                      ) {
                        let difference = getDifferenceBetweenTime(
                          values?.date,
                          values?.startTime,
                          e.target.value
                        );
                        setFieldValue("totalTime", difference);
                      }
                    }}
                  />
                </div>
                {/* Total Part */}
                <div className="col-lg-4">
                  <InputField
                    disabled
                    value={values?.totalTime}
                    label={
                      selectedBusinessUnit?.value !== 4
                        ? "Total Hours"
                        : "Actual Running Hours"
                    }
                    name="totalTime"
                    type={"type"}
                  />
                </div>

                {selectedBusinessUnit.value === 4 ? (
                  // <div className="col-lg-4">
                  //   <InputField
                  //     value={values?.strRemarks}
                  //     label="Reasons For Stopage"
                  //     name="strRemarks"
                  //     type="text"
                  //     onChange={
                  //       (e) => {
                  //         setFieldValue("strRemarks", e.target.value);
                  //       }
                  //     }
                  //   />
                  // </div>
                  <>
                    <div className="col-lg-12">
                      <hr />
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="strBreakdownType"
                        options={[
                          {
                            value: "Poor Load",
                            label: "Poor Load",
                          },
                          {
                            value: "REB / Overload",
                            label: "REB / Overload",
                          },
                          {
                            value: "Gas Pressure Low",
                            label: "Gas Pressure Low",
                          },
                          {
                            value: "Troubleshooting",
                            label: "Troubleshooting",
                          },
                          {
                            value: "Schedule Maintenance",
                            label: "Schedule Maintenance",
                          },
                          {
                            value: "BreakDown",
                            label: "BreakDown",
                          },
                        ]}
                        value={values?.strBreakdownType}
                        label="BreakDown Type"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("strBreakdownType", valueOption);
                          } else {
                            setFieldValue("strBreakdownType", "");
                          }
                        }}
                        isDisabled={!values?.date || params?.id}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* new changes by kabir bhai */}
                    <div className="col-lg-4">
                      <InputField
                        value={values?.strStartTime}
                        label="Breakdown Start Time"
                        name="strStartTime"
                        type="time"
                        onChange={(e) => {
                          setFieldValue("strStartTime", e.target.value);
                          if (values?.date && e.target.value) {
                            let breakdownDifference = getDifferenceBetweenTime(
                              values?.date,
                              e.target.value,
                              values?.strEndTime
                            );
                            setFieldValue("numDuration", breakdownDifference);
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-4">
                      <InputField
                        value={values?.strEndTime}
                        label="Breakdown End Time"
                        name="strEndTime"
                        type="time"
                        onChange={(e) => {
                          if (!values?.date)
                            return toast.warn("Please select date");
                          setFieldValue("strEndTime", e.target.value);
                          if (values?.date && e.target.value) {
                            let breakdownDifference = getDifferenceBetweenTime(
                              values?.date,
                              values?.strStartTime,
                              e.target.value
                            );
                            setFieldValue(
                              "numDuration",
                              convertTimeIntoDecimal(breakdownDifference)
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-4">
                      <InputField
                        value={values?.numDuration}
                        label="Duration (Hours)"
                        name="numDuration"
                        type="number"
                        // onChange={e => { setFieldValue('numDuration', e.target.value) }}
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-4">
                      <InputField
                        value={values?.strReasonOfStopage}
                        label="Reason Of Stopage"
                        name="strReasonOfStopage"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("strReasonOfStopage", e.target.value);
                        }}
                        disabled={
                          params?.id && selectedBusinessUnit?.value === 4
                        }
                      />
                    </div>
                    <div style={{ marginTop: "15px" }} className="col-lg-1">
                      <button
                        type="button"
                        onClick={() => {
                          let actualRunninHour = (
                            8.0 - (getActualDuration(rowData) || 0.0) || 0.0
                          ).toFixed(2);
                          if (+actualRunninHour <= 0) {
                            return toast.warn(
                              "Actual running hour cann't be negative or zero"
                            );
                          }
                          addRowDataData(values, (rowData) => {
                            setFieldValue(
                              "totalTime",
                              convertDecimalToTime(
                                8.0 - (getActualDuration(rowData) || 0.0) || 0.0
                              )
                            );
                          });
                        }}
                        disabled={
                          params?.id ||
                          !values?.strBreakdownType?.label ||
                          !values?.strReasonOfStopage
                        }
                        className="btn btn-primary"
                      >
                        ADD
                      </button>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                      <strong style={{ marginRight: "5px" }}>
                        {" "}
                        Total Breakdown Hour :{" "}
                        {convertDecimalToTime(getActualDuration(rowData)) || ""}
                      </strong>
                      <strong>
                        {" "}
                        Actual Running Hours :{" "}
                        {location?.state?.tmTotalHour
                          ? location?.state?.tmTotalHour
                          : convertDecimalToTime(
                              8.0 - (getActualDuration(rowData) || 0.0) || 0.0
                            )}
                      </strong>
                    </div>
                  </>
                ) : null}
              </div>
              {selectedBusinessUnit?.value === 4 && !params?.id ? (
                <div className="row">
                  {rowData?.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table po-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th> BreakDown Type </th>
                            <th> Start Time </th>
                            <th> End Time </th>
                            <th> Duration </th>
                            <th> Reason of stopage </th>
                            <th> Action </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center align-middle">
                                  {" "}
                                  {index + 1}{" "}
                                </td>
                                <td className="text-center align-middle">
                                  {item?.strBreakdownType}
                                </td>
                                <td className="text-center align-middle">
                                  {item?.strStartTime}
                                </td>
                                <td className="text-center align-middle">
                                  {item?.strEndTime}
                                </td>
                                <td className="text-center align-middle">
                                  {item?.numDuration}
                                </td>
                                <td className="text-center align-middle">
                                  {item?.strReasonOfStopage}
                                </td>
                                <td className="text-center align-middle">
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="delete-icon">
                                        {"Delete"}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      <i
                                        onClick={() => {
                                          removeHandler(index, (rowData) => {
                                            setFieldValue(
                                              "totalTime",
                                              convertDecimalToTime(
                                                8.0 -
                                                  (getActualDuration(rowData) ||
                                                    0.0) || 0.0
                                              )
                                            );
                                          });
                                        }}
                                        className="fa fa-trash deleteBtn text-danger"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </OverlayTrigger>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              ) : null}
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
}
