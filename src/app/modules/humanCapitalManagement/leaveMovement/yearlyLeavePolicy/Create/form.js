/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import { GetYearlyLeavePolicyInfo } from "../helper";
import InputField from "../../../../_helper/_inputField";
import { YearDDL } from "../../../../_helper/_yearDDL";

// Validation schema
const validationSchema = Yup.object().shape({
  year: Yup.object()
    .shape({
      label: Yup.string().required("Year is required"),
      value: Yup.string().required("Year is required"),
    })
    .nullable(),
  employmentType: Yup.object()
    .shape({
      label: Yup.string().required("Employment Type is required"),
      value: Yup.string().required("Employment Type is required"),
    })
    .nullable(),
});

export default function _Form({
  selectedBusinessUnit,
  profileData,
  businessUnitDDL,
  positionDDL,
  employmentTypeDDL,
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setLeaevDays,
  remover,
  setter,
  setRowDto,
  isEdit,
}) {
  const [valid, setValid] = useState(true);

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
          setValid(true);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="employmentType"
                    options={employmentTypeDDL}
                    value={values?.employmentType}
                    label="Employment Type"
                    onChange={(valueOption) => {
                      setFieldValue("employmentType", valueOption);
                    }}
                    placeholder="Select Employment Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                             
                </div>
                <div className="col-lg-3 pl pr-1 mb-0">
                  <NewSelect
                    name="year"
                    options={YearDDL()}
                    value={values?.year}
                    label="Select Year"
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                    placeholder="Select Year"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "15px" }}
                    type="button"
                    disabled={!values?.year || !values?.employmentType}
                    className="btn btn-primary"
                    onClick={(e) => {
                      GetYearlyLeavePolicyInfo(
                        selectedBusinessUnit?.value,
                        profileData?.accountId,
                        values?.year?.value,
                        values?.employmentType?.value,
                        setRowDto
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-8">
                  <table className={"table mt-1 bj-table"}>
                    <thead className={rowDto?.length < 1 && "d-none"}>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Leave Type</th>
                        <th style={{ width: "150px" }}>Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td style={{ verticalAlign: "middle" }}>
                            <div className="text-center">{item?.leaveType}</div>
                          </td>
                          <td className="d-flex justify-content-center align-items-center">
                            <InputField
                              value={item?.leaveDays}
                              style={{ width: "80px" }}
                              name="leaveDays"
                              placeholder="Days"
                              type="number"
                              min="0"
                              onChange={(e) =>
                                setLeaevDays(index, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Row Dto Table End */}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
