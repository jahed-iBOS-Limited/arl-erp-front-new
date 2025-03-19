import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { useState } from "react";
import { getSbuDDLAction } from "../_redux/Actions";
import customStyles from "../../../../selectCustomStyle";
import {
  getReportAction,
  getYearDDLAction,
  setReportEmpty,
} from "../../../_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import ICard from "../../../../_helper/_card";
import { useHistory } from "react-router-dom";
// import IViewModal from "../../../../_helper/_viewModal";
// import ReportView from "../../reportView/ReportView";
import Help from "./../../../help/Help";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTableScorecard from "../../../_helper/pmsCommonTable/PmsCommonTableScorecard";
import { SetSBUBalancedScoreData } from "../../../../_helper/reduxForLocalStorage/Actions";

export default function BalancedTable() {
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

  const dispatch = useDispatch();
  const [sbu, setSbu] = useState({
    value: profileData?.sbuId,
    label: profileData?.sbuName,
  });
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [section, setSection] = useState("");
  const history = useHistory();
  // const [isShowModal, setIsShowModal] = useState(false);
  // const [currentItem, setCurrentItem] = useState("");
  const [report, setReport] = useState({});

  const reports = useSelector((state) => state.performanceMgt?.reportData, {
    shallowEqual,
  });

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getSbuDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
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

  useEffect(() => {
    return () => {
      dispatch(setReportEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sbu?.value) {
      dispatch(
        getReportAction(
          selectedBusinessUnit.value,
          sbu?.value,
          11,
          0,
          0,
          false,
          3
        )
      );
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

  let sbuKpiScorecardPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 878) {
      sbuKpiScorecardPublic = userRole[i];
    }
  }

  return (
    <div>
      <ICard
        title="SBU BALANCED SCORECARD
    "
        printTitle="Print Preview"
        isShowPrintPreviewBtn={true}
        isPrint={true}
        // componentRef={printRef}
        clickHandler={() =>
          history.push({
            pathname: "/performance-management/sbu-kpi/scorecard/print",
            state: { sbu, year, from, to },
          })
        }
        isHelp={true}
        helpModalComponent={<Help />}
      >
        <div className="form-group row">
          <div className="col-lg">
            <label>Select SBU</label>
            {/* <myComponent /> */}
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
                    3,
                    section?.value
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
                  3,
                  section?.value
                );

                setSbu({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
              }}
              isDisabled={!sbuKpiScorecardPublic?.isView}
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
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    sbu?.value,
                    valueOption?.value,
                    from?.value,
                    to?.value,
                    false,
                    3,
                    section?.value
                  )
                );
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
                    sbu?.value,
                    year?.value,
                    valueOption?.value,
                    to?.value,
                    false,
                    3,
                    section?.value
                  )
                );
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
                    sbu?.value,
                    year?.value,
                    from?.value,
                    valueOption?.value,
                    false,
                    3,
                    section?.value
                  )
                );
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
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    sbu?.value,
                    year?.value,
                    from?.value,
                    to?.value,
                    false,
                    3,
                    valueOption?.value
                  )
                );
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
        <div className="achievement bsc-print kpi-presentation-table">
          <PmsCommonTableScorecard
            report={report}
            actionHandler={(item) => {
              // setCurrentItem({ item, index: item?.flatIndex });
              // setIsShowModal(true);
              dispatch(SetSBUBalancedScoreData({
                newData: reports,
                report:item,
                currentItem: {
                  item,
                  index: item?.flatIndex,
                },
                heading: "SBU BALANCED SCORECARD",
                from: from,
                to: to,
                year,
                sbuName:sbu?.label
              }))                             
              window.open(
                `${process.env.PUBLIC_URL}/sbu-balanced-scorecard`,
                "_blank"
              )
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
            heading="SBU BALANCED SCORECARD"
            from={from}
            to={to}
            year={year}
          />
        </IViewModal> */}
      </ICard>
    </div>
  );
}
