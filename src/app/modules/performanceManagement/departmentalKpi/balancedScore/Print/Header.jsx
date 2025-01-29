import React, { useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ICard from "../../../../_helper/_card";
import { useSelector, shallowEqual } from "react-redux";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTableScorecard from "../../../_helper/pmsCommonTable/PmsCommonTableScorecard";

export default function DepBSCPrint() {
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
    if (state?.department && state?.year && state?.from && state?.to) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        state?.department?.value,
        state?.year?.value,
        state?.from?.value,
        state?.to?.value,
        false,
        2
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
          history.push("/performance-management/departmental-kpi/scorecard")
        }
      >
        <div className="bsc-print-section" ref={printRef}>
          <div className="mx-auto my-2">
            <div className="text-center my-2">
              <b className="display-5"> {selectedBusinessUnit?.label} </b>{" "}
              <br />
              <b className="display-5"> Departmental Balanced Scorecard </b>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <b>Department : {state?.department?.label}</b> <br />
              </div>
              <div>
                <b> Year : {state?.year?.label} </b>
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
