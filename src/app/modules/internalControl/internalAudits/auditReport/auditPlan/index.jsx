import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { getSingleScheduleDataHandler } from '../../auditschedules/helper';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import '../../auditschedules/style.css';

const AuditPlanViewAndPrint = () => {
  // use hook
  const { state: auditReportData } = useLocation();

  // state
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});

  // print audit plan
  const printRef = React.useRef();

  // use axios get
  const [
    auditReportDataById,
    getAuditReportDataById,
    getAditReportDataByIdLoading,
  ] = useAxiosGet();

  useEffect(() => {
    if (auditReportData?.intAuditScheduleId)
      getSingleScheduleDataHandler(
        auditReportData?.intAuditScheduleId,
        getAuditReportDataById,
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
      {getAditReportDataByIdLoading && <Loading />}

      <div className="text-right mt-3">
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary ml-3">Print</button>
          )}
          content={() => printRef.current}
        />
      </div>

      {/* Audit Plan View With IIFE  */}

      {(() => {
        const {
          strAuditEngagementName,
          strBusinessUnitName,
          strAuditorName,
          dteStartDate,
          dteEndDate,
          strAuditObjective,
          strScopeOfAudit,
          strGeneralScopeOfWork,
          strActionPlan,
        } = auditReportDataById;
        return (
          <div id="audit_schedule-print" ref={printRef} className="p-4">
            {/* Print View Content */}
            <div className="mb-3"></div>
            <div className="text-center" style={{ mergin: '0 auto' }}>
              {/* <h4>Audit Plan Template</h4> */}
              <p>
                <strong>Name of assignment: {strAuditEngagementName}</strong>
              </p>
              <p>
                <strong>Audit scope of duration: For the year ***</strong>
              </p>
              <p>
                <strong>Name of company: {strBusinessUnitName}</strong>
              </p>
              <p>
                <strong>Name of Auditor: {strAuditorName} (Lead)</strong>
              </p>
              <p>
                <strong>Additional Members:</strong>
              </p>
              <p>Mr. YY (Member)</p>
              <p>Mr. CC (Member)</p>
              <p>
                <strong>
                  Work starting date: {_dateFormatter(dteStartDate)}
                </strong>
              </p>
              <p>
                <strong>
                  Fieldwork completion date: {_dateFormatter(dteEndDate)}
                </strong>
              </p>
            </div>
            <div className="row">
              <div className="col-12">
                <h5>Audit Objective:</h5>
                <div
                  className="text-editor-view"
                  dangerouslySetInnerHTML={{
                    __html: strAuditObjective || '',
                  }}
                ></div>
                <hr />
              </div>
              <div className="col-12">
                <h5>Scope of Audit:</h5>
                <div
                  className="text-editor-view"
                  dangerouslySetInnerHTML={{
                    __html: strScopeOfAudit || '',
                  }}
                ></div>
                <hr />
              </div>
              <div className="col-12">
                <h5>General Scope Of Work:</h5>
                <div
                  className="text-editor-view"
                  dangerouslySetInnerHTML={{
                    __html: strGeneralScopeOfWork || '',
                  }}
                ></div>
                <hr />
              </div>
              <div className="col-12">
                <h5>Action Plan:</h5>
                <div
                  className="text-editor-view"
                  dangerouslySetInnerHTML={{
                    __html: strActionPlan || '',
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })()}
    </IForm>
  );
};

export default AuditPlanViewAndPrint;
