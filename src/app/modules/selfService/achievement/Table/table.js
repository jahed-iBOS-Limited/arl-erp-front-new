/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  getEmployeeBasicInfoByIdAction,
  getYearDDLAction,
} from "../../../performanceManagement/_redux/Actions";
import ICard from "../../../_helper/_card";
import Select from "react-select";
import customStyles from "../../../selectCustomStyle";
import { useState } from "react";
import { getEmployeeDDLAction } from "../../../performanceManagement/individualKpi/balancedScore/_redux/Actions";
import { getMonthDDLAction } from "../../../performanceManagement/individualKpi/PerformanceChart/_redux/Actions";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import { downloadFile } from "../../../_helper/downloadFile";
import { currentPyscalYear } from "./utils";
import { getPmsReportAction } from "../../../performanceManagement/_helper/getReportAction";
import PmsCommonTable from "../../../performanceManagement/_helper/pmsCommonTable/PmsCommonTable";
import IViewModal from "../../../_helper/_viewModal";
import ViewForm from "../View/mainForm";

export default function AchievementTable() {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState("");
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [privacyType] = useState("1");

  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        monthDDL: state.performanceChartTwo.monthDDL,
        empDDL: state.inDividualBalancedScore.employeeDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    monthDDL,
    empDDL,
  } = storeData;

  // get employee basic info from store
  const employeeBasicInfo = useSelector((state) => {
    return state?.performanceMgt?.employeeBasicInfo;
  }, shallowEqual);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getEmployeeDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
    }
    setEmployee({
      value: profileData?.employeeId,
      label: profileData?.employeeFullName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL?.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));
    }
    let pyscalYear = currentPyscalYear(yearDDL);
    setYear(pyscalYear);
  }, [yearDDL]);

  useEffect(() => {
    setFrom({ value: monthDDL[0]?.value, label: monthDDL[0]?.label });
    setTo({
      value: monthDDL[monthDDL.length - 1]?.value,
      label: monthDDL[monthDDL.length - 1]?.label,
    });
  }, [monthDDL]);

  const [report, setReport] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  // june = 13;
  // july = 24;
  useEffect(() => {
    if (employee?.value && yearDDL.length > 0) {
      let pyscalYear = currentPyscalYear(yearDDL);

      getPmsReportAction(
        setReport,
        selectedBusinessUnit?.value,
        employee?.value,
        pyscalYear?.value,
        13,
        24,
        false,
        1
      );
    }
  }, [selectedBusinessUnit, employee, yearDDL]);

  useEffect(() => {
    if (employee?.value) {
      dispatch(getEmployeeBasicInfoByIdAction(employee?.value));
    }
  }, [employee]);

  return (
    <ICard title="INDIVIDUAL KPI">
      <div className="form-group row">
        <div className="col-lg-3">
          <label>Select Employee</label>
          <Select
            onChange={(valueOption) => {}}
            isDisabled={privacyType === "1"}
            className="mb-3"
            value={employee}
            styles={customStyles}
            label="Employee"
            options={empDDL || []}
            name="employee"
          />
        </div>
        <div className="col-lg-3">
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
                employee?.value,
                valueOption?.value,
                from?.value,
                to?.value,
                false,
                1
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
        <div className="col-lg-3">
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
                employee?.value,
                year?.value,
                valueOption?.value,
                to?.value,
                false,
                1
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

        <div className="col-lg-3">
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
                employee?.value,
                year?.value,
                from?.value,
                valueOption?.value,
                false,
                1
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
      {employeeBasicInfo && (
        <p className="mt-3 employee_info">
          <b> Enroll</b> : {employeeBasicInfo?.employeeId}, <b> Designation</b>{" "}
          : {employeeBasicInfo?.designationName}, <b> Department</b> :{" "}
          {employeeBasicInfo?.departmentName}, <b> Supervisor</b> :{" "}
          {employeeBasicInfo?.supervisorName}, <b> Sbu</b> :{" "}
          {employeeBasicInfo?.sbuName}, <b> Business Unit</b> :{" "}
          {employeeBasicInfo?.businessUnitName}
        </p>
      )}
      <div className="text-right mb-1">
        <ButtonStyleOne
          label="Export Excel"
          style={{ padding: "6px 8px" }}
          type="button"
          onClick={() => {
            downloadFile(
              `/pms/Kpi2/GetKpiReportDownload?intUnitID=${selectedBusinessUnit?.value}&ReportTypeReffId=${employee?.value}&intYearId=${year?.value}&intFromMonthId=${from?.value}&intToMonthId=${to?.value}&isDashBoard=false&ReportType=1`,
              "Individual KPI",
              "xlsx"
            );
          }}
        />
      </div>
      <div className="achievement">
        <PmsCommonTable
          ths={[
            { name: "BSC" },
            { name: "Objective" },
            { name: "KPI" },
            { name: "SRF" },
            { name: "Weight" },
            { name: "Benchmark" },
            { name: "Target" },
            { name: "Ach." },
            { name: "Progress" },
            { name: "Score" },
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
                  <td> {item?.benchmark} </td>
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
                            setCurrentItem({
                              kpiId: item.kpiId,
                              frId: item.intFrequency,
                              year: item?.intYearId,
                              enroll: employee?.value,
                              selectedYear: year,
                              objective: item?.objective,
                              kpi: item?.kpi,
                              setReport,
                            });
                            setIsShowModal(true);
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
                  <td>{item?.score}</td>
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
