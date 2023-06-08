import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  employeeName: Yup.string()
    .required("Employee name is required")
    .typeError("Employee name is required"),
  cardNo: Yup.number().typeError("Must be number").integer("Must be integer").positive("Must be positive number"),
  position: Yup.string()
    .required("Position is required")
    .typeError("Position is required"),
  code: Yup.string()
    .required("Employee code is required")
    .typeError("Employee code is required"),
  dateOfJoining: Yup.string()
    .required("Date of joining is required")
    .typeError("Date of joining is required"),
  grossSalary: Yup.string()
    .required("Gross salary is required")
    .typeError("Gross salary is required"),
  accountNo: Yup.string()
    .required("Account no is required")
    .typeError("Account no is required"),
  department: Yup.object()
    .shape({
      label: Yup.string().required("Department is required"),
      value: Yup.string().required("Department is required"),
    })
    .typeError("Department is required"),
  function: Yup.object()
    .shape({
      label: Yup.string().required("Function/Section is required"),
      value: Yup.string().required("Function/Section is required"),
    })
    .typeError("Function/Section is required"),
  // subFunction: Yup.object()
  //   .shape({
  //     label: Yup.string().required("Sub Function is required"),
  //     value: Yup.string().required("Sub Function is required"),
  //   })
  //   .typeError("Sub Function is required"),
  designation: Yup.object()
    .shape({
      label: Yup.string().required("Designation is required"),
      value: Yup.string().required("Designation is required"),
    })
    .typeError("Designation is required"),
  businessUnit: Yup.object()
    .shape({
      label: Yup.string().required("Business unit is required"),
      value: Yup.string().required("Business unit is required"),
    })
    .typeError("Business unit is required"),
  sbu: Yup.object()
    .shape({
      label: Yup.string().required("SBU is required"),
      value: Yup.string().required("SBU is required"),
    })
    .typeError("SBU is required"),
  workplaceGroup: Yup.object()
    .shape({
      label: Yup.string().required("Workplace group is required"),
      value: Yup.string().required("Workplace group is required"),
    })
    .typeError("Workplace group is required"),
  workplace: Yup.object()
    .shape({
      label: Yup.string().required("Workplace is required"),
      value: Yup.string().required("Workplace is required"),
    })
    .typeError("Workplace is required"),
  employmentType: Yup.object()
    .shape({
      label: Yup.string().required("Employment type is required"),
      value: Yup.string().required("Employment type is required"),
    })
    .typeError("Employment type is required"),
  gender: Yup.object()
    .shape({
      label: Yup.string().required("Gender is required"),
      value: Yup.string().required("Gender is required"),
    })
    .typeError("Gender is required"),
  employeeStatus: Yup.object()
    .shape({
      label: Yup.string().required("Employee status is required"),
      value: Yup.string().required("Employee status is required"),
    })
    .typeError("Employee status is required"),
  religion: Yup.object()
    .shape({
      label: Yup.string().required("Religion is required"),
      value: Yup.string().required("Religion is required"),
    })
    .typeError("Religion is required"),
  supervisor: Yup.object()
    .shape({
      label: Yup.string().required("Supervisor is required"),
      value: Yup.string().required("Supervisor is required"),
    })
    .typeError("Supervisor is required"),
  lineManager: Yup.object()
    .shape({
      label: Yup.string().required("Line manager is required"),
      value: Yup.string().required("Line manager is required"),
    })
    .typeError("Line manager is required"),
  grade: Yup.object()
    .shape({
      label: Yup.string().required("Grade is required"),
      value: Yup.string().required("Grade is required"),
    })
    .typeError("Grade is required"),
  bank: Yup.object()
    .shape({
      label: Yup.string().required("Bank is required"),
      value: Yup.string().required("Bank is required"),
    })
    .typeError("Bank is required"),
  branch: Yup.object()
    .shape({
      label: Yup.string().required("Branch is required"),
      value: Yup.string().required("Branch is required"),
    })
    .typeError("Branch is required"),
  district: Yup.object()
    .shape({
      label: Yup.string().required("District is required"),
      value: Yup.string().required("District is required"),
    })
    .typeError("District is required"),
});

export const genderDDL = [
  { value: 1, label: "Male" },
  { value: 2, label: "Female" },
  { value: 3, label: "Common" },
];

export const categoryDDL = [
  { value: 1, label: "Corporate" },
  { value: 2, label: "SBU" },
];
