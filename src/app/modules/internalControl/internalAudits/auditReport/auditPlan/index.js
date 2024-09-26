import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getSingleScheduleDataHandler } from "../../auditschedules/helper";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import '../../auditschedules/style.css'

const AuditPlanViewAndPrint = () => {
  // use hook
  const { state: viewData } = useLocation();

  // state
  const [objProps, setObjprops] = useState({});

  // print audit plan
  const printRef = React.useRef();

  // use axios get
  const [
    scheduleData,
    getSingleScheduleData,
    loading,
    setSingleScheduleData,
  ] = useAxiosGet();

  useEffect(() => {
    if (viewData?.intAuditScheduleId)
      getSingleScheduleDataHandler(
        viewData?.intAuditScheduleId,
        getSingleScheduleData
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IForm
      title="View Audit Plan"
      isHiddenReset
      isHiddenSave
      getProps={setObjprops}
      isHiddenBack={false}
    >
      {loading && <Loading />}

      <div className="text-right mt-3">
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary ml-3">Print</button>
          )}
          content={() => printRef.current}
        />
      </div>

      {/* Conditionally rendering the content based on the active tab */}

      <div id="audit_schedule-print" ref={printRef} className="p-4">
        {/* Print View Content */}
        <div className="mb-3"></div>
        <div className="text-center" style={{ mergin: "0 auto" }}>
          {/* <h4>Audit Plan Template</h4> */}
          <p>
            <strong>
              Name of assignment: {scheduleData?.strAuditEngagementName}
            </strong>
          </p>
          <p>
            <strong>Audit scope of duration: For the year ***</strong>
          </p>
          <p>
            <strong>
              Name of company: {scheduleData?.strBusinessUnitName}
            </strong>
          </p>
          <p>
            <strong>
              Name of Auditor: {scheduleData?.strAuditorName} (Lead)
            </strong>
          </p>
          <p>
            <strong>Additional Members:</strong>
          </p>
          <p>Mr. YY (Member)</p>
          <p>Mr. CC (Member)</p>
          <p>
            <strong>
              Work starting date: {_dateFormatter(scheduleData?.dteStartDate)}
            </strong>
          </p>
          <p>
            <strong>
              Fieldwork completion date:{" "}
              {_dateFormatter(scheduleData?.dteEndDate)}
            </strong>
          </p>
        </div>
        <div className="row">
          <div className="col-12">
            <h5>Audit Objective:</h5>
            <div
              className="text-editor-view"
              dangerouslySetInnerHTML={{
                __html: scheduleData?.strAuditObjective || "",
              }}
            ></div>
            <hr />
          </div>
          <div className="col-12">
            <h5>Scope of Audit:</h5>
            <div
              className="text-editor-view"
              dangerouslySetInnerHTML={{
                __html: scheduleData?.strScopeOfAudit || "",
              }}
            ></div>
            <hr />
          </div>
          <div className="col-12">
            <h5>General Scope Of Work:</h5>
            <div
              className="text-editor-view"
              dangerouslySetInnerHTML={{
                __html: scheduleData?.strGeneralScopeOfWork || "",
              }}
            ></div>
            <hr />
          </div>
          <div className="col-12">
            <h5>Action Plan:</h5>
            <div
              className="text-editor-view"
              dangerouslySetInnerHTML={{
                __html: scheduleData?.strActionPlan || "",
              }}
            ></div>
          </div>
        </div>
      </div>
    </IForm>
  );
};

export default AuditPlanViewAndPrint;
