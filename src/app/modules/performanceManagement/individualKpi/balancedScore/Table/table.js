/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { useState } from "react";
import { getEmployeeDDLAction } from "../_redux/Actions";
import customStyles from "../../../../selectCustomStyle";
import {
  getEmployeeBasicInfoByIdAction,
  getReportAction,
  getYearDDLAction,
  setReportEmpty,
} from "../../../_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import ICard from "../../../../_helper/_card";
import { useHistory } from "react-router-dom";
// import IViewModal from "../../../../_helper/_viewModal";
// import ReportView from "../../../sbuKpi/reportView/ReportView";
import IView from "../../../../_helper/_helperIcons/_view";
import Help from "./../../../help/Help";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import { SetKPIScoreData } from "../../../../_helper/reduxForLocalStorage/Actions";

export default function BalancedTable() {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState("");
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const history = useHistory();
  // const [isShowModal, setIsShowModal] = useState(false);
  // const [currentItem, setCurrentItem] = useState("");

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

  const reports = useSelector((state) => state.performanceMgt?.reportData, {
    shallowEqual,
  });

  const [report, setReport] = useState({});

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
      setEmployee({
        value: profileData?.employeeId,
        label: profileData?.userName,
      });
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

  useEffect(() => {
    return () => {
      dispatch(setReportEmpty());
      dispatch(SetKPIScoreData(null))
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (employee?.value) {
      dispatch(
        getReportAction(
          selectedBusinessUnit.value,
          employee?.value,
          11,
          0,
          0,
          false,
          1
        )
      );

      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        employee?.value,
        11,
        0,
        0,
        false,
        1
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, employee]);

  useEffect(() => {
    setFrom({ value: monthDDL[0]?.value, label: monthDDL[0]?.label });
    setTo({
      value: monthDDL[monthDDL.length - 1]?.value,
      label: monthDDL[monthDDL.length - 1]?.label,
    });
  }, [monthDDL]);

  useEffect(() => {
    if (employee?.value) {
      dispatch(getEmployeeBasicInfoByIdAction(employee?.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let indScorecardPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 882) {
      indScorecardPublic = userRole[i];
    }
  }

  return (
    <div className="">
      <ICard
        title="INDIVIDUAL BALANCED SCORECARD
    "
        printTitle="Print Preview"
        isShowPrintPreviewBtn={true}
        isPrint={true}
        clickHandler={() =>
          history.push({
            pathname:
              "/performance-management/individual-kpi/individual-scorecard/print",
            state: { employee, year, from, to, employeeBasicInfo },
          })
        }
        isHelp={true}
        helpModalComponent={<Help />}
      >
        <div className="form-group row">
          <div className="col-lg">
            <label>Select Employee</label>
            <myComponent />
            <Select
              onChange={(valueOption) => {
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    valueOption?.value,
                    year?.value,
                    from?.value,
                    to?.value,
                    false,
                    1
                  )
                );
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

                setEmployee({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
              }}
              isDisabled={!indScorecardPublic?.isView}
              className="mb-3"
              value={employee}
              styles={customStyles}
              label="Employee"
              options={empDDL || []}
              name="employee"
            />
          </div>
          <div className="col-lg">
            <label>Select Year</label>
            <Select
              onChange={(valueOption) => {
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    employee?.value,
                    valueOption?.value,
                    from?.value,
                    to?.value,
                    false,
                    1
                  )
                );
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

                setYear({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
                dispatch(getMonthDDLAction(valueOption?.value));
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
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    employee?.value,
                    year?.value,
                    valueOption?.value,
                    to?.value,
                    false,
                    1
                  )
                );

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

                setFrom({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
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
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    employee?.value,
                    year?.value,
                    from?.value,
                    valueOption?.value,
                    false,
                    1
                  )
                );
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

                setTo({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
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
            <b> Enroll</b> : {employeeBasicInfo?.employeeId},{" "}
            <b> Designation</b> : {employeeBasicInfo?.designationName},{" "}
            <b> Department</b> : {employeeBasicInfo?.departmentName},{" "}
            <b> Supervisor</b> : {employeeBasicInfo?.supervisorName},{" "}
            <b> Sbu</b> : {employeeBasicInfo?.sbuName}, <b> Business Unit</b> :{" "}
            {employeeBasicInfo?.businessUnitName}
          </p>
        )}
        <div className="achievement bsc-print kpi-presentation-table-individual kpi-presentation-table">
          <PmsCommonTable
            ths={[
              { name: "BSC" },
              { name: "Objective" },
              { name: "KPI" },
              { name: "SRF" },
              { name: "Weight" },
              { name: "Target" },
              { name: "Achievement" },
              { name: "Progress" },
              { name: "Score" },
              { name: "Action", style: { width: "50px" } },
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
                      <div className="d-flex">
                        {indx !== report?.infoList.length - 1 && (
                          <div className="text-right">
                            {item?.progress}%{" "}
                            <i
                              className={`ml-2 fas fa-arrow-alt-${item?.arrowText}`}
                            ></i>
                          </div>
                        )}
                        {indx !== report?.infoList.length - 1 && (
                          <a
                            className="ml-3"
                            href={`${item?.strURL}`}
                            target="_blank"
                          >
                            <i
                              className={
                                item?.strURL
                                  ? "fas fa-link text-primary"
                                  : "fas fa-link"
                              }
                            ></i>
                          </a>
                        )}
                      </div>
                    </td>

                    <td>{item?.score}</td>

                    <td>
                      {indx !== report?.infoList.length - 1 && (
                        <div
                          className="text-primary pointer kpi-presentation-view text-center"
                          onClick={
                            () => {
                              dispatch(SetKPIScoreData({
                                employeeName:employee,
                                newData: reports,
                                report:item,
                                reports:report,
                                currentItem: {
                                  item,
                                  index: item?.flatIndex,
                                },
                                heading: "INDIVIDUAL BALANCED SCORECARD",
                                from: from,
                                to: to,
                                year,
                                reportIndex:indx
                              }))                             
                              window.open(
                                `${process.env.PUBLIC_URL}/individual-kpi-scorecard`,
                                "_blank"
                              );
                            }
                          }
                        >
                          <IView />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </PmsCommonTable>
        </div>
        {/* <IViewModal
          dialogClassName="kpi-presentation-report"
          show={isShowModal}
          onHide={() => setIsShowModal(false)}
        >
          <ReportView
            newData={reports}
            currentItem={currentItem}
            heading="INDIVIDUAL BALANCED SCORECARD"
            from={from}
            to={to}
            year={year}
          />
        </IViewModal> */}
      </ICard>
    </div>
  );
}
