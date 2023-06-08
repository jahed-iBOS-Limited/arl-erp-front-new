import React, { useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ICard from "../../../../_helper/_card";
import { useSelector, shallowEqual } from "react-redux";
import { currentDateAndTime } from "../../../../_helper/currentDateAndTime";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTableScorecard from "../../../_helper/pmsCommonTable/PmsCommonTableScorecard";

export default function IndBSCPrint() {
  const location = useLocation();
  const { state } = location;
  const history = useHistory();
  const printRef = useRef();

  let storeData = useSelector(
    (state) => {
      return {
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  let { selectedBusinessUnit } = storeData;

  const [report, setReport] = React.useState({});

  useEffect(() => {
    if (state?.employee && state?.year && state?.from && state?.to) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        state?.employee?.value,
        state?.year?.value,
        state?.from?.value,
        state?.to?.value,
        false,
        1
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, state]);

  return (
    <>
      <ICard
        printTitle="Print"
        title=""
        isBackBtn={true}
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
        backHandler={() =>
          history.push(
            "/performance-management/individual-kpi/individual-scorecard/"
          )
        }
      >
        <div className="bsc-print-section" ref={printRef}>
          <div className="mx-auto">
            <div className="text-center my-2">
              <b className="display-5"> {selectedBusinessUnit?.label} </b>{" "}
              <br />
              <b className="display-5"> Individual Balanced Scorecard </b>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <b>
                  Employee Name : {state?.employee?.label}[
                  {state?.employee?.value}]
                </b>{" "}
                <br />
                <b>
                  {" "}
                  Designation : {state?.employeeBasicInfo?.designationName}{" "}
                </b>{" "}
                <br />
                <div>
                  <b>
                    {" "}
                    Department : {state?.employeeBasicInfo?.departmentName}{" "}
                  </b>
                </div>
                <div>
                  <b>
                    Supervisor : {state?.employeeBasicInfo?.supervisorName}[
                    {state?.employeeBasicInfo?.supervisorId}]
                  </b>{" "}
                </div>
              </div>
              <div className="text-right">
                <b> Year : {state?.year?.label} </b> <br />
                <b>Print Date and Time : {currentDateAndTime()} </b>
              </div>
            </div>
          </div>
          <div className="achievement bsc-print bsc-final-print">
            <PmsCommonTableScorecard report={report} />
          </div>
        </div>
      </ICard>
    </>
  );
}
