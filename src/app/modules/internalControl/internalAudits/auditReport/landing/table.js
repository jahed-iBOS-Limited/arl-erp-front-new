import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { calculateDaysDifference } from "../../auditschedules/helper";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import NewIcon from "../../../../_helper/_helperIcons/newIcon";

const AuditReportLandingTable = ({ objProps }) => {
  // use hook
  const history = useHistory();

  // props
  const {
    auditReportData,
    setShowConfidentialModal,
    setSingleAuditReport,
  } = objProps;

  return (
    <div className="table-responsive">
      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Audit Engagement Name</th>
            <th>SBU Name</th>
            <th>Priority</th>
            <th>Auditor's Name</th>
            <th>Audit start date</th>
            <th>Audit end date</th>
            <th>Days to complete the audit assignment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {auditReportData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.strAuditEngagementName}</td>
              <td>{item?.strBusinessUnitName}</td>
              <td className="text-center">{item?.strPriorityName}</td>
              <td className="text-center">{item?.strAuditorName}</td>
              <td className="text-center">
                {_dateFormatter(item?.dteStartDate)}
              </td>
              <td className="text-center">
                {_dateFormatter(item?.dteEndDate)}
              </td>
              <td className="text-center">
                {calculateDaysDifference(item?.dteStartDate, item?.dteEndDate)}
              </td>

              <td className="text-center">
                <div className="d-flex">
                  {/* Audit Plan View & Print Report */}
                  <span
                    className=""
                    onClick={() => {
                      history.push({
                        pathname: `/internal-control/internalaudits/auditreport/view`,
                        state: item,
                      });
                    }}
                  >
                    <IView />
                  </span>
                  {/* Confidential Audit Report View */}
                  <span
                    className="ml-3"
                    onClick={() => {
                      setShowConfidentialModal(true);
                      setSingleAuditReport(item);
                    }}
                  >
                    <NewIcon title="Confidential Audit" iconName="fa fa-bolt" />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditReportLandingTable;
