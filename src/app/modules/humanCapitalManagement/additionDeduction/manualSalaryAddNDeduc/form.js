import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ButtonStyleOne from "./../../../_helper/button/ButtonStyleOne";
import UploadButton from "./UploadButton";
import { downloadFile } from "./../../../_helper/downloadFile";
import NewSelect from "../../../_helper/_select";
import { monthDDL } from "../../humanResource/officialInformation/EditForm/collpaseComponent/basicEmployeeInformation/helper";
import { YearDDL } from "../../../_helper/_yearDDL";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  saveHandler,
  fileUpload,
  btnRef,
  resetBtnRef,
  rowDto,
  setLoading,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3 mb-2">
                  <NewSelect
                    name="month"
                    options={monthDDL}
                    value={values?.month}
                    label="Month"
                    onChange={(valueOption) => {
                      setFieldValue("month", valueOption);
                    }}
                    placeholder="Month"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mb-2">
                  <NewSelect
                    name="year"
                    options={YearDDL(1, 10)}
                    value={values?.year}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                    placeholder="Year"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-12 d-flex align-items-center">
                      <ButtonStyleOne
                        label="Download Excel"
                        style={{ padding: "6px 8px", marginRight: "15px" }}
                        type="button"
                        onClick={() => {
                          downloadFile(
                            `/hcm/EmpRemunerationAddDed/GetBlankAdditionDeductionExcelDownload`,
                            "Manual Salary Addition and Deduction",
                            "xlsx",
                            setLoading
                          );
                        }}
                      />
                      <UploadButton onFileChange={fileUpload} values={values} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="row">
                <div className="col-lg-6">
                  {rowDto?.length > 0 && (
                    <table
                      className="global-table table mt-5 mb-5"
                      id="table-to-xlsx"
                    >
                      <thead className="tableHead">
                        <tr>
                          <th>SL</th>
                          <th>Enroll</th>
                          <th>Addition Amount</th>
                          <th>Deduction Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="text-right pr-2">
                                {item?.enroll}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {item?.additionAmount}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {item?.deductionAmount}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

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
