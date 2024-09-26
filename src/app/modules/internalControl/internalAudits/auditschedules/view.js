import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { getSingleScheduleDataHandler } from "./helper";
import "./style.css";
import ViewForm from "./viewForm";

export default function AuditSchedulesView() {
  const [objProps, setObjprops] = useState({});
  const [activeTab, setActiveTab] = useState("create"); // Managing tabs
  const { state: viewData } = useLocation();
  const [, onSaveAction, saveLoading] = useAxiosPost();

  const printRef = React.useRef();
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
      title="Create Audit Plan Template"
      getProps={setObjprops}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      {(loading || saveLoading) && <Loading />}

      <div className="mt-3">
        <label className="mr-3">
          <input
            type="radio"
            name="viewToggle"
            value="create"
            checked={activeTab === "create"}
            onChange={() => setActiveTab("create")}
            className="mr-1 pointer"
            style={{ position: "relative", top: "2px" }}
          />
          Create View
        </label>
        <label className="mr-3">
          <input
            type="radio"
            name="viewToggle"
            value="print"
            checked={activeTab === "print"}
            onChange={() => setActiveTab("print")}
            className="mr-1 pointer"
            style={{ position: "relative", top: "2px" }}
          />
          Print View
        </label>
      </div>

      <div className="text-right mt-3">
        {activeTab === "create" && (
          <button
            onClick={() => {
              const entryApiUrl = `/fino/Audit/SaveAuditEngagementSchedules`;

              onSaveAction(
                entryApiUrl,
                [scheduleData],
                () => {
                  getSingleScheduleDataHandler(viewData?.intAuditScheduleId,getSingleScheduleData);
                },
                true
              );
            }}
            type="button"
            form="createForm"
            className="btn btn-primary"
          >
            Save
          </button>
        )}
        {activeTab === "print" && (
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-primary ml-3">Print</button>
            )}
            content={() => printRef.current}
          />
        )}
      </div>

      {/* Conditionally rendering the content based on the active tab */}
      {activeTab === "create" ? (
        <ViewForm
          scheduleData={scheduleData}
          setSingleScheduleData={setSingleScheduleData}
        />
      ) : (
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
      )}
    </IForm>
  );
}
