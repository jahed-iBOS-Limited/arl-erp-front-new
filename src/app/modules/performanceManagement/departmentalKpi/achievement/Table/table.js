import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getYearDDLAction } from "../../../_redux/Actions";
import ICard from "../../../../_helper/_card";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useState } from "react";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import { getDepartmentDDLAction } from "../../../individualKpi/balancedScore/_redux/Actions";
import { OverlayTrigger } from "react-bootstrap";
import { Tooltip } from "@material-ui/core";
import Help from "../../../help/Help";
import { toast } from "react-toastify";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../View/mainForm.js";

export default function AchievementTable() {
  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        monthDDL: state.performanceChartTwo.monthDDL,
        departmentDDL: state.inDividualBalancedScore.departmentDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    monthDDL,
    departmentDDL,
  } = storeData;

  const dispatch = useDispatch();
  const [department, setDepartment] = useState({
    value: profileData?.departmentId,
    label: profileData?.departmentName,
  });
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getDepartmentDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL?.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));
    }
    setYear({ value: yearDDL[0]?.value, label: yearDDL[0]?.label });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL]);

  const [report, setReport] = useState({});

  useEffect(() => {
    if (department?.value) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        department?.value,
        11,
        0,
        0,
        false,
        2
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, department]);

  useEffect(() => {
    setFrom({ value: monthDDL[0]?.value, label: monthDDL[0]?.label });
    setTo({
      value: monthDDL[monthDDL.length - 1]?.value,
      label: monthDDL[monthDDL.length - 1]?.label,
    });
  }, [monthDDL]);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let depKpiResult = null;
  let depKpiResultPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 169) {
      depKpiResult = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 881) {
      depKpiResultPublic = userRole[i];
    }
  }

  return (
    <ICard
      title="DEPARTMENTAL KPI ACHIEVEMENT"
      isHelp={true}
      helpModalComponent={<Help />}
    >
      <div className="form-group row">
        <div className="col-lg">
          <label>Select Department</label>
          <Select
            onChange={(valueOption) => {
              setDepartment({
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
                2
              );
            }}
            isDisabled={!depKpiResultPublic?.isView}
            className="mb-3"
            value={department}
            styles={customStyles}
            label="Department"
            options={departmentDDL || []}
            name="department"
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
                department?.value,
                valueOption?.value,
                from?.value,
                to?.value,
                false,
                2
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
                department?.value,
                year?.value,
                valueOption?.value,
                to?.value,
                false,
                2
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
                department?.value,
                year?.value,
                from?.value,
                valueOption?.value,
                false,
                2
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
      </div>
      <div className="achievement">
        <PmsCommonTable
          ths={[
            { name: "BSC" },
            { name: "Objective" },
            { name: "KPI" },
            { name: "SRF" },
            { name: "Target" },
            { name: "Achievement" },
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
                            <span>Achi.</span>
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
                            if (depKpiResult?.isCreate) {
                              setCurrentItem({
                                kpiId: item.kpiId,
                                frId: item.intFrequency,
                                year: item?.intYearId,
                                enroll: department?.value,
                                selectedYear: year,
                                objective: item?.objective,
                                kpi: item?.kpi,
                                setReport,
                              });
                              setIsShowModal(true)
                            } else {
                              toast.warning("You don't have access");
                            }
                          }}
                        >
                          {item?.numAchivement}
                        </span>
                      </OverlayTrigger>
                    )}
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
