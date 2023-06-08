/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getDDL } from "../helper";
import IDelete from "../../../../_helper/_helperIcons/_delete";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  profileData,
  selectedBusinessUnit,
  isEdit,
  remover,
  addItemToTheGrid,
  rowDto,
}) {
  // All DDL State
  const [BSCPerspectiveDDL, setBSCPerspectiveDDL] = useState([]);

  const KPIFormatDDL = [
    { value: 1, label: "% of" },
    { value: 2, label: "# of" },
    { value: 3, label: "Amount" },
  ];

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      // Get BSC Perspective DDL
      getDDL(`/pms/CommonDDL/BSCPerspectiveDDL`, setBSCPerspectiveDDL);
    }
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
              <div className="">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="BSCPerspective"
                      options={BSCPerspectiveDDL || []}
                      value={values?.BSCPerspective}
                      label="BSC Perspective"
                      onChange={(valueOption) => {
                        setFieldValue("BSCPerspective", valueOption);
                      }}
                      placeholder="BSC Perspective"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>KPI Name</label>
                    <InputField
                      name="KPIName"
                      value={values?.KPIName}
                      placeholder="KPI Name"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="KPIFormat"
                      options={KPIFormatDDL || []}
                      value={values?.KPIFormat}
                      label="KPI Format"
                      onChange={(valueOption) => {
                        setFieldValue("KPIFormat", valueOption);
                      }}
                      placeholder="KPI Format"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Comments</label>
                    <InputField
                      name="Comments"
                      value={values?.Comments}
                      placeholder="Comments"
                      type="text"
                    />
                  </div>
                  {!isEdit && (
                    <div className="col-lg-2 mt-5">
                      <button
                        className="btn btn-primary pt-2 pb-2"
                        type="button"
                        onClick={() => {
                          addItemToTheGrid(values);
                        }}
                        disabled={
                          !values?.BSCPerspective ||
                          !values?.KPIName ||
                          !values?.KPIFormat
                        }
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
                {!isEdit && (
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th>BSC Perspective</th>
                        <th>KPI Name</th>
                        <th>KPI Format</th>
                        <th>Comments</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto.map((itm, index) => (
                        <tr key={index} className="text-center">
                          <td className="text-center">{index + 1}</td>
                          <td>{itm?.BSCPerspective}</td>
                          <td>{itm?.KPIName}</td>
                          <td>{itm?.KPIFormat}</td>
                          <td>{itm?.Comments}</td>
                          <td className="text-center">
                            <IDelete remover={remover} id={index} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
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
