/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getEmployeeBasicInfoByIdAction } from "../../../_redux/Actions";
import ICard from "../../../../_helper/_card";
import { useState } from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { getPmsReportAction } from "../../../_helper/getReportAction";
import PmsCommonTableScorecard from "../../../_helper/pmsCommonTable/PmsCommonTableScorecard.jsx";

export default function AchievementTableFromReport() {
  const { id } = useParams();
  const printRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();

  const location = useLocation()
  console.log("location", location);

  const [report, setReport] = useState({});

  let storeData = useSelector(
    (state) => {
      return {
        profileData: state?.authData?.profileData,
        selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
        yearDDL: state?.performanceMgt?.yearDDL,
        monthDDL: state?.performanceChartTwo?.monthDDL,
        empDDL: state?.inDividualBalancedScore?.employeeDDL,
      };
    },
    { shallowEqual }
  );
  let { selectedBusinessUnit } = storeData;

  // get employee basic info from store
  const employeeBasicInfo = useSelector((state) => {
    return state?.performanceMgt?.employeeBasicInfo;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getPmsReportAction(
        setReport,
        selectedBusinessUnit.value,
        id,
        location?.state?.year?.value || 11,
        location?.state?.fromMonth?.value || 13,
        location?.state?.toMonth?.value || 24,
        false,
        1
      );
    }
  }, [selectedBusinessUnit, location]);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeBasicInfoByIdAction(id));
    }
  }, [id]);

  const backHandler = () => {
    history.goBack();
  };

  return (
    <div componentRef={printRef} ref={printRef}>
      <ICard title="INDIVIDUAL KPI ACHIEVEMENT">
        <div
          className="text-right"
          style={{
            marginTop: "-42px",
            paddingBottom: "30px",
          }}
        >
          <button onClick={backHandler} className="btn btn-light mr-2">
            Back
          </button>
          <ReactToPrint
            trigger={() => (
              <button
                type="button"
                className="btn btn-primary sales_invoice_btn"
              >
                <img
                  style={{ width: "25px", paddingRight: "5px" }}
                  src={printIcon}
                  alt="print-icon"
                />
                Print
              </button>
            )}
            content={() => printRef.current}
          />
        </div>

        {employeeBasicInfo && (
          <p className="mt-3 employee_info">
            <b>Name</b> : {employeeBasicInfo?.employeeFullName},<b> Enroll</b> :{" "}
            {id}, <b> Designation</b> : {employeeBasicInfo?.designationName},{" "}
            <b> Department</b> : {employeeBasicInfo?.departmentName},{" "}
            <b> Supervisor</b> : {employeeBasicInfo?.supervisorName},{" "}
            <b> Sbu</b> : {employeeBasicInfo?.sbuName}, <b> Business Unit</b> :{" "}
            {employeeBasicInfo?.businessUnitName}
          </p>
        )}
        <div className="achievement">
          <PmsCommonTableScorecard report={report} type="indKpiReport" />
        </div>
      </ICard>
    </div>
  );
}
