// audit report index

import { _firstDateOfMonth, _todayDate } from "../../../_helper/_todayDate";
import * as Yup from "yup";

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
  //   const strBusinessUnit = values?.businessUnit
  //     ? `&BusinessUnitId=${values?.businessUnit?.value}`
  //     : "";
  //   const strDate =
  //     values?.fromDate && values?.toDate
  //       ? `&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
  //       : "";

  getAuditReportData(
    `/fino/Audit/GetAuditEngagementReportByEmployeeId?EmployeeId=${profileData?.employeeId}&pageNumber=${pageNo}&pageSize=${pageSize}`
  );
};
