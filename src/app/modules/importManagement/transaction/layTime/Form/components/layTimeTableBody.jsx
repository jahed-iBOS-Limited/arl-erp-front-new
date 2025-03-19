import React from "react";
// import FormikInput from "../../../_chartinghelper/common/formikInput";
// import FormikSelect from "../../../_chartinghelper/common/formikSelect";
// import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
// import IEdit from "../../../_chartinghelper/icons/_edit";
// import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
// import IDelete from "../../../_chartinghelper/_delete";
// import { _formatMoney } from "../../../_chartinghelper/_formatMoney";

import {
  daysToSeconds,
  DDHHMMToDays,
  editRowDataHandler,
  hourDDL,
  minDDL,
  removeRowData,
  renderPlusUpdateTotalTimeAndRemainingTime,
  saveEditRowDataHandler,
  toDDHHMM,
  totalSecondCalculate,
} from "../utils";
import { LayTimeTableHeader } from "./layTimeTableHeader";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import FormikSelect from "../../../../../chartering/_chartinghelper/common/formikSelect";
import customStyles from "../../../../../chartering/_chartinghelper/common/selectCustomStyle";
import FormikInput from "../../../../../chartering/_chartinghelper/common/formikInput";
import IEdit from "../../../../../chartering/_chartinghelper/icons/_edit";
import IDelete from "../../../../../chartering/_chartinghelper/_delete";
import { _formatMoney } from "../../../../../chartering/_chartinghelper/_formatMoney";

