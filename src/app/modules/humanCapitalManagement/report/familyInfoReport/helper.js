import { generateJsonToExcel } from "../../../_helper/excel/jsonToExcel";

export const familyInfoReportExcel = (data, values) => {
  const header = [
    {
      text: "SL",
      textFormat: "text",
      alignment: "center:middle",
      key: "sl",
    },
    {
      text: "Enroll",
      textFormat: "text",
      alignment: "center:middle",
      key: "employeeId",
    },
    {
      text: "Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "employeeName",
    },
    {
      text: "Designation",
      textFormat: "text",
      alignment: "center:middle",
      key: "designation",
    },
    {
      text: "Management Status",
      textFormat: "text",
      alignment: "center:middle",
      key: "managementStatus",
    },
    {
      text: "Department",
      textFormat: "text",
      alignment: "center:middle",
      key: "department",
    },
    {
      text: "Date Of Joining",
      textFormat: "text",
      alignment: "center:middle",
      key: "dateOfJoining",
    },
    {
      text: "Date Of Confirmation",
      textFormat: "text",
      alignment: "center:middle",
      key: "confirmationDate",
    },
    {
      text: "Employement Type",
      textFormat: "text",
      alignment: "center:middle",
      key: "employmentType",
    },
    {
      text: "Basic salary",
      textFormat: "text",
      alignment: "center:middle",
      key: "basicSalary",
    },
    {
      text: "Work Group",
      textFormat: "text",
      alignment: "center:middle",
      key: "workplaceGroup",
    },
    {
      text: "Work Place",
      textFormat: "text",
      alignment: "center:middle",
      key: "workplace",
    },
    {
      text: "Work Place",
      textFormat: "text",
      alignment: "center:middle",
      key: "workplace",
    },
    {
      text: "Email",
      textFormat: "text",
      alignment: "center:middle",
      key: "strEmail",
    },
    {
      text: "Cell No",
      textFormat: "text",
      alignment: "center:middle",
      key: "personalContactNo",
    },
    {
      text: "SBU",
      textFormat: "text",
      alignment: "center:middle",
      key: "strSBUName",
    },
    {
      text: "Marital Status",
      textFormat: "text",
      alignment: "center:middle",
      key: "maritalStatus",
    },
    {
      text: "Date Of Birth",
      textFormat: "text",
      alignment: "center:middle",
      key: "dateOfBirth",
    },
    {
      text: "Relation With Employee",
      textFormat: "text",
      alignment: "center:middle",
      key: "relation",
    },
    {
      text: "Family Person Name",
      textFormat: "text",
      alignment: "center:middle",
      key: "familyPersonName",
    },
  ];
  const _data = data.map((item, index) => {
    return {
      ...item,
      sl: index + 1,
    };
  });
  generateJsonToExcel(header, _data, "Family_Info_Report");
};
