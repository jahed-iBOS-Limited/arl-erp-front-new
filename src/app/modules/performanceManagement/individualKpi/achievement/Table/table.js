/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  getEmployeeBasicInfoByIdAction,
  getYearDDLAction,
} from "../../../_redux/Actions";
import ICard from "../../../../_helper/_card";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useState } from "react";
import { getEmployeeDDLAction } from "../../balancedScore/_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { downloadFile } from "../../../../_helper/downloadFile";
import { currentPyscalYear } from "./utils";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";
import IViewModal from "../../../../_helper/_viewModal";
import ViewForm from "../View/mainForm";

export default function AchievementTable() {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState("");
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [privacyType, setPrivecyType] = useState("1");

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

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let indKPIEntry = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 240) {
      indKPIEntry = userRole[i];
    }
  }

  const weight = (dataOne, itm,  i) =>{
    if(i < dataOne?.length -1 ){
      return itm?.numWeight;
    }else{
      function findWeight(data){
        let sum = 0;
        for (let i = 0 ; i < data?.length; i++ ){
        let item = data[i].dynamicList
              for (let j = 0 ; j < item?.length; j++){
                sum = sum + item[j].numWeight;
              }
      }
        return sum;
      }
      return findWeight(dataOne)

    }
    
  }

  //userRole Permission end
  return (
    <ICard title="INDIVIDUAL KPI">
      <div className="form-group row">
        <div className="row">
          <div className="col-lg ml-4 mt-6">
            <label className="mr-3">
              <input
                type="radio"
                name="privacyType"
                checked={privacyType === "1"}
                className="mr-1 pointer"
                style={{ position: "relative", top: "2px" }}
                onChange={(e) => {
                  setPrivecyType("1");
                }}
              />
              Private
            </label>
            {indKPIEntry?.isCreate ? (
              <label>
                <input
                  type="radio"
                  name="privacyType"
                  checked={privacyType === "2"}
                  className="mr-1 pointer"
                  style={{ position: "relative", top: "2px" }}
                  onChange={(e) => {
                    setPrivecyType("2");
                  }}
                />
                Public
              </label>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-lg-9"></div>
        <div className="col-lg-3">
          <label>Select Employee</label>
          <Select
            onChange={(valueOption) => {
              setEmployee({
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
                1
              );
            }}
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
                  <td> {weight(report?.infoList, item, indx)} </td>
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