export default function LayTimeTableBody({
  rowData,
  values,
  setRowData,
  hideDeleteBtn,
  errors,
  touched,
  viewType,
}) {
  let timeDemurage = 0;
  let actualTimeUsed =
    timeDemurage + daysToSeconds(+values?.timeAllowedForLoading);

  const calculateTimeDemurage = (item) => {
    if (item?.isDemurage) {
      timeDemurage = timeDemurage + +totalSecondCalculate(item?.usedTime);
    }
  };

  const calculateTimeDespatch = () => {
    let totalTime = 0;
    for (let i = 0; i < rowData?.length; i++) {
      let item = rowData[i];
      for (let j = 0; j < item?.rowlist?.length; j++) {
        let nestedItem = item?.rowlist[j];

        if (!nestedItem?.isDemurage) {
          totalTime = totalTime + +totalSecondCalculate(nestedItem?.usedTime);
        }
      }
    }

    if (+DDHHMMToDays(toDDHHMM(totalTime)) === +values?.timeAllowedForLoading) {
      totalTime = 0;
    } else {
      totalTime = +daysToSeconds(+values?.timeAllowedForLoading) - totalTime;
    }

    return totalTime;
  };

  /* Handle Nested Row Data's Value */
  const rowDataUpdateHandler = (
    index,
    nestedIndex,
    name,
    value,
    rowData,
    setRowData
  ) => {
    const copy = [...rowData];
    if (copy[index].rowlist.length) {
      copy[index].rowlist[nestedIndex][name] = value;
      setRowData(copy);
    }
  };

  /* HH:MM format to HH/MM {value, label} */
  const valueLabelMakerForRowTimeInputDDL = (time, mm) => {
    if (!time) return "";
    let splitedTime = time?.split(":");
    return {
      value: !mm ? splitedTime[0] : splitedTime[1],
      label: !mm ? splitedTime[0] : splitedTime[1],
    };
  };

  /* Make a dropdown value to Formatted Time */
  const timeSetterForRowEditHandler = (
    valueOption,
    type,
    format,
    /*  */
    index,
    nestedIndex,
    rowData,
    setRowData
  ) => {
    const currentObj = rowData[index]?.rowlist[nestedIndex];

    switch (type) {
      /* From Time Condition Goes Here!! */
      case "from":
        switch (format) {
          case "HH":
            valueOption?.value &&
              rowDataUpdateHandler(
                index,
                nestedIndex,
                "workingTimeFrom",
                `${valueOption?.value}:00`,
                rowData,
                setRowData
              );
            break;

          default:
            valueOption?.value &&
              rowDataUpdateHandler(
                index,
                nestedIndex,
                "workingTimeFrom",
                `${
                  valueLabelMakerForRowTimeInputDDL(currentObj?.workingTimeFrom)
                    ?.value
                }:${valueOption?.value}`,
                rowData,
                setRowData
              );
            break;
        }
        break;

      /* To Time Condition Goes Here */
      default:
        switch (format) {
          case "HH":
            valueOption?.value &&
              rowDataUpdateHandler(
                index,
                nestedIndex,
                "workingTime",
                `${valueOption?.value}:00`,
                rowData,
                setRowData
              );
            break;

          default:
            valueOption?.value &&
              rowDataUpdateHandler(
                index,
                nestedIndex,
                "workingTime",
                `${
                  valueLabelMakerForRowTimeInputDDL(currentObj?.workingTime)
                    ?.value
                }:${valueOption?.value}`,
                rowData,
                setRowData
              );
            break;
        }
        break;
    }
  };

  return (
    <>
     <div className="table-responsive">
     <table className="table mt-3 bj-table bj-table-landing">
        <LayTimeTableHeader hideDeleteBtn={hideDeleteBtn} />
        <tbody style={{ fontSize: "15px" }}>
          {rowData?.map((item, index) => {
            return (
              <>
                <tr style={{ borderTop: "1px solid #d6d6d6" }} key={index + 1}>
                  <td
                    className="text-center text-middle"
                    rowSpan={item?.rowlist?.length + 1}
                    colSpan={1}
                    style={{ width: "100px", verticalAlign: "middle" }}
                  >
                    {_dateFormatter(item?.layTimeDate)}
                  </td>
                  <td
                    style={{ width: "60px", verticalAlign: "middle" }}
                    className="text-center text-middle"
                    rowSpan={item?.rowlist?.length + 1}
                    colSpan={1}
                  >
                    {item?.layhTimeDay}
                  </td>
                </tr>
                {item?.rowlist?.map((nesItem, nestedIndex) => (
                  <tr>
                    {renderPlusUpdateTotalTimeAndRemainingTime(
                      index,
                      nestedIndex,
                      nesItem?.usedTime,
                      values,
                      rowData
                    )}
                    {calculateTimeDemurage(nesItem)}

                    <td
                      className="text-center"
                      style={{
                        width: nesItem?.isEdit ? "140px" : "80px",
                        verticalAlign: "middle",
                      }}
                    >
                      {nesItem?.isEdit ? (
                        <div className="w-100">
                          <div className="d-flex">
                            <div style={{ width: "50%" }}>
                              <FormikSelect
                                value={valueLabelMakerForRowTimeInputDDL(
                                  nesItem?.workingTimeFrom
                                )}
                                name={`workingTimeFromHH ${nestedIndex}`}
                                isSearchable={true}
                                options={hourDDL() || []}
                                styles={customStyles}
                                onChange={(valueOption) => {
                                  timeSetterForRowEditHandler(
                                    valueOption,
                                    "from",
                                    "HH",
                                    /*  */
                                    index,
                                    nestedIndex,
                                    rowData,
                                    setRowData
                                  );
                                }}
                                placeholder="HH"
                                errors={errors}
                                touched={touched}
                                isClearable={false}
                              />
                            </div>
                            <div style={{ width: "50%" }}>
                              <FormikSelect
                                value={valueLabelMakerForRowTimeInputDDL(
                                  nesItem?.workingTimeFrom,
                                  "mm"
                                )}
                                name={`workingTimeFromMM ${nestedIndex}`}
                                isSearchable={true}
                                options={minDDL() || []}
                                styles={customStyles}
                                onChange={(valueOption) => {
                                  timeSetterForRowEditHandler(
                                    valueOption,
                                    "from",
                                    "MM",
                                    /*  */
                                    index,
                                    nestedIndex,
                                    rowData,
                                    setRowData
                                  );
                                }}
                                placeholder="MM"
                                errors={errors}
                                isDisabled={
                                  nesItem?.workingTimeFrom === "24:00"
                                }
                                touched={touched}
                                isClearable={false}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        nesItem?.workingTimeFrom
                      )}
                    </td>
                    <td
                      className="text-center"
                      style={{
                        width: nesItem?.isEdit ? "140px" : "80px",
                        verticalAlign: "middle",
                      }}
                    >
                      {nesItem?.isEdit ? (
                        <div className="w-100">
                          <div className="d-flex">
                            <div style={{ width: "50%" }}>
                              <FormikSelect
                                value={valueLabelMakerForRowTimeInputDDL(
                                  nesItem?.workingTime
                                )}
                                name={`workingToHH ${nestedIndex}`}
                                isSearchable={true}
                                options={hourDDL() || []}
                                styles={customStyles}
                                onChange={(valueOption) => {
                                  timeSetterForRowEditHandler(
                                    valueOption,
                                    "to",
                                    "HH",
                                    /*  */
                                    index,
                                    nestedIndex,
                                    rowData,
                                    setRowData
                                  );
                                }}
                                placeholder="HH"
                                errors={errors}
                                touched={touched}
                                isClearable={false}
                              />
                            </div>
                            <div style={{ width: "50%" }}>
                              <FormikSelect
                                value={valueLabelMakerForRowTimeInputDDL(
                                  nesItem?.workingTime,
                                  "mm"
                                )}
                                name={`workingToHH ${nestedIndex}`}
                                isSearchable={true}
                                options={minDDL() || []}
                                styles={customStyles}
                                onChange={(valueOption) => {
                                  timeSetterForRowEditHandler(
                                    valueOption,
                                    "to",
                                    "MM",
                                    /*  */
                                    index,
                                    nestedIndex,
                                    rowData,
                                    setRowData
                                  );
                                }}
                                placeholder="MM"
                                isDisabled={nesItem?.workingTime === "24:00"}
                                errors={errors}
                                touched={touched}
                                isClearable={false}
                              />
                            </div>
                          </div>
                        </div>
                      ) : nesItem?.workingTime === "00:00" ? (
                        "24:00"
                      ) : (
                        nesItem?.workingTime
                      )}
                    </td>
                    <td
                      className="text-center"
                      style={{ width: "80px", verticalAlign: "middle" }}
                    >
                      {nesItem?.isEdit ? (
                        <FormikInput
                          value={nesItem?.ratio}
                          name={`ratio ${nestedIndex}`}
                          type="number"
                          errors={errors}
                          onChange={(e) => {
                            if (e.target.value <= 200) {
                              rowDataUpdateHandler(
                                index,
                                nestedIndex,
                                "ratio",
                                e.target.value,
                                rowData,
                                setRowData
                              );
                            }
                          }}
                          touched={touched}
                        />
                      ) : (
                        <>
                          {nesItem?.ratio}
                          {"%"}
                        </>
                      )}
                    </td>
                    <td
                      className="text-center"
                      style={{ width: "100px", verticalAlign: "middle" }}
                    >
                      {nesItem?.isEdit ? "-" : nesItem?.usedTime}
                    </td>
                    <td
                      className="text-center"
                      style={{ width: "100px", verticalAlign: "middle" }}
                    >
                      {nesItem?.isEdit ? "-" : nesItem?.totalTime}
                    </td>
                    <td
                      className="text-center"
                      style={{ width: "110px", verticalAlign: "middle" }}
                    >
                      {nesItem?.isEdit ? "-" : nesItem?.remainingTime}
                    </td>
                    <td
                      className="text-left"
                      style={{ verticalAlign: "middle" }}
                    >
                      {nesItem?.isEdit ? (
                        <FormikInput
                          value={nesItem?.remark}
                          name={`remark ${nestedIndex}`}
                          type="text"
                          errors={errors}
                          touched={touched}
                          onChange={(e) => {
                            rowDataUpdateHandler(
                              index,
                              nestedIndex,
                              "remark",
                              e.target.value,
                              rowData,
                              setRowData
                            );
                          }}
                        />
                      ) : (
                        <>{nesItem?.remark}</>
                      )}
                    </td>
                    {!hideDeleteBtn && (
                      <td style={{ width: "80px" }}>
                        <div className="d-flex justify-content-center">
                          {nesItem?.isEdit ? (
                            <span
                              className="mr-2 animate-pulse"
                              style={{ cursor: "pointer", color: "green" }}
                              onClick={() => {
                                saveEditRowDataHandler(
                                  index,
                                  nestedIndex,
                                  rowData,
                                  setRowData,
                                  values,
                                  nesItem,
                                  item
                                );
                              }}
                            >
                              <i
                                style={{ color: "green" }}
                                className={`fas fa-check-circle pointer`}
                              ></i>
                            </span>
                          ) : (
                            <span
                              className="mr-2"
                              style={{ cursor: "pointer", color: "blue" }}
                              onClick={() => {
                                editRowDataHandler(
                                  index,
                                  nestedIndex,
                                  rowData,
                                  setRowData,
                                  values
                                );
                              }}
                            >
                              <IEdit />
                            </span>
                          )}

                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              removeRowData(
                                index,
                                nestedIndex,
                                rowData,
                                setRowData
                              );
                            }}
                          >
                            <IDelete />
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </>
            );
          })}

          {/* Total Days */}
          {rowData?.length > 0 ? (
            <>
              {timeDemurage > 0 ? (
                <tr>
                  <td colSpan="6"></td>
                  <td colSpan="1" className="text-center font-weight-bold">
                    {toDDHHMM(timeDemurage)}
                  </td>
                  <td colSpan="3"></td>
                </tr>
              ) : null}

              {/* Other's Section */}
              <tr>
                <td colSpan="10">
                  <div className="p-2"></div>
                </td>
              </tr>
              <tr>
                <td
                  className="text-left font-weight-bold"
                  colSpan={3}
                  rowSpan={1}
                >
                  Time allowed for{" "}
                  {values?.layTimeType?.value === 1 ? "Loading" : "Discharging"}
                </td>
                <td
                  className="text-right font-weight-bold"
                  colSpan={1}
                  rowSpan={1}
                >
                  {+values?.timeAllowedForLoading}
                </td>
                <td className="font-weight-bold" colSpan={1} rowSpan={1}>
                  DAYS
                </td>
                <td colSpan={5} rowSpan={1}></td>
              </tr>

              <tr>
                <td
                  className="text-left font-weight-bold"
                  colSpan={3}
                  rowSpan={1}
                >
                  Actual time used
                </td>
                <td
                  className="text-right font-weight-bold"
                  colSpan={1}
                  rowSpan={1}
                >
                  {timeDemurage > 0
                    ? DDHHMMToDays(toDDHHMM(actualTimeUsed + timeDemurage))
                    : timeDemurage === +calculateTimeDespatch()
                    ? +values?.timeAllowedForLoading
                    : DDHHMMToDays(
                        toDDHHMM(
                          +daysToSeconds(+values?.timeAllowedForLoading) -
                            calculateTimeDespatch()
                        )
                      )}
                </td>
                <td className="font-weight-bold" colSpan={1} rowSpan={1}>
                  DAYS
                </td>
                <td colSpan={5} rowSpan={1}></td>
              </tr>

              {/* Time Despatch */}
              {timeDemurage === 0 && calculateTimeDespatch() > 0 ? (
                <>
                  <tr>
                    <td
                      className="text-left font-weight-bold"
                      colSpan={3}
                      rowSpan={1}
                    >
                      {"Time Despatch"}
                    </td>
                    <td
                      className="text-right font-weight-bold"
                      colSpan={1}
                      rowSpan={1}
                    >
                      {DDHHMMToDays(toDDHHMM(calculateTimeDespatch()))}
                    </td>
                    <td className="font-weight-bold" colSpan={1} rowSpan={1}>
                      DAYS
                    </td>
                    <td colSpan={5} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td
                      className="text-left font-weight-bold"
                      colSpan={3}
                      rowSpan={1}
                    >
                      {"Despatch dues"}
                    </td>
                    <td
                      className="text-right font-weight-bold"
                      colSpan={1}
                      rowSpan={1}
                    >
                      {_formatMoney(
                        (
                          +DDHHMMToDays(toDDHHMM(calculateTimeDespatch())) *
                          +values?.despatchRate
                        )?.toFixed(0)
                      )}
                    </td>
                    <td className="font-weight-bold" colSpan={1} rowSpan={1}>
                      USD
                    </td>
                    <td className="font-weight-bold" colSpan={5} rowSpan={1}>
                      (US Dollars only).
                    </td>
                  </tr>
                </>
              ) : null}

              {/* Time Demurrage */}
              {timeDemurage > 0 ? (
                <>
                  <tr>
                    <td
                      className="text-left font-weight-bold"
                      colSpan={3}
                      rowSpan={1}
                    >
                      {"Time Demurrage"}
                    </td>
                    <td
                      className="text-right font-weight-bold"
                      colSpan={1}
                      rowSpan={1}
                    >
                      {DDHHMMToDays(toDDHHMM(timeDemurage))}
                    </td>
                    <td className="font-weight-bold" colSpan={1} rowSpan={1}>
                      DAYS
                    </td>
                    <td colSpan={5} rowSpan={1}></td>
                  </tr>
                  <tr>
                    <td
                      className="text-left font-weight-bold"
                      colSpan={3}
                      rowSpan={1}
                    >
                      {"Demurrage dues"}
                    </td>
                    <td
                      className="text-right font-weight-bold"
                      colSpan={1}
                      rowSpan={1}
                    >
                      {_formatMoney(
                        (
                          +DDHHMMToDays(toDDHHMM(timeDemurage)) *
                          +values?.demurrageRate
                        )?.toFixed(0)
                      )}
                    </td>
                    <td className="font-weight-bold" colSpan={1} rowSpan={1}>
                      USD
                    </td>
                    <td className="font-weight-bold" colSpan={5} rowSpan={1}>
                      (US Dollars only).
                    </td>
                  </tr>
                </>
              ) : null}
            </>
          ) : null}
        </tbody>
      </table>
     </div>
    </>
  );
}
