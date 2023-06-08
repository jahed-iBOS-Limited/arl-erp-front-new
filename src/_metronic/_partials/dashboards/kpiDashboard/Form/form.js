import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GroupChart from "../rgl";
// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  saveHandler,
  yearDDL,
  month,
  profileData,
  employeeBasicInfo,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: {
            value: profileData?.employeeId,
            label: profileData?.employeeFullName,
          },
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
          from: { value: month[0]?.value, label: month[0]?.label },
          to: {
            value: month[month.length - 1]?.value,
            label: month[month.length - 1]?.label,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ values }) => (
          <>
            <Form className="form form-label-right">
              <div style={{ marginLeft: "8px" }}></div>
              {/* {employeeBasicInfo && (
                <div style={{ marginLeft: "9px" }}>
                  <p className="mt-3 employee_info">
                    <b> Enroll</b> : {employeeBasicInfo?.employeeId},{" "}
                    <b> Designation</b> : {employeeBasicInfo?.designationName},{" "}
                    <b> Department</b> : {employeeBasicInfo?.departmentName},{" "}
                    <b> Supervisor</b> : {employeeBasicInfo?.supervisorName},{" "}
                    <b> Sbu</b> : {employeeBasicInfo?.sbuName},{" "}
                    <b> Business Unit</b> :{" "}
                    {employeeBasicInfo?.businessUnitName}
                  </p>
                </div>
              )} */}
              <GroupChart values={values} yearDDL={yearDDL} />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
