/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getYearDDLAction } from "../../../_redux/Actions";
import ICard from "../../../../_helper/_card";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useState } from "react";
import { getSbuDDLAction } from "../../balancedScore/_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "@material-ui/core";
import "./table.css";
import Help from "../../../help/Help";
import { toast } from "react-toastify";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../View/mainForm";

export default function AchievementTable() {
  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        monthDDL: state.performanceChartTwo.monthDDL,
        sbuDDL: state.inDividualBalancedScore.sbuDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    monthDDL,
    sbuDDL,
  } = storeData;

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  const dispatch = useDispatch();
  const [report, setReport] = useState({});
  const [sbu, setSbu] = useState({
    value: profileData?.sbuId,
    label: profileData?.sbuName,
  });
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [section, setSection] = useState({ value: 0, label: "None" });

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getSbuDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL?.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));
    }
    setYear({ value: yearDDL[0]?.value, label: yearDDL[0]?.label });
  }, [yearDDL]);

  useEffect(() => {
    if (sbu?.value) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        sbu?.value,
        11,
        0,
        0,
        false,
        3
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, sbu]);

  useEffect(() => {
    setFrom({ value: monthDDL[0]?.value, label: monthDDL[0]?.label });
    setTo({
      value: monthDDL[monthDDL.length - 1]?.value,
      label: monthDDL[monthDDL.length - 1]?.label,
    });
  }, [monthDDL]);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let sbuKpiResult = null;
  let sbuKpiResultPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 175) {
      sbuKpiResult = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 879) {
      sbuKpiResultPublic = userRole[i];
    }
  }

  return (
    <ICard
      title="SBU KPI ACHIEVEMENT"
      isHelp={true}
      helpModalComponent={<Help />}
    >
      <div className="form-group row sbu-kpi-achievement">
        <div className="col-lg">
          <label>Select SBU</label>
          <Select
            onChange={(valueOption) => {
              setSbu({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                valueOption?.value,
                year?.value,
                from?.value,
                to?.value,
                false,
                3,
                section?.value
              );
            }}
            isDisabled={!sbuKpiResultPublic?.isView}
            className="mb-3"
            value={sbu}
            styles={customStyles}
            label="SBU"
            options={sbuDDL}
            name="sbu"
          />
        </div>
        <div className="col-lg">
          <label>Select Year</label>
          <Select
            onChange={(valueOption) => {
              setYear({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              dispatch(getMonthDDLAction(valueOption?.value));
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                sbu?.value,
                valueOption?.value,
                from?.value,
                to?.value,
                false,
                3,
                section?.value
              );
            }}
            className="mb-3"
            value={year}
            styles={customStyles}
            label="Year"
            options={yearDDL || []}
            name="year"
          />
        </div>
        <div className="col-lg">
          <label>Select From Month</label>
          <Select
            onChange={(valueOption) => {
              setFrom({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                sbu?.value,
                year?.value,
                valueOption?.value,
                to?.value,
                false,
                3,
                section?.value
              );
            }}
            className="mb-3"
            value={from}
            styles={customStyles}
            label="From month"
            options={monthDDL || []}
            name="from"
            isDisabled={!year}
          />
        </div>

        <div className="col-lg">
          <label>Select To Month</label>
          <Select
            onChange={(valueOption) => {
              setTo({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                sbu?.value,
                year?.value,
                from?.value,
                valueOption?.value,
                false,
                3,
                section?.value
              );
            }}
            className="mb-3"
            value={to}
            styles={customStyles}
            label="To month"
            options={monthDDL || []}
            name="to"
            isDisabled={!year}
          />
        </div>
        <div className="col-lg">
          <label>Select Section</label>
          <Select
            options={[
              { value: 0, label: "None" },
              { value: 1, label: "Production" },
              { value: 2, label: "Sales" },
            ]}
            name="section"
            styles={customStyles}
            value={section}
            onChange={(valueOption) => {
              setSection(valueOption);
              getPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                sbu?.value,
                year?.value,
                from?.value,
                to?.value,
                false,
                3,
                valueOption?.value
              );
            }}
          />
        </div>
      </div>
      <div className="achievement">
        <PmsCommonTable
          ths={[
            { name: "BSC" },
            { name: "Objective" },
            { name: "KPI" },
            { name: "SRF" },
            { name: "Target" },
            { name: "Ach." },
            { name: "Achievement (%)" },
            { name: "Progress" },
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
                  <td> {item?.numTarget} </td>
                  <td>
                    {indx !== report?.infoList.length - 1 && (
                      <OverlayTrigger
                        overlay={
                          <Tooltip className="mytooltip" id="info-tooltip">
                            <span>Achievement Entry</span>
                          </Tooltip>
                        }
                      >
                        <span
                          style={{
                            padding: "16px 16px",
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            if (sbuKpiResult?.isCreate) {
                              // history.push({
                              //   pathname: `/performance-management/sbu-kpi/achievement/view/${item.kpiId}/${item.intFrequency}/${item?.intYearId}/${sbu?.value}`,
                              //   state: item,
                              // });
                              setCurrentItem({
                                kpiId: item.kpiId,
                                frId: item.intFrequency,
                                year: item?.intYearId,
                                enroll: sbu?.value,
                                selectedYear: year,
                                objective: item?.objective,
                                kpi: item?.kpi,
                                setReport,
                              });
                              setIsShowModal(true);
                            } else {
                              toast.warning("You don't have access");
                            }
                          }}
                        >
                          {item?.numAchivement}
                        </span>
                      </OverlayTrigger>
                    )}{" "}
                  </td>
                  <td>
                    {indx !== report?.infoList.length - 1 && (
                      <div className="text-right">
                        {item?.progress}%{" "}
                        <i
                          className={`ml-2 fas fa-arrow-alt-${item?.arrowText}`}
                        ></i>
                      </div>
                    )}
                  </td>

                  <td
                    className={
                      indx !== report?.infoList.length - 1
                        ? item?.progress >= 80
                          ? "green"
                          : item?.progress >= 60
                          ? "yellow"
                          : "red"
                        : ""
                    }
                  >
                    {indx !== report?.infoList.length - 1 && <div></div>}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </PmsCommonTable>
      </div>
      <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
        <ViewForm currentItem={currentItem} />
      </IViewModal>
    </ICard>
  );
}
