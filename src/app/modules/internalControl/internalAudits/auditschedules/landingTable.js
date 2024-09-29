import React from "react";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import NewIcon from "../../../_helper/_helperIcons/newIcon";
import {
  auditScheduleLandingTableHeader,
  calculateDaysDifference,
} from "./helper";

const AuditScheduleLandingTable = ({ objProps }) => {
  // use hooks
  const history = useHistory();
  // obj props
  const { gridData, setShowConfidentialModal, setSingleAuditData } = objProps;

  return (
    <div className="table-responsive">
      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            {auditScheduleLandingTableHeader?.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gridData?.map((item, index) => (
            <tr key={index} className="text-center">
              <td>{index + 1}</td>
              <td>{item?.strAuditEngagementName}</td>
              <td>{item?.strBusinessUnitName}</td>
              <td>{item?.strPriorityName}</td>
              <td>{item?.strAuditorName}</td>
              <td>{item?.intStatus}</td>
              <td style={{ width: 90 }}>
                {_dateFormatter(item?.dteStartDate)}
              </td>
              <td style={{ width: 90 }}>{_dateFormatter(item?.dteEndDate)}</td>
              <td style={{ width: 90 }}>
                {calculateDaysDifference(item?.dteStartDate, item?.dteEndDate)}
              </td>
              <td style={{ width: 90 }}>
                {_dateFormatter(item?.dteReportSubforSupervisorRevDate)}
              </td>
              <td style={{ width: 90 }}>
                {_dateFormatter(item?.dteSupervisorRevCompleteDate)}
              </td>
              <td style={{ width: 90 }}>
                {_dateFormatter(item?.dteReportSendforManagementResDate)}
              </td>
              <td style={{ width: 90 }}>
                {_dateFormatter(item?.dteManagementResponseDate)}
              </td>
              <td style={{ width: 90 }}>
                {_dateFormatter(item?.dteFinalAudReportSubmission)}
              </td>

              <td>
                <div className="d-flex">
                  <span
                    className=""
                    onClick={() => {
                      history.push({
                        pathname: `/internal-control/internalaudits/auditschedules/view`,
                        state: item,
                      });
                    }}
                  >
                    <IView />
                  </span>
                  <span
                    className="ml-3"
                    onClick={() => {
                      setShowConfidentialModal(true);
                      setSingleAuditData(item);
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

export default AuditScheduleLandingTable;
