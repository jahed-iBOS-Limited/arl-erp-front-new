/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { useState } from "react";
import { getDepartmentDDLAction } from "../_redux/Actions";
import customStyles from "../../../../selectCustomStyle";
import { getReportAction, getYearDDLAction } from "../../../_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import ICard from "../../../../_helper/_card";
import { useHistory } from "react-router-dom";
// import IViewModal from "../../../../_helper/_viewModal";
// import ReportView from "../../../sbuKpi/reportView/ReportView";
import Help from "./../../../help/Help";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTableScorecard from "../../../_helper/pmsCommonTable/PmsCommonTableScorecard";
import { SetDepartmentalBalancedScoreData } from "../../../../_helper/reduxForLocalStorage/Actions";

export default function BalancedTable() {
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

  const [department, setDepartment] = useState({
    value: profileData?.departmentId,
    label: profileData?.departmentName,
  });

  const reports = useSelector((state) => state.performanceMgt?.reportData, {
    shallowEqual,
  });

  useEffect(() => {
    if (department?.value) {
      dispatch(
        getReportAction(
          selectedBusinessUnit.value,
          department?.value,
          11,
          0,
          0,
          false,
          2
        )
      );
    }
  }, [selectedBusinessUnit, department]);

  const dispatch = useDispatch();

  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const history = useHistory();
  // const [isShowModal, setIsShowModal] = useState(false);
  // const [currentItem, setCurrentItem] = useState("");

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
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (yearDDL?.length > 0) {
      dispatch(getMonthDDLAction(yearDDL[0]?.value));
    }
    setYear({ value: yearDDL[0]?.value, label: yearDDL[0]?.label });
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
  }, [selectedBusinessUnit, department]);

  useEffect(() => {
    setFrom({ value: monthDDL[0]?.value, label: monthDDL[0]?.label });
    setTo({
      value: monthDDL[monthDDL.length - 1]?.value,
      label: monthDDL[monthDDL.length - 1]?.label,
    });
  }, [monthDDL]);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let depKpiScorecardPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 880) {
      depKpiScorecardPublic = userRole[i];
    }
  }

  return (
    <div>
      <ICard
        title="DEPARTMENTAL BALANCED SCORECARD
    "
        printTitle="Print Preview"
        isShowPrintPreviewBtn={true}
        isPrint={true}
        // componentRef={printRef}
        clickHandler={() =>
          history.push({
            pathname:
              "/performance-management/departmental-kpi/scorecard/print",
            state: { department, year, from, to, selectedBusinessUnit },
          })
        }
        isHelp={true}
        helpModalComponent={<Help />}
      >
        <div className="form-group row">
          <div className="col-lg">
            <label>Select Department</label>
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
                    2
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
                  2
                );

                setDepartment({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
              }}
              isDisabled={!depKpiScorecardPublic?.isView}
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
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    department?.value,
                    valueOption?.value,
                    from?.value,
                    to?.value,
                    false,
                    2
                  )
                );

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
                    department?.value,
                    year?.value,
                    valueOption?.value,
                    to?.value,
                    false,
                    2
                  )
                );
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
                    department?.value,
                    year?.value,
                    from?.value,
                    valueOption?.value,
                    false,
                    2
                  )
                );
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
        <div className="achievement bsc-print kpi-presentation-table">
          <PmsCommonTableScorecard
            report={report}
            actionHandler={(item) => {
              // setCurrentItem({ item, index: item?.flatIndex });
              // setIsShowModal(true);
              dispatch(SetDepartmentalBalancedScoreData({
                departmentName:department?.label,
                newData: reports,
                report:item,
                currentItem: {
                  item,
                  index: item?.flatIndex,
                },
                heading: "DEPARTMENTAL BALANCED SCORECARD",
                from: from,
                to: to,
                year,
                reportIndex:item?.flatIndex
              }))                             
              window.open(
                `${process.env.PUBLIC_URL}/departmental-balanced-scorecard`,
                "_blank"
              );
            }}
          />
        </div>
        {/* <IViewModal
          dialogClassName="kpi-presentation-report"
          show={isShowModal}
          onHide={() => setIsShowModal(false)}
        >
          <ReportView
            newData={reports}
            currentItem={currentItem}
            heading="DEPARTMENT BALANCED SCORECARD"
            from={from}
            to={to}
            year={year}
          />
        </IViewModal> */}
      </ICard>
    </div>
  );
}
