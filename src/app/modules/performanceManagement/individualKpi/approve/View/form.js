import React, { useState } from "react";
import { IInput } from "../../../../_helper/_input";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getReportAction } from "../../../_redux/Actions";
import { getDailyTargetData, saveDailyTargetRow } from "./helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

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
}) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [clickedMonth, setClickedMonth] = useState("");
  const [dailyEntryRow, setDailyEntryRow] = useState([]);

  // daily entry row handler
  const dailyEntryHandler = (value, index) => {
    const xData = [...dailyEntryRow];
    xData[index].amount = value;
    setDailyEntryRow([...xData]);
  };

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
              "/performance-management/individual-kpi/individual-kpi-approve"
            );
            dispatch(
              getReportAction(
                selectedBusinessUnit.value,
                enroll,
                11,
                0,
                0,
                false,
                1
              )
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
                    <b>Objective</b> : {location?.state?.objective}{" "}
                  </p>
                  <p style={{ fontSize: "14px", marginBottom: "0px" }}>
                    {" "}
                    <b>KPI</b> : {location?.state?.kpi}{" "}
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
                                min="0"
                                disabled={true}
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
                            >
                              <IInput
                                value={rowDto[index]?.numAchivment}
                                placeholder={itm?.achivment}
                                type="number"
                                min="0"
                                name="numAchivment"
                                step="any"
                                onClick={() => {
                                  setClickedMonth(
                                    Object.keys(target?.objHeader)[index]
                                  );
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
                        //disabled={values?.numAchivment > 0}
                        className="btn btn-primary btn-sm ml-2"
                        type="button"
                        onClick={() => saveDailyTargetRow(dailyEntryRow, getTarget)}
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
