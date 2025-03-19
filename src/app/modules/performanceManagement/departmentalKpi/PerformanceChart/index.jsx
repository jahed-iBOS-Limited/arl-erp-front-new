/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import customStyles from "../../../selectCustomStyle";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { updateChartTypeAction, updateIsShownAction } from "./_redux/Actions";
import { useParams } from "react-router-dom";
import IHeart from "../../../_helper/_helperIcons/_heart";
import { getPmsReportAction } from "../../_helper/getReportAction";
import PmsCommonTable from "../../_helper/pmsCommonTable/PmsCommonTable";

export default function PerformanceChart({ values }) {
  const dispatch = useDispatch();
  const [chartType, setChartType] = useState({});
  const params = useParams();
  const { depId } = params;

  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  let { profileData, selectedBusinessUnit } = storeData;

  const [report, setReport] = useState({});

  useEffect(() => {
    if (values.from?.value && depId) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        depId,
        values?.year?.value,
        values?.from?.value,
        values?.to?.value,
        false,
        2
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, depId]);

  const callGetReportAction = () => {
    getPmsReportAction(
      setReport,
      selectedBusinessUnit.value,
      depId,
      values?.year?.value,
      values?.from?.value,
      values?.to?.value,
      false,
      2
    );
  };

  const updateIsShown = (kpiId, tf) => {
    dispatch(updateIsShownAction(kpiId, tf, callGetReportAction));
  };

  return (
    <div className="performance-chart">
      <PmsCommonTable
        ths={[
          { name: "BSC" },
          { name: "Objective" },
          { name: "KPI" },
          { name: "SRF" },
          { name: "Weight" },
          { name: "Target" },
          { name: "Ach." },
          { name: "Chart Type" },
          { name: "Chart" },
        ]}
      >
        {report?.infoList?.map((itm, indx) => (
          <>
            {itm.dynamicList.map((item, index) => (
              <tr>
                {index === 0 && (
                  <td
                    className={`bsc bsc${indx}`}
                    rowspan={itm.dynamicList.length}
                  >
                    <div>{itm?.bsc}</div>
                  </td>
                )}
                {item?.isParent && (
                  <td className="obj" rowspan={item?.numberOfChild}>
                    {" "}
                    {item?.parentName}{" "}
                  </td>
                )}
                <td> {item?.label} </td>
                <td> {item?.strFrequency} </td>
                <td> {item?.numWeight} </td>
                <td> {item?.numTarget} </td>
                <td> {item?.numAchivement} </td>
                <td>
                  {indx !== report?.infoList.length - 1 && (
                    <div
                      className="perform-select"
                      style={{ height: "100%", zIndex: "9999", width: "90px" }}
                    >
                      <Select
                        isSearchable={true}
                        styles={customStyles}
                        defaultValue={{
                          value: item.chart_type,
                          label: item.chart_type_label,
                        }}
                        options={[
                          { value: 1, label: "Bar" },
                          { value: 2, label: "Donut" },
                          { value: 3, label: "Gauge" },
                        ]}
                        placeholder="Select"
                        onChange={(valueOption) => {
                          setChartType({
                            value: valueOption?.value,
                            label: valueOption?.label,
                          });
                          dispatch(
                            updateChartTypeAction(
                              item?.kpiId,
                              valueOption?.value,
                              callGetReportAction
                            )
                          );
                        }}
                      />
                    </div>
                  )}
                </td>

                <td>
                  {indx !== report?.infoList.length - 1 &&
                    (item?.chart_type === 1 ? (
                      <div className="d-flex justify-content-between">
                        <i
                          style={{ fontSize: "22px", color: "#34495e" }}
                          className="far fa-chart-bar"
                        ></i>
                        <IHeart
                          updateIsShown={updateIsShown}
                          isShown={item.isShown}
                          kpiId={item.kpiId}
                          classNames="i-heart-position"
                        />
                      </div>
                    ) : item?.chart_type === 2 ? (
                      <div className="d-flex justify-content-between">
                        <i
                          style={{ fontSize: "22px", color: "#3498db" }}
                          className="fas fa-dot-circle"
                        ></i>
                        <IHeart
                          updateIsShown={updateIsShown}
                          isShown={item.isShown}
                          kpiId={item.kpiId}
                          classNames="i-heart-position"
                        />
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between">
                        <i
                          style={{ fontSize: "22px", color: "#e67e22" }}
                          className="fas fa-tachometer-alt"
                        ></i>
                        <IHeart
                          updateIsShown={updateIsShown}
                          isShown={item.isShown}
                          kpiId={item.kpiId}
                          classNames="i-heart-position"
                        />
                      </div>
                    ))}
                </td>
              </tr>
            ))}
          </>
        ))}
      </PmsCommonTable>
    </div>
  );
}
