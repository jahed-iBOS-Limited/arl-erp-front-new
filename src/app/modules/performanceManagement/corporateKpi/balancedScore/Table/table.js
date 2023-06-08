import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { useState } from "react";
import customStyles from "../../../../selectCustomStyle";
import {
  getReportAction,
  getYearDDLAction,
  setReportEmpty,
} from "../../../_redux/Actions";
import { getMonthDDLAction } from "../../PerformanceChart/_redux/Actions";
import ICard from "../../../../_helper/_card";
import { useHistory } from "react-router-dom";
import { getCorporateDepertmentDDL } from "./../helper";
import IViewModal from "../../../../_helper/_viewModal";
import ReportView from "../../../sbuKpi/reportView/ReportView";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTableScorecard from "../../../_helper/pmsCommonTable/PmsCommonTableScorecard.jsx";

export default function BalancedTable() {
  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        yearDDL: state.performanceMgt?.yearDDL,
        monthDDL: state.corporatePerformanceChart.monthDDL,
        // sbuDDL: state.corporateInDividualBalancedScore.sbuDDL,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    yearDDL,
    monthDDL,
    // sbuDDL,
  } = storeData;

  const reports = useSelector((state) => state.performanceMgt?.reportData, {
    shallowEqual,
  });

  const [report, setReport] = useState({});

  const dispatch = useDispatch();
  const [year, setYear] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const history = useHistory();
  const [corporateDDL, setCorporateDDL] = useState([]);
  const [corporate, setCorporate] = useState({
    value: profileData?.departmentId,
    label: profileData?.departmentName,
  });
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
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
    if (profileData && selectedBusinessUnit) {
      getCorporateDepertmentDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCorporateDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (corporate?.value) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        corporate?.value,
        11,
        0,
        0,
        false,
        4
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, corporate]);

  useEffect(() => {
    // for modal presentation view
    if (corporate?.value) {
      dispatch(
        getReportAction(
          selectedBusinessUnit.value,
          corporate?.value,
          11,
          0,
          0,
          false,
          4
        )
      );
    }
    return () => {
      dispatch(setReportEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, corporate]);

  useEffect(() => {
    setFrom({ value: monthDDL[0]?.value, label: monthDDL[0]?.label });
    setTo({
      value: monthDDL[monthDDL.length - 1]?.value,
      label: monthDDL[monthDDL.length - 1]?.label,
    });
  }, [monthDDL]);

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let corKpiScorecardPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 877) {
      corKpiScorecardPublic = userRole[i];
    }
  }

  return (
    <div>
      <ICard
        title="Corporate BALANCED SCORECARD
    "
        printTitle="Print Preview"
        isShowPrintPreviewBtn={true}
        isPrint={true}
        // componentRef={printRef}
        clickHandler={() =>
          history.push({
            pathname: "/performance-management/corporate-kpi/scorecard/print",
            state: { corporate, year, from, to },
          })
        }
      >
        <div className="form-group row">
          <div className="col-lg">
            <label>Select Corporate</label>
            <Select
              onChange={(valueOption) => {
                setCorporate({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });

                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    valueOption?.value,
                    year?.value,
                    from?.value,
                    to?.value,
                    false,
                    4
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
                  4
                );
              }}
              isDisabled={!corKpiScorecardPublic?.isView}
              className="mb-3"
              value={corporate}
              styles={customStyles}
              label="Corporate"
              options={corporateDDL || []}
              name="corporate"
            />
          </div>
          <div className="col-lg">
            <label>Select Year</label>
            <Select
              onChange={(valueOption) => {
                dispatch(
                  getReportAction(
                    selectedBusinessUnit.value,
                    corporate?.value,
                    valueOption?.value,
                    from?.value,
                    to?.value,
                    false,
                    4
                  )
                );
                getPmsReportAction(
                  setReport,
                  selectedBusinessUnit.value,
                  corporate?.value,
                  valueOption?.value,
                  from?.value,
                  to?.value,
                  false,
                  4
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
                    corporate?.value,
                    year?.value,
                    valueOption?.value,
                    to?.value,
                    false,
                    4
                  )
                );
                getPmsReportAction(
                  setReport,
                  selectedBusinessUnit.value,
                  corporate?.value,
                  year?.value,
                  valueOption?.value,
                  to?.value,
                  false,
                  4
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
                    corporate?.value,
                    year?.value,
                    from?.value,
                    valueOption?.value,
                    false,
                    4
                  )
                );
                getPmsReportAction(
                  setReport,
                  selectedBusinessUnit.value,
                  corporate?.value,
                  year?.value,
                  from?.value,
                  valueOption?.value,
                  false,
                  4
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
              setCurrentItem({ item, index: item?.flatIndex });
              setIsShowModal(true);
            }}
          />
        </div>
        <IViewModal
          dialogClassName="kpi-presentation-report"
          show={isShowModal}
          onHide={() => setIsShowModal(false)}
        >
          <ReportView
            newData={reports}
            currentItem={currentItem}
            heading="CORPORATE BALANCED SCORECARD"
            from={from}
            to={to}
            year={year}
          />
        </IViewModal>
      </ICard>
    </div>
  );
}
