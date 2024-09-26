import axios from "axios";

// index
// calculate days difference
export const calculateDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0; // If dates are not defined, return 0 days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end - start;
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days
  return dayDifference > 0 ? dayDifference : 0; // Ensure non-negative days difference
};

// confidential audit form init data
export const auditFormInitData = {
  auditObservation: "",
  financialImpact: "",
  responsibleEmployee: "",
  mgmtFeedback: "",
};

// confidential audit table head
export const confidentialAuditTableHead = [
  "SL",
  "Audit Observation Name",
  "Financial Impact",
  "Responsible Persons of Management Feedback",
  "Audit Evidence Attachted",
  "Management Feedback (Specific)",
  "Audit Recommendation",
];

// confidential init data
export const generateConfidentialInitData = (
  singleConfidentialAuditData = {},
  emptyInitData
) => {
  // Destructure with default values to prevent errors
  const {
    strAuditObservationName = "",
    strFinancialImpact = "",
    intEmployeeIdResponsibleMgtfeedBack = null,
    strEmployeeNameResponsibleMgtfeedBack = "",
    strManagementFeedBack = "",
  } = singleConfidentialAuditData || {};

  if (!singleConfidentialAuditData) {
    return emptyInitData; // Return empty init data if no confidential data
  }

  return {
    auditObservation: strAuditObservationName || "",
    financialImpact: strFinancialImpact || "",
    responsibleEmployee: {
      value: intEmployeeIdResponsibleMgtfeedBack || null,
      label: strEmployeeNameResponsibleMgtfeedBack || "",
    },
    mgmtFeedback: strManagementFeedBack || "",
  };
};

// handle confidential audit submit
export const handleConfidentialAuditSubmit = (objProps) => {
  const {
    submitConfidentialAuditData,
    singleConfidentialAuditData,
    setSingleAuditData,
    values,
    profileData,
    getSingleScheduleDataHandler,
    getSingleScheduleData,
  } = objProps;

  const saveURL = `/fino/Audit/SaveAuditEngagementSchedules`;

  const {
    auditObservation,
    financialImpact,
    responsibleEmployee,
    mgmtFeedback,
  } = values;

  const confidentialPayload = {
    strAuditObservationName: auditObservation,
    strFinancialImpact: financialImpact,
    intEmployeeIdResponsibleMgtfeedBack: responsibleEmployee?.value,
    strEmployeeNameResponsibleMgtfeedBack: responsibleEmployee?.label,
    strManagementFeedBack: mgmtFeedback,
    intUpdateBy: profileData?.userId,
    dteLastActionDateTime: new Date().toISOString(),
    // strAuditEmpEvidenceAttastment: null,
    // strAuditRecommendation: null,
  };

  const finalPayload = {
    ...singleConfidentialAuditData, // Preserve existing data
    ...confidentialPayload, // Override with new form data
  };

  submitConfidentialAuditData(
    saveURL,
    [finalPayload],
    () => {
      setSingleAuditData({});
      getSingleScheduleDataHandler(
        singleConfidentialAuditData?.intAuditScheduleId,
        getSingleScheduleData
      );
    },
    true,
    "Successfully Updated",
    "Update Failed"
  );
};

// load employee list api
export const loadEmployeeInfo = (accId, v) => {
  if (v?.length < 2) return [];
  return axios
    .get(`/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${accId}&search=${v}`)
    .then((res) => {
      return res?.data;
    });
};

// view
export const getSingleScheduleDataHandler = (
  AuditScheduleId,
  getSingleScheduleData
) => {
  getSingleScheduleData(
    `/fino/Audit/GetAuditEngagementScheduleById?AuditScheduleId=${AuditScheduleId}`
  );
};
