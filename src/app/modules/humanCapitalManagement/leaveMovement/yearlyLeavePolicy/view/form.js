import React from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";

export default function _Form({ initData, btnRef, resetBtnRef, rowDto }) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employmentType: {
            value: rowDto?.[0]?.intEmploymentTypeId,
            label: rowDto?.[0]?.strEmploymentType,
          },
          year: {
            value: rowDto?.[0]?.intYearId,
            label: rowDto?.[0]?.intYearId,
          },
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <div className="row">
                <div className="col-lg">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-4 ">
                      <NewSelect
                        name="employmentType"
                        options={[]}
                        value={values?.employmentType}
                        label="Employment Type"
                        onChange={(valueOption) => {
                          setFieldValue("employmentType", valueOption);
                        }}
                        placeholder="Select Employment Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-0">
                      <NewSelect
                        name="year"
                        options={[]}
                        value={values?.year}
                        label="Year"
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                        }}
                        placeholder="Year"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                                 
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <table className={"table mt-1 bj-table"}>
                  <thead className={rowDto?.length < 1 && "d-none"}>
                    <tr>
                      <th style={{ width: "15px" }}>SL</th>
                      <th style={{ width: "100px" }}>Leave Type</th>
                      <th style={{ width: "80px" }}>Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td style={{ verticalAlign: "middle" }}>
                          <div className="text-center">
                            {item?.strLeaveType}
                          </div>
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          <div className="text-center">
                            {item?.intAllocatedLeave}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
