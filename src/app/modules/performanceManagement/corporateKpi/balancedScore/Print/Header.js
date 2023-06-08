import React, { useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "antd/dist/antd.css";
import ICard from "../../../../_helper/_card";
import { useSelector, shallowEqual } from "react-redux";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTableScorecard from "../../../_helper/pmsCommonTable/PmsCommonTableScorecard";

export default function CorporateBSCPrint() {
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
    if (state?.sbu && state?.year && state?.from && state?.to) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        state?.sbu?.value,
        state?.year?.value,
        state?.from?.value,
        state?.to?.value,
        false,
        3
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
          history.push("/performance-management/corporate-kpi/scorecard")
        }
      >
        <div ref={printRef} className="bsc-print-section">
          <div className="mx-auto">
            <div className="text-center my-2">
              <b className="display-5"> {selectedBusinessUnit?.label} </b>{" "}
              <br />
              <b className="display-5"> SBU Balanced Scorecard </b>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <b>SBU : {state?.sbu?.label}</b> <br />
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
