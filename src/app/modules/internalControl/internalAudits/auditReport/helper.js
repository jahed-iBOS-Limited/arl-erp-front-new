// audit report index

import { _firstDateOfMonth, _todayDate } from "../../../_helper/_todayDate";
import * as Yup from "yup";

// save url
export const auditReportURLS = {
  saveURL: `/fino/Audit/SaveAuditEngagementSchedules`,
};

// init data
export const initData = {
  fromDate: _firstDateOfMonth(),
  toDate: _todayDate(),
};

// validation
export const validation = Yup.object({
  fromDate: Yup.date().required("From date is requried"),
  toDate: Yup.date().required("To date is requried"),
});

// get audit report data handler
export const getAuditReportDataHandler = (
  profileData,
  pageNo = 0,
  pageSize = 0,
  getAuditReportData,
  values
) => {
  // if fromday & today exits
  // default value for initial data & custom value for show & pagination
  const hasFromDateToDate = values?.fromDate && values?.toDate;
  const fromDate = hasFromDateToDate ? values?.fromDate : _firstDateOfMonth();
  const toDate = hasFromDateToDate ? values?.toDate : _todayDate();
  const fromDateToDate = `&FromDate=${fromDate}&ToDate=${toDate}`;

  getAuditReportData(
    `/fino/Audit/GetAuditEngagementReportByEmployeeId?EmployeeId=${profileData?.employeeId}&pageNumber=${pageNo}&pageSize=${pageSize}${fromDateToDate}`
  );
};

// audit report confidential attachemt submit & view
export const handleSubmitConfAuditWithAttachement = (objProps) => {
  const {
    submitConfAuditWithAttachemnt,
    submitURL,
    singleConfidentialAuditData,
    getSingleScheduleDataHandler,
    getSingleConfidentialData,
  } = objProps;

  // submit attachement
  /**
   * URLObject[submitURL]
   * [singleAuditDataById]
   * Callback for get signle audit after successfull submit
   * show toast true
   * success message
   * error message
   */
  submitConfAuditWithAttachemnt(
    auditReportURLS[submitURL],
    [singleConfidentialAuditData],
    () => {
      getSingleScheduleDataHandler(
        singleConfidentialAuditData?.intAuditScheduleId,
        getSingleConfidentialData
      );
    },
    true,
    "Successfully Updated",
    "Update Failed"
  );
};
