/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  getEmployeeBasicInfoByIdAction,
  getYearDDLAction,
} from "../../../_redux/Actions";
import ICard from "../../../../_helper/_card";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useState } from "react";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import { getEmployeeNameBySupervisorDDL_api } from "../View/helper";
import IConfirmModal from "../../../../_helper/_confirmModal";
import {
  saveAproveKPI_api_action,
  saveRejectKPI_api_action,
} from "../_redux/Actions";
import { getDepartmentDDL } from "../helper";
import { getUnapprovedPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTable from "../../../_helper/pmsCommonTable/PmsCommonTable";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";

export default function ApproveTable() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [departmentDDL, setDepartmentDDL] = useState([]);
  const [employee, setEmployee] = useState("");
  const [department, setDepartment] = useState("");
  const [employeeSupervisor, setEmployeeSupervisor] = useState("");
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false)

  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        monthDDL: state.performanceChartTwo.monthDDL,
        newKpiReport: state.performanceMgt?.newKpiReport,
      };
    },
    { shallowEqual }
  );
  let { profileData, selectedBusinessUnit, yearDDL, monthDDL } = storeData;

  // get employee basic info from store
  const employeeBasicInfo = useSelector((state) => {
    return state?.performanceMgt?.employeeBasicInfo;
  }, shallowEqual);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getDepartmentDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        setDepartmentDDL
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
  }, [yearDDL]);

  const [report, setReport] = useState({});

  useEffect(() => {
    if (employee?.value) {
      getUnapprovedPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        employee?.value,
        11,
        0,
        0,
        false,
        1,
        setLoading
      );
    }
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
  }, [employee]);

  const callbackFunc = () => {
    getUnapprovedPmsReportAction(
      setReport,
      selectedBusinessUnit?.value,
      employee?.value,
      year?.value,
      from?.value,
      to?.value,
      false,
      1,
      setLoading
    );
  };

  const approveAllKpi = () => {
    let data = [];

    for (let i = 0; i < report.infoList.length - 1; i++) {
      for (let j = 0; j < report.infoList[i].dynamicList.length; j++) {
        data.push(report.infoList[i].dynamicList[j].kpiId);
      }
    }
    if (data.length < 1) return toast.warn("No data found for approve");
    dispatch(saveAproveKPI_api_action({ids : data}, callbackFunc, setLoading));
  };

  const approvalHandler = (isApproved, id) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // if approve btn click
      if (isApproved === "approve") {
        let confirmObject = {
          title: "Are you sure?",
          message: `Do you want to post the selected Approve ?`,
          yesAlertFunc: async () => {
            const payload = {
              ids: [id],
            };
            dispatch(saveAproveKPI_api_action(payload, callbackFunc,setLoading));
          },
          noAlertFunc: () => {},
        };
        IConfirmModal(confirmObject);
      } else {
        // if reject btn click
        let confirmObject = {
          title: "Are you sure?",
          message: `Do you want to post the selected Reject ?`,
          yesAlertFunc: async () => {
            const payload = {
              ids: [id],
            };
            dispatch(saveRejectKPI_api_action(payload, callbackFunc));
          },
          noAlertFunc: () => {},
        };
        IConfirmModal(confirmObject);
      }
    } else {
    }
  };

  return (
    <ICard title="INDIVIDUAL KPI APPROVE">
      {loading && <Loading />}
      <div className="form-group row">
        <div className="col-lg">
          <label>Select Department</label>
          <Select
            onChange={(valueOption) => {
              setDepartment({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              setEmployee("");
              getEmployeeNameBySupervisorDDL_api(
                profileData?.accountId,
                selectedBusinessUnit?.value,
                profileData?.userId,
                valueOption?.value,
                setEmployeeSupervisor
              );
            }}
            className="mb-3"
            value={department}
            styles={customStyles}
            placeholder="Department"
            options={departmentDDL || []}
            name="department"
          />
        </div>
        <div className="col-lg">
          <label>Select Employee</label>
          <Select
            onChange={(valueOption) => {
              setEmployee({
                value: valueOption?.value,
                label: valueOption?.label,
              });
              getUnapprovedPmsReportAction(
                setReport,
                selectedBusinessUnit?.value,
                valueOption?.value,
                year?.value,
                from?.value,
                to?.value,
                false,
                1,
                setLoading
              );
            }}
            className="mb-3"
            value={employee}
            styles={customStyles}
            placeholder="Employee Name"
            options={employeeSupervisor || []}
            name="employee"
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
              getUnapprovedPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                employee?.value,
                valueOption?.value,
                from?.value,
                to?.value,
                false,
                1,
                setLoading
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
              getUnapprovedPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                employee?.value,
                year?.value,
                valueOption?.value,
                to?.value,
                false,
                1,
                setLoading
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
              getUnapprovedPmsReportAction(
                setReport,
                selectedBusinessUnit.value,
                employee?.value,
                year?.value,
                from?.value,
                valueOption?.value,
                false,
                1,
                setLoading
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
        <div className="col-lg d-flex justify-content-center align-items-center">
          <button
            type="button"
            className="btn btn-primary mr-1"
            style={{ marginTop: "15px" }}
            onClick={() => approveAllKpi()}
          >
            Approve All
          </button>
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
      <div className="achievement">
        <PmsCommonTable
          ths={[
            { name: "BSC" },
            { name: "Objective" },
            { name: "KPI" },
            { name: "SRF" },
            { name: "Weight" },
            { name: "Target" },
            { name: "Ach." },
            { name: "Progress" },
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
                          onClick={() =>
                            history.push({
                              pathname: `/performance-management/individual-kpi/individual-kpi-approve/view/${
                                item.kpiId
                              }/${item.intFrequency}/${11}/${employee?.value}`,
                              state: item,
                            })
                          }
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

                  <td className="text-center">
                    {indx !== report?.infoList.length - 1 && (
                      // <input
                      //   id="itemCheck"
                      //   type="checkbox"
                      //   className=""
                      //   value={item?.approve}
                      //   checked={item?.approve}
                      //   name={item?.approve}
                      //   onChange={(e) => {
                      //     itemSlectedHandler(e.target.checked, index);
                      //   }}
                      // />
                      <div className="text-center">
                        <button
                          onClick={() => approvalHandler("reject", item?.kpiId)}
                          className="btn btn-sm btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </PmsCommonTable>
      </div>
    </ICard>
  );
}
